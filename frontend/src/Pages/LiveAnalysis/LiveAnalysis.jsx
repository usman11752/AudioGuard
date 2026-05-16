import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop, FaPlay, FaDownload, FaRedo, FaChartLine } from 'react-icons/fa';
import AudioUploader from '../../AudioUploader';
import './LiveAnalysis.css';

const LiveAnalysis = () => {
  const [activeMode, setActiveMode] = useState('record'); // 'record' or 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Check microphone permission on load
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionDenied(false);
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setPermissionDenied(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      setResult(null);
      setError(null);
      
      // Start timer
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Could not access microphone. Please check permissions.');
      setPermissionDenied(true);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };
  
  const analyzeAudio = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      
      setResult(response.data);
      
      // Save to history
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        filename: 'Live Recording',
        is_fake: response.data.is_fake,
        confidence: response.data.confidence,
        message: response.data.message,
        type: 'live'
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('detectionHistory', JSON.stringify(existingHistory.slice(0, 50)));
      
    } catch (err) {
      console.error('Analysis error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Make sure backend server is running.');
      } else if (err.response) {
        setError(err.response.data?.error || 'Server error occurred');
      } else if (err.request) {
        setError('Cannot connect to backend. Make sure it\'s running on http://localhost:5000');
      } else {
        setError('Failed to analyze audio. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setResult(null);
    setError(null);
    setRecordingDuration(0);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
    }
  };

  return (
    <div className="live-analysis-page">
      <div className="page-header">
        <div>
          <h1>Live Voice Analysis</h1>
          <p>Real-time deepfake detection using your microphone</p>
        </div>
      </div>

      <div className="live-content">
        {/* Mode Selector */}
        <div className="analysis-mode-selector">
          <button 
            className={`mode-btn ${activeMode === 'record' ? 'active' : ''}`}
            onClick={() => setActiveMode('record')}
          >
            🎙️ Live Recording
          </button>
          <button 
            className={`mode-btn ${activeMode === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveMode('upload')}
          >
            📁 File Upload
          </button>
        </div>

        {activeMode === 'upload' ? (
          <AudioUploader />
        ) : (
          <>
            {/* Recording Section */ }
            <div className="recording-card">
            <h2>🎙️ Record Your Voice</h2>
          
          {permissionDenied ? (
            <div className="permission-error">
              <h3>⚠️ Microphone Access Required</h3>
              <p>Please allow microphone access in your browser settings to use live recording.</p>
              <button onClick={checkMicrophonePermission} className="btn-retry">
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="visualizer-container">
                <div className={`wave-visualizer ${isRecording ? 'active' : ''}`}>
                  {isRecording && (
                    <div className="wave-bars">
                      {[...Array(30)].map((_, i) => (
                        <div 
                          key={i} 
                          className="wave-bar"
                          style={{
                            animationDelay: `${i * 0.05}s`,
                            height: `${Math.random() * 60 + 20}px`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {!isRecording && !audioBlob && (
                    <div className="visualizer-placeholder">
                      <FaMicrophone className="placeholder-icon" />
                      <p>Click "Start Recording" to begin</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="recording-controls">
                {!isRecording && !audioBlob && (
                  <button onClick={startRecording} className="btn-record">
                    <FaMicrophone /> Start Recording
                  </button>
                )}
                
                {isRecording && (
                  <>
                    <div className="recording-timer">
                      <div className="recording-dot"></div>
                      <span>{formatTime(recordingDuration)}</span>
                    </div>
                    <button onClick={stopRecording} className="btn-stop">
                      <FaStop /> Stop Recording
                    </button>
                  </>
                )}
                
                {audioBlob && !isAnalyzing && (
                  <div className="recording-actions">
                    <div className="audio-player-container">
                      <audio ref={audioRef} src={audioUrl} className="audio-player" controls />
                      <div className="player-buttons">
                        <button onClick={playRecording} className="btn-play">
                          <FaPlay /> Play
                        </button>
                        <button onClick={resetRecording} className="btn-reset">
                          <FaRedo /> Record Again
                        </button>
                      </div>
                    </div>
                    <button onClick={analyzeAudio} className="btn-analyze">
                      <FaChartLine /> Analyze Recording
                    </button>
                  </div>
                )}
                
                {isAnalyzing && (
                  <div className="analyzing">
                    <div className="spinner"></div>
                    <p>Analyzing your voice with AI model...</p>
                    <small>This may take a few seconds</small>
                  </div>
                )}
              </div>
            </>
          )}
          
          {error && (
            <div className="error-message">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}
        </div>
        
        {/* Results Section */}
        {result && (
          <div className={`results-card ${result.is_fake ? 'fake' : 'real'} slide-in`}>
            <div className="results-header">
              <div className="result-icon">
                {result.is_fake ? '🤖' : '👤'}
              </div>
              <div className="result-title">
                {result.is_fake ? 'FAKE VOICE DETECTED' : 'REAL VOICE CONFIRMED'}
              </div>
            </div>
            
            <div className="confidence-meter">
              <div className="confidence-label">Detection Confidence</div>
              <div className="confidence-value">
                {(result.confidence * 100).toFixed(1)}%
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{ 
                    width: `${result.confidence * 100}%`,
                    backgroundColor: result.is_fake ? '#ef4444' : '#10b981'
                  }}
                >
                  {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="analysis-details">
              <h3>📊 Analysis Details</h3>
              <div className="detail-row">
                <span>Detection Method:</span>
                <strong>Deep Neural Network (DNN)</strong>
              </div>
              <div className="detail-row">
                <span>Audio Source:</span>
                <strong>🎙️ Live Microphone</strong>
              </div>
              <div className="detail-row">
                <span>Duration:</span>
                <strong>{formatTime(recordingDuration)}</strong>
              </div>
              <div className="detail-row">
                <span>Timestamp:</span>
                <strong>{new Date().toLocaleString()}</strong>
              </div>
            </div>
            
            <div className="result-message">
              {result.message}
            </div>
          </div>
            )}
          </>
        )}
      </div>
      
      {/* Tips Section */}
      <div className="tips-card">
        <h3>💡 Tips for Best Results</h3>
        <ul>
          <li>Speak clearly and naturally for at least 3-5 seconds</li>
          <li>Minimize background noise for accurate detection</li>
          <li>Use a good quality microphone</li>
          <li>Results are more accurate with longer recordings (5-10 seconds)</li>
          <li>Make sure you're in a quiet environment</li>
        </ul>
      </div>
    </div>
  );
};

export default LiveAnalysis;