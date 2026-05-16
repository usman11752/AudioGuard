import joblib
import os

model_dir = 'models'
try:
    encoder = joblib.load(os.path.join(model_dir, 'label_encoder.pkl'))
    print(f"Classes: {encoder.classes_}")
    
    features = joblib.load(os.path.join(model_dir, 'feature_columns.pkl'))
    print(f"Features count: {len(features)}")
    print(f"Features: {features}")
except Exception as e:
    print(f"Error: {e}")
