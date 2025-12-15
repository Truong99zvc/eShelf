import api from './api';

const feedbackService = {
  // Submit feedback
  submitFeedback: async (data) => {
    const response = await api.post('/feedback', data);
    return response.data;
  },

  // Get my feedback
  getMyFeedback: async () => {
    const response = await api.get('/feedback/my-feedback');
    return response.data;
  },
};

export default feedbackService;










