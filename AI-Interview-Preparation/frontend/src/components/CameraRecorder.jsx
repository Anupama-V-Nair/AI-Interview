import React, { useRef, useState } from 'react';

const CameraRecorder = ({ onRecordingComplete, isRecording, onStart, onStop }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      
      mediaRecorderRef.current = new MediaRecorder(mediaStream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        chunksRef.current = [];
        onRecordingComplete(videoBlob);
      };
      
    } catch (err) {
      console.error('Camera error:', err);
      alert('Failed to access camera. Please allow permissions.');
    }
  };

  const handleStart = () => {
    chunksRef.current = [];
    mediaRecorderRef.current.start();
    onStart();
  };

  const handleStop = () => {
    mediaRecorderRef.current.stop();
    onStop();
  };

  return (
    <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        onLoadedMetadata={startCamera}
      />
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-sm font-medium">REC</span>
        </div>
      )}
    </div>
  );
};

export default CameraRecorder;