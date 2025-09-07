import { Bell, Search, Settings, Moon, Sun, LogOut, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { authAPI } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserSession } from '@/lib/user-data-manager';
import { getAdminNotifications, markAdminNotificationAsRead, clearAllAdminNotifications, type AdminNotification } from '@/lib/admin-notifications';

interface AdminNavbarProps {
  onGlobalSearch?: (query: string) => void;
}

export function AdminNavbar({ onGlobalSearch }: AdminNavbarProps) {
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const navigate = useNavigate();

  // Load notifications on component mount
  useEffect(() => {
    try {
      const userSession = getCurrentUserSession();
      if (userSession && userSession.role === 'admin') {
        const adminNotifications = getAdminNotifications(userSession.email);
        setNotifications(adminNotifications);
      }
    } catch (error) {
      console.error('Error loading admin notifications:', error);
      setNotifications([]);
    }
  }, []);

  const handleNotificationClick = (notification: AdminNotification) => {
    markAdminNotificationAsRead(notification.id);
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleClearAllNotifications = () => {
    const userSession = getCurrentUserSession();
    if (userSession && userSession.role === 'admin') {
      clearAllAdminNotifications(userSession.email);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Clear all auth tokens
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    authAPI.logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to events page with search query if searching for events
      if (searchQuery.toLowerCase().includes('event')) {
        navigate('/admin/events', { state: { searchQuery: searchQuery } });
      } else {
        // For general search, use the callback if provided
        onGlobalSearch?.(searchQuery);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Real-time search callback
    if (onGlobalSearch) {
      onGlobalSearch(query);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-dashboard-nav-bg/95 backdrop-blur-sm supports-[backdrop-filter]:bg-dashboard-nav-bg/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search events, users..."
              className="pl-10 bg-background/50 border-border focus:bg-background"
            />
          </form>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearAllNotifications}
                    className="h-6 text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-3 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex flex-col space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          {!notification.read && (
                            <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@campus.edu</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}