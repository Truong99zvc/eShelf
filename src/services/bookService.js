import api from './api';

const bookService = {
  // Get all books with pagination
  getBooks: async (params = {}) => {
    const response = await api.get('/books', { params });
    return response.data;
  },

  // Get book by ISBN
  getBookByIsbn: async (isbn) => {
    const response = await api.get(`/books/${isbn}`);
    return response.data;
  },

  // Search books
  searchBooks: async (params) => {
    const response = await api.get('/books/search', { params });
    return response.data;
  },

  // Get all genres
  getGenres: async () => {
    const response = await api.get('/books/genres');
    return response.data;
  },

  // Get books by genre
  getBooksByGenre: async (genreName, params = {}) => {
    const response = await api.get(`/books/genre/${encodeURIComponent(genreName)}`, { params });
    return response.data;
  },

  // Get related books
  getRelatedBooks: async (isbn, limit = 12) => {
    const response = await api.get(`/books/${isbn}/related`, { params: { limit } });
    return response.data;
  },

  // Increment download count
  incrementDownload: async (isbn) => {
    const response = await api.post(`/books/${isbn}/download`);
    return response.data;
  },
};

export default bookService;

