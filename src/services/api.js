// import axios from 'axios';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor - add auth token and org header to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     const currentOrgId = localStorage.getItem('currentOrgId');

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     if (currentOrgId) {
//       config.headers['X-Organization-ID'] = currentOrgId;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor - handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid - clear storage and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('organizations');
//       localStorage.removeItem('currentOrgId');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Fitness Staff
// api.fitnessStaff = {
//   getAll: (params) => api.get('/api/fitness/staff', { params }),
//   getById: (id) => api.get(`/api/fitness/staff/${id}`),
//   create: (formData) => api.post('/api/fitness/staff/create', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   update: (id, formData) => api.put(`/api/fitness/staff/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   }),
//   delete: (id) => api.delete(`/api/fitness/staff/${id}`),

//   // Roles
//   getRoles: () => api.get('/api/fitness/roles'),
//   createRole: (data) => api.post('/api/fitness/roles/create', data),
//   deleteRole: (id) => api.delete(`/api/fitness/roles/${id}`),

//   // Employment Types
//   getEmploymentTypes: () => api.get('/api/fitness/types'),
//   createEmploymentType: (data) => api.post('/api/fitness/types/create', data),
//   deleteEmploymentType: (id) => api.delete(`/api/fitness/types/${id}`),
// };

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const currentOrgId = localStorage.getItem('currentOrgId');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (currentOrgId) config.headers['X-Organization-ID'] = currentOrgId;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('organizations');
      localStorage.removeItem('currentOrgId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Fitness Staff
api.fitnessStaff = {
  getAll: (params) => api.get('/fitness/staff', { params }),
  getById: (id) => api.get(`/fitness/staff/${id}`),
  create: (formData) => api.post('/fitness/staff/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/fitness/staff/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/fitness/staff/${id}`),

  getRoles: () => api.get('/fitness/roles'),
  createRole: (data) => api.post('/fitness/roles/create', data),
  deleteRole: (id) => api.delete(`/fitness/roles/${id}`),

  getEmploymentTypes: () => api.get('/fitness/types'),
  createEmploymentType: (data) => api.post('/fitness/types/create', data),
  deleteEmploymentType: (id) => api.delete(`/fitness/types/${id}`),
};

export default api;