import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInterviewHistory();
  }, []);

  const loadInterviewHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/interview/history');
      setInterviews(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    // Filter by status
    if (filter === 'completed' && interview.status !== 'Completed') return false;
    if (filter === 'in-progress' && interview.status !== 'InProgress') return false;

    // Filter by search term
    if (searchTerm && !interview.jobRole?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✓ Completed</span>;
      case 'InProgress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">🔄 In Progress</span>;
      case 'Setup':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">⏳ Setup</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{status}</span>;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await api.delete(`/interview/${sessionId}`);
      setInterviews(interviews.filter(i => i._id !== sessionId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete interview');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-white overflow-hidden relative animate-pulse">

        {/* Glow Effects */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />

        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

        <div className="relative z-10">

          {/* HEADER */}
          <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">

            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">

              <div>

                <div className="h-12 w-80 bg-white/10 rounded-2xl mb-4"></div>

                <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
              </div>

              <div className="h-14 w-48 bg-indigo-500/20 rounded-2xl"></div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="max-w-7xl mx-auto px-6 py-8">

            {/* FILTERS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">

              <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">

                {/* Search */}
                <div className="w-full lg:flex-1">

                  <div className="h-14 w-full bg-white/10 rounded-2xl"></div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 flex-wrap">

                  <div className="h-12 w-28 bg-white/10 rounded-xl"></div>

                  <div className="h-12 w-40 bg-green-500/10 rounded-xl"></div>

                  <div className="h-12 w-40 bg-blue-500/10 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* INTERVIEW CARDS */}
            <div className="space-y-5">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex-1">

                      <div className="flex items-center gap-4 mb-5">

                        <div className="h-8 w-56 bg-white/10 rounded-xl"></div>

                        <div className="h-7 w-28 bg-white/10 rounded-full"></div>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4">

                        <div className="h-7 w-24 bg-green-500/10 rounded-full"></div>

                        <div className="h-4 w-32 bg-white/5 rounded-lg"></div>

                        <div className="h-4 w-24 bg-white/5 rounded-lg"></div>

                        <div className="h-4 w-36 bg-white/5 rounded-lg"></div>
                      </div>

                      <div className="flex flex-wrap gap-4">

                        <div className="h-4 w-52 bg-white/5 rounded-lg"></div>

                        <div className="h-4 w-44 bg-white/5 rounded-lg"></div>
                      </div>
                    </div>

                    {/* RIGHT BUTTONS */}
                    <div className="flex gap-3 flex-wrap">

                      <div className="h-12 w-36 bg-blue-500/10 rounded-xl"></div>

                      <div className="h-12 w-32 bg-indigo-500/10 rounded-xl"></div>

                      <div className="h-12 w-28 bg-red-500/10 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* STATS SUMMARY */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >

                  <div className="h-10 w-20 bg-white/10 rounded-xl mx-auto mb-4"></div>

                  <div className="h-4 w-32 bg-white/5 rounded-lg mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10">

        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">

          <div className="max-w-7xl mx-auto px-6 py-5">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Interview History
                </h1>

                <p className="text-slate-400 mt-2 text-sm">
                  Review, manage, and continue your AI interview sessions.
                </p>
              </div>

              <button
                onClick={() => navigate('/interview-setup')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-all duration-300 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
              >
                + New Interview
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Search + Filters */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl">

            <div className="flex flex-col xl:flex-row gap-5 items-center justify-between">

              {/* Search */}
              <div className="w-full xl:flex-1">

                <div className="relative">

                  <input
                    type="text"
                    placeholder="Search by job role..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 px-5 py-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 transition"
                  />

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    🔍
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">

                <button
                  onClick={() => setFilter('all')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                >
                  All ({interviews.length})
                </button>

                <button
                  onClick={() => setFilter('completed')}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'completed'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                >
                  ✓ Completed (
                  {
                    interviews.filter(
                      (i) => i.status === 'Completed'
                    ).length
                  }
                  )
                </button>

                <button
                  onClick={() =>
                    setFilter('in-progress')
                  }
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${filter === 'in-progress'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                >
                  🔄 In Progress (
                  {
                    interviews.filter(
                      (i) => i.status === 'InProgress'
                    ).length
                  }
                  )
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-6 text-red-300 backdrop-blur-xl">
              {error}
            </div>
          )}

          {/* Empty State */}
          {filteredInterviews.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-14 text-center shadow-2xl">

              <div className="text-7xl mb-5">
                📝
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">
                No Interviews Found
              </h3>

              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {searchTerm || filter !== 'all'
                  ? 'No matching interviews found. Try changing filters or search terms.'
                  : 'Start your first AI interview session to begin tracking progress.'}
              </p>

              <button
                onClick={() =>
                  navigate('/interview-setup')
                }
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 transition-all duration-300 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-indigo-500/30"
              >
                Start First Interview
              </button>
            </div>
          ) : (

            /* Interview Cards */
            <div className="space-y-5">

              {filteredInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-indigo-500/20 transition-all duration-300 shadow-2xl"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                    {/* Left */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3 mb-4">

                        <h3 className="text-2xl font-bold text-white">
                          {interview.jobRole}
                        </h3>

                        {getStatusBadge(
                          interview.status
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">

                        <span
                          className={`px-4 py-2 rounded-full font-semibold ${getDifficultyColor(
                            interview.difficulty
                          )}`}
                        >
                          {interview.difficulty}
                        </span>

                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-300">
                          📋 {interview.questionType}
                        </span>

                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-300">
                          ⏱️ {interview.duration} min
                        </span>

                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-slate-300">
                          📅 {formatDate(interview.createdAt)}
                        </span>
                      </div>

                      {interview.status ===
                        'Completed' && (
                          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">

                            <span>
                              ✅{' '}
                              {interview.answers?.filter(
                                (a) => a?.recorded
                              ).length || 0}
                              /
                              {interview.questions
                                ?.length || 0}{' '}
                              answered
                            </span>

                            {interview.actualDuration && (
                              <span>
                                ⏱️ Completed in{' '}
                                {Math.floor(
                                  interview.actualDuration /
                                  60
                                )}
                                m{' '}
                                {interview.actualDuration %
                                  60}
                                s
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">

                      {interview.status ===
                        'InProgress' && (
                          <button
                            onClick={() =>
                              navigate(
                                `/ai-interview/${interview._id}`
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
                          >
                            ▶ Resume
                          </button>
                        )}

                      {interview.status ===
                        'Completed' && (
                          <button
                            onClick={() =>
                              navigate(
                                `/interview-result/${interview._id}`
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30"
                          >
                            Results
                          </button>
                        )}

                      <button
                        onClick={() =>
                          navigate('/interview-setup')
                        }
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 hover:scale-105"
                      >
                        Retake
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(interview._id)
                        }
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 px-5 py-3 rounded-xl font-semibold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {interviews.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">

                <div className="text-5xl font-black text-indigo-400">
                  {interviews.length}
                </div>

                <div className="text-slate-400 mt-2">
                  Total Interviews
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">

                <div className="text-5xl font-black text-green-400">
                  {
                    interviews.filter(
                      (i) =>
                        i.status === 'Completed'
                    ).length
                  }
                </div>

                <div className="text-slate-400 mt-2">
                  Completed
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">

                <div className="text-5xl font-black text-blue-400">
                  {
                    interviews.filter(
                      (i) =>
                        i.status === 'InProgress'
                    ).length
                  }
                </div>

                <div className="text-slate-400 mt-2">
                  In Progress
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">

                <div className="text-5xl font-black text-purple-400">
                  {interviews.reduce(
                    (sum, i) =>
                      sum +
                      (i.questions?.length || 0),
                    0
                  )}
                </div>

                <div className="text-slate-400 mt-2">
                  Questions Practiced
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;