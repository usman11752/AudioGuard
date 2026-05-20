import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AudioUploader.css';
import { API_URL } from './config';

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
      if (!file.type.startsWith('audio/') && !file.name.match(/\.(wav|mp3|ogg|aac|flac|m4a|wma)$/i)) {
        setError('Please upload a valid audio file (WAV, MP3, OGG, AAC, etc.)');
        setSelectedFile(null);
        setAudioPreview(null);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setSelectedFile(null);
        setAudioPreview(null);
        return;
      }
      
      setSelectedFile(file);
      setResult(null);
      setError(null);
      
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
    formData.append('type', 'upload');

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      
      setResult(response.data);

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
      
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Upload error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The server might be busy.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Server error occurred');
      } else if (err.request) {
        setError(`Cannot connect to backend server. Make sure it's running on ${API_URL}`);
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

  const getConfidenceColor = (isFake) => {
    return isFake ? '#ef4444' : '#10b981';
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
              <div className="upload-hint">WAV, MP3 or M4A (max 10MB)</div>
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
                  Analyzing...
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
          <div className={`result-card-compact ${result.is_fake ? 'fake' : 'real'}`}>
            <div className="result-header-compact">
              <div className="result-icon-compact">
                {result.is_fake ? '🤖' : '👤'}
              </div>
              <div className="result-title-compact">
                {result.is_fake ? 'FAKE VOICE' : 'REAL VOICE'}
              </div>
            </div>
            
            <div className="result-message-compact">
              {result.message}
            </div>
            
            <div className="confidence-section-compact">
              <div className="confidence-label-compact">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
              <div className="confidence-bar-compact">
                <div 
                  className="confidence-fill-compact" 
                  style={{ 
                    width: `${result.confidence * 100}%`,
                    backgroundColor: getConfidenceColor(result.is_fake)
                  }}
                ></div>
              </div>
            </div>
            
            <div className="result-details-compact">
              <div className="detail-item-compact">
                <span className="detail-value-compact">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioUploader;