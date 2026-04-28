const InterviewSession = require('../models/InterviewSession');
const { generateQuestions } = require('../services/aiQuestionService');
const { evaluateSessionAnswers } = require('../services/aiEvaluationService');

// @desc    Setup new interview session
// @route   POST /api/interview/setup
exports.setupInterview = async (req, res) => {
  try {
    console.log('📥 Setup request:', req.body);
    
    const { jobRole, difficulty, duration, questionType, resumeText } = req.body;
    
    // ✅ FIX: Make user optional for development/testing
    const userId = req.user?.id || null;

    // Validate required fields
    if (!jobRole) {
      return res.status(400).json({ 
        success: false, 
        message: 'Job role is required' 
      });
    }

    // 1. Create Session
    const session = await InterviewSession.create({
      user: userId,  // Now safely null if not authenticated
      jobRole,
      difficulty: difficulty || 'Medium',
      duration: duration || 10,
      questionType: questionType || 'Mixed',
      resumeText: resumeText || null,
      // Add mock questions to avoid empty array issues
      questions: [
        {
          question: `Tell me about your experience with ${jobRole}?`,
          category: 'Technical',
          expectedAnswer: 'Candidate should discuss relevant skills'
        }
      ],
      status: 'Setup'
    });

    // 2. Generate AI Questions (optional - won't crash if fails)
    try {
      const questions = await generateQuestions(jobRole, difficulty, questionType, duration, resumeText);
      session.questions = questions;
    } catch (aiError) {
      console.log('⚠️ AI service skipped:', aiError.message);
      // Continue with mock questions - don't crash the whole request
    }
    
    session.status = 'InProgress';
    await session.save();

     console.log('✅ Session created:', session._id);

    // ✅ FIXED: Added "data:" key before the nested object
    res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        questionCount: session.questions.length
      }
    });
  } catch (error) {
    console.error('❌ Setup error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      errorName: error.name
    });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    console.log('📥 Submit answer request:', req.body);
    console.log('📁 Uploaded file:', req.file);
    
    const { sessionId, questionIndex, transcript } = req.body;
    
    // Handle video file if uploaded
    let videoPath = null;
    if (req.file) {
      videoPath = `/uploads/interview-recordings/${req.file.filename}`;
      console.log('✅ Video saved:', videoPath);
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Store answer
    if (!session.answers) {
      session.answers = [];
    }

    session.answers[questionIndex] = {
      video: videoPath,
      transcript: transcript || '',
      recordedAt: new Date(),
      recorded: true
    };

    session.markModified('answers');
    await session.save();
    console.log('✅ Answer saved for question', questionIndex);

    res.json({ success: true, message: 'Answer saved' });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { duration } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.status = 'Completed';
    session.completedAt = new Date();
    session.actualDuration = duration;

    // Trigger answer evaluation (async)
    if (session.answers && session.answers.length > 0) {
      session.answers = await evaluateSessionAnswers(session.questions, session.answers);
      session.markModified('answers');
    }

    await session.save();

    res.json({
      success: true,
      message: 'Interview completed',
      data: { sessionId }
    });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getInterviewSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId)
     // .populate('resume')
      .populate('user', 'name email');
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.json({ success: true, data: session });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInterviewHistory = async (req, res) => {
  try {
    // For now, get all interviews (add user filter when auth is ready)
    const userId = req.user?.id || null;
    
    const query = userId ? { user: userId } : {};
    
    const interviews = await InterviewSession.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .select('jobRole difficulty duration questionType status createdAt actualDuration questions answers');
    
    res.json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.deleteInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findByIdAndDelete(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    
    // TODO: Delete associated video files from uploads folder
    
    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};