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
    setLoading(true);
    
    let csvHeaders: string[] = [];
    let csvData: any[][] = [];
    let fileName = '';

    switch (reportType) {
      case 'event-popularity':
        csvHeaders = ['Event Name', 'Registrations', 'Attendance', 'Attendance Rate (%)', 'No-Show Rate (%)'];
        csvData = eventPopularityData.map(event => {
          const attendanceRate = Math.round((event.attendance / event.registrations) * 100);
          const noShowRate = Math.round(((event.registrations - event.attendance) / event.registrations) * 100);
          return [
            event.name,
            event.registrations.toString(),
            event.attendance.toString(),
            attendanceRate.toString(),
            noShowRate.toString()
          ];
        });
        fileName = 'event_popularity_report';
        break;

      case 'attendance-distribution':
        csvHeaders = ['Status', 'Count', 'Percentage (%)', 'Color Code'];
        const totalAttendance = attendanceData.reduce((sum, item) => sum + item.value, 0);
        csvData = attendanceData.map(item => [
          item.name,
          item.value.toString(),
          Math.round((item.value / totalAttendance) * 100).toString(),
          item.color
        ]);
        fileName = 'attendance_distribution_report';
        break;

      case 'monthly-trends':
        csvHeaders = ['Month', 'Events', 'Participants'];
        csvData = studentParticipationData.map(item => [
          item.month,
          item.events.toString(),
          item.participants.toString()
        ]);
        fileName = 'monthly_trends_report';
        break;

      case 'student-participation':
        csvHeaders = ['Month', 'Events Hosted', 'Total Participants', 'Average per Event', 'Growth Rate (%)'];
        csvData = studentParticipationData.map((item, index) => {
          const avgPerEvent = Math.round(item.participants / item.events);
          const growthRate = index > 0 
            ? Math.round(((item.participants - studentParticipationData[index - 1].participants) / studentParticipationData[index - 1].participants) * 100)
            : 0;
          return [
            item.month,
            item.events.toString(),
            item.participants.toString(),
            avgPerEvent.toString(),
            growthRate.toString()
          ];
        });
        fileName = 'student_participation_report';
        break;

      default:
        csvHeaders = ['Report Type', 'Generated Date'];
        csvData = [[reportType, new Date().toLocaleDateString()]];
        fileName = 'general_report';
    }

    // Add summary statistics
    let summaryData: string[][] = [
      [], // Empty row for separation
      ['REPORT SUMMARY'],
      ['Generated Date', new Date().toLocaleDateString()],
      ['Generated Time', new Date().toLocaleTimeString()],
      ['Total Records', csvData.length.toString()],
      ['Report Type', reportType.replace('-', ' ').toUpperCase()],
    ];

    // Add report-specific summaries
    if (reportType === 'event-popularity') {
      const totalRegistrations = eventPopularityData.reduce((sum, event) => sum + event.registrations, 0);
      const totalAttendance = eventPopularityData.reduce((sum, event) => sum + event.attendance, 0);
      const overallAttendanceRate = Math.round((totalAttendance / totalRegistrations) * 100);
      
      summaryData.push(
        [],
        ['STATISTICS'],
        ['Total Events', eventPopularityData.length.toString()],
        ['Total Registrations', totalRegistrations.toString()],
        ['Total Attendance', totalAttendance.toString()],
        ['Overall Attendance Rate', `${overallAttendanceRate}%`],
        ['Most Popular Event', eventPopularityData.reduce((max, event) => event.registrations > max.registrations ? event : max).name],
        ['Best Attended Event', eventPopularityData.reduce((max, event) => (event.attendance / event.registrations) > (max.attendance / max.registrations) ? event : max).name]
      );
    } else if (reportType === 'attendance-distribution') {
      const totalAttendance = attendanceData.reduce((sum, item) => sum + item.value, 0);
      summaryData.push(
        [],
        ['STATISTICS'],
        ['Total Attendees', totalAttendance.toString()],
        ['Present Rate', `${Math.round((attendanceData.find(item => item.name === 'Present')?.value || 0) / totalAttendance * 100)}%`],
        ['Late Rate', `${Math.round((attendanceData.find(item => item.name === 'Late')?.value || 0) / totalAttendance * 100)}%`],
        ['Absent Rate', `${Math.round((attendanceData.find(item => item.name === 'Absent')?.value || 0) / totalAttendance * 100)}%`]
      );
    }

    const csvContent = [csvHeaders, ...csvData, ...summaryData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    setTimeout(() => setLoading(false), 1000);
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