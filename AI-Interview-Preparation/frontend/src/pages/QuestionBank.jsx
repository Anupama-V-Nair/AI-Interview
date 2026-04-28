import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const QuestionBank = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  
  // Selected question for practice
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [savedQuestions, setSavedQuestions] = useState([]);

  useEffect(() => {
    loadQuestions();
    loadSavedQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/question');
      setQuestions(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('Failed to load question bank');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedQuestions = () => {
    const saved = localStorage.getItem('savedQuestions');
    if (saved) {
      setSavedQuestions(JSON.parse(saved));
    }
  };

  const saveQuestion = (questionId) => {
    const newSaved = savedQuestions.includes(questionId)
      ? savedQuestions.filter(id => id !== questionId)
      : [...savedQuestions, questionId];
    
    setSavedQuestions(newSaved);
    localStorage.setItem('savedQuestions', JSON.stringify(newSaved));
  };

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    if (searchTerm && !q.question.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && q.category !== categoryFilter) {
      return false;
    }
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) {
      return false;
    }
    if (roleFilter !== 'all' && q.jobRole !== roleFilter) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Get unique values for filters
  const categories = [...new Set(questions.map(q => q.category))];
  const difficulties = [...new Set(questions.map(q => q.difficulty))];
  const roles = [...new Set(questions.map(q => q.jobRole))];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical': return '💻';
      case 'Behavioral': return '';
      case 'Leadership': return '👑';
      case 'Problem Solving': return '🧩';
      case 'Communication': return '💬';
      default: return '📝';
    }
  };

  const startPractice = (question) => {
    setSelectedQuestion(question);
    setIsPracticing(true);
    setPracticeAnswer('');
  };

  const submitPractice = async () => {
    try {
      // Mock submission - in real app, send to AI for evaluation
      await api.post('/interview/practice-answer', {
        questionId: selectedQuestion._id,
        answer: practiceAnswer
      });
      
      alert('✅ Practice answer submitted! Check your feedback in analytics.');
      setIsPracticing(false);
      setSelectedQuestion(null);
      setPracticeAnswer('');
    } catch (err) {
      console.error('Practice submission error:', err);
      alert('Failed to submit practice answer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📚 Question Bank</h1>
              <p className="text-gray-600 mt-1">Browse and practice {questions.length} interview questions</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/interview-setup')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                🎯 Start Mock Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Search</label>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📋 Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">⚡ Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Difficulties</option>
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">💼 Job Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters & Clear */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Showing {filteredQuestions.length} questions</span>
              {(categoryFilter !== 'all' || difficultyFilter !== 'all' || roleFilter !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setDifficultyFilter('all');
                    setRoleFilter('all');
                    setCurrentPage(1);
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600">
              💾 Saved: {savedQuestions.length} questions
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Questions Grid */}
        {currentQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Questions Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setDifficultyFilter('all');
                setRoleFilter('all');
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-8">
            {currentQuestions.map((question, index) => (
              <div
                key={question._id || index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {question.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {question.jobRole}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {question.question}
                    </h3>
                    
                    {question.expectedAnswer && (
                      <details className="mt-3">
                        <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium">
                          👁️ View Suggested Answer
                        </summary>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                          {question.expectedAnswer}
                        </div>
                      </details>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => saveQuestion(question._id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        savedQuestions.includes(question._id)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {savedQuestions.includes(question._id) ? '⭐ Saved' : '☆ Save'}
                    </button>
                    <button
                      onClick={() => startPractice(question)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
                    >
                      🎤 Practice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600">{questions.length}</div>
            <div className="text-sm text-gray-600 mt-1">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{categories.length}</div>
            <div className="text-sm text-gray-600 mt-1">Categories</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{roles.length}</div>
            <div className="text-sm text-gray-600 mt-1">Job Roles</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{savedQuestions.length}</div>
            <div className="text-sm text-gray-600 mt-1">Saved Questions</div>
          </div>
        </div>
      </div>

      {/* Practice Modal */}
      {isPracticing && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">🎤 Practice Question</h2>
                <button
                  onClick={() => {
                    setIsPracticing(false);
                    setSelectedQuestion(null);
                    setPracticeAnswer('');
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(selectedQuestion.category)}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {selectedQuestion.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                    {selectedQuestion.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedQuestion.question}</h3>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Your Answer (Type or speak)
                </label>
                <textarea
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={submitPractice}
                  disabled={!practiceAnswer.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  ✅ Submit Answer
                </button>
                <button
                  onClick={() => {
                    setIsPracticing(false);
                    setSelectedQuestion(null);
                    setPracticeAnswer('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;