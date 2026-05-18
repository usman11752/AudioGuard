#!/usr/bin/env python3
"""
Test script to verify the live analysis integration
Tests model loading, feature extraction, and prediction pipeline
"""

import os
import sys
import numpy as np
import librosa
from config import config
from services.detection_service import detection_service
from database.mongodb import mongodb

def print_section(title):
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print(f"{'='*60}")

def test_model_loading():
    """Test 1: Verify model files exist and load correctly"""
    print_section("TEST 1: Model Loading")
    
    files = {
        'Model': config.MODEL_PATH,
        'Label Encoder': config.LABEL_ENCODER_PATH,
        'Feature Columns': config.FEATURE_COLS_PATH
    }
    
    for name, path in files.items():
        if os.path.exists(path):
            print(f"✅ {name}: {path}")
        else:
            print(f"❌ {name}: NOT FOUND - {path}")
            return False
    
    if detection_service.model is not None:
        print(f"✅ Model loaded successfully")
    else:
        print(f"❌ Model failed to load")
        return False
    
    return True

def test_audio_processing():
    """Test 2: Verify audio processing pipeline"""
    print_section("TEST 2: Audio Processing")
    
    # Create synthetic audio data for testing
    duration = 5  # 5 seconds
    sr = 16000
    t = np.linspace(0, duration, int(sr * duration))
    
    # Generate a simple sine wave (simulating recorded audio)
    frequency = 440  # A4 note
    audio = np.sin(2 * np.pi * frequency * t).astype(np.float32)
    
    print(f"📊 Generated test audio:")
    print(f"   - Duration: {duration}s")
    print(f"   - Sample Rate: {sr} Hz")
    print(f"   - Samples: {len(audio)}")
    print(f"   - Shape: {audio.shape}")
    
    # Test feature extraction
    try:
        features = detection_service.extract_features(audio, sr)
        print(f"✅ Feature extraction successful")
        print(f"   - Features extracted: {len(features)}")
        print(f"   - Sample features:")
        for key in list(features.keys())[:5]:
            print(f"      • {key}: {features[key]:.4f}")
    except Exception as e:
        print(f"❌ Feature extraction failed: {e}")
        return False
    
    return True

def test_prediction():
    """Test 3: Verify prediction on synthetic data"""
    print_section("TEST 3: Model Prediction")
    
    # Create a temporary test audio file
    import tempfile
    import soundfile as sf
    
    duration = 5
    sr = 16000
    t = np.linspace(0, duration, int(sr * duration))
    
    # Create diverse audio patterns for realistic testing
    audio = (
        0.3 * np.sin(2 * np.pi * 440 * t) +  # Sine wave
        0.2 * np.sin(2 * np.pi * 800 * t) +  # Second frequency
        0.1 * np.random.randn(len(t))         # Some noise
    ).astype(np.float32)
    
    # Save to temporary file
    temp_dir = config.UPLOAD_FOLDER
    os.makedirs(temp_dir, exist_ok=True)
    temp_file = os.path.join(temp_dir, 'test_audio.wav')
    
    try:
        sf.write(temp_file, audio, sr)
        print(f"✅ Test audio file created: {temp_file}")
        
        # Test prediction
        result = detection_service.predict(temp_file, user_id='test_user', source_type='test')
        
        print(f"✅ Prediction successful!")
        print(f"   - Is Fake: {result['is_fake']}")
        print(f"   - Confidence: {result['confidence']:.2%}")
        print(f"   - Prob Fake: {result['prob_fake']:.2%}")
        print(f"   - Prob Real: {result['prob_real']:.2%}")
        print(f"   - Duration: {result['duration']:.2f}s")
        print(f"   - Message: {result['message']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Prediction failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

def test_database():
    """Test 4: Verify database connection"""
    print_section("TEST 4: Database Connection")
    
    mongodb.connect()
    
    if mongodb.connected:
        print(f"✅ MongoDB connected successfully")
        print(f"   - URI: {config.MONGO_URI}")
        print(f"   - Database: {config.DATABASE_NAME}")
        return True
    else:
        print(f"⚠️  MongoDB not connected (optional - app works without it)")
        return True  # Not critical

def test_api_endpoint():
    """Test 5: Verify API is properly configured"""
    print_section("TEST 5: API Configuration")
    
    print(f"✅ API Configuration:")
    print(f"   - Target Sample Rate: {config.TARGET_SR} Hz")
    print(f"   - Target Duration: {config.TARGET_DURATION} seconds")
    print(f"   - Target Samples: {config.TARGET_SAMPLES}")
    print(f"   - Max File Size: {config.MAX_CONTENT_LENGTH / (1024*1024):.1f} MB")
    print(f"   - Upload Folder: {config.UPLOAD_FOLDER}")
    
    return True

def main():
    print("\n" + "🔍 AUDIOGUARD LIVE ANALYSIS INTEGRATION TEST" + "\n")
    
    tests = [
        ("Model Loading", test_model_loading),
        ("Audio Processing", test_audio_processing),
        ("Model Prediction", test_prediction),
        ("Database Connection", test_database),
        ("API Configuration", test_api_endpoint),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test failed with error: {e}")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))
    
    # Summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\n{'='*60}")
    print(f"Result: {passed}/{total} tests passed")
    print(f"{'='*60}\n")
    
    if passed == total:
        print("🎉 All tests passed! Live analysis is ready to use.")
        return 0
    else:
        print("⚠️  Some tests failed. Check errors above.")
        return 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
