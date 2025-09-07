import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Users, UserCheck, Star } from 'lucide-react';
import { eventsAPI, usersAPI } from '@/lib/api';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock API calls - replace with real API when backend is ready
        setStats({
          totalEvents: 24,
          totalUsers: 1247,
          totalRegistrations: 3456,
          averageFeedback: 4.2,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
              {[
                { event: 'Tech Symposium', action: 'New registration', user: 'John Doe', time: '2 mins ago' },
                { event: 'Cultural Fest', action: 'Event created', user: 'Admin', time: '1 hour ago' },
                { event: 'Sports Meet', action: 'Bulk registration', user: 'Jane Smith', time: '3 hours ago' },
                { event: 'Career Fair', action: 'Event updated', user: 'Admin', time: '5 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.action} by {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}