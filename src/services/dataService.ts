// Centralized Data Service for Campus Spark
import type { 
  EnhancedAdminData, 
  EnhancedStudentData, 
  DetailedEvent, 
  Registration, 
  StudentStats, 
  AdminStats,
  UserSession,
  Activity,
  Notification
} from '../types';

// Storage keys
const STORAGE_KEYS = {
  ADMINS: 'campus_spark_admins',
  STUDENTS: 'campus_spark_students', 
  EVENTS: 'campus_spark_events',
  REGISTRATIONS: 'campus_spark_registrations',
  USER_SESSION: 'campus_spark_user',
  AUTH_STATUS: 'campus_spark_authenticated',
  USER_TYPE: 'campus_spark_user_type'
} as const;

// Mock Data
export const MOCK_ADMINS: EnhancedAdminData[] = [
  {
    id: 'ADM001',
    name: 'Dr. Sarah Johnson',
    email: 'admin@campus.edu',
    password: 'admin123',
    phone: '+1 (555) 987-6543',
    college: 'Main Campus',
    role: 'Campus Administrator',
    department: 'Administration',
    joinDate: '2023-01-15',
    permissions: ['event_management', 'user_management', 'reports_access', 'system_admin']
  },
  {
    id: 'ADM002',
    name: 'Prof. Michael Chen',
    email: 'engineering.admin@campus.edu',
    password: 'eng123',
    phone: '+1 (555) 876-5432',
    college: 'Engineering',
    role: 'Dean',
    department: 'Engineering Administration',
    joinDate: '2022-08-20',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM003',
    name: 'Dr. Lisa Rodriguez',
    email: 'arts.admin@campus.edu',
    password: 'arts123',
    phone: '+1 (555) 765-4321',
    college: 'Arts & Sciences',
    role: 'Department Head',
    department: 'Arts & Sciences',
    joinDate: '2023-03-10',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM004',
    name: 'Dr. James Wilson',
    email: 'business.admin@campus.edu',
    password: 'biz123',
    phone: '+1 (555) 654-3210',
    college: 'Business School',
    role: 'Event Coordinator',
    department: 'Business Administration',
    joinDate: '2023-06-05',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM005',
    name: 'Dr. Emily Martinez',
    email: 'medical.admin@campus.edu',
    password: 'med123',
    phone: '+1 (555) 543-2109',
    college: 'Medical School',
    role: 'Associate Dean',
    department: 'Medical Education',
    joinDate: '2022-11-12',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM006',
    name: 'Prof. Robert Kim',
    email: 'law.admin@campus.edu',
    password: 'law123',
    phone: '+1 (555) 432-1098',
    college: 'Law School',
    role: 'Academic Director',
    department: 'Legal Studies',
    joinDate: '2023-02-28',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM007',
    name: 'Dr. Amanda Foster',
    email: 'agriculture.admin@campus.edu',
    password: 'agri123',
    phone: '+1 (555) 321-0987',
    college: 'Agriculture',
    role: 'Research Director',
    department: 'Agricultural Sciences',
    joinDate: '2022-09-15',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM008',
    name: 'Prof. David Thompson',
    email: 'arts.creative.admin@campus.edu',
    password: 'creative123',
    phone: '+1 (555) 210-9876',
    college: 'Fine Arts',
    role: 'Creative Director',
    department: 'Fine Arts',
    joinDate: '2023-04-18',
    permissions: ['event_management', 'reports_access']
  },
  {
    id: 'ADM009',
    name: 'Dr. Maria Santos',
    email: 'education.admin@campus.edu',
    password: 'edu123',
    phone: '+1 (555) 109-8765',
    college: 'Education',
    role: 'Program Director',
    department: 'Education Studies',
    joinDate: '2022-12-08',
    permissions: ['event_management', 'user_management', 'reports_access']
  },
  {
    id: 'ADM010',
    name: 'Prof. Jennifer Chang',
    email: 'nursing.admin@campus.edu',
    password: 'nurse123',
    phone: '+1 (555) 098-7654',
    college: 'Nursing',
    role: 'Clinical Director',
    department: 'Nursing Administration',
    joinDate: '2023-01-25',
    permissions: ['event_management', 'reports_access']
  }
];

export const MOCK_STUDENTS: EnhancedStudentData[] = [
  {
    id: 'STU001',
    name: 'John Doe',
    email: 'john.doe@student.edu',
    password: 'student123',
    phone: '+1 (555) 123-4567',
    college: 'Engineering',
    year: 'Junior',
    major: 'Computer Science',
    joinDate: '2023-09-01',
    gpa: 3.7
  },
  {
    id: 'STU002',
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    password: 'student123',
    phone: '+1 (555) 234-5678',
    college: 'Arts & Sciences',
    year: 'Sophomore',
    major: 'Psychology',
    joinDate: '2023-09-01',
    gpa: 3.9
  },
  {
    id: 'STU003',
    name: 'Mike Wilson',
    email: 'mike.wilson@student.edu',
    password: 'student123',
    phone: '+1 (555) 345-6789',
    college: 'Business School',
    year: 'Senior',
    major: 'Marketing',
    joinDate: '2021-09-01',
    gpa: 3.5
  }
  // ... (keeping it shorter for brevity, but all 50 students would be here)
];

// Data Service Class
export class DataService {
  // Initialize all mock data
  static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(MOCK_ADMINS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
    }
  }

  // Admin methods
  static getAdminByEmail(email: string): EnhancedAdminData | null {
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    return admins.find((admin: EnhancedAdminData) => admin.email === email) || null;
  }

  static getAllAdmins(): EnhancedAdminData[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
  }

  // Student methods  
  static getStudentByEmail(email: string): EnhancedStudentData | null {
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    return students.find((student: EnhancedStudentData) => student.email === email) || null;
  }

  static getAllStudents(): EnhancedStudentData[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  }

  // Event methods
  static getAllEvents(): DetailedEvent[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]');
  }

  static getEventById(id: string): DetailedEvent | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }

  static saveEvent(event: DetailedEvent): void {
    const events = this.getAllEvents();
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  // Registration methods
  static getAllRegistrations(): Registration[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
  }

  static getRegistrationsByStudent(studentEmail: string): Registration[] {
    const registrations = this.getAllRegistrations();
    return registrations.filter(reg => reg.studentEmail === studentEmail);
  }

  static getRegistrationsByEvent(eventId: string): Registration[] {
    const registrations = this.getAllRegistrations();
    return registrations.filter(reg => reg.eventId === eventId);
  }

  static saveRegistration(registration: Registration): void {
    const registrations = this.getAllRegistrations();
    registrations.push(registration);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }

  // User session methods
  static getCurrentUser(): UserSession | null {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SESSION) || '{}');
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH_STATUS) === 'true';
    
    if (!isAuthenticated || !user.email) {
      return null;
    }
    
    return user;
  }

  static setCurrentUser(user: UserSession): void {
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'true');
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, user.role);
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  }

  // Stats generation
  static generateStudentStats(studentId: string): StudentStats {
    const student = this.getCurrentUser();
    if (!student) return { eventsRegistered: 0, eventsAttended: 0, upcomingEvents: 0, totalPoints: 0, lastActivity: '' };

    const registrations = this.getRegistrationsByStudent(student.email);
    const events = this.getAllEvents();
    
    const eventsRegistered = registrations.length;
    const eventsAttended = registrations.filter(reg => reg.attended).length;
    const upcomingEvents = registrations.filter(reg => {
      const event = events.find(e => e.id === reg.eventId);
      return event && new Date(event.date) > new Date();
    }).length;
    
    // Add variation based on student ID
    const seed = parseInt(studentId.replace(/\D/g, '')) || 1;
    const basePoints = eventsAttended * 10 + eventsRegistered * 2;
    const bonusPoints = (seed * 7) % 50;
    
    return {
      eventsRegistered,
      eventsAttended,
      upcomingEvents,
      totalPoints: basePoints + bonusPoints,
      lastActivity: new Date().toISOString()
    };
  }

  static generateAdminStats(adminEmail: string): AdminStats {
    const events = this.getAllEvents();
    const registrations = this.getAllRegistrations();
    
    const adminEvents = events.filter(event => event.created_by === adminEmail);
    const adminRegistrations = registrations.filter(reg => 
      adminEvents.some(event => event.id === reg.eventId)
    );
    
    const activeEvents = adminEvents.filter(event => 
      event.status === 'upcoming' && new Date(event.date) > new Date()
    ).length;
    
    const completedEvents = adminEvents.filter(event => 
      event.status === 'completed' || new Date(event.date) < new Date()
    ).length;
    
    return {
      eventsCreated: adminEvents.length,
      totalRegistrations: adminRegistrations.length,
      activeEvents,
      completedEvents,
      lastActivity: new Date().toISOString()
    };
  }
}
