import api from './api';

export const getQuestions = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await api.get('/question');
  return response.data;
};

export const submitPracticeAnswer = async (questionId, answer) => {
  const response = await api.post('/interview/practice-answer', {
    questionId,
    answer
  });
  return response.data;
};