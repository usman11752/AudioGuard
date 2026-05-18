import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB Configuration
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DATABASE_NAME = os.getenv('DATABASE_NAME', 'audioguard_db')
    
    # Model Configuration
    MODEL_PATH = 'models/deepfake_detector_model.pkl'
    LABEL_ENCODER_PATH = 'models/label_encoder.pkl'
    FEATURE_COLS_PATH = 'models/feature_columns.pkl'
    
    # Audio Configuration
    TARGET_SR = 16000
    TARGET_DURATION = 10
    TARGET_SAMPLES = TARGET_SR * TARGET_DURATION
    
    # API Configuration
    UPLOAD_FOLDER = 'temp_uploads'
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024

config = Config()