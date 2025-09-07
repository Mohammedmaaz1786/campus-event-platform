import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Calendar, Clock, CheckCircle, XCircle, Download } from 'lucide-react';
import { eventsAPI } from '@/lib/api';

interface AttendanceRecord {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_college: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late';
  duration?: number; // in minutes
}

// Mock data for demonstration
const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    event_id: '1',
    event_title: 'Tech Symposium 2024',
    event_date: '2024-03-15T09:00:00',
    user_id: '1',
    user_name: 'John Doe',
    user_email: 'john.doe@campus.edu',
    user_college: 'Engineering',
    check_in_time: '2024-03-15T09:15:00',
    check_out_time: '2024-03-15T16:30:00',
    status: 'late',
    duration: 435,
  },
  {
    id: '2',
    event_id: '1',
    event_title: 'Tech Symposium 2024',
    event_date: '2024-03-15T09:00:00',
    user_id: '2',
    user_name: 'Jane Smith',
    user_email: 'jane.smith@campus.edu',
    user_college: 'Engineering',
    check_in_time: '2024-03-15T08:55:00',
    check_out_time: '2024-03-15T17:00:00',
    status: 'present',
    duration: 485,
  },
  {
    id: '3',
    event_id: '2',
    event_title: 'Cultural Fest',
    event_date: '2024-03-20T10:00:00',
    user_id: '3',
    user_name: 'Alice Johnson',
    user_email: 'alice.j@campus.edu',
    user_college: 'Arts & Sciences',
    check_in_time: null,
    check_out_time: null,
    status: 'absent',
  },
  {
    id: '4',
    event_id: '3',
    event_title: 'Career Fair 2024',
    event_date: '2024-02-28T09:00:00',
    user_id: '4',
    user_name: 'Bob Wilson',
    user_email: 'bob.wilson@campus.edu',
    user_college: 'Business',
    check_in_time: '2024-02-28T09:05:00',
    check_out_time: '2024-02-28T15:45:00',
    status: 'present',
    duration: 400,
  },
];

export default function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

  const events = Array.from(new Set(attendance.map(record => record.event_title)));

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.event_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = eventFilter === 'all' || record.event_title === eventFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    const variants = {
      present: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      late: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const icons = {
      present: <CheckCircle className="h-3 w-3 mr-1" />,
      late: <Clock className="h-3 w-3 mr-1" />,
      absent: <XCircle className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge className={`capitalize flex items-center ${variants[status]}`}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting attendance data...');
  };

  const calculateAttendanceRate = () => {
    const presentCount = attendance.filter(record => record.status === 'present' || record.status === 'late').length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">
            Track event attendance and check-ins
          </p>
        </div>
        
        <Button onClick={handleExport} className="bg-gradient-primary text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">
              {attendance.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {attendance.filter(r => r.status === 'present').length}
            </div>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {attendance.filter(r => r.status === 'late').length}
            </div>
            <p className="text-sm text-muted-foreground">Late</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {calculateAttendanceRate()}%
            </div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-dashboard-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Event Filter */}
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event} value={event}>{event}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="shadow-dashboard-md">
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            {filteredAttendance.length} records found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${record.user_id}.png`} />
                        <AvatarFallback className="bg-gradient-stats text-primary font-medium">
                          {getInitials(record.user_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.user_name}</div>
                        <div className="text-sm text-muted-foreground">{record.user_email}</div>
                        <div className="text-xs text-muted-foreground">{record.user_college}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.event_title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(record.event_date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.check_in_time ? (
                      <span className="text-sm">
                        {formatDateTime(record.check_in_time)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.check_out_time ? (
                      <span className="text-sm">
                        {formatDateTime(record.check_out_time)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.duration ? (
                      <span className="text-sm font-medium">
                        {formatDuration(record.duration)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}