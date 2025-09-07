interface Activity {
  id: string;
  event: string;
  action: string;
  user: string;
  timestamp: string;
}

// Initial mock activities
const initialActivities: Activity[] = [
  { 
    id: '1', 
    event: 'Tech Symposium', 
    action: 'New registration', 
    user: 'John Doe', 
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  { 
    id: '2', 
    event: 'Cultural Fest', 
    action: 'Event created', 
    user: 'Admin', 
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  { 
    id: '3', 
    event: 'Sports Meet', 
    action: 'Bulk registration', 
    user: 'Jane Smith', 
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: '4', 
    event: 'Career Fair', 
    action: 'Event updated', 
    user: 'Admin', 
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
];

// Load activities from localStorage or use initial data
let activities: Activity[] = (() => {
  try {
    const stored = localStorage.getItem('campusActivities');
    return stored ? JSON.parse(stored) : initialActivities;
  } catch {
    return initialActivities;
  }
})();

// Save activities to localStorage
const saveActivities = () => {
  try {
    localStorage.setItem('campusActivities', JSON.stringify(activities));
  } catch (error) {
    console.error('Failed to save activities to localStorage:', error);
  }
};

export function getActivities(): Activity[] {
  return [...activities];
}

export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
  const newActivity: Activity = {
    ...activity,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  
  activities.unshift(newActivity); // Add to beginning
  
  // Keep only last 20 activities
  if (activities.length > 20) {
    activities = activities.slice(0, 20);
  }
  
  saveActivities(); // Persist to localStorage
  return newActivity;
}

export function updateActivity(id: string, updates: Partial<Activity>): boolean {
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updates };
    saveActivities(); // Persist to localStorage
    return true;
  }
  return false;
}

export function removeActivity(id: string): boolean {
  const index = activities.findIndex(a => a.id === id);
  if (index !== -1) {
    activities.splice(index, 1);
    saveActivities(); // Persist to localStorage
    return true;
  }
  return false;
}
