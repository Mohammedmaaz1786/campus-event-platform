import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserCheck, 
  ClipboardList, 
  BarChart3,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/lib/api';

const sidebarItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { title: 'Events', icon: Calendar, path: '/events' },
  { title: 'Users', icon: Users, path: '/users' },
  { title: 'Registrations', icon: UserCheck, path: '/registrations' },
  { title: 'Attendance', icon: ClipboardList, path: '/attendance' },
  { title: 'Reports', icon: BarChart3, path: '/reports' },
];

export function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <div className="flex flex-col h-full bg-dashboard-sidebar-bg border-r border-border shadow-dashboard-md">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Campus Events</h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 h-11 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-dashboard-sm" 
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Button>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}