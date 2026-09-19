import api from './api';

export const authService = {
  async register(fullName, email, password) {
    // Added /api prefix so Nginx routes this to backend-service:8000
    const res = await api.post('/api/auth/register', { full_name: fullName, email, password });
    return res.data;
  },

  async login(email, password) {
    // Added /api prefix so Nginx routes this to backend-service:8000
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('stenox_token', res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('stenox_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!(localStorage.getItem('stenox_token') || localStorage.getItem('token'));
  }
};

