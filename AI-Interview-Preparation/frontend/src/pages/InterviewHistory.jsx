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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
              <p className="text-gray-600 mt-1">View and manage your past interview sessions</p>
            </div>
            <button
              onClick={() => navigate('/interview-setup')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              ➕ New Interview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search by job role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({interviews.length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✓ Completed ({interviews.filter(i => i.status === 'Completed').length})
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'in-progress' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔄 In Progress ({interviews.filter(i => i.status === 'InProgress').length})
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Interview List */}
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Interviews Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'Start your first AI interview to see it here'}
            </p>
            <button
              onClick={() => navigate('/interview-setup')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <div
                key={interview._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Interview Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{interview.jobRole}</h3>
                      {getStatusBadge(interview.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(interview.difficulty)}`}>
                        {interview.difficulty}
                      </span>
                      <span>📋 {interview.questionType}</span>
                      <span>⏱️ {interview.duration} min</span>
                      <span>📅 {formatDate(interview.createdAt)}</span>
                    </div>
                    
                    {interview.status === 'Completed' && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          ✅ {interview.answers?.filter(a => a?.recorded).length || 0}/{interview.questions?.length || 0} questions answered
                        </span>
                        {interview.actualDuration && (
                          <span className="text-gray-600">
                            ⏱️ Completed in {Math.floor(interview.actualDuration / 60)}m {interview.actualDuration % 60}s
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex gap-3">
                    {interview.status === 'InProgress' && (
                      <button
                        onClick={() => navigate(`/ai-interview/${interview._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                      >
                        ▶️ Resume
                      </button>
                    )}
                    
                    {interview.status === 'Completed' && (
                      <button
                        onClick={() => navigate(`/interview-result/${interview._id}`)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                      >
                        📊 View Results
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate('/interview-setup')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                    >
                      🔄 Retake
                    </button>
                    
                    <button
                      onClick={() => handleDelete(interview._id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-2 rounded-lg font-medium transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {interviews.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">{interviews.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Interviews</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {interviews.filter(i => i.status === 'Completed').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {interviews.filter(i => i.status === 'InProgress').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">In Progress</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {interviews.reduce((sum, i) => sum + (i.questions?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Questions Practiced</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;