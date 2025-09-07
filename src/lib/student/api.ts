import axios from 'axios';

// Create axios instance for student API
const studentAPI = axios.create({
  baseURL: 'http://localhost:8000/student', // Student specific endpoints
  timeout: 10000,
});

// Request interceptor to add auth token
studentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken');
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
studentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentToken');
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

// Student Auth API
export const studentAuthAPI = {
  login: (credentials: { email: string; password: string }) =>
    studentAPI.post('/auth/login', credentials),
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    college: string;
    department?: string;
    year?: string;
  }) => studentAPI.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentUser');
    window.location.href = '/student/login';
  },
  getCurrentUser: () => studentAPI.get('/auth/me'),
  updateProfile: (profileData: any) => studentAPI.put('/auth/profile', profileData),
  changePassword: (passwordData: { oldPassword: string; newPassword: string }) =>
    studentAPI.put('/auth/change-password', passwordData),
};

// Student Events API
export const studentEventsAPI = {
  getAll: () => studentAPI.get('/events'),
  getById: (id: string) => studentAPI.get(`/events/${id}`),
  getUpcoming: () => studentAPI.get('/events/upcoming'),
  getByCategory: (category: string) => studentAPI.get(`/events/category/${category}`),
  search: (query: string) => studentAPI.get(`/events/search?q=${query}`),
};

// Student Registration API
export const studentRegistrationAPI = {
  register: (eventId: string) => studentAPI.post(`/events/${eventId}/register`),
  unregister: (eventId: string) => studentAPI.delete(`/events/${eventId}/register`),
  getMyRegistrations: () => studentAPI.get('/registrations'),
  getRegistrationStatus: (eventId: string) => studentAPI.get(`/events/${eventId}/registration-status`),
};

// Student Attendance API
export const studentAttendanceAPI = {
  checkIn: (eventId: string, qrCode?: string) => 
    studentAPI.post(`/events/${eventId}/checkin`, { qrCode }),
  getMyAttendance: () => studentAPI.get('/attendance'),
  getEventAttendance: (eventId: string) => studentAPI.get(`/events/${eventId}/my-attendance`),
};

// Student Profile API
export const studentProfileAPI = {
  getProfile: () => studentAPI.get('/profile'),
  updateProfile: (profileData: any) => studentAPI.put('/profile', profileData),
  getStats: () => studentAPI.get('/profile/stats'),
  getEventHistory: () => studentAPI.get('/profile/event-history'),
  getCertificates: () => studentAPI.get('/profile/certificates'),
  downloadCertificate: (eventId: string) => studentAPI.get(`/profile/certificates/${eventId}/download`),
};

// Student Notifications API
export const studentNotificationsAPI = {
  getAll: () => studentAPI.get('/notifications'),
  markAsRead: (id: string) => studentAPI.put(`/notifications/${id}/read`),
  markAllAsRead: () => studentAPI.put('/notifications/read-all'),
  getUnreadCount: () => studentAPI.get('/notifications/unread-count'),
};

export default studentAPI;
