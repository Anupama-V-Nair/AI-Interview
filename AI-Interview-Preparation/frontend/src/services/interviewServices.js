import api from './api';

export const setupInterviewSession = async (setupData) => {
  const response = await api.post('/interview/setup', setupData);
  return response.data;
};
export const getInterviewSession = async (sessionId) => {
  const response = await api.get(`/interview/${sessionId}`);
  return response.data;
};
export const submitAnswer = async (sessionId, questionIndex, videoBlob, transcript) => {
  const formData = new FormData();
  formData.append('sessionId', sessionId);
  formData.append('questionIndex', questionIndex);
  formData.append('video', videoBlob, `answer-${questionIndex}.webm`);
  formData.append('transcript', transcript);
  
  const response = await api.post('/interview/answer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
export const completeInterview = async (sessionId, answers, duration) => {
  const response = await api.post(`/interview/${sessionId}/complete`, {
    answers,
    duration
  });
  return response.data;
};
export const deleteInterview = async (sessionId) => {
  const response = await api.delete(`/interview/${sessionId}`);
  return response.data;
};