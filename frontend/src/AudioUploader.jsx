import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AudioUploader.css';

function AudioUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(wav|mp3|ogg|aac|flac|m4a|wma)$/i)) {
        setError('Please upload a valid audio file (WAV, MP3, OGG, AAC, etc.)');
        setSelectedFile(null);
        setAudioPreview(null);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        setAudioPreview(null);
        return;
      }
      
      setSelectedFile(file);
      setResult(null);
      setError(null);
      
      // Create audio preview URL
      const previewUrl = URL.createObjectURL(file);
      setAudioPreview(previewUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an audio file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Send to your Flask backend
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 second timeout
      });
      
      setResult(response.data);

      // Save to history
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        filename: selectedFile.name,
        is_fake: response.data.is_fake,
        confidence: response.data.confidence,
        message: response.data.message,
        type: 'upload'
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('detectionHistory', JSON.stringify(existingHistory.slice(0, 50)));
      
      // Trigger a storage event so other components (like Dashboard) can update if they are listening
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Upload error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be busy.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Server error occurred');
      } else if (err.request) {
        setError('Cannot connect to backend server. Make sure it\'s running on http://localhost:5000');
      } else {
        setError('Failed to get a prediction. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#ff4444';
    if (confidence >= 0.6) return '#ff8844';
    return '#ffcc44';
  };

  return (
    <div className="audio-uploader">
      <div className="upload-card">
        <form onSubmit={handleSubmit}>
          <div className="upload-area">
            <label htmlFor="audio-input" className="upload-label">
              <div className="upload-icon">🎵</div>
              <div className="upload-text">
                <strong>Click to upload</strong> or drag and drop
              </div>
              <div className="upload-hint">WAV or MP3 (max 10MB)</div>
            </label>
            <input
              ref={fileInputRef}
              id="audio-input"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="file-input"
            />
          </div>

          {audioPreview && (
            <div className="audio-preview">
              <audio controls src={audioPreview} className="audio-player">
                Your browser does not support the audio element
              </audio>
            </div>
          )}

          <div className="button-group">
            <button 
              type="submit" 
              disabled={isLoading || !selectedFile}
              className={`detect-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing Audio...
                </>
              ) : (
                '🔍 Detect Deepfake'
              )}
            </button>
            
            {selectedFile && !isLoading && (
              <button type="button" onClick={handleReset} className="reset-button">
                Clear
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className={`result-card ${result.is_fake ? 'fake' : 'real'}`}>
            <div className="result-header">
              <div className="result-icon">
                {result.is_fake ? '🤖' : '👤'}
              </div>
              <div className="result-title">
                {result.is_fake ? 'FAKE VOICE DETECTED' : 'REAL VOICE CONFIRMED'}
              </div>
            </div>
            
            <div className="result-message">
              {result.message}
            </div>
            
            <div className="confidence-section">
              <div className="confidence-label">Confidence Score</div>
              <div className="confidence-value">
                {(result.confidence * 100).toFixed(1)}%
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${result.confidence * 100}%`,
                    backgroundColor: getConfidenceColor(result.confidence)
                  }}
                ></div>
              </div>
            </div>
            
            <div className="result-details">
              <div className="detail-item">
                <span className="detail-label">Analysis Method:</span>
                <span className="detail-value">Deep Neural Network</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timestamp:</span>
                <span className="detail-value">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {!result && !error && selectedFile && !isLoading && (
          <div className="info-message">
            💡 Ready to analyze! Click "Detect Deepfake" to process the audio.
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioUploader;