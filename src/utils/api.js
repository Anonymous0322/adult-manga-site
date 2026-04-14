import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
  const trimmed = String(rawUrl || '').trim().replace(/\/+$/, '');
  if (!trimmed) return 'http://localhost:5000/api';
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.REACT_APP_API_URL || 'http://localhost:5000'
);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mangauz_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mangauz_token');
      localStorage.removeItem('mangauz_user');
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, username) => api.post('/auth/register', { email, password, username }),
  registerAdmin: (username, email, password, setupKey) =>
    api.post('/auth/register-admin', { username, email, password, setupKey })
};

export const mangaApi = {
  list: (params = {}) => api.get('/manga', { params }),
  getById: (id) => api.get(`/manga/${id}`),
  create: (formData) =>
    api.post('/manga', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  update: (id, formData) =>
    api.put(`/manga/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id) => api.delete(`/manga/${id}`)
};

export const chapterApi = {
  create: (formData) =>
    api.post('/chapter', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getById: (id, params = {}) => api.get(`/chapter/${id}`, { params }),
  delete: (id) => api.delete(`/chapter/${id}`)
};

export const usersApi = {
  list: (params = {}) => api.get('/users', { params }),
  update: (id, payload) => api.patch(`/users/${id}`, payload),
  delete: (id) => api.delete(`/users/${id}`)
};

export const userApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getActivity: (userId) => api.get(`/users/${userId}/activity`),
  getLibrary: () => api.get('/users/library'),
  addToLibrary: (contentId) => api.post('/users/library', { contentId }),
  removeFromLibrary: (contentId) => api.delete(`/users/library/${contentId}`)
};

export const adminApi = {
  getUsers: (page = 1, limit = 20) => usersApi.list({ page, limit }),
  updateUser: (userId, data) => usersApi.update(userId, data),
  deleteUser: (userId) => usersApi.delete(userId)
};

export default api;
