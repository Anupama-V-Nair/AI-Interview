import React, { useState, useEffect } from 'react';
import useSpeechToText from '../hooks/useSpeechToText';

const SpeechTranscript = ({ isRecording }) => {
  const [transcript, setTranscript] = useState('');
  const { isListening, transcript: liveTranscript, startListening, stopListening } = useSpeechToText();

  useEffect(() => {
    if (isRecording && !isListening) {
      startListening();
    } else if (!isRecording && isListening) {
      stopListening();
    }
  }, [isRecording, isListening, startListening, stopListening]);

  useEffect(() => {
    if (liveTranscript) {
      setTranscript(liveTranscript);
    }
  }, [liveTranscript]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">🎤 Live Transcript</h3>
        {isListening && (
          <span className="flex items-center gap-2 text-green-600 text-sm">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Listening
          </span>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
        {transcript ? (
          <p className="text-gray-700 text-sm leading-relaxed">{transcript}</p>
        ) : (
          <p className="text-gray-400 text-sm italic">
            {isRecording ? 'Start speaking to see transcript...' : 'Recording will appear here'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SpeechTranscript;