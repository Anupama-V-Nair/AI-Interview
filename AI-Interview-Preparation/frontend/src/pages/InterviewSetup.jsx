import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupInterviewSession } from '../services/interviewServices';
import ResumeUploader from '../components/ResumeUploader';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: '',
    difficulty: 'Medium',
    duration: 10,
    questionType: 'Mixed',
    resumeText: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = (extractedResumeText) => {
    setFormData({ ...formData, resumeText: extractedResumeText });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await setupInterviewSession(formData);
      navigate(`/ai-interview/${result.data.sessionId}`);
    } catch (error) {
      alert('Failed to setup interview. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Configure Your AI Interview
          </h1>
          <p className="mt-2 text-gray-600">
            Set your preferences and get started with your practice session
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Job Role */}
            <div>
              <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-2">
                Job Role / Title *
              </label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                placeholder="e.g. Frontend Developer, Data Scientist"
                value={formData.jobRole}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <ResumeUploader onUploadSuccess={handleResumeUpload} />
              </div>
            </div>

            {/* Difficulty & Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                >
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

            {/* Question Type */}
            <div>
              <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 mb-2">
                Question Focus
              </label>
              <select
                id="questionType"
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
              >
                <option value="Mixed">Mixed (Technical + Behavioral)</option>
                <option value="Technical">Technical Only</option>
                <option value="Behavioral">Behavioral Only</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.jobRole}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Setting up...
                </span>
              ) : (
                'Start Interview →'
              )}
            </button>
          </form>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          💡 Tip: Upload your resume for personalized questions based on your experience
        </p>
      </div>
    </div>
  );
};

export default InterviewSetup;