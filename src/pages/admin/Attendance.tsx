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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AttendanceRecord>>({});

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

  const handleView = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setEditFormData(record);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedRecord && editFormData) {
      const updatedAttendance = attendance.map(record =>
        record.id === selectedRecord.id ? { ...record, ...editFormData } : record
      );
      setAttendance(updatedAttendance);
      setIsEditModalOpen(false);
      setSelectedRecord(null);
      setEditFormData({});
    }
  };

  const handleExport = () => {
    // Export filtered attendance data to CSV
    const csvHeaders = [
      'Record ID',
      'Event Title',
      'Event Date',
      'User Name',
      'User Email',
      'User College',
      'Check-in Time',
      'Check-out Time',
      'Status',
      'Duration (minutes)'
    ];

    const csvData = filteredAttendance.map(record => [
      record.id,
      record.event_title,
      new Date(record.event_date).toLocaleDateString(),
      record.user_name,
      record.user_email,
      record.user_college,
      record.check_in_time ? new Date(record.check_in_time).toLocaleString() : 'N/A',
      record.check_out_time ? new Date(record.check_out_time).toLocaleString() : 'N/A',
      record.status,
      record.duration ? record.duration.toString() : 'N/A'
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleView(record)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(record)}
                      >
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

      {/* View Attendance Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attendance Details</DialogTitle>
            <DialogDescription>
              View complete attendance information
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.user_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.user_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">College</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.user_college}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Event</Label>
                  <p className="text-sm text-muted-foreground">{selectedRecord.event_title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Event Date</Label>
                  <p className="text-sm text-muted-foreground">{formatDateTime(selectedRecord.event_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-in Time</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.check_in_time ? formatDateTime(selectedRecord.check_in_time) : 'Not checked in'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Check-out Time</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRecord.check_out_time ? formatDateTime(selectedRecord.check_out_time) : 'Not checked out'}
                  </p>
                </div>
                {selectedRecord.duration && (
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-muted-foreground">{formatDuration(selectedRecord.duration)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Attendance Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>
              Update attendance information
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editFormData.status || selectedRecord.status}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value as AttendanceRecord['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-checkin">Check-in Time</Label>
                  <Input
                    type="datetime-local"
                    value={editFormData.check_in_time ? new Date(editFormData.check_in_time).toISOString().slice(0, 16) : 
                           selectedRecord.check_in_time ? new Date(selectedRecord.check_in_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, check_in_time: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-checkout">Check-out Time</Label>
                  <Input
                    type="datetime-local"
                    value={editFormData.check_out_time ? new Date(editFormData.check_out_time).toISOString().slice(0, 16) : 
                           selectedRecord.check_out_time ? new Date(selectedRecord.check_out_time).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, check_out_time: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Attendance Information (Read-only)</Label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">User</Label>
                    <p className="text-sm text-muted-foreground">{selectedRecord.user_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedRecord.user_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Event</Label>
                    <p className="text-sm text-muted-foreground">{selectedRecord.event_title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Event Date</Label>
                    <p className="text-sm text-muted-foreground">{formatDateTime(selectedRecord.event_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}