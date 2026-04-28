const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  jobRole: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  duration: { type: Number, required: true }, // in minutes
  questionType: { type: String, enum: ['Technical', 'Behavioral', 'Mixed'], default: 'Mixed' },
  resumeText: { type: String, default: null },
  status: { type: String, enum: ['Setup', 'InProgress', 'Completed'], default: 'Setup' },
  questions: [{ 
    question: String, 
    category: String,
    expectedAnswer: String 
  }],
  answers: [{
    video: String,
    transcript: String,
    recordedAt: Date,
    recorded: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    feedback: String,
    improvements: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);