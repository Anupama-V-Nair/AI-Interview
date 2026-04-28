import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const InterviewResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadInterviewResult();
  }, [sessionId]);

  const loadInterviewResult = async () => {
    try {
      const response = await api.get(`/interview/${sessionId}`);
      const sessionData = response.data.data;
      setSession(sessionData);
      
      // Mock analysis data (replace with actual AI evaluation)
      setAnalysis(generateMockAnalysis(sessionData));
    } catch (err) {
      console.error('Failed to load interview result:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (session) => {
    const totalQuestions = session.questions?.length || 0;
    const answeredQuestions = session.answers?.filter(a => a && a.recorded).length || 0;
    
    // Calculate overall score from real evaluated answers
    let totalScore = 0;
    let scoredAnswers = 0;
    let strengthsSet = new Set();
    let improvementsSet = new Set();

    const questionFeedback = session.questions?.map((q, index) => {
      const answer = session.answers && session.answers[index];
      const score = answer?.score || 0;
      const feedback = answer?.feedback || "No answer recorded.";
      const improvements = answer?.improvements || "Answer the question to get improvement feedback.";
      
      if (answer && answer.recorded) {
        totalScore += score;
        scoredAnswers++;
        if (score >= 80) strengthsSet.add("Strong handle on " + q.category);
        if (score < 60) improvementsSet.add("Review topics around " + q.category);
        if (improvements && improvements.length > 5) improvementsSet.add(improvements);
      }

      return {
        question: q.question,
        transcript: answer?.transcript || "No transcript recorded.",
        score: Math.round(score),
        feedback: feedback,
        improvements: improvements,
        category: q.category
      };
    }) || [];

    const overallScore = scoredAnswers > 0 ? Math.round(totalScore / scoredAnswers) : 0;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return {
      overallScore,
      completionRate,
      strengths: strengthsSet.size > 0 ? Array.from(strengthsSet).slice(0, 4) : ['Consistent effort'],
      areasForImprovement: improvementsSet.size > 0 ? Array.from(improvementsSet).slice(0, 4) : ['Try to provide more detailed answers'],
      questionFeedback
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your interview...</p>
        </div>
      </div>
    );
  }

  if (!session || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Results Found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Results</h1>
          <p className="text-gray-600">{session.jobRole} • {new Date(session.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}%
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {analysis.overallScore >= 80 ? 'Excellent Performance! 🎉' : 
               analysis.overallScore >= 60 ? 'Good Job! 👍' : 'Keep Practicing! 💪'}
            </h2>
            <p className="text-gray-600">
              You completed {analysis.completionRate}% of the interview
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {session.questions?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {session.answers?.filter(a => a?.recorded).length || 0}
              </div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.floor((session.actualDuration || 0) / 60)}m
              </div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-500">✓</span> Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-yellow-500">💡</span> Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {analysis.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Feedback */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Question-by-Question Analysis</h3>
          <div className="space-y-6">
            {analysis.questionFeedback.map((feedback, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                        Q{index + 1}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {feedback.category}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{feedback.question}</p>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
                    {feedback.score}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Answer</h4>
                    <p className="text-sm text-gray-700 italic border-l-2 border-indigo-300 pl-3 py-1 bg-white rounded-r">{feedback.transcript}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Feedback</h4>
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                  </div>
                  {feedback.improvements && feedback.improvements !== "-" && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">How to Improve</h4>
                      <p className="text-sm text-gray-700">{feedback.improvements}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/interview-setup')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            🔄 Try Another Interview
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-all"
          >
            📊 View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;