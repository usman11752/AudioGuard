import librosa
import numpy as np
import joblib
import os

class DetectionService:
    def __init__(self):
        # Use absolute paths to be 100% sure the correct models are loaded
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_path = os.path.join(self.base_dir, 'models', 'deepfake_detector_model.pkl')
        self.features_path = os.path.join(self.base_dir, 'models', 'feature_columns.pkl')
        self.encoder_path = os.path.join(self.base_dir, 'models', 'label_encoder.pkl')
        
        # Load models
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.feature_columns = joblib.load(self.features_path)
                self.label_encoder = joblib.load(self.encoder_path)
                print(f"Models loaded successfully from {self.model_path}")
                print(f"Detected classes: {self.label_encoder.classes_}")
            else:
                print(f"Model file not found at {self.model_path}")
                self.model = None
        except Exception as e:
            print(f"Error loading models: {e}")
            self.model = None

    def extract_features(self, file_path):
        """Extract features from audio file matching the model training."""
        try:
            # Load audio - load entire clip for better accuracy
            y, sr = librosa.load(file_path)
            
            # Extract features
            chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
            rms = librosa.feature.rms(y=y)
            spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)
            spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            zcr = librosa.feature.zero_crossing_rate(y)
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
            
            # Combine all features (mean values) in the EXACT order expected by the feature_columns.pkl
            features = [
                np.mean(chroma_stft),
                np.mean(rms),
                np.mean(spec_cent),
                np.mean(spec_bw),
                np.mean(rolloff),
                np.mean(zcr),
            ]
            
            # Add MFCCs 1-20
            for e in mfcc:
                features.append(np.mean(e))
                
            return np.array(features).reshape(1, -1)
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None

    def predict(self, file_path):
        if self.model is None:
            return {"error": "Model not loaded"}
            
        features = self.extract_features(file_path)
        if features is None:
            return {"error": "Could not process audio file"}
            
        # Prediction
        prediction = self.model.predict(features)
        probability = self.model.predict_proba(features)
        
        # Get label and confidence
        label_idx = int(prediction[0])
        label = self.label_encoder.classes_[label_idx]
        confidence = float(np.max(probability))
        
        # Standardize labels for the frontend
        is_fake = (label.upper() == 'FAKE')
        
        return {
            "is_fake": is_fake,
            "label": "FAKE" if is_fake else "REAL",
            "confidence": confidence,
            "message": f"Verdict: {label}"
        }

# Singleton instance
detection_service = DetectionService()
