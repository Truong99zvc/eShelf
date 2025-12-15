import api from './api';

const donationService = {
  // Create donation
  createDonation: async (data) => {
    const response = await api.post('/donations', data);
    return response.data;
  },

  // Check donation status
  checkStatus: async (transactionId) => {
    const response = await api.get(`/donations/status/${transactionId}`);
    return response.data;
  },

  // Get my donations
  getMyDonations: async () => {
    const response = await api.get('/donations/my-donations');
    return response.data;
  },
};

export default donationService;










