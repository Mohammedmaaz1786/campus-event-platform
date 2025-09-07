// Enhanced Admin Stats Synchronization System
// Ensures real-time accurate stats for admin profile

// Clear all stats data and force reinitialization
export const clearAndReinitializeStatsData = (): void => {
  console.log('Clearing all stats data...');
  localStorage.removeItem('admin_events');
  localStorage.removeItem('event_registrations');
  localStorage.removeItem('mock_admins');
  localStorage.removeItem('mock_students_enhanced');
  
  // Force reinitialize
  const { initializeEnhancedMockData } = require('./enhanced-mock-data');
  initializeEnhancedMockData();
  
  console.log('Stats data cleared and reinitialized');
};

export interface AdminProfileStats {
  eventsCreated: number;
  totalRegistrations: number;
  activeEvents: number;
  completedEvents: number;
  avgRegistrationsPerEvent: number;
  lastActivity: string;
}

export interface EventStats {
  id: string;
  title: string;
  registrations: number;
  capacity: number;
  fillRate: number;
  status: string;
  date: string;
}

// Get real-time admin stats with detailed calculation
export const getRealTimeAdminStats = (adminEmail: string): AdminProfileStats => {
  console.log('Calculating stats for admin:', adminEmail);
  
  // Get fresh data from localStorage
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  console.log('Total events in system:', events.length);
  console.log('Total registrations in system:', registrations.length);
  
  // Filter events created by this specific admin
  const adminEvents = events.filter((event: any) => {
    const isCreatedByAdmin = event.created_by === adminEmail;
    if (isCreatedByAdmin) {
      console.log('Found event created by admin:', event.title, 'ID:', event.id);
    }
    return isCreatedByAdmin;
  });
  
  console.log('Admin events found:', adminEvents.length);
  
  // Get all registrations for admin's events
  const adminRegistrations = registrations.filter((reg: any) => {
    const isForAdminEvent = adminEvents.some((event: any) => event.id === reg.eventId);
    if (isForAdminEvent) {
      console.log('Found registration for admin event:', reg.eventId, 'by:', reg.studentEmail);
    }
    return isForAdminEvent;
  });
  
  console.log('Admin registrations found:', adminRegistrations.length);
  
  // Calculate active events (future events with upcoming status)
  const currentDate = new Date();
  const activeEvents = adminEvents.filter((event: any) => {
    const eventDate = new Date(event.date);
    const isActive = (event.status === 'upcoming' || !event.status) && eventDate > currentDate;
    return isActive;
  }).length;
  
  // Calculate completed events (past events or completed status)
  const completedEvents = adminEvents.filter((event: any) => {
    const eventDate = new Date(event.date);
    const isCompleted = event.status === 'completed' || eventDate < currentDate;
    return isCompleted;
  }).length;
  
  // Calculate average registrations per event
  const avgRegistrationsPerEvent = adminEvents.length > 0 
    ? Math.round(adminRegistrations.length / adminEvents.length * 10) / 10 
    : 0;
  
  const stats = {
    eventsCreated: adminEvents.length,
    totalRegistrations: adminRegistrations.length,
    activeEvents,
    completedEvents,
    avgRegistrationsPerEvent,
    lastActivity: new Date().toISOString()
  };
  
  console.log('Final calculated stats:', stats);
  return stats;
};

// Get detailed event stats for admin dashboard
export const getAdminEventStats = (adminEmail: string): EventStats[] => {
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  const adminEvents = events.filter((event: any) => event.created_by === adminEmail);
  
  return adminEvents.map((event: any) => {
    const eventRegistrations = registrations.filter((reg: any) => reg.eventId === event.id);
    const fillRate = event.max_capacity > 0 
      ? Math.round((eventRegistrations.length / event.max_capacity) * 100) 
      : 0;
    
    return {
      id: event.id,
      title: event.title,
      registrations: eventRegistrations.length,
      capacity: event.max_capacity,
      fillRate,
      status: event.status || 'upcoming',
      date: event.date
    };
  });
};

// Force refresh admin stats in events data
export const syncAdminEventRegistrations = (): void => {
  console.log('Syncing admin event registrations...');
  
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  // Update current_registrations for each event
  const updatedEvents = events.map((event: any) => {
    const eventRegistrations = registrations.filter((reg: any) => reg.eventId === event.id);
    const updatedEvent = {
      ...event,
      current_registrations: eventRegistrations.length
    };
    
    if (eventRegistrations.length !== event.current_registrations) {
      console.log(`Updated event ${event.title}: ${event.current_registrations} -> ${eventRegistrations.length} registrations`);
    }
    
    return updatedEvent;
  });
  
  localStorage.setItem('admin_events', JSON.stringify(updatedEvents));
  console.log('Admin event registrations synced successfully');
};

// Verify data integrity for admin stats
export const verifyAdminStatsIntegrity = (adminEmail: string): boolean => {
  try {
    const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
    const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
    
    console.log('Verifying data integrity for:', adminEmail);
    console.log('Events data valid:', Array.isArray(events));
    console.log('Registrations data valid:', Array.isArray(registrations));
    
    const adminEvents = events.filter((event: any) => event.created_by === adminEmail);
    console.log('Admin has created events:', adminEvents.length > 0);
    
    // Check if events have required fields
    const validEvents = adminEvents.every((event: any) => 
      event.id && event.title && event.created_by && event.date
    );
    console.log('All events have required fields:', validEvents);
    
    return validEvents;
  } catch (error) {
    console.error('Data integrity check failed:', error);
    return false;
  }
};

// Initialize admin stats tracking
export const initializeAdminStatsTracking = (adminEmail: string): void => {
  console.log('Initializing stats tracking for admin:', adminEmail);
  
  // Force check if data exists, if not reinitialize
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  
  if (events.length === 0 || registrations.length === 0) {
    console.log('Missing data detected, forcing reinitialization...');
    // Clear existing data
    localStorage.removeItem('admin_events');
    localStorage.removeItem('event_registrations');
    
    // Force reinitialize from enhanced mock data
    const { initializeEnhancedMockData } = require('./enhanced-mock-data');
    initializeEnhancedMockData();
  }
  
  // Verify data integrity
  const isDataValid = verifyAdminStatsIntegrity(adminEmail);
  if (!isDataValid) {
    console.warn('Data integrity issues detected for admin:', adminEmail);
  }
  
  // Sync registrations
  syncAdminEventRegistrations();
  
  // Calculate initial stats
  const stats = getRealTimeAdminStats(adminEmail);
  console.log('Initial stats calculated:', stats);
};
