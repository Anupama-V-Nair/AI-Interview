const express = require('express');
const router = express.Router();
const { getQuestions, submitPracticeAnswer } = require('../controllers/questionController');

router.get('/', getQuestions);
router.post('/practice-answer', submitPracticeAnswer);

module.exports = router;