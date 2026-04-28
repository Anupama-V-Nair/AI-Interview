const express = require('express');
const router = express.Router();
const { 
  setupInterview, 
  getInterviewSession, 
  submitAnswer, 
  completeInterview,
  getInterviewHistory,
  deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/history', getInterviewHistory);

router.post('/setup', setupInterview);
router.get('/:sessionId', getInterviewSession);

router.post('/answer', upload.single('video'), submitAnswer);
router.post('/:sessionId/complete', completeInterview);
router.delete('/:sessionId', deleteInterview);


module.exports = router;