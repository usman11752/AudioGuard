from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from services.detection_service import detection_service

app = Flask(__name__)
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
        # Save file temporarily with a unique name
        filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            print(f"Processing file: {file_path}")
            # Perform prediction
            result = detection_service.predict(file_path)
            print(f"Prediction result: {result}")
            
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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": detection_service.model is not None})

if __name__ == '__main__':
    # Run the Flask app
    print("Starting AudioGuard Backend Server...")
    app.run(host='0.0.0.0', port=5000, debug=False)
