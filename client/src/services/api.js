import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  demoLogin: (role, department) => api.post('/auth/demo-login', { role, department }),
};

// Complaint endpoints
export const complaintAPI = {
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data),
  assign: (id, data) => api.put(`/complaints/${id}/assign`, data),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  verify: (id, data) => api.put(`/complaints/${id}/verify`, data),
  feedback: (id, data) => api.post(`/complaints/${id}/feedback`, data),
  reopen: (id, data) => api.put(`/complaints/${id}/reopen`, data),
  reject: (id, data) => api.put(`/complaints/${id}/reject`, data),
};

// Module specific endpoints
export const wasteAPI = {
  classify: (imageBase64, mimeType) => api.post('/waste/classify', { imageBase64, mimeType }),
  getHotspots: () => api.get('/waste/hotspots'),
};

export const waterAPI = {
  getTelemetry: () => api.get('/water/telemetry'),
};

export const energyAPI = {
  getTelemetry: () => api.get('/energy/telemetry'),
};

export const aiAPI = {
  chat: (prompt, language, history) => api.post('/ai/chat', { prompt, language, history }),
};

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics'),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getStaffByDepartment: (department) => api.get(`/users/staff/${department}`),
  getDepartments: () => api.get('/users/departments'),
  getAuditLogs: () => api.get('/users/audit-logs'),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
};

export default api;
