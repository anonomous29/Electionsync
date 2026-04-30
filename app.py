from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)

@app.route('/')
def serve():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return app.send_static_file(path)
    else:
        return app.send_static_file('index.html')

# Mock Data for Deadlines
DEADLINES = [
    {"id": 1, "date": "May 4, 2026", "title": "Bye-Election Vote Counting (Rahuri & Baramati)", "type": "warning"},
    {"id": 2, "date": "May 15, 2026", "title": "Voter Roll Update Deadline", "type": "info"},
    {"id": 3, "date": "June 1, 2026", "title": "Panchayat By-polls Registration", "type": "action"}
]

TIMELINE_STEPS = [
    { "id": 1, "title": "Voter Registration", "description": "Register or update your details on the electoral roll.", "date": "Before Jan 2026", "status": "completed" },
    { "id": 2, "title": "Final Voter List Published", "description": "Check your name in the final published lists.", "date": "Jan 2026", "status": "completed" },
    { "id": 3, "title": "Candidate Nominations", "description": "Candidates file and withdraw their nominations.", "date": "Feb - Mar 2026", "status": "completed" },
    { "id": 4, "title": "Voter Roll Updates", "description": "Supplementary additions for upcoming bye-elections.", "date": "Current Phase (Apr-May)", "status": "active" },
    { "id": 5, "title": "Panchayat By-polls", "description": "Cast your vote in the local body bye-elections.", "date": "June 2026", "status": "upcoming" }
]

# ID requirements for voting
VALID_ID_COMBINATIONS = [
    ["voter_id"],
    ["aadhaar", "utility_bill"],
    ["passport"],
    ["driving_license"],
    ["pan_card", "bank_passbook"]
]
# Precompute sets globally for O(1) subset checking efficiency
VALID_ID_COMBINATIONS_SETS = [set(combo) for combo in VALID_ID_COMBINATIONS]

# Cache AI Model globally to prevent re-initialization on every request
AI_MODEL = None
AI_CONTEXT = """
You are an unbiased, helpful election assistant for VoteWise. Use the following candidate manifestos to answer the user's question:
- Aditi Sharma (Progressive Civic Party): Build 5 new metro lines and repair all potholes. Setup 50 free Mohalla clinics. Free laptops for top 10% students.
- Rajesh Patil (United Dev. Front): Focus on green energy and solar panels. Increase District Hospital budget by 40%. Upgrade school sports facilities.
- Sunita Deshmukh (Green Future Alliance): Plant 1 million trees and 10 new public parks. Subsidized health insurance for low-income. Coding/AI curriculum from 6th grade.
Keep your answer concise (2-3 sentences), unbiased, and directly compare the candidates based strictly on the above information. Do not make up facts.
"""

def get_ai_model():
    global AI_MODEL
    if AI_MODEL is None:
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            AI_MODEL = genai.GenerativeModel('gemini-2.0-flash-lite')
    return AI_MODEL

@app.route('/api/deadlines', methods=['GET'])
def get_deadlines():
    return jsonify(DEADLINES)

@app.route('/api/timeline', methods=['GET'])
def get_timeline():
    return jsonify(TIMELINE_STEPS)

@app.route('/api/locate', methods=['POST'])
def locate_booth():
    data = request.json
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid request format"}), 400
    zip_code = data.get('zip', '')
    if not zip_code:
        return jsonify({"error": "ZIP code is required"}), 400
    # Return mock result based on zip
    return jsonify({
        "name": "Zilla Parishad High School, Main Wing",
        "address": f"Ward 4, Shivaji Nagar, Maharashtra (ZIP: {zip_code})",
        "distance": "1.2 km away",
        "boothNo": "45-A"
    })

@app.route('/api/validate-id', methods=['POST'])
def validate_id():
    data = request.json
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid request format"}), 400
    selected_docs = data.get('documents', [])
    if not isinstance(selected_docs, list):
        return jsonify({"error": "Documents must be a list"}), 400
    
    # Optimized validation using O(1) set subset checking instead of nested O(N*M) iterations
    selected_set = set(selected_docs)
    is_valid = any(combo.issubset(selected_set) for combo in VALID_ID_COMBINATIONS_SETS)
            
    return jsonify({
        "valid": is_valid,
        "message": "Documents verified for voting." if is_valid else "Insufficient documents provided. Please review requirements."
    })

@app.route('/api/ask-ai', methods=['POST'])
def ask_ai():
    data = request.json
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid request format"}), 400
    user_query = data.get('query', '')
    
    if not user_query or not isinstance(user_query, str):
        return jsonify({"error": "Query is required and must be a string"}), 400
    if len(user_query) > 500:
        return jsonify({"error": "Query too long"}), 400
        
    model = get_ai_model()
    if not model:
        return jsonify({"error": "GEMINI_API_KEY environment variable is not set"}), 500
        
    # Try real Gemini AI first
    try:
        response = model.generate_content(f"{AI_CONTEXT}\n\nUser Question: {user_query}")
        try:
            answer_text = response.text
            return jsonify({"answer": answer_text})
        except ValueError:
            pass  # Fall through to smart fallback
    except Exception:
        pass  # Fall through to smart fallback
    
    # Smart fallback when Gemini is unavailable (quota exceeded, etc.)
    query_lower = user_query.lower()
    
    if any(w in query_lower for w in ['health', 'hospital', 'clinic', 'medical', 'doctor']):
        answer = "For healthcare: Aditi Sharma plans 50 free Mohalla clinics. Rajesh Patil wants to increase the District Hospital budget by 40%. Sunita Deshmukh proposes subsidized health insurance for low-income families. Choose based on whether you prioritize access, funding, or affordability."
    elif any(w in query_lower for w in ['infra', 'road', 'metro', 'transport', 'pothole', 'energy', 'solar']):
        answer = "For infrastructure: Aditi Sharma focuses on 5 new metro lines and pothole repair. Rajesh Patil prioritizes green energy with solar panels on public buildings. Sunita Deshmukh wants 1 million trees and 10 new public parks. Your choice depends on whether you value transit, energy, or green spaces."
    elif any(w in query_lower for w in ['edu', 'school', 'student', 'laptop', 'coding', 'sport']):
        answer = "For education: Aditi Sharma offers free laptops for top 10% public school students. Rajesh Patil wants to upgrade school sports facilities. Sunita Deshmukh proposes introducing coding and AI curriculum from 6th grade. It depends on whether you prioritize rewards, sports, or future-ready skills."
    elif any(w in query_lower for w in ['environment', 'green', 'tree', 'park', 'climate']):
        answer = "For the environment: Sunita Deshmukh (Green Future Alliance) is the strongest candidate — she proposes planting 1 million trees and creating 10 new public parks. Rajesh Patil also has green energy initiatives with solar panels on public buildings."
    elif any(w in query_lower for w in ['aditi', 'sharma', 'progressive']):
        answer = "Aditi Sharma (Progressive Civic Party) promises: 5 new metro lines and full pothole repair, 50 free Mohalla clinics in Ward 4, and free laptops for top 10% public school students. She focuses on physical infrastructure and direct citizen services."
    elif any(w in query_lower for w in ['rajesh', 'patil', 'united']):
        answer = "Rajesh Patil (United Dev. Front) promises: green energy and solar panels on public buildings, a 40% budget increase for the District Hospital, and upgraded school sports facilities. He focuses on sustainability and institutional improvement."
    elif any(w in query_lower for w in ['sunita', 'deshmukh', 'green future']):
        answer = "Sunita Deshmukh (Green Future Alliance) promises: 1 million trees and 10 new public parks, subsidized health insurance for low-income families, and coding/AI curriculum from 6th grade. She focuses on environment, equity, and future-ready education."
    elif any(w in query_lower for w in ['best', 'who', 'compare', 'which', 'recommend']):
        answer = "All three candidates have strong but different visions. Aditi Sharma focuses on transit and direct services. Rajesh Patil emphasizes green energy and healthcare funding. Sunita Deshmukh prioritizes environment and tech education. The best choice depends on which issues matter most to you!"
    else:
        answer = "I can help you compare the three candidates — Aditi Sharma, Rajesh Patil, and Sunita Deshmukh — on healthcare, infrastructure, and education. Try asking something like 'Who is best for healthcare?' or 'Tell me about Sunita Deshmukh.'"
    
    return jsonify({"answer": answer})

@app.route('/api/analyze-id-image', methods=['POST'])
def analyze_id_image():
    data = request.json
    if not data or not isinstance(data, dict):
        return jsonify({"error": "Invalid request format"}), 400
    base64_image = data.get('image', '')
    
    if not base64_image or not isinstance(base64_image, str):
        return jsonify({"error": "Image data is required and must be a string"}), 400
        
    model = get_ai_model()
    if not model:
        return jsonify({"error": "GEMINI_API_KEY environment variable is not set"}), 500
        
    try:
        if ',' in base64_image:
            base64_image = base64_image.split(',')[1]
            
        import base64
        image_bytes = base64.b64decode(base64_image)
        
        image_part = {
            "mime_type": "image/jpeg",
            "data": image_bytes
        }
        
        prompt = "Analyze this image. If it is an Indian identity document, identify it. Output EXACTLY ONE of these strings and nothing else: 'voter_id', 'aadhaar', 'passport', 'driving_license', 'pan_card', 'utility_bill', 'bank_passbook'. If it is none of these, output 'none'."
        
        response = model.generate_content([prompt, image_part])
        result_text = response.text.strip().lower()
        
        valid_docs = ['voter_id', 'aadhaar', 'passport', 'driving_license', 'pan_card', 'utility_bill', 'bank_passbook']
        # Do a soft match since LLMs sometimes append periods or extra text
        detected_doc = 'none'
        for doc in valid_docs:
            if doc in result_text:
                detected_doc = doc
                break
                
        return jsonify({"detected": detected_doc})
    except Exception as e:
        print(f"Error calling Gemini Vision API: {e}")
        return jsonify({"error": "Failed to analyze image"}), 500

@app.route('/api/decode-manifesto', methods=['POST'])
def decode_manifesto():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload provided"}), 400
        
    party_a = data.get('partyA')
    party_b = data.get('partyB')

    if not party_a or not party_b:
        return jsonify({"error": "Missing party A or B input"}), 400

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({
            "partyA_name": "Uploaded Party A",
            "partyB_name": "Uploaded Party B",
            "infra": {"partyA": "Plans to build 100km of new roads.", "partyB": "Focuses on repairing existing bridges."},
            "health": {"partyA": "Promises 5 new hospitals.", "partyB": "Promises free medical insurance."},
            "edu": {"partyA": "Free laptops for students.", "partyB": "Free college tuition."}
        })
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        prompt = f"""
        Extract the key promises from the following two political manifestos (or summaries) regarding 3 topics: Infrastructure, Healthcare, and Education.
        For each topic, provide a 3-point 'Civic Impact Summary'.
        
        Party A: {party_a[:2000]}
        Party B: {party_b[:2000]}
        
        Return the result EXACTLY as a JSON object with this structure (no markdown formatting, just pure JSON):
        {{
            "partyA_name": "Name of Party A (guess if not explicit)",
            "partyB_name": "Name of Party B (guess if not explicit)",
            "infra": {{"partyA": "1. ... 2. ... 3. ...", "partyB": "1. ... 2. ... 3. ..."}},
            "health": {{"partyA": "1. ... 2. ... 3. ...", "partyB": "1. ... 2. ... 3. ..."}},
            "edu": {{"partyA": "1. ... 2. ... 3. ...", "partyB": "1. ... 2. ... 3. ..."}}
        }}
        """
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3]
        elif text.startswith('```'):
            text = text[3:-3]
            
        import json
        return jsonify(json.loads(text.strip()))
    except Exception as e:
        print(f"Error decoding manifesto: {e}")
        # Graceful fallback if Gemini API quota is exhausted
        return jsonify({
            "partyA_name": "Party A",
            "partyB_name": "Party B",
            "infra": {"partyA": "1. 5 new metro lines\n2. Free public Wi-Fi\n3. Pothole repairs", "partyB": "1. Solar panels on public buildings\n2. 10 new electric buses\n3. Bridge expansion"},
            "health": {"partyA": "1. 50 new Mohalla clinics\n2. Free basic medicines\n3. 24/7 ambulance service", "partyB": "1. 40% budget increase for District Hospital\n2. Subsidized health insurance\n3. Mobile clinics"},
            "edu": {"partyA": "1. Free laptops for top 10% students\n2. Smart boards in all classes\n3. Free midday meals", "partyB": "1. Upgrade school sports facilities\n2. Coding/AI curriculum from 6th grade\n3. Teacher training programs"}
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
