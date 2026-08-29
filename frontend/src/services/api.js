import axios from 'axios';

// Defaults to FastAPI port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT bearer token to outbound requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stenox_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication endpoints
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const requestPasswordReset = (data) => api.post('/api/auth/forgot-password', data);
export const submitNewPassword = (data) => api.post('/api/auth/reset-password', data);

// Webhook log query and management endpoints
export const getRequests = (endpointId) => api.get(`/api/requests/${endpointId}`);
export const deleteRequest = (requestId) => api.delete(`/api/requests/${requestId}`);
export const clearRequests = (endpointId) => api.delete(`/api/requests/clear/${endpointId}`);

// Profile endpoints
export const uploadProfilePhoto = (formData) =>
  api.put('/api/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;