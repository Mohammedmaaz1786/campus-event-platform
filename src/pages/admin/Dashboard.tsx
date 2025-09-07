import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Users, UserCheck, Star, Search } from 'lucide-react';
import { eventsAPI, usersAPI } from '@/lib/api';
import { getTimeAgo } from '@/lib/time-utils';
import { getActivities } from '@/lib/activity-manager';
import { getRealTimeAdminStats, syncAdminEventRegistrations, initializeAdminStatsTracking, clearAndReinitializeStatsData } from '@/lib/admin-stats-sync';
import { getCurrentUserSession } from '@/lib/user-data-manager';
import { initializeEnhancedMockData } from '@/lib/enhanced-mock-data';

// Mock data for demonstration
const popularEventsData = [
  { name: 'Tech Symposium', registrations: 245 },
  { name: 'Cultural Fest', registrations: 189 },
  { name: 'Sports Meet', registrations: 167 },
  { name: 'Career Fair', registrations: 134 },
  { name: 'Science Expo', registrations: 98 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    averageFeedback: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState(getActivities());

  const filteredActivities = activities.filter(activity =>
    activity.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Initialize enhanced mock data first
        initializeEnhancedMockData();
        
        // Get current user session
        const userSession = getCurrentUserSession();
        if (!userSession || userSession.role !== 'admin') {
          setStats({
            totalEvents: 0,
            totalUsers: 0,
            totalRegistrations: 0,
            averageFeedback: 0,
          });
          setLoading(false);
          return;
        }

        // Only reinitialize if really needed
        const quickCheck = localStorage.getItem('event_registrations');
        if (!quickCheck || JSON.parse(quickCheck).length < 5) {
          console.log('Minimal data, reinitializing...');
          clearAndReinitializeStatsData();
          initializeEnhancedMockData();
        }

        // Default stats
        let totalEvents = 1;
        let totalRegistrations = 1;
        
        try {
          // Try to get real stats
          initializeAdminStatsTracking(userSession.email);
          syncAdminEventRegistrations();
          
          const realTimeStats = getRealTimeAdminStats(userSession.email);
          totalEvents = realTimeStats.eventsCreated || 1;
          totalRegistrations = realTimeStats.totalRegistrations || 1;
          
          console.log('Dashboard stats calculated:', { totalEvents, totalRegistrations });
        } catch (error) {
          console.error('Error calculating real-time stats, using defaults:', error);
        }

        setStats({
          totalEvents,
          totalUsers: 1247, // Static for now
          totalRegistrations,
          averageFeedback: 4.2, // Static for now
        });
      } catch (error) {
        console.error('Error in Dashboard fetchStats:', error);
        // Fallback stats
        setStats({
          totalEvents: 1,
          totalUsers: 1247,
          totalRegistrations: 1,
          averageFeedback: 4.2,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update times every minute to keep them current
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update relative times and refresh activities
      setActivities(getActivities());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your campus events.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recent activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          description="Active events"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Registered Students"
          value={stats.totalUsers}
          description="Total users"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Event Registrations"
          value={stats.totalRegistrations}
          description="This month"
          icon={UserCheck}
          trend={{ value: 23, isPositive: true }}
        />
        <StatCard
          title="Average Feedback"
          value={`${stats.averageFeedback}/5`}
          description="User rating"
          icon={Star}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Events Chart */}
        <Card className="shadow-dashboard-md">
          <CardHeader>
            <CardTitle>Top 5 Popular Events</CardTitle>
            <CardDescription>
              Events with the highest number of registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularEventsData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar 
                  dataKey="registrations" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-dashboard-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest events and registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.action} by {activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No activities match your search.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}