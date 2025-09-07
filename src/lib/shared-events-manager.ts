// Shared Event Management System for Campus Spark
// Connects Admin Events to Student Interface

export interface Event {
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

// Get all events created by admins
export const getAllEvents = (): Event[] => {
  try {
    const events = localStorage.getItem('admin_events');
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get specific event by ID
export const getEventById = (id: string): Event | null => {
  const events = getAllEvents();
  return events.find(event => event.id === id) || null;
};

// Get all registrations for a specific student
export const getStudentRegistrations = (studentEmail: string): Registration[] => {
  try {
    const registrations = localStorage.getItem('event_registrations');
    const allRegistrations: Registration[] = registrations ? JSON.parse(registrations) : [];
    return allRegistrations.filter(reg => reg.studentEmail === studentEmail);
  } catch (error) {
    console.error('Error fetching student registrations:', error);
    return [];
  }
};

// Get all registrations for a specific event
export const getEventRegistrations = (eventId: string): Registration[] => {
  try {
    const registrations = localStorage.getItem('event_registrations');
    const allRegistrations: Registration[] = registrations ? JSON.parse(registrations) : [];
    return allRegistrations.filter(reg => reg.eventId === eventId);
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
};

// Register student for an event
export const registerForEvent = (eventId: string, studentData: {
  name: string;
  email: string;
  phone: string;
  college: string;
}): boolean => {
  try {
    const event = getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const existingRegistrations = getEventRegistrations(eventId);
    if (existingRegistrations.find(reg => reg.studentEmail === studentData.email)) {
      throw new Error('Already registered for this event');
    }

    if (existingRegistrations.length >= event.max_capacity) {
      throw new Error('Event is full');
    }

    const newRegistration: Registration = {
      id: Date.now().toString(),
      eventId,
      studentName: studentData.name,
      studentEmail: studentData.email,
      phone: studentData.phone,
      college: studentData.college,
      registeredAt: new Date().toISOString(),
      attended: false,
      feedback_given: false
    };

    const allRegistrations = localStorage.getItem('event_registrations');
    const registrations: Registration[] = allRegistrations ? JSON.parse(allRegistrations) : [];
    registrations.push(newRegistration);
    
    localStorage.setItem('event_registrations', JSON.stringify(registrations));
    
    // Update event registration count in admin_events
    const allEvents = getAllEvents();
    const eventIndex = allEvents.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      allEvents[eventIndex].current_registrations = existingRegistrations.length + 1;
      localStorage.setItem('admin_events', JSON.stringify(allEvents));
    }
    
    // Update activity
    const activities = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    activities.unshift({
      id: Date.now().toString(),
      type: 'registration',
      message: `${studentData.name} registered for ${event.title}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_activities', JSON.stringify(activities.slice(0, 100)));
    
    return true;
  } catch (error) {
    console.error('Error registering for event:', error);
    return false;
  }
};

// Submit feedback for completed event
export const submitFeedback = (registrationId: string, rating: number, comments: string): boolean => {
  try {
    const allRegistrations = localStorage.getItem('event_registrations');
    const registrations: Registration[] = allRegistrations ? JSON.parse(allRegistrations) : [];
    
    const registrationIndex = registrations.findIndex(reg => reg.id === registrationId);
    if (registrationIndex === -1) {
      throw new Error('Registration not found');
    }

    registrations[registrationIndex] = {
      ...registrations[registrationIndex],
      feedback_given: true,
      feedback: {
        rating,
        comments,
        submittedAt: new Date().toISOString()
      }
    };

    localStorage.setItem('event_registrations', JSON.stringify(registrations));

    // Update activity
    const activities = JSON.parse(localStorage.getItem('admin_activities') || '[]');
    const event = getEventById(registrations[registrationIndex].eventId);
    activities.unshift({
      id: Date.now().toString(),
      type: 'feedback',
      message: `Feedback received for ${event?.title || 'event'} (${rating}/5 stars)`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_activities', JSON.stringify(activities.slice(0, 100)));

    return true;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
};

// Check if event is completed
export const isEventCompleted = (event: Event): boolean => {
  const eventDate = new Date(event.date);
  const now = new Date();
  return eventDate < now;
};

// Check if student can provide feedback
export const canProvideFeedback = (registration: Registration): boolean => {
  const event = getEventById(registration.eventId);
  return event ? isEventCompleted(event) && registration.attended && !registration.feedback_given : false;
};

// Create mock admin events
export const createMockAdminEvents = (): void => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Engineering Innovation Summit',
      description: 'Explore cutting-edge technologies and innovations in engineering. Join industry experts and researchers.',
      date: '2024-12-30',
      time: '10:00',
      location: 'Engineering Auditorium',
      type: 'conference',
      college: 'Engineering',
      max_capacity: 200,
      current_registrations: 0,
      status: 'upcoming',
      created_by: 'engineering.admin@campus.edu',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Business Leadership Workshop',
      description: 'Develop essential leadership skills for the modern business world. Interactive sessions with industry leaders.',
      date: '2024-12-28',
      time: '14:00',
      location: 'Business School Conference Room',
      type: 'workshop',
      college: 'Business School',
      max_capacity: 50,
      current_registrations: 0,
      status: 'upcoming',
      created_by: 'business.admin@campus.edu',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Arts & Culture Festival',
      description: 'Celebrate creativity with art exhibitions, performances, and cultural showcases from around the world.',
      date: '2024-12-29',
      time: '16:00',
      location: 'Arts Center Main Hall',
      type: 'cultural',
      college: 'Arts & Sciences',
      max_capacity: 300,
      current_registrations: 0,
      status: 'upcoming',
      created_by: 'arts.admin@campus.edu',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Campus Tech Hackathon',
      description: '48-hour coding challenge to solve real campus problems. Prizes for innovative solutions!',
      date: '2025-01-05',
      time: '09:00',
      location: 'Computer Science Building',
      type: 'competition',
      college: 'Main Campus',
      max_capacity: 100,
      current_registrations: 0,
      status: 'upcoming',
      created_by: 'admin@campus.edu',
      created_at: new Date().toISOString()
    }
  ];

  // Only create if no events exist
  const existingEvents = localStorage.getItem('admin_events');
  if (!existingEvents || JSON.parse(existingEvents).length === 0) {
    localStorage.setItem('admin_events', JSON.stringify(mockEvents));
  }
};
