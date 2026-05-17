import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop, FaPlay, FaDownload, FaRedo, FaChartLine, FaLightbulb, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './LiveAnalysis.css';
import { API_URL } from '../../config';

const LiveAnalysis = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [audioLevels, setAudioLevels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const resultsRef = useRef(null);

  // Auto-scroll to results when they load
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  // Wave visualizer animation
  useEffect(() => {
    let animationId;
    let lastUpdate = 0;

    if (isRecording) {
      const updateLevels = () => {
        const now = Date.now();
        if (now - lastUpdate > 100) {
          const newLevels = Array(20).fill(0).map(() => 15 + Math.random() * 45);
          setAudioLevels(newLevels);
          lastUpdate = now;
        }
        animationId = requestAnimationFrame(updateLevels);
      };
      updateLevels();
    } else {
      setAudioLevels(Array(20).fill(25));
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording]);

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
      // Request microphone with optimal settings for speech
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Standard for speech recognition
        }
      });

      // Try different MIME types
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        // Combine chunks into a single blob
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });

        try {
          console.log('Converting to WAV...');
          const wavBlob = await convertToWav(audioBlob);
          console.log('Conversion successful, size:', wavBlob.size);

          const audioUrl = URL.createObjectURL(wavBlob);
          setAudioBlob(wavBlob);
          setAudioUrl(audioUrl);
        } catch (err) {
          console.error('WAV conversion failed:', err);
          setError('Failed to process audio format. Please try again with a shorter recording.');
          // Fallback: use original format
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording with smaller chunks for better performance
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setResult(null);
      setError(null);

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
    if (!audioBlob) {
      setError('No audio recorded. Please record something first.');
      return;
    }

    console.log('Analyzing audio blob:', {
      size: audioBlob.size,
      type: audioBlob.type,
      sizeKB: (audioBlob.size / 1024).toFixed(2)
    });

    if (audioBlob.size < 1000) {
      setError('Recording is too short or empty. Please record at least 2-3 seconds of speech.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    try {
      console.log('Sending to backend...');
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      console.log('Response received:', response.data);

      // Check if the result looks valid
      if (response.data && typeof response.data.is_fake !== 'undefined') {
        setResult(response.data);
        // Do not auto-open the popup; just show that the result is ready!
        setIsModalOpen(false);

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
      } else {
        throw new Error('Invalid response format from server');
      }

    } catch (err) {
      console.error('Analysis error details:', err);

      if (err.code === 'ECONNABORTED') {
        setError(`Request timed out. Make sure backend server is running on ${API_URL}`);
      } else if (err.response) {
        setError(`Server error: ${err.response.data?.error || 'Unknown server error'}`);
      } else if (err.request) {
        setError(`Cannot connect to backend. Please check if backend is running on ${API_URL}`);
      } else {
        setError(`Failed to analyze: ${err.message}`);
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

  // Convert WebM to WAV with proper format for model
  const convertToWav = async (webmBlob) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Read the blob as array buffer
        const arrayBuffer = await webmBlob.arrayBuffer();

        // Decode the audio
        let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Target sample rate (adjust based on your model's requirement)
        const TARGET_SAMPLE_RATE = 16000;

        // Resample if needed
        if (audioBuffer.sampleRate !== TARGET_SAMPLE_RATE) {
          audioBuffer = await resampleAudio(audioBuffer, TARGET_SAMPLE_RATE);
        }

        // Convert to mono if stereo
        let monoBuffer = audioBuffer;
        if (audioBuffer.numberOfChannels > 1) {
          monoBuffer = convertToMono(audioBuffer);
        }

        // Convert to WAV
        const wavBlob = audioBufferToWav(monoBuffer);

        await audioContext.close();
        resolve(wavBlob);

      } catch (error) {
        console.error('Conversion error:', error);
        reject(error);
      }
    });
  };

  // Helper: Resample audio
  const resampleAudio = async (audioBuffer, targetSampleRate) => {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length * targetSampleRate / audioBuffer.sampleRate,
      targetSampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start();

    const resampledBuffer = await offlineContext.startRendering();
    return resampledBuffer;
  };

  // Helper: Convert stereo to mono
  const convertToMono = (audioBuffer) => {
    const length = audioBuffer.length;
    const monoChannel = new Float32Array(length);

    // Average all channels
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        monoChannel[i] += channelData[i];
      }
    }

    // Average the values
    for (let i = 0; i < length; i++) {
      monoChannel[i] /= audioBuffer.numberOfChannels;
    }

    // Create new mono buffer
    const monoBuffer = new AudioBuffer({
      numberOfChannels: 1,
      length: length,
      sampleRate: audioBuffer.sampleRate
    });
    monoBuffer.copyToChannel(monoChannel, 0);

    return monoBuffer;
  };

  // Helper: Convert AudioBuffer to WAV
  const audioBufferToWav = (buffer) => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    // Get the audio data
    let samples = buffer.getChannelData(0);

    // Convert float samples to 16-bit PCM
    const pcmData = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      // Clamp between -1 and 1, then convert to 16-bit integer
      const sample = Math.max(-1, Math.min(1, samples[i]));
      pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }

    // Calculate buffer length
    const bufferLength = 44 + pcmData.length * 2;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // Helper function to write strings
    const writeString = (offset, str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    // Write WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, pcmData.length * 2, true);

    // Write audio data
    for (let i = 0; i < pcmData.length; i++) {
      view.setInt16(44 + i * 2, pcmData[i], true);
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  return (
    <div className="live-analysis-page">
      <div className="page-header">
        <div>
          <h1>Live Voice Analysis</h1>
          <p>Real-time deepfake detection using your microphone</p>
        </div>
      </div>

      {/* Debug info - Remove after testing */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px', fontSize: '12px', borderRadius: '5px' }}>
          <div>Audio Blob: {audioBlob ? `${(audioBlob.size / 1024).toFixed(1)}KB, ${audioBlob.type}` : 'No audio'}</div>
          <div>Recording: {isRecording ? 'Yes' : 'No'}</div>
          <div>Analyzing: {isAnalyzing ? 'Yes' : 'No'}</div>
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
      )}

      <div className="live-grid">
        {/* Left Side: Recording Card */}
        <div className="recording-card-container">
          <div className="recording-card">
            <div className="card-header">
              <FaMicrophone className="header-icon" />
              <h2>Record Your Voice</h2>
            </div>

            {permissionDenied ? (
              <div className="permission-error">
                <FaExclamationTriangle className="error-icon-big" />
                <h3>Microphone Access Required</h3>
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
                        {audioLevels.map((height, i) => (
                          <div
                            key={i}
                            className="wave-bar"
                            style={{
                              animationDelay: `${i * 0.05}s`,
                              height: `${height}px`
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {!isRecording && !audioBlob && (
                      <div className="visualizer-placeholder">
                        <FaMicrophone className="placeholder-icon" />
                        <p>Ready to capture</p>
                      </div>
                    )}
                    {audioBlob && !isRecording && (
                      <div className="visualizer-placeholder">
                        <FaCheckCircle className="placeholder-icon success" />
                        <p>{result ? "Analysis completed! Result is ready" : "Voice captured successfully"}</p>
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
                    <div className="active-recording-controls">
                      <div className="recording-timer">
                        <div className="recording-dot"></div>
                        <span>{formatTime(recordingDuration)}</span>
                      </div>
                      <button onClick={stopRecording} className="btn-stop">
                        <FaStop /> Stop
                      </button>
                    </div>
                  )}

                  {audioBlob && !isAnalyzing && (
                    <div className="recording-actions">
                      <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
                      <div className="player-controls">
                        <button onClick={playRecording} className="btn-play-small">
                          <FaPlay /> Listen
                        </button>
                        <button onClick={resetRecording} className="btn-reset-small">
                          <FaRedo /> Retake
                        </button>
                      </div>
                      {result ? (
                        <button onClick={() => setIsModalOpen(true)} className="btn-view-result-large">
                          <FaChartLine /> View Result
                        </button>
                      ) : (
                        <button onClick={analyzeAudio} className="btn-analyze-large">
                          <FaChartLine /> Analyze with AI
                        </button>
                      )}
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="analyzing-mini">
                      <div className="mini-spinner"></div>
                      <p>AI processing...</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="error-badge">
                <FaExclamationTriangle /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tips Card */}
        <div className="tips-card-container">
          <div className="tips-card-modern">
            <div className="tips-header">
              <FaLightbulb className="tips-icon" />
              <h3>Best Results Tips</h3>
            </div>
            <ul className="tips-list">
              <li>
                <strong>Length:</strong>
                Speak for at least 5-10 seconds for higher accuracy.
              </li>
              <li>
                <strong>Environment:</strong>
                Ensure a quiet background to avoid noise interference.
              </li>
              <li>
                <strong>Clarity:</strong>
                Speak clearly and at a natural pace.
              </li>
              <li>
                <strong>Quality:</strong>
                A dedicated microphone performs better than built-in ones.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full Width Results Section */}
      {result && (
        <div ref={resultsRef} className={`results-card-full ${result.is_fake ? 'fake' : 'real'} slide-up`}>
          <div className="results-main">
            <div className="result-indicator">
              <div className="result-symbol">
                {result.is_fake ? <FaExclamationTriangle /> : <FaCheckCircle />}
              </div>
              <div className="result-verdict">
                <h2 className="verdict-status-simple">{result.is_fake ? 'FAKE' : 'REAL'}</h2>
              </div>
            </div>

            <div className="confidence-section-simple">
              <span className="confidence-percentage">{(result.confidence * 100).toFixed(1)}% Confidence</span>
              <div className="confidence-bar-simple">
                <div
                  className="confidence-fill-simple"
                  style={{
                    width: `${result.confidence * 100}%`,
                    background: result.is_fake ? '#ef4444' : '#10b981'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="result-footer-simple">
            <div className="footer-timestamp">
              Analyzed at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
      {/* Premium Result Modal */}
      {isModalOpen && result && (
        <div className="result-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="result-modal-content slide-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            
            <div className={`modal-status-badge ${result.is_fake ? 'fake' : 'real'}`}>
              {result.is_fake ? '🤖 AI FAKE DETECTED' : '🛡️ REAL HUMAN VOICE'}
            </div>
            
            <div className="modal-body">
              <div className="gauge-container">
                <svg viewBox="0 0 100 100" className="gauge-svg">
                  <circle className="gauge-track" cx="50" cy="50" r="40" />
                  <circle 
                    className="gauge-fill" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 * (1 - result.confidence)}`,
                      stroke: result.is_fake ? '#ef4444' : '#10b981'
                    }}
                  />
                  <text x="50" y="52" className="gauge-text">
                    {(result.confidence * 100).toFixed(1)}%
                  </text>
                </svg>
                <div className="gauge-label">Confidence Score</div>
              </div>
              
              <div className="result-description-card">
                <h3>Analysis Breakdown</h3>
                <p className="verdict-msg">{result.message}</p>
                <p className="detailed-explanation">
                  {result.is_fake 
                    ? "Our advanced neural network detected synthetic patterns, speech anomalies, and spectral artifacts characteristic of modern AI voice generators." 
                    : "Our analysis confirmed authentic biological vocal markers, natural cord vibrations, and standard ambient resonance."
                  }
                </p>
              </div>
            </div>
            
            <div className="modal-actions-footer">
              <button className="btn-modal-close" onClick={() => setIsModalOpen(false)}>
                Done
              </button>
              <button 
                className="btn-modal-retry" 
                onClick={() => {
                  setIsModalOpen(false);
                  resetRecording();
                }}
              >
                Analyze New Voice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveAnalysis;