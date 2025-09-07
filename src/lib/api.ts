import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000', // Backend URL
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events/'),
  create: (event: any) => api.post('/events/', event),
  update: (id: string, event: any) => api.put(`/events/${id}`, event),
  delete: (id: string) => api.delete(`/events/${id}`),
  getRegistrations: (id: string) => api.get(`/events/${id}/registrations`),
  getAttendance: (id: string) => api.get(`/events/${id}/attendance`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users/'),
  create: (user: any) => api.post('/users/', user),
  update: (id: string, user: any) => api.put(`/users/${id}`, user),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Reports API
export const reportsAPI = {
  getEventPopularity: () => api.get('/reports/event-popularity'),
  getStudentParticipation: () => api.get('/reports/student-participation'),
  getAttendanceStats: () => api.get('/reports/attendance-stats'),
};

export default api;