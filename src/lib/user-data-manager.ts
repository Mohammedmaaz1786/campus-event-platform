// Individual User Data Management System
// Ensures each user has unique stats and data persistence

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  college: string;
  loginTime: string;
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

// Generate unique stats for each student based on their ID
export const generateStudentStats = (studentId: string): StudentStats => {
  const registrations = getStudentRegistrations(studentId);
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  
  // Calculate real stats from actual data
  const eventsRegistered = registrations.length;
  const eventsAttended = registrations.filter((reg: any) => reg.attended).length;
  const upcomingEvents = registrations.filter((reg: any) => {
    const event = events.find((e: any) => e.id === reg.eventId);
    return event && new Date(event.date) > new Date();
  }).length;
  
  // Add some variation based on student ID for demo purposes
  const seed = parseInt(studentId.replace(/\D/g, '')) || 1;
  const basePoints = eventsAttended * 10 + eventsRegistered * 2;
  const bonusPoints = (seed * 7) % 50; // Variation based on student ID
  
  return {
    eventsRegistered,
    eventsAttended,
    upcomingEvents,
    totalPoints: basePoints + bonusPoints,
    lastActivity: new Date().toISOString()
  };
};

// Generate unique stats for each admin based on their ID
export const generateAdminStats = (adminEmail: string): AdminStats => {
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  // Filter events created by this admin
  const adminEvents = events.filter((event: any) => event.created_by === adminEmail);
  const adminRegistrations = registrations.filter((reg: any) => 
    adminEvents.some((event: any) => event.id === reg.eventId)
  );
  
  const activeEvents = adminEvents.filter((event: any) => 
    event.status === 'upcoming' && new Date(event.date) > new Date()
  ).length;
  
  const completedEvents = adminEvents.filter((event: any) => 
    event.status === 'completed' || new Date(event.date) < new Date()
  ).length;
  
  return {
    eventsCreated: adminEvents.length,
    totalRegistrations: adminRegistrations.length,
    activeEvents,
    completedEvents,
    lastActivity: new Date().toISOString()
  };
};

// Get registrations for a specific student
export const getStudentRegistrations = (studentId: string) => {
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  const student = JSON.parse(localStorage.getItem('user') || '{}');
  return registrations.filter((reg: any) => reg.studentEmail === student.email);
};

// Get events for a specific student (all events visible to students)
export const getStudentEvents = () => {
  return JSON.parse(localStorage.getItem('admin_events') || '[]');
};

// Get user-specific activity history
export const getUserActivity = (userEmail: string, userType: 'admin' | 'student') => {
  const activityKey = `${userType}_activity_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  return JSON.parse(localStorage.getItem(activityKey) || '[]');
};

// Add user-specific activity
export const addUserActivity = (userEmail: string, userType: 'admin' | 'student', activity: {
  type: string;
  message: string;
  timestamp: string;
}) => {
  const activityKey = `${userType}_activity_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const activities = getUserActivity(userEmail, userType);
  activities.unshift({
    id: Date.now().toString(),
    ...activity
  });
  
  // Keep only last 50 activities
  if (activities.length > 50) {
    activities.splice(50);
  }
  
  localStorage.setItem(activityKey, JSON.stringify(activities));
};

// Get current user session
export const getCurrentUserSession = (): UserSession | null => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated || !user.email) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    college: user.college,
    loginTime: new Date().toISOString()
  };
};

// Initialize user-specific data when they log in
export const initializeUserData = (userEmail: string, userType: 'admin' | 'student') => {
  // Add login activity
  addUserActivity(userEmail, userType, {
    type: 'login',
    message: `Logged in to ${userType} portal`,
    timestamp: new Date().toISOString()
  });
  
  // Generate initial stats if needed
  if (userType === 'student') {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    generateStudentStats(user.id);
  } else if (userType === 'admin') {
    generateAdminStats(userEmail);
  }
};

// Clear user-specific data on logout
export const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userType');
};
