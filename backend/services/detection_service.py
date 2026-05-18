import time
import pandas as pd
import numpy as np
import librosa
import joblib
from config import config
from database.mongodb import mongodb
from database.models import DetectionModel

class DetectionService:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.feature_columns = None
        self.load_model()
    
    def load_model(self):
        try:
            self.model = joblib.load(config.MODEL_PATH)
            self.label_encoder = joblib.load(config.LABEL_ENCODER_PATH)
            self.feature_columns = joblib.load(config.FEATURE_COLS_PATH)
            print("✅ Model loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Model loading error: {e}")
            return False
    
    def extract_features(self, y_segment, sr):
        features = {
            'chroma_stft': np.mean(librosa.feature.chroma_stft(y=y_segment, sr=sr)),
            'rms': np.mean(librosa.feature.rms(y=y_segment)),
            'spectral_centroid': np.mean(librosa.feature.spectral_centroid(y=y_segment, sr=sr)),
            'spectral_bandwidth': np.mean(librosa.feature.spectral_bandwidth(y=y_segment, sr=sr)),
            'rolloff': np.mean(librosa.feature.spectral_rolloff(y=y_segment, sr=sr)),
            'zero_crossing_rate': np.mean(librosa.feature.zero_crossing_rate(y_segment))
        }
        mfcc = librosa.feature.mfcc(y=y_segment, sr=sr, n_mfcc=20)
        for i in range(20):
            features[f'mfcc{i+1}'] = np.mean(mfcc[i])
        return features
    def predict(self, file_path, user_id='anonymous', source_type='file'):
        try:
            # Load audio
            y, sr = librosa.load(file_path, sr=config.TARGET_SR, mono=True)
            duration = len(y) / sr
            
            # Process audio to fixed length
            if len(y) > config.TARGET_SAMPLES:
                y = y[:config.TARGET_SAMPLES]
            else:
                y = np.pad(y, (0, config.TARGET_SAMPLES - len(y)))
            
            # Extract features
            features = self.extract_features(y, sr)
            df_features = pd.DataFrame([features])
            df_features = df_features[self.feature_columns]
            
            # Predict
            prob = self.model.predict_proba(df_features)[0]
            classes = list(self.label_encoder.classes_)
            fake_idx = classes.index("FAKE")
            real_idx = classes.index("REAL")
            
            prob_fake = float(prob[fake_idx])
            prob_real = float(prob[real_idx])
            is_fake = prob_fake > prob_real
            confidence = prob_fake if is_fake else prob_real
            
            # Save to database if connected
            detection_id = None
            if mongodb.connected:
                detection = DetectionModel.create_detection(
                    user_id=user_id,
                    filename=file_path.split('\\')[-1],
                    file_size=len(y) * 2,
                    duration=duration,
                    is_fake=is_fake,
                    confidence=confidence,
                    prob_fake=prob_fake,
                    prob_real=prob_real,
                    source_type=source_type
                )
                collection = mongodb.get_collection('detections')
                if collection:
                    result = collection.insert_one(detection)
                    detection_id = str(result.inserted_id)
            
            return {
                'is_fake': is_fake,
                'confidence': confidence,
                'prob_fake': prob_fake,
                'prob_real': prob_real,
                'detection_id': detection_id,
                'duration': duration,
                'message': '⚠️ FAKE VOICE DETECTED!' if is_fake else '✅ REAL VOICE CONFIRMED!'
            }
        except Exception as e:
            raise Exception(f"Prediction error: {str(e)}")
    
    def get_history(self, user_id, limit=50):
        if not mongodb.connected:
            return []
        
        collection = mongodb.get_collection('detections')
        if not collection:
            return []
        
        cursor = collection.find({'user_id': user_id}).sort('timestamp', -1).limit(limit)
        history = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            history.append(doc)
        return history

detection_service = DetectionService()