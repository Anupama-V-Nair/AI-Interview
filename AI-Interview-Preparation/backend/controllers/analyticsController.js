const InterviewSession = require('../models/InterviewSession');

// @desc    Get user analytics
// @route   GET /api/interview/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const range = req.query.range || 'all';
    
    // Calculate date filter
    const dateFilter = {};
    const now = new Date();
    if (range === 'week') {
      dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
    } else if (range === 'month') {
      dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
    }
    
    const query = userId ? { user: userId, ...dateFilter } : dateFilter;

    // Get all interviews for calculations
    const interviews = await InterviewSession.find(query).sort({ createdAt: 1 });
    
  if (interviews.length === 0) {
  return res.json({
    success: true,
     data:{                    // ✅ Added "" key
      overview: { 
        totalInterviews: 0, 
        averageScore: 0, 
        totalQuestions: 0, 
        totalPracticeTime: 0 
      },
      performanceByRole: [],
      performanceByDifficulty: [],
      progressOverTime: [],
      categoryScores: [],
      recentInterviews: [],
      insights: []
    }
  });
}

    // Calculate overview stats
    const completedInterviews = interviews.filter(i => i.status === 'Completed');
    const totalQuestions = interviews.reduce((sum, i) => sum + (i.questions?.length || 0), 0);
    const answeredQuestions = interviews.reduce((sum, i) => sum + (i.answers?.filter(a => a?.recorded).length || 0), 0);
    const totalPracticeTime = interviews.reduce((sum, i) => sum + (i.actualDuration || 0), 0);
    
    // Helper to extract actual score from an interview
    const getInterviewScore = (interview) => {
      if (!interview.answers || interview.answers.length === 0) return 0;
      const validAnswers = interview.answers.filter(a => a && a.score !== undefined && a.recorded);
      if (validAnswers.length === 0) return 0;
      return validAnswers.reduce((sum, a) => sum + (a.score || 0), 0) / validAnswers.length;
    };

    // Actual scores from AI evaluation
    const actualScores = interviews.map(i => getInterviewScore(i));
    const averageScore = actualScores.length > 0 
      ? Math.round(actualScores.reduce((a, b) => a + b, 0) / actualScores.length)
      : 0;

    // Performance by Role
    const roleStats = {};
    interviews.forEach(i => {
      if (!roleStats[i.jobRole]) {
        roleStats[i.jobRole] = { scores: [], count: 0 };
      }
      roleStats[i.jobRole].scores.push(getInterviewScore(i));
      roleStats[i.jobRole].count++;
    });
    const performanceByRole = Object.entries(roleStats).map(([role, data]) => ({
      role,
      averageScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      count: data.count
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    // Performance by Difficulty
    const difficultyStats = { Easy: [], Medium: [], Hard: [] };
    interviews.forEach(i => {
      if (difficultyStats[i.difficulty]) {
        difficultyStats[i.difficulty].push(getInterviewScore(i));
      }
    });
    const performanceByDifficulty = ['Easy', 'Medium', 'Hard'].map(diff => ({
      difficulty: diff,
      averageScore: difficultyStats[diff].length > 0 
        ? Math.round(difficultyStats[diff].reduce((a, b) => a + b, 0) / difficultyStats[diff].length)
        : 0,
      count: difficultyStats[diff].length
    })).filter(d => d.count > 0);

    // Progress over time (last 7 data points)
    const progressOverTime = interviews.slice(-7).map((i, idx) => ({
      date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.round(actualScores[interviews.length - 7 + idx]),
      average: Math.round(averageScore)
    }));

    // Category scores (mock)
    const categoryScores = [
      { category: 'Technical', score: 75 },
      { category: 'Communication', score: 82 },
      { category: 'Problem Solving', score: 68 },
      { category: 'Behavioral', score: 88 },
      { category: 'Leadership', score: 71 }
    ];

    // Recent interviews
    const recentInterviews = interviews.slice(-5).reverse().map(i => ({
      _id: i._id,
      jobRole: i.jobRole,
      difficulty: i.difficulty,
      status: i.status,
      createdAt: i.createdAt,
      averageScore: Math.round(getInterviewScore(i)),
      questionsAnswered: i.answers?.filter(a => a?.recorded).length || 0
    }));

    // Generate insights
    const insights = [];
    if (averageScore < 70) {
      insights.push({
        icon: '🎯',
        title: 'Focus on Fundamentals',
        description: 'Your average score suggests reviewing core concepts could help improve performance.'
      });
    }
    if (answeredQuestions / totalQuestions < 0.8) {
      insights.push({
        icon: '⏱️',
        title: 'Time Management',
        description: 'Try to complete more questions per session to maximize practice efficiency.'
      });
    }
    if (performanceByDifficulty.find(d => d.difficulty === 'Hard')?.averageScore < 60) {
      insights.push({
        icon: '💪',
        title: 'Challenge Yourself',
        description: 'Hard difficulty scores are lower. Consider practicing more advanced questions.'
      });
    }
    if (insights.length === 0) {
      insights.push({
        icon: '🌟',
        title: 'Great Progress!',
        description: 'Keep up the consistent practice. You\'re on the right track!'
      });
    }

    res.json({
      success: true,
     data:  {
        overview: {
          totalInterviews: interviews.length,
          averageScore,
          totalQuestions,
          totalPracticeTime,
          completionRate: Math.round((answeredQuestions / totalQuestions) * 100),
          interviewsThisMonth: interviews.filter(i => {
            const d = new Date(i.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length,
          scoreImprovement: Math.round(Math.random() * 15), // Mock improvement
          mostActiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)]
        },
        performanceByRole,
        performanceByDifficulty,
        progressOverTime,
        categoryScores,
        recentInterviews,
        insights
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};