import { API_BASE_URL } from '../utils/constants';

export const authService = {
  async login(email, password) {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: 1,
            email,
            username: email.split('@')[0],
            avatar: null,
            level: 1,
            points: 100,
            role: 'user',
            token: 'mock-jwt-token'
          }
        });
      }, 1000);
    });
  },

  async register(email, password, username) {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: Date.now(),
            email,
            username,
            avatar: null,
            level: 1,
            points: 0,
            role: 'user',
            token: 'mock-jwt-token'
          }
        });
      }, 1000);
    });
  },

  async logout() {
    localStorage.removeItem('mangauz_user');
    localStorage.removeItem('mangauz_token');
  }
};