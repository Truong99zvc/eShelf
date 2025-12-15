import api from './api';

const reviewService = {
  // Get reviews for a book
  getBookReviews: async (isbn, params = {}) => {
    const response = await api.get(`/reviews/book/${isbn}`, { params });
    return response.data;
  },

  // Create a review
  createReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Update a review
  updateReview: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Toggle like on a review
  toggleLike: async (id) => {
    const response = await api.post(`/reviews/${id}/like`);
    return response.data;
  },

  // Get my reviews
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
};

export default reviewService;










