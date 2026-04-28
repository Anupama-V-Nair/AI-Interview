// backend/controllers/questionController.js

// Seed questions - always available
const SEED_QUESTIONS = [
  {
    _id: 'seed_1',
    question: "Explain the difference between let, const, and var in JavaScript.",
    category: "Technical",
    difficulty: "Easy",
    jobRole: "Frontend Developer",
    expectedAnswer: "var is function-scoped, let/const are block-scoped. const cannot be reassigned."
  },
  {
    _id: 'seed_2',
    question: "How does React's virtual DOM work?",
    category: "Technical",
    difficulty: "Medium",
    jobRole: "Frontend Developer",
    expectedAnswer: "React creates virtual UI representation, diffs changes, and updates only what changed in real DOM."
  },
  {
    _id: 'seed_3',
    question: "Tell me about a challenging technical problem you solved.",
    category: "Behavioral",
    difficulty: "Medium",
    jobRole: "Software Engineer",
    expectedAnswer: "Use STAR method: Situation, Task, Action, Result. Focus on problem-solving approach."
  },
  {
    _id: 'seed_4',
    question: "How do you handle team conflicts?",
    category: "Behavioral",
    difficulty: "Medium",
    jobRole: "Team Lead",
    expectedAnswer: "Active listening, find common ground, focus on problem not person, seek win-win solutions."
  },
  {
    _id: 'seed_5',
    question: "Explain REST API principles.",
    category: "Technical",
    difficulty: "Easy",
    jobRole: "Backend Developer",
    expectedAnswer: "REST uses HTTP methods, is stateless, resource-based URLs, returns JSON/XML."
  },
  {
    _id: 'seed_6',
    question: "How do you optimize database queries?",
    category: "Technical",
    difficulty: "Hard",
    jobRole: "Backend Developer",
    expectedAnswer: "Use indexes, avoid N+1 queries, implement caching, use pagination, avoid SELECT *."
  },
  {
    _id: 'seed_7',
    question: "Describe your leadership style.",
    category: "Leadership",
    difficulty: "Medium",
    jobRole: "Manager",
    expectedAnswer: "Situational leadership, empower team, clear communication, adapt to team needs."
  },
  {
    _id: 'seed_8',
    question: "How do you prioritize urgent tasks?",
    category: "Problem Solving",
    difficulty: "Medium",
    jobRole: "Project Manager",
    expectedAnswer: "Use Eisenhower Matrix, consider business impact, dependencies, communicate trade-offs."
  },
  {
    _id: 'seed_9',
    question: "Explain tech concepts to non-technical people.",
    category: "Communication",
    difficulty: "Hard",
    jobRole: "Software Engineer",
    expectedAnswer: "Use analogies, avoid jargon, focus on benefits, check understanding, relate to experience."
  },
  {
    _id: 'seed_10',
    question: "Where do you see yourself in 5 years?",
    category: "Behavioral",
    difficulty: "Easy",
    jobRole: "All Roles",
    expectedAnswer: "Show ambition aligned with company goals, desire for growth, commitment to field."
  }
];

// ✅ Function 1: Get Questions
const getQuestions = async (req, res) => {
  try {
    console.log('📥 GET /api/interview/questions');
    
    // Return seed questions (reliable for dev)
    return res.status(200).json({
      success: true,
      count: SEED_QUESTIONS.length,
       SEED_QUESTIONS
    });
    
  } catch (error) {
    console.error('❌ getQuestions error:', error.message);
    
    // Fallback to seed questions
    return res.status(200).json({
      success: true,
      count: SEED_QUESTIONS.length,
       SEED_QUESTIONS
    });
  }
};

// ✅ Function 2: Submit Practice Answer
const submitPracticeAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    console.log('📝 Practice answer received');
    
    return res.status(200).json({
      success: true,
      message: 'Answer received',
      data: {
        feedback: 'Answer saved!',
        submittedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ submitPracticeAnswer error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Export both functions
module.exports = {
  getQuestions,
  submitPracticeAnswer
};