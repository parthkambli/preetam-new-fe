import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token and org header to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const currentOrgId = localStorage.getItem('currentOrgId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (currentOrgId) {
      config.headers['X-Organization-ID'] = currentOrgId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('organizations');
      localStorage.removeItem('currentOrgId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
