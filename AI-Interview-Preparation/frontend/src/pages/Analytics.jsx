import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import api from '../services/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // week, month, all

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/interview/analytics?range=${timeRange}`);
      setAnalytics(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Color palette for charts
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];
  const STATUS_COLORS = { Completed: '#22c55e', InProgress: '#3b82f6', Setup: '#eab308' };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  // Format percentage
  const formatPercent = (value) => `${value}%`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Analytics Data</h2>
          <p className="text-gray-600 mb-6">{error || 'Complete some interviews to see your analytics'}</p>
          <button
            onClick={() => navigate('/interview-setup')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Start Your First Interview
          </button>
        </div>
      </div>
    );
  }

  const {
    overview,
    performanceByRole,
    performanceByDifficulty,
    progressOverTime,
    categoryScores,
    recentInterviews
  } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your interview performance and improvement</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={() => navigate('/interview-setup')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
              >
                ➕ New Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Interviews"
            value={overview.totalInterviews}
            icon="📝"
            trend={overview.interviewsThisMonth > 0 ? `+${overview.interviewsThisMonth} this month` : null}
            color="indigo"
          />
          <StatCard
            title="Average Score"
            value={`${overview.averageScore}%`}
            icon="🎯"
            trend={overview.scoreImprovement > 0 ? `↑ ${overview.scoreImprovement}% vs last period` : null}
            color="green"
          />
          <StatCard
            title="Questions Practiced"
            value={formatNumber(overview.totalQuestions)}
            icon="💬"
            trend={`${overview.completionRate}% completion rate`}
            color="purple"
          />
          <StatCard
            title="Total Practice Time"
            value={`${Math.floor(overview.totalPracticeTime / 60)}h ${overview.totalPracticeTime % 60}m`}
            icon="⏱️"
            trend={overview.mostActiveDay ? `Most active: ${overview.mostActiveDay}` : null}
            color="blue"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Progress Over Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Score Progress Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="average" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance by Role */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Performance by Job Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByRole} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(value) => [`${value}%`, 'Average Score']} />
                <Bar dataKey="averageScore" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Category Scores (Radar) */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🕸️ Skills Assessment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={categoryScores}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Your Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Difficulty Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performance by Difficulty</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceByDifficulty}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {performanceByDifficulty.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} interviews`,
                  `${props.payload.difficulty} - Avg: ${props.payload.averageScore}%`
                ]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Interviews Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">🕐 Recent Interviews</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInterviews.map((interview) => (
                  <tr key={interview._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{interview.jobRole}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interview.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        interview.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {interview.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="font-semibold text-indigo-600">
                        {interview.averageScore || 'N/A'}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interview.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        interview.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => navigate(`/interview-result/${interview._id}`)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">💡 Personalized Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.insights?.map((insight, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-2">{insight.icon}</div>
                <h4 className="font-semibold mb-1">{insight.title}</h4>
                <p className="text-sm text-indigo-100">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, trend, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${colorClasses[color]} text-white`}>
          {trend}
        </span>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default Analytics;