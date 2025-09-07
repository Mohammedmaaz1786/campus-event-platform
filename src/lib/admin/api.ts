import axios from 'axios';

// Create axios instance for admin API
const adminAPI = axios.create({
  baseURL: 'http://localhost:8000/admin', // Admin specific endpoints
  timeout: 10000,
});

// Request interceptor to add auth token
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
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
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth API
export const adminAuthAPI = {
  login: (credentials: { email: string; password: string }) =>
    adminAPI.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  },
  getCurrentUser: () => adminAPI.get('/auth/me'),
};

// Admin Events API
export const adminEventsAPI = {
  getAll: () => adminAPI.get('/events'),
  create: (event: any) => adminAPI.post('/events', event),
  update: (id: string, event: any) => adminAPI.put(`/events/${id}`, event),
  delete: (id: string) => adminAPI.delete(`/events/${id}`),
  getRegistrations: (id: string) => adminAPI.get(`/events/${id}/registrations`),
  getAttendance: (id: string) => adminAPI.get(`/events/${id}/attendance`),
  updateAttendance: (eventId: string, attendanceData: any) => 
    adminAPI.put(`/events/${eventId}/attendance`, attendanceData),
};

// Admin Users Management API
export const adminUsersAPI = {
  getAll: () => adminAPI.get('/users'),
  create: (user: any) => adminAPI.post('/users', user),
  update: (id: string, user: any) => adminAPI.put(`/users/${id}`, user),
  delete: (id: string) => adminAPI.delete(`/users/${id}`),
  getStudents: () => adminAPI.get('/users/students'),
  getFaculty: () => adminAPI.get('/users/faculty'),
};

// Admin Reports API
export const adminReportsAPI = {
  getEventPopularity: () => adminAPI.get('/reports/event-popularity'),
  getStudentParticipation: () => adminAPI.get('/reports/student-participation'),
  getAttendanceStats: () => adminAPI.get('/reports/attendance-stats'),
  getDepartmentStats: () => adminAPI.get('/reports/department-stats'),
  exportEventData: (eventId: string) => adminAPI.get(`/reports/export/event/${eventId}`),
  exportAllData: () => adminAPI.get('/reports/export/all'),
};

// Admin College Management API
export const adminCollegeAPI = {
  getCollegeInfo: () => adminAPI.get('/college/info'),
  updateCollegeInfo: (info: any) => adminAPI.put('/college/info', info),
  getSettings: () => adminAPI.get('/college/settings'),
  updateSettings: (settings: any) => adminAPI.put('/college/settings', settings),
};

export default adminAPI;
