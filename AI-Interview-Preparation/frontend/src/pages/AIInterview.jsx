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
              Try Again
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
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-[-150px] right-[-150px] w-[420px] h-[420px] bg-purple-600/10 blur-3xl rounded-full" />
      </div>

      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-[#020617]/90 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-4 py-3">

          <div className="flex items-center justify-between gap-4">

            {/* Left */}
            <div>

              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                AI Interview
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                {session.jobRole} • {session.difficulty}
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">

              <div
                className={`px-4 py-2 rounded-xl font-mono text-sm font-bold border ${timeRemaining < 60
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  }`}
              >
                ⏱️ {formatTime(timeRemaining)}
              </div>

              <div className="text-sm text-slate-300 font-medium">
                Q{currentQuestionIndex + 1}/{session.questions.length}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-4 h-[calc(100vh-92px)] overflow-hidden">

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-5 h-full">

          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 h-full overflow-hidden">

            {/* CAMERA CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-0">

              {/* Card Header */}
              <div className="px-5 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 shrink-0">

                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  📹 Your Camera
                </h2>
              </div>

              {/* Camera */}
              <div className="p-4 flex flex-col flex-1 min-h-0">

                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse shadow-lg">

                      <div className="w-2 h-2 rounded-full bg-white"></div>

                      <span className="text-xs font-bold">
                        REC
                      </span>
                    </div>
                  )}

                  {!cameraPermission && !error && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">

                      <p className="text-sm text-white font-medium">
                        Waiting for camera access...
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="mt-4 flex justify-center">

                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={!cameraPermission}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 disabled:opacity-50 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                    >
                      🔴 Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
                    >
                      ⏹️ Stop Recording
                    </button>
                  )}
                </div>

                {/* Success */}
                {isAnswerRecorded && (
                  <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center text-sm font-medium">

                    ✅ Answer successfully recorded
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
             <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-5 shrink-0">

              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                💡 Interview Tips
              </h3>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">

                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span>
                  Speak clearly and confidently
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Use STAR method
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">•</span>
                  Maintain eye contact
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  Think before answering
                </li>
              </ul>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-4 h-full overflow-hidden">

            {/* QUESTION CARD */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-5 flex flex-col flex-1 min-h-0">

              {/* Top Tags */}
              <div className="flex items-center gap-3 mb-5 shrink-0">

                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-xs font-bold shadow-lg">

                  Question {currentQuestionIndex + 1}
                </span>

                <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">

                  {currentQuestion.category}
                </span>
              </div>

              {/* Question */}
              <div className="overflow-y-auto flex-1 pr-1">

                <p className="text-2xl md:text-xl leading-relaxed font-semibold text-white">

                  {currentQuestion.question}
                </p>
              </div>
            </div>

           
            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2 shrink-0">

              ⏱️ Suggested answer time: 2–3 minutes
            </div>


            {/* Transcript */}
           <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl h-40 flex flex-col shrink-0">

              <div className="p-4 overflow-y-auto flex-1">

                {transcript ? (
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {transcript}
                  </p>
                ) : (
                  <p className="text-sm italic text-slate-500">
                    {isRecording
                      ? "Speak clearly to see transcript..."
                      : "Transcript will appear here"}
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-4 flex gap-3 shrink-0">

              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-sm transition-all duration-300 disabled:opacity-40"
              >
                ← Previous
              </button>

              {currentQuestionIndex < session.questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitInterview}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white font-semibold text-sm transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Interview ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterview;