import { Bell, Search, Settings, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { getStudentNotifications, markNotificationAsRead, searchEvents } from '@/lib/student-data-helper';
import type { Notification } from '@/lib/student-data-helper';

export function StudentNavbarFixed() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Load notifications for current user
    if (user.email) {
      const userNotifications = getStudentNotifications(user.email);
      setNotifications(userNotifications);
    }
  }, [user.email]);

  useEffect(() => {
    // Search events when query changes
    if (searchQuery.trim()) {
      const results = searchEvents(searchQuery);
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/student/login');
  };

  const handleSettings = () => {
    navigate('/student/profile');
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleSearchItemClick = (eventId: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    navigate('/student/events');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between shadow-dashboard-sm">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="pl-10 h-9 bg-muted/50 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
          
          {/* Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 max-h-60 overflow-auto">
              {searchResults.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleSearchItemClick(event.id)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-900">{event.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.college} • {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {event.description}
                  </div>
                </div>
              ))}
              <div className="p-2 text-center border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                    navigate('/student/events');
                  }}
                  className="text-primary"
                >
                  View all events
                </Button>
              </div>
            </div>
          )}

          {isSearchFocused && searchQuery.trim() && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 p-4 text-center text-gray-500">
              No events found for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
            
            <div className="max-h-80 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded-full ${
                        notification.type === 'reminder' ? 'bg-blue-100' :
                        notification.type === 'feedback' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        <Bell className={`h-3 w-3 ${
                          notification.type === 'reminder' ? 'text-blue-600' :
                          notification.type === 'feedback' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-400">{formatNotificationTime(notification.timestamp)}</p>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/student/registrations')}
                  className="text-primary"
                >
                  View all notifications
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>
                  {user.name?.split(' ').map((n: string) => n[0]).join('') || 'S'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'Student'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || 'student@campus.edu'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/student/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
