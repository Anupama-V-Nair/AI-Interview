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
      navigate(`/interview/${result.data.sessionId}`);
    } catch (error) {
      alert('Failed to setup interview. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-5">
          AI Interview Setup
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-4">
          Configure Your Interview
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl">
          Customize your AI-powered interview experience and generate
          personalized questions based on your role and resume.
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl">

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Job Role */}
          <div>
            <label
              htmlFor="jobRole"
              className="block text-sm font-medium text-slate-300 mb-3"
            >
              Job Role / Title
            </label>

            <input
              type="text"
              id="jobRole"
              name="jobRole"
              placeholder="Frontend Developer, Data Analyst, Backend Engineer..."
              value={formData.jobRole}
              onChange={handleChange}
              required
              className="w-full bg-[#0f172a] border border-white/10 focus:border-cyan-400 rounded-2xl px-5 py-4 text-white placeholder:text-slate-500 outline-none transition-all"
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Upload Resume
            </label>

            <div className="bg-[#0f172a] border border-dashed border-white/10 rounded-2xl p-6">
              <ResumeUploader onUploadSuccess={handleResumeUpload} />
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-slate-300 mb-3"
              >
                Difficulty Level
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-white/10 focus:border-cyan-400 rounded-2xl px-5 py-4 text-white outline-none transition-all"
              >
                <option className="bg-slate-900">Easy</option>
                <option className="bg-slate-900">Medium</option>
                <option className="bg-slate-900">Hard</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-slate-300 mb-3"
              >
                Interview Duration
              </label>

              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-[#0f172a] border border-white/10 focus:border-cyan-400 rounded-2xl px-5 py-4 text-white outline-none transition-all"
              >
                <option value={5} className="bg-slate-900">
                  5 Minutes
                </option>

                <option value={10} className="bg-slate-900">
                  10 Minutes
                </option>

                <option value={15} className="bg-slate-900">
                  15 Minutes
                </option>

                <option value={30} className="bg-slate-900">
                  30 Minutes
                </option>
              </select>
            </div>
          </div>

          {/* Question Type */}
          <div>
            <label
              htmlFor="questionType"
              className="block text-sm font-medium text-slate-300 mb-3"
            >
              Question Focus
            </label>

            <select
              id="questionType"
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 focus:border-cyan-400 rounded-2xl px-5 py-4 text-white outline-none transition-all"
            >
              <option value="Mixed" className="bg-slate-900">
                Mixed (Technical + Behavioral)
              </option>

              <option value="Technical" className="bg-slate-900">
                Technical Only
              </option>

              <option value="Behavioral" className="bg-slate-900">
                Behavioral Only
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.jobRole}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.01] text-white font-semibold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">

                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 
                    0 0 5.373 0 12h4z"
                  />
                </svg>

                Preparing Interview...
              </span>
            ) : (
              "Start AI Interview →"
            )}
          </button>
        </form>
      </div>

      {/* Bottom Tip */}
      <div className="mt-8 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">

        <p className="text-cyan-300 text-sm leading-relaxed">
          Uploading your resume helps the AI generate highly personalized
          interview questions based on your skills, projects, and experience.
        </p>
      </div>
    </div>
  </div>
);
};

export default InterviewSetup;