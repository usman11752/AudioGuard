from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from services.detection_service import detection_service
from services.database_service import db_service
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure CORS origins
frontend_url = os.getenv('FRONTEND_URL')
if frontend_url:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        frontend_url
    ]
    allowed_origins = [origin for origin in allowed_origins if origin]
    CORS(app, origins=allowed_origins)
else:
    # Fallback to allow all origins if FRONTEND_URL is not configured yet
    CORS(app)


# Configuration
UPLOAD_FOLDER = 'temp_uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            print(f"Processing file: {file_path}")
            # Perform prediction
            result = detection_service.predict(file_path)
            print(f"Prediction result: {result}")
            
            # Save to database
            det_type = request.form.get('type', 'upload')
            db_service.save_detection(result, file.filename, detection_type=det_type)
            
            # Clean up: delete the temporary file
            os.remove(file_path)
            
            if "error" in result:
                return jsonify(result), 500
                
            return jsonify(result)
            
        except Exception as e:
            # Clean up on error
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    limit = request.args.get('limit', default=50, type=int)
    history = db_service.get_history(limit=limit)
    return jsonify(history)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Missing required fields"}), 400
        
    result = db_service.register_user(
        name=data.get('name'),
        email=data.get('email'),
        password=data.get('password')
    )
    
    if "error" in result:
        return jsonify(result), 400
        
    return jsonify(result), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
        
    user = db_service.authenticate_user(
        email=data.get('email'),
        password=data.get('password')
    )
    
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
        
    return jsonify({"success": True, "user": user})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": detection_service.model is not None})

if __name__ == '__main__':
    # Run the Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
