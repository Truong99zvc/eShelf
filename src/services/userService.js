import api from './api';

const userService = {
  // Update profile
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Favorites
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  addFavorite: async (isbn) => {
    const response = await api.post(`/users/favorites/${isbn}`);
    return response.data;
  },

  removeFavorite: async (isbn) => {
    const response = await api.delete(`/users/favorites/${isbn}`);
    return response.data;
  },

  // Bookmarks
  getBookmarks: async () => {
    const response = await api.get('/users/bookmarks');
    return response.data;
  },

  addBookmark: async (isbn) => {
    const response = await api.post(`/users/bookmarks/${isbn}`);
    return response.data;
  },

  removeBookmark: async (isbn) => {
    const response = await api.delete(`/users/bookmarks/${isbn}`);
    return response.data;
  },

  // Reading history
  getReadingHistory: async () => {
    const response = await api.get('/users/reading-history');
    return response.data;
  },

  updateReadingHistory: async (isbn, progress) => {
    const response = await api.post(`/users/reading-history/${isbn}`, { progress });
    return response.data;
  },
};

export default userService;










