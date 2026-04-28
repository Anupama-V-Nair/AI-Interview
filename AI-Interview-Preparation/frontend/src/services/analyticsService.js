import api from './api';

export const getInterviewAnalytics = async (timeRange = 'all') => {
  const response = await api.get(`/interview/analytics?range=${timeRange}`);
  return response.data;
};