from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from config import config
from database.mongodb import mongodb
from services.detection_service import detection_service
import traceback

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

os.makedirs(config.UPLOAD_FOLDER, exist_ok=True)

# Connect to MongoDB
mongodb.connect()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'mongodb': mongodb.connected,
        'model': detection_service.model is not None,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/health/detailed', methods=['GET'])
def detailed_health_check():
    """Detailed health check including model info for live analysis"""
    model_loaded = detection_service.model is not None
    
    return jsonify({
        'status': 'healthy' if model_loaded else 'degraded',
        'services': {
            'api': 'running',
            'model': 'loaded' if model_loaded else 'not_loaded',
            'database': 'connected' if mongodb.connected else 'disconnected'
        },
        'model_info': {
            'loaded': model_loaded,
            'type': 'RandomForestClassifier' if model_loaded else None,
            'classes': ['REAL', 'FAKE'],
            'features': len(detection_service.feature_columns) if detection_service.feature_columns else None,
            'sample_rate': config.TARGET_SR,
            'max_duration': f"{config.TARGET_DURATION}s"
        },
        'configuration': {
            'upload_folder': config.UPLOAD_FOLDER,
            'max_file_size_mb': config.MAX_CONTENT_LENGTH / (1024 * 1024),
            'target_samples': config.TARGET_SAMPLES
        },
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    user_id = request.form.get('user_id', 'anonymous')
    
    ext = os.path.splitext(file.filename)[1]
    temp_path = os.path.join(config.UPLOAD_FOLDER, f"{uuid.uuid4().hex}{ext}")
    file.save(temp_path)
    
    try:
        result = detection_service.predict(temp_path, user_id, 'file')
        return jsonify(result), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id', 'anonymous')
    limit = int(request.args.get('limit', 50))
    history = detection_service.get_history(user_id, limit)
    return jsonify({'history': history, 'count': len(history)})

@app.route('/model/info', methods=['GET'])
def model_info():
    return jsonify({
        'model_type': 'RandomForestClassifier',
        'classes': ['REAL', 'FAKE'],
        'sample_rate': config.TARGET_SR,
        'duration': config.TARGET_DURATION
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🎙️ AudioGuard API Server")
    print("="*50)
    print(f"📍 Server: http://localhost:5000")
    print(f"📡 Health: http://localhost:5000/health")
    print(f"🎯 Predict: http://localhost:5000/predict")
    print(f"📊 MongoDB: {'Connected' if mongodb.connected else 'Not Connected'}")
    print(f"🧠 Model: {'Loaded' if detection_service.model else 'Not Loaded'}")
    print("="*50 + "\n")
    app.run(debug=True, host='0.0.0.0', port=5000)