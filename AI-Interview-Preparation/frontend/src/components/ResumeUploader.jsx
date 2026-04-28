// frontend/src/components/ResumeUploader.js
import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      if (onUploadSuccess && res.data.resumeText) {
        onUploadSuccess(res.data.resumeText);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm h-full">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <FileText size={18} /> Resume Analysis
      </h3>

      {!result ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
          <UploadCloud className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-3 truncate">
            {file ? file.name : "Drag & drop or click to upload"}
          </p>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="hidden" 
            id="resume-upload"
            accept=".pdf,.doc,.docx"
          />
          <label 
            htmlFor="resume-upload" 
            className="cursor-pointer bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-100 inline-block"
          >
            Select File
          </label>
          
          {file && (
            <button 
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="block w-full mt-4 bg-indigo-600 text-black py-2.5 rounded-md text-sm font-bold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {uploading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
            <CheckCircle size={18} /> Analysis Complete
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong className="text-gray-900">Score:</strong> {result.analysis.score}/100</p>
            <p><strong className="text-gray-900">Strengths:</strong> {result.analysis.strengths.join(', ')}</p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setResult(null);
              setFile(null);
            }} 
            className="mt-4 text-sm text-indigo-600 font-semibold hover:text-indigo-800 underline"
          >
            Upload New Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;