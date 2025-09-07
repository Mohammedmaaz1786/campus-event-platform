import { Home, Calendar, BookOpen, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/student' },
    { icon: Calendar, label: 'Events', path: '/student/events' },
    { icon: BookOpen, label: 'My Events', path: '/student/registrations' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-0 flex-1 ${
              location.pathname === path
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}