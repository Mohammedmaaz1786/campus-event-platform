// Admin Notification Management System
// Provides real-time notifications for admin dashboard

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Get admin notifications
export const getAdminNotifications = (adminEmail: string): AdminNotification[] => {
  // Get mock data
  const events = JSON.parse(localStorage.getItem('admin_events') || '[]');
  const registrations = JSON.parse(localStorage.getItem('event_registrations') || '[]');
  const userSession = JSON.parse(localStorage.getItem('user_session') || '{}');
  
  const notifications: AdminNotification[] = [];
  
  // Get events created by this admin
  const adminEvents = events.filter((event: any) => event.created_by === adminEmail);
  
  // Create notifications for recent registrations
  adminEvents.forEach((event: any) => {
    const eventRegistrations = registrations.filter((reg: any) => reg.eventId === event.id);
    
    // New registrations notification
    if (eventRegistrations.length > 0) {
      const recentRegistrations = eventRegistrations.filter((reg: any) => {
        const regDate = new Date(reg.registeredAt);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return regDate > oneDayAgo;
      });
      
      if (recentRegistrations.length > 0) {
        notifications.push({
          id: `new-reg-${event.id}`,
          title: 'New Registrations',
          message: `${recentRegistrations.length} new registrations for "${event.title}"`,
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: '/admin/registrations'
        });
      }
    }
    
    // Event capacity notification
    const capacityPercent = event.max_capacity > 0 ? (eventRegistrations.length / event.max_capacity) * 100 : 0;
    if (capacityPercent >= 80 && capacityPercent < 100) {
      notifications.push({
        id: `capacity-${event.id}`,
        title: 'Event Almost Full',
        message: `"${event.title}" is ${Math.round(capacityPercent)}% full`,
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/admin/events'
      });
    }
    
    // Event full notification
    if (capacityPercent >= 100) {
      notifications.push({
        id: `full-${event.id}`,
        title: 'Event Full',
        message: `"${event.title}" has reached maximum capacity`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/admin/events'
      });
    }
    
    // Upcoming event notification
    const eventDate = new Date(event.date);
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    if (eventDate <= threeDaysFromNow && eventDate >= tomorrow) {
      notifications.push({
        id: `upcoming-${event.id}`,
        title: 'Event Reminder',
        message: `"${event.title}" is coming up on ${eventDate.toLocaleDateString()}`,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/admin/events'
      });
    }
  });
  
  // System notifications
  notifications.push({
    id: 'system-update',
    title: 'System Update',
    message: 'Enhanced admin statistics are now available',
    type: 'success',
    timestamp: new Date().toISOString(),
    read: false
  });
  
  // Sort by timestamp (newest first)
  return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Mark admin notification as read
export const markAdminNotificationAsRead = (notificationId: string): void => {
  const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
  const updatedNotifications = notifications.map((notif: AdminNotification) => 
    notif.id === notificationId ? { ...notif, read: true } : notif
  );
  localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
};

// Get unread notification count
export const getUnreadAdminNotificationCount = (adminEmail: string): number => {
  const notifications = getAdminNotifications(adminEmail);
  return notifications.filter(n => !n.read).length;
};

// Clear all admin notifications
export const clearAllAdminNotifications = (adminEmail: string): void => {
  const notifications = getAdminNotifications(adminEmail);
  const clearedNotifications = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem('admin_notifications', JSON.stringify(clearedNotifications));
};
