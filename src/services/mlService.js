import api from './api';

const mlService = {
  // Get recommendations for a given userId
  getRecommendations: async (userId) => {
    const response = await api.get('/ml/recommendations', {
      params: { userId },
    });
    return response.data;
  },

  // Get current model info
  getModelInfo: async () => {
    const response = await api.get('/ml/model');
    return response.data;
  },
};

export default mlService;


