// Core type definitions for Campus Spark

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  college: string;
  loginTime: string;
}

export interface EnhancedAdminData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  college: string;
  role: string;
  department: string;
  joinDate: string;
  permissions: string[];
}

export interface EnhancedStudentData {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  college: string;
  year: string;
  major: string;
  joinDate: string;
  gpa?: number;
}

export interface DetailedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  college: string;
  max_capacity: number;
  current_registrations: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  image_url?: string;
  registration_deadline?: string;
  requirements?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[];
  agenda?: string[];
  speakers?: string[];
  certificates: boolean;
  fees?: number;
}

export interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  college: string;
  registeredAt: string;
  attended: boolean;
  feedback_given: boolean;
  feedback?: {
    rating: number;
    comments: string;
    submittedAt: string;
  };
}

export interface StudentStats {
  eventsRegistered: number;
  eventsAttended: number;
  upcomingEvents: number;
  totalPoints: number;
  lastActivity: string;
}

export interface AdminStats {
  eventsCreated: number;
  totalRegistrations: number;
  activeEvents: number;
  completedEvents: number;
  lastActivity: string;
}

export interface Notification {
  id: string;
  type: 'event_reminder' | 'registration_confirmation' | 'event_update' | 'deadline_reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}
