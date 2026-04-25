from flask import Flask, request, jsonify
from flask_cors import CORS

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

@app.route('/api/deadlines', methods=['GET'])
def get_deadlines():
    return jsonify(DEADLINES)

@app.route('/api/validate-id', methods=['POST'])
def validate_id():
    data = request.json
    selected_docs = data.get('documents', [])
    
    # Check if selected documents fulfill any of the valid combinations
    is_valid = False
    for combo in VALID_ID_COMBINATIONS:
        if all(doc in selected_docs for doc in combo):
            is_valid = True
            break
            
    return jsonify({
        "valid": is_valid,
        "message": "Documents verified for voting." if is_valid else "Insufficient documents provided. Please review requirements."
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
