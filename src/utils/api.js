import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mangauz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mangauz_token');
      localStorage.removeItem('mangauz_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, username) => api.post('/auth/register', { email, password, username }),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
};

export const contentApi = {
  getPopular: () => api.get('/content/popular'),
  getByCategory: (category, page = 1) => api.get(`/content/category/${category}?page=${page}`),
  search: (query, filters = {}) => api.post('/content/search', { query, filters }),
  getContent: (id) => api.get(`/content/${id}`),
  upload: (formData) => api.post('/content/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
};

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getActivity: (userId) => api.get(`/users/${userId}/activity`),
  getLibrary: () => api.get('/users/library'),
  addToLibrary: (contentId) => api.post('/users/library', { contentId }),
  removeFromLibrary: (contentId) => api.delete(`/users/library/${contentId}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (page = 1) => api.get(`/admin/users?page=${page}`),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getContent: (page = 1) => api.get(`/admin/content?page=${page}`),
  moderateContent: (contentId, action) => api.post(`/admin/content/${contentId}/moderate`, { action }),
};

export default api;