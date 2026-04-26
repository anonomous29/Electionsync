from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Mock Data for Deadlines
DEADLINES = [
    {"id": 1, "date": "May 4, 2026", "title": "Bye-Election Vote Counting (Rahuri & Baramati)", "type": "warning"},
    {"id": 2, "date": "May 15, 2026", "title": "Voter Roll Update Deadline", "type": "info"},
    {"id": 3, "date": "June 1, 2026", "title": "Panchayat By-polls Registration", "type": "action"}
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

@app.route('/api/validate-id', methods=['POST'])
def validate_id():
    data = request.json
    selected_docs = data.get('documents', [])
    
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
    user_query = data.get('query', '')
    
    if not user_query:
        return jsonify({"error": "Query is required"}), 400
        
    model = get_ai_model()
    if not model:
        return jsonify({"error": "GEMINI_API_KEY environment variable is not set"}), 500
        
    try:
        response = model.generate_content(f"{AI_CONTEXT}\n\nUser Question: {user_query}")
        
        # Try to get text from response
        try:
            answer_text = response.text
            return jsonify({"answer": answer_text})
        except ValueError:
            # Response was blocked by safety filters
            return jsonify({"answer": "I can only answer questions about the election candidates and their manifestos. Please try asking something like 'Who is best for healthcare?'"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"answer": f"AI Error: {str(e)}"}), 200

@app.route('/api/analyze-id-image', methods=['POST'])
def analyze_id_image():
    data = request.json
    base64_image = data.get('image', '')
    
    if not base64_image:
        return jsonify({"error": "Image data is required"}), 400
        
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
