// Shared event management system for both admin and student interfaces

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  start_time: string;
  end_time?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
  max_capacity?: number;
  created_by: string; // Admin who created the event
  created_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_college: string;
  registration_date: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  checked_in: boolean;
  check_in_time?: string;
  feedback_given: boolean;
  feedback?: {
    rating: number;
    comment: string;
    submitted_at: string;
  };
}

// Get all events from localStorage (admin events)
export function getAllEvents(): Event[] {
  try {
    const stored = localStorage.getItem('campusEvents');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Get all registrations from localStorage
export function getAllRegistrations(): Registration[] {
  try {
    const stored = localStorage.getItem('campusRegistrations');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Get user registrations
export function getUserRegistrations(userId: string): Registration[] {
  const allRegistrations = getAllRegistrations();
  return allRegistrations.filter(reg => reg.user_id === userId);
}

// Register for an event
export function registerForEvent(eventId: string, userData: {
  user_id: string;
  user_name: string;
  user_email: string;
  user_college: string;
}): Registration {
  const allRegistrations = getAllRegistrations();
  
  const newRegistration: Registration = {
    id: Date.now().toString(),
    event_id: eventId,
    ...userData,
    registration_date: new Date().toISOString(),
    status: 'confirmed',
    checked_in: false,
    feedback_given: false,
  };

  const updatedRegistrations = [newRegistration, ...allRegistrations];
  localStorage.setItem('campusRegistrations', JSON.stringify(updatedRegistrations));
  
  return newRegistration;
}

// Submit feedback for an event
export function submitFeedback(registrationId: string, feedback: {
  rating: number;
  comment: string;
}): boolean {
  try {
    const allRegistrations = getAllRegistrations();
    const updatedRegistrations = allRegistrations.map(reg => {
      if (reg.id === registrationId) {
        return {
          ...reg,
          feedback_given: true,
          feedback: {
            ...feedback,
            submitted_at: new Date().toISOString(),
          }
        };
      }
      return reg;
    });
    
    localStorage.setItem('campusRegistrations', JSON.stringify(updatedRegistrations));
    return true;
  } catch {
    return false;
  }
}

// Check in for an event
export function checkInForEvent(registrationId: string): boolean {
  try {
    const allRegistrations = getAllRegistrations();
    const updatedRegistrations = allRegistrations.map(reg => {
      if (reg.id === registrationId) {
        return {
          ...reg,
          checked_in: true,
          check_in_time: new Date().toISOString(),
        };
      }
      return reg;
    });
    
    localStorage.setItem('campusRegistrations', JSON.stringify(updatedRegistrations));
    return true;
  } catch {
    return false;
  }
}
