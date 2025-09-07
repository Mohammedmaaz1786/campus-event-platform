import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar, CheckCircle, MessageSquare, TrendingUp, ArrowRight, Users, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { getStudentStats, getStudentChartData, initializeMockData, getStudentNotifications } from '@/lib/student-data-helper';
import { createMockAdminEvents } from '@/lib/shared-events-manager';
import { generateStudentStats, getCurrentUserSession, initializeUserData } from '@/lib/user-data-manager';

const chartConfig = {
  events: {
    label: 'Events Attended',
    color: 'hsl(var(--primary))',
  },
};

export default function StudentHome() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('Student');
  const [studentEmail, setStudentEmail] = useState('');
  const [stats, setStats] = useState({
    registered: 0,
    attended: 0,
    feedbacks: 0,
    completed: 0,
    upcoming: 0
  });
  const [chartData, setChartData] = useState<Array<{month: string, events: number}>>([]);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Initialize mock data
    createMockAdminEvents();
    initializeMockData();

    // Get current user session
    const userSession = getCurrentUserSession();
    if (!userSession || userSession.role !== 'student') {
      navigate('/student/login');
      return;
    }

    // Initialize user-specific data
    initializeUserData(userSession.email, 'student');

    // Set student info
    setStudentName(userSession.name);
    setStudentEmail(userSession.email);
    
    // Get individual student stats
    const individualStats = generateStudentStats(userSession.id);
    setStats({
      registered: individualStats.eventsRegistered,
      attended: individualStats.eventsAttended,
      feedbacks: individualStats.eventsAttended, // Assuming feedback given for attended events
      completed: individualStats.eventsAttended,
      upcoming: individualStats.upcomingEvents
    });
    
    // Get chart data (can use existing function)
    const chartInfo = getStudentChartData(userSession.email);
    setChartData(chartInfo);
    
    // Get notifications count
    const studentNotifications = getStudentNotifications(userSession.email);
    setNotifications(studentNotifications.filter(n => !n.read).length);
  }, [navigate]);

  const handleBrowseEvents = () => {
    navigate('/student/events');
  };

  const handleMyEvents = () => {
    navigate('/student/registrations');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {studentName}!
        </h1>
        <p className="text-muted-foreground">
          Here's your campus event activity overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.registered}</p>
                <p className="text-sm text-gray-600">Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                <p className="text-sm text-gray-600">Attended</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.feedbacks}</p>
                <p className="text-sm text-gray-600">Feedbacks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.upcoming}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participation Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Participation Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No participation data yet</p>
                <p className="text-sm">Start attending events to see your trend</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">Browse Events</h3>
                </div>
                <p className="text-gray-600">Discover new events and register</p>
                <Button 
                  onClick={handleBrowseEvents}
                  className="mt-3 group-hover:bg-primary/90 transition-colors"
                >
                  View All Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{stats.registered}</p>
                <p className="text-sm text-gray-500">Events registered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">My Registrations</h3>
                </div>
                <p className="text-gray-600">Manage your event registrations</p>
                <Button 
                  onClick={handleMyEvents}
                  variant="outline"
                  className="mt-3 group-hover:bg-green-50 group-hover:border-green-200 transition-colors"
                >
                  View Registrations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                <p className="text-sm text-gray-500">Events attended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Alert */}
      {notifications > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-orange-800">You have {notifications} new notifications</p>
                <p className="text-sm text-orange-600">Check your upcoming events and feedback requests</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/student/registrations')}
                className="border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
