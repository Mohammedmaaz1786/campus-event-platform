import { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar, CheckCircle, MessageSquare, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', events: 2 },
  { month: 'Feb', events: 4 },
  { month: 'Mar', events: 3 },
  { month: 'Apr', events: 6 },
  { month: 'May', events: 5 },
  { month: 'Jun', events: 8 },
];

const chartConfig = {
  events: {
    label: 'Events Attended',
    color: 'hsl(var(--primary))',
  },
};

export default function StudentHome() {
  const [studentName, setStudentName] = useState('Student');
  const [stats, setStats] = useState({
    registered: 12,
    attended: 8,
    feedbacks: 6,
  });

  useEffect(() => {
    // Get student info from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name) {
      setStudentName(user.name);
    }
  }, []);

  return (
    <StudentLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {studentName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your campus event activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Events Registered"
            value={stats.registered}
            icon={Calendar}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Events Attended"
            value={stats.attended}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Feedbacks Given"
            value={stats.feedbacks}
            icon={MessageSquare}
            description="Help improve events"
          />
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
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <Calendar className="h-5 w-5 mb-2 text-primary" />
              <div className="font-medium">Browse Events</div>
              <div className="text-sm text-muted-foreground">Find new events</div>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left">
              <CheckCircle className="h-5 w-5 mb-2 text-primary" />
              <div className="font-medium">My Events</div>
              <div className="text-sm text-muted-foreground">Check registrations</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}