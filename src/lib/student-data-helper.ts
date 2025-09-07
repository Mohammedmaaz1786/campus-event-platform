// Student Data Helper - Centralized data management for students
import { getAllEvents, getStudentRegistrations, submitFeedback } from './shared-events-manager';
import type { Event, Registration } from './shared-events-manager';

export interface StudentData {
  id: string;
  name: string;
  email: string;
  college: string;
  phone: string;
  joinDate: string;
  year: string;
}

export interface StudentStats {
  registered: number;
  attended: number;
  feedbacks: number;
  completed: number;
  upcoming: number;
}

export interface EventStats {
  totalEvents: number;
  totalRegistrations: number;
  completedEvents: number;
  upcomingEvents: number;
  feedbacksReceived: number;
}

export interface Notification {
  id: string;
  type: 'event' | 'registration' | 'feedback' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Initialize mock student data and registrations
export const initializeMockData = (): void => {
  const mockStudents: StudentData[] = [
    {
      id: 'STU001',
      name: 'John Doe',
      email: 'john.doe@student.edu',
      college: 'Engineering',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-09-01',
      year: 'Junior'
    },
    {
      id: 'STU002', 
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      college: 'Arts & Sciences',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-09-01',
      year: 'Sophomore'
    },
    {
      id: 'STU003',
      name: 'Mike Wilson',
      email: 'mike.wilson@student.edu', 
      college: 'Business School',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-09-01',
      year: 'Senior'
    }
  ];

  // Store students data
  localStorage.setItem('mock_students', JSON.stringify(mockStudents));

  // Create mock registrations for different students
  const mockRegistrations: Registration[] = [
    // John Doe registrations
    {
      id: 'REG001',
      eventId: '1', // Engineering Innovation Summit
      studentName: 'John Doe',
      studentEmail: 'john.doe@student.edu',
      phone: '+1 (555) 123-4567',
      college: 'Engineering',
      registeredAt: '2024-12-20T10:00:00Z',
      attended: true,
      feedback_given: true,
      feedback: {
        rating: 5,
        comments: 'Excellent summit! Learned a lot about new technologies.',
        submittedAt: '2024-12-21T15:00:00Z'
      }
    },
    {
      id: 'REG002',
      eventId: '4', // Campus Tech Hackathon
      studentName: 'John Doe', 
      studentEmail: 'john.doe@student.edu',
      phone: '+1 (555) 123-4567',
      college: 'Engineering',
      registeredAt: '2024-12-22T14:00:00Z',
      attended: false,
      feedback_given: false
    },

    // Jane Smith registrations
    {
      id: 'REG003',
      eventId: '3', // Arts & Culture Festival
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@student.edu',
      phone: '+1 (555) 234-5678',
      college: 'Arts & Sciences',
      registeredAt: '2024-12-21T09:00:00Z',
      attended: true,
      feedback_given: false
    },
    {
      id: 'REG004',
      eventId: '2', // Business Leadership Workshop
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@student.edu', 
      phone: '+1 (555) 234-5678',
      college: 'Arts & Sciences',
      registeredAt: '2024-12-19T16:00:00Z',
      attended: true,
      feedback_given: true,
      feedback: {
        rating: 4,
        comments: 'Great workshop on leadership skills.',
        submittedAt: '2024-12-20T18:00:00Z'
      }
    },

    // Mike Wilson registrations  
    {
      id: 'REG005',
      eventId: '2', // Business Leadership Workshop
      studentName: 'Mike Wilson',
      studentEmail: 'mike.wilson@student.edu',
      phone: '+1 (555) 345-6789', 
      college: 'Business School',
      registeredAt: '2024-12-18T11:00:00Z',
      attended: true,
      feedback_given: true,
      feedback: {
        rating: 5,
        comments: 'Outstanding workshop! Very practical advice.',
        submittedAt: '2024-12-19T20:00:00Z'
      }
    },
    {
      id: 'REG006',
      eventId: '1', // Engineering Innovation Summit
      studentName: 'Mike Wilson',
      studentEmail: 'mike.wilson@student.edu',
      phone: '+1 (555) 345-6789',
      college: 'Business School', 
      registeredAt: '2024-12-20T13:00:00Z',
      attended: false,
      feedback_given: false
    }
  ];

  // Only add if no registrations exist
  const existingRegistrations = localStorage.getItem('event_registrations');
  if (!existingRegistrations || JSON.parse(existingRegistrations).length === 0) {
    localStorage.setItem('event_registrations', JSON.stringify(mockRegistrations));
  }
};

// Get student statistics
export const getStudentStats = (studentEmail: string): StudentStats => {
  const registrations = getStudentRegistrations(studentEmail);
  const events = getAllEvents();
  
  const completed = registrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return event && new Date(event.date) < new Date();
  }).length;
  
  const upcoming = registrations.filter(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return event && new Date(event.date) >= new Date();
  }).length;

  return {
    registered: registrations.length,
    attended: registrations.filter(reg => reg.attended).length,
    feedbacks: registrations.filter(reg => reg.feedback_given).length,
    completed,
    upcoming
  };
};

// Get overall event statistics
export const getEventStats = (): EventStats => {
  const events = getAllEvents();
  const allRegistrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  const completedEvents = events.filter(event => new Date(event.date) < new Date()).length;
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).length;
  const feedbacksReceived = allRegistrations.filter((reg: Registration) => reg.feedback_given).length;

  return {
    totalEvents: events.length,
    totalRegistrations: allRegistrations.length,
    completedEvents,
    upcomingEvents,
    feedbacksReceived
  };
};

// Get student notifications
export const getStudentNotifications = (studentEmail: string): Notification[] => {
  const registrations = getStudentRegistrations(studentEmail);
  const events = getAllEvents();
  const notifications: Notification[] = [];

  // Create notifications for upcoming events
  registrations.forEach(reg => {
    const event = events.find(e => e.id === reg.eventId);
    if (event) {
      const eventDate = new Date(event.date);
      const now = new Date();
      const timeDiff = eventDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 1) {
        notifications.push({
          id: `reminder-${reg.id}`,
          type: 'reminder',
          title: 'Event Tomorrow',
          message: `Don't forget: ${event.title} is tomorrow at ${event.time}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/student/registrations'
        });
      }

      if (eventDate < now && reg.attended && !reg.feedback_given) {
        notifications.push({
          id: `feedback-${reg.id}`,
          type: 'feedback',
          title: 'Feedback Requested',
          message: `Please provide feedback for ${event.title}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/student/registrations'
        });
      }
    }
  });

  return notifications;
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = JSON.parse(localStorage.getItem('student_notifications') || '[]');
  const updatedNotifications = notifications.map((notif: Notification) => 
    notif.id === notificationId ? { ...notif, read: true } : notif
  );
  localStorage.setItem('student_notifications', JSON.stringify(updatedNotifications));
};

// Get student data by email
export const getStudentByEmail = (email: string): StudentData | null => {
  const students = JSON.parse(localStorage.getItem('mock_students') || '[]');
  return students.find((student: StudentData) => student.email === email) || null;
};

// Search events
export const searchEvents = (query: string): Event[] => {
  const events = getAllEvents();
  if (!query.trim()) return events;
  
  const searchTerm = query.toLowerCase();
  return events.filter(event => 
    event.title.toLowerCase().includes(searchTerm) ||
    event.description.toLowerCase().includes(searchTerm) ||
    event.college.toLowerCase().includes(searchTerm) ||
    event.type.toLowerCase().includes(searchTerm) ||
    event.location.toLowerCase().includes(searchTerm)
  );
};

// Get chart data for student analytics
export const getStudentChartData = (studentEmail: string) => {
  const registrations = getStudentRegistrations(studentEmail);
  const events = getAllEvents();
  
  // Group registrations by month
  const monthlyData: { [key: string]: number } = {};
  
  registrations.forEach(reg => {
    const event = events.find(e => e.id === reg.eventId);
    if (event && reg.attended) {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    }
  });

  return Object.entries(monthlyData).map(([month, events]) => ({
    month,
    events
  }));
};
