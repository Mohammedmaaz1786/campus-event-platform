import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Download, TrendingUp, Calendar, Users, BarChart3 } from 'lucide-react';
import { reportsAPI } from '@/lib/api';

// Mock data for demonstration
const eventPopularityData = [
  { name: 'Tech Symposium', registrations: 245, attendance: 210 },
  { name: 'Cultural Fest', registrations: 189, attendance: 165 },
  { name: 'Sports Meet', registrations: 167, attendance: 155 },
  { name: 'Career Fair', registrations: 134, attendance: 128 },
  { name: 'Science Expo', registrations: 98, attendance: 87 },
  { name: 'Art Exhibition', registrations: 76, attendance: 71 },
];

const attendanceData = [
  { name: 'Present', value: 78, color: '#10b981' },
  { name: 'Late', value: 15, color: '#f59e0b' },
  { name: 'Absent', value: 7, color: '#ef4444' },
];

const studentParticipationData = [
  { month: 'Jan', events: 12, participants: 456 },
  { month: 'Feb', events: 15, participants: 578 },
  { month: 'Mar', events: 18, participants: 689 },
  { month: 'Apr', events: 14, participants: 523 },
  { month: 'May', events: 20, participants: 743 },
  { month: 'Jun', events: 16, participants: 634 },
];

const monthlyTrendsData = [
  { month: 'Jan', events: 12, registrations: 456, attendance: 398 },
  { month: 'Feb', events: 15, registrations: 578, attendance: 512 },
  { month: 'Mar', events: 18, registrations: 689, attendance: 634 },
  { month: 'Apr', events: 14, registrations: 523, attendance: 467 },
  { month: 'May', events: 20, registrations: 743, attendance: 691 },
  { month: 'Jun', events: 16, registrations: 634, attendance: 589 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

export default function Reports() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(false);

  const handleExport = (reportType: string) => {
    console.log(`Exporting ${reportType} report...`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-dashboard-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">
            Analytics and insights for campus events
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">95</div>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
              <div className="p-2 bg-gradient-stats rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+12%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">3,847</div>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
              </div>
              <div className="p-2 bg-gradient-stats rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+8%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">89%</div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
              </div>
              <div className="p-2 bg-gradient-stats rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+3%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">4.6</div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
              <div className="p-2 bg-gradient-stats rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">+0.2</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Popularity */}
        <Card className="shadow-dashboard-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Event Popularity</CardTitle>
              <CardDescription>Registrations vs Attendance by Event</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('event-popularity')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventPopularityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="attendance" fill="hsl(var(--primary) / 0.6)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card className="shadow-dashboard-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Attendance Distribution</CardTitle>
              <CardDescription>Present, Late, and Absent percentages</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('attendance-distribution')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="shadow-dashboard-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Events, registrations, and attendance over time</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('monthly-trends')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="registrations" 
                stackId="1"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary) / 0.6)" 
              />
              <Area 
                type="monotone" 
                dataKey="attendance" 
                stackId="1"
                stroke="hsl(var(--primary) / 0.8)" 
                fill="hsl(var(--primary) / 0.3)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Participation */}
      <Card className="shadow-dashboard-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Participation Trends</CardTitle>
            <CardDescription>Number of events and participants per month</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExport('student-participation')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentParticipationData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="participants" 
                stroke="hsl(var(--primary) / 0.6)" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary) / 0.6)', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}