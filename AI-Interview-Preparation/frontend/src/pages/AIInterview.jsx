import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AIInterview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stream, setStream] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  
  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  
  // Refs to fix stale closures
  const currentQuestionIndexRef = useRef(0);
  const transcriptRef = useRef('');

  // Sync state to refs
  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Load interview session
  useEffect(() => {
    loadSession();
    return () => cleanup();
  }, [sessionId]);

  // Timer effect
  useEffect(() => {
    if (session && timeRemaining > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitInterview();
    }
    return () => clearInterval(timerRef.current);
  }, [session, timeRemaining, isSubmitting]);

  // Request camera on mount (after session loads)
  useEffect(() => {
    if (session && !cameraInitialized) {
      setTimeout(() => {
        requestCameraAccess();
      }, 500);
    }
  }, [session, cameraInitialized]);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
  };

  const loadSession = async () => {
    try {
      const response = await api.get(`/interview/${sessionId}`);
      const sessionData = response.data.data;
      setSession(sessionData);
      setAnswers(new Array(sessionData.questions.length).fill(null));
      setTimeRemaining(sessionData.duration * 60);
    } catch (err) {
      console.error('Failed to load session:', err);
      setError('Failed to load interview session');
    }
  };

  // ✅ SINGLE CAMERA FUNCTION - Clean version
  const requestCameraAccess = async () => {
    if (cameraInitialized) return; // Prevent duplicate calls
    
    try {
      console.log('📷 Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });
      
      console.log('✅ Camera access granted!');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setCameraPermission(true);
      setCameraInitialized(true);
      
      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        chunksRef.current = [];
        await saveAnswer(videoBlob);
      };
      
    } catch (err) {
      console.error('❌ Camera access error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('🔒 Camera permission denied. Please allow camera access in browser settings and refresh.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('📷 No camera found. Please connect a camera to continue.');
      } else if (err.name === 'NotReadableError') {
        setError('📹 Camera is busy. Close other apps using camera and refresh.');
      } else {
        setError('Camera error: ' + err.message);
      }
      setCameraPermission(false);
    }
  };

  // ✅ Speech Recognition
  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('🎤 Speech recognition not supported');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('🎤 Speech error:', event.error);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  // ✅ Start Recording - Simplified
  const handleStartRecording = () => {
    if (!cameraPermission) {
      setError('Camera not ready. Please allow permissions and refresh.');
      return;
    }

    chunksRef.current = [];
    setTranscript('');
    
    // Start video recording
    if (mediaRecorderRef.current?.state === 'inactive') {
      mediaRecorderRef.current.start();
      console.log('🔴 Recording started');
    }
    
    // Start speech recognition
    if (!recognitionRef.current) {
      initializeSpeechRecognition();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Speech already started');
      }
    }
    
    setIsRecording(true);
  };

  // ✅ Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    console.log('⏹️ Recording stopped');
  };

  // ✅ Save Answer to Backend
  const saveAnswer = async (videoBlob) => {
    try {
      const qIndex = currentQuestionIndexRef.current;
      const currentTranscript = transcriptRef.current;

      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('questionIndex', qIndex);
      formData.append('video', videoBlob, `answer-${qIndex}.webm`);
      formData.append('transcript', currentTranscript);
      
      await api.post('/interview/answer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAnswers(prevAnswers => {
        const newAnswers = [...prevAnswers];
        newAnswers[qIndex] = {
          video: videoBlob,
          transcript: currentTranscript,
          recorded: true,
          timestamp: new Date()
        };
        return newAnswers;
      });
      console.log('✅ Answer saved for question', qIndex);
      
    } catch (err) {
      console.error('Failed to save answer:', err);
      setError('Failed to save answer');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTranscript('');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTranscript(answers[currentQuestionIndex - 1]?.transcript || '');
    }
  };

  const handleSubmitInterview = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await api.post(`/interview/${sessionId}/complete`, {
        answers: answers.map(a => a?.recorded || false),
        duration: (session?.duration || 10) * 60 - timeRemaining
      });
      navigate(`/interview-result/${sessionId}`);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Camera/Microphone Error</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setError(null);
                requestCameraAccess();
              }}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;
  const isAnswerRecorded = answers[currentQuestionIndex]?.recorded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Interview</h1>
              <p className="text-sm text-gray-600">{session.jobRole} • {session.difficulty}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600">
                Q{currentQuestionIndex + 1}/{session.questions.length}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:h-[calc(100vh-140px)] min-h-[600px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          
          {/* Left: Camera */}
          <div className="flex flex-col h-full gap-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 shrink-0">
                <h2 className="text-white font-semibold">📹 Your Camera</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden shrink-0 w-full max-w-full">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-sm font-bold">REC</span>
                    </div>
                  )}
                  {!cameraPermission && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm">
                      <p className="text-white text-sm font-medium">Waiting for camera access...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-center gap-4 shrink-0">
                  {!isRecording ? (
                    <button onClick={handleStartRecording} disabled={!cameraPermission} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                      <span className="text-lg">🔴</span> Start Recording
                    </button>
                  ) : (
                    <button onClick={handleStopRecording} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                      <span className="text-lg">⏹️</span> Stop Recording
                    </button>
                  )}
                </div>
                
                {isAnswerRecorded && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center text-sm font-medium animate-fade-in">
                    ✅ Answer successfully recorded
                  </div>
                )}
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 shrink-0 h-40 flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="font-semibold text-gray-800">🎤 Live Transcript</h3>
                {isRecording && <span className="text-green-600 text-sm font-medium flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>Listening</span>}
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex-1 overflow-y-auto border border-gray-100">
                {transcript ? <p className="text-gray-700 text-sm leading-relaxed">{transcript}</p> : <p className="text-gray-400 text-sm italic">{isRecording ? 'Speak clearly to see transcript...' : 'Transcript will appear here'}</p>}
              </div>
            </div>
          </div>

          {/* Right: Question */}
          <div className="flex flex-col h-full gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">Question {currentQuestionIndex + 1}</span>
                <span className="text-sm font-medium text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">{currentQuestion.category}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <h2 className="text-2xl lg:text-3xl leading-snug font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-indigo-900 mb-6 pb-2">
                  {currentQuestion.question}
                </h2>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
                <span>⏱️</span><span>Suggested answer time: 2-3 minutes</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 shrink-0">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">💡 Interview Tips</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="text-indigo-500">•</span> Speak clearly at moderate pace</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">•</span> Use STAR method for behavioral</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">•</span> Maintain eye contact with camera</li>
                <li className="flex items-center gap-2"><span className="text-indigo-500">•</span> Take a breath before answering</li>
              </ul>
            </div>

            <div className="flex justify-between gap-4 shrink-0 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
              <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="flex-1 flex items-center justify-center whitespace-nowrap px-4 py-3.5 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:hover:bg-transparent transition-all">← Previous</button>
              {currentQuestionIndex < session.questions.length - 1 ? (
                <button onClick={handleNextQuestion} className="flex-1 flex items-center justify-center whitespace-nowrap px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-black rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Next →</button>
              ) : (
                <button onClick={handleSubmitInterview} disabled={isSubmitting} className="flex-1 flex items-center justify-center whitespace-nowrap px-4 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50">{isSubmitting ? 'Submitting...' : 'Submit ✓'}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterview;