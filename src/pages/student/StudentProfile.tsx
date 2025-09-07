import { useState, useEffect } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, School, Calendar, Trophy, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';

export default function StudentProfile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    college: 'Computer Science',
    joined: '2023-09-01',
    stats: {
      eventsAttended: 12,
      feedbacksGiven: 8,
      certificatesEarned: 3,
    }
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData.name) {
      setUser(prev => ({ ...prev, ...userData }));
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <StudentLayout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary">{user.college}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{user.stats.eventsAttended}</div>
              <div className="text-sm text-muted-foreground">Events Attended</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{user.stats.feedbacksGiven}</div>
              <div className="text-sm text-muted-foreground">Feedbacks Given</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{user.stats.certificatesEarned}</div>
              <div className="text-sm text-muted-foreground">Certificates</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <School className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">College</div>
                <div className="text-sm text-muted-foreground">{user.college}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Joined</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.joined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start" 
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </StudentLayout>
  );
}