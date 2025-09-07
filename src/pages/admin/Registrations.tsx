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
import { Search, Calendar, User, Download } from 'lucide-react';
import { eventsAPI } from '@/lib/api';

interface Registration {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_college: string;
  registration_date: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'free';
}

// Mock data for demonstration
const mockRegistrations: Registration[] = [
  {
    id: '1',
    event_id: '1',
    event_title: 'Tech Symposium 2024',
    event_date: '2024-03-15T09:00:00',
    user_id: '1',
    user_name: 'John Doe',
    user_email: 'john.doe@campus.edu',
    user_college: 'Engineering',
    registration_date: '2024-02-20T14:30:00',
    status: 'confirmed',
    payment_status: 'paid',
  },
  {
    id: '2',
    event_id: '2',
    event_title: 'Cultural Fest',
    event_date: '2024-03-20T10:00:00',
    user_id: '2',
    user_name: 'Jane Smith',
    user_email: 'jane.smith@campus.edu',
    user_college: 'Arts & Sciences',
    registration_date: '2024-02-18T09:15:00',
    status: 'confirmed',
    payment_status: 'free',
  },
  {
    id: '3',
    event_id: '1',
    event_title: 'Tech Symposium 2024',
    event_date: '2024-03-15T09:00:00',
    user_id: '3',
    user_name: 'Alice Johnson',
    user_email: 'alice.j@campus.edu',
    user_college: 'Engineering',
    registration_date: '2024-02-25T16:45:00',
    status: 'waitlist',
    payment_status: 'pending',
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
    registration_date: '2024-02-15T11:20:00',
    status: 'confirmed',
    payment_status: 'paid',
  },
  {
    id: '5',
    event_id: '4',
    event_title: 'AI Workshop',
    event_date: '2024-04-10T14:00:00',
    user_id: '5',
    user_name: 'Emma Davis',
    user_email: 'emma.davis@campus.edu',
    user_college: 'Computer Science',
    registration_date: '2024-03-01T10:30:00',
    status: 'confirmed',
    payment_status: 'free',
  },
  {
    id: '6',
    event_id: '5',
    event_title: 'Science Expo',
    event_date: '2024-04-15T09:00:00',
    user_id: '6',
    user_name: 'Michael Brown',
    user_email: 'michael.brown@campus.edu',
    user_college: 'Sciences',
    registration_date: '2024-03-05T15:20:00',
    status: 'confirmed',
    payment_status: 'paid',
  },
];

export default function Registrations() {
  // Load registrations from localStorage or use mock data as fallback
  const getStoredRegistrations = (): Registration[] => {
    try {
      const stored = localStorage.getItem('campusRegistrations');
      return stored ? JSON.parse(stored) : mockRegistrations;
    } catch {
      return mockRegistrations;
    }
  };

  const [registrations, setRegistrations] = useState<Registration[]>(getStoredRegistrations);
  const [searchTerm, setSearchTerm] = useState('');

  // Save registrations to localStorage
  const saveRegistrations = (newRegistrations: Registration[]) => {
    try {
      localStorage.setItem('campusRegistrations', JSON.stringify(newRegistrations));
      setRegistrations(newRegistrations);
    } catch (error) {
      console.error('Failed to save registrations to localStorage:', error);
      setRegistrations(newRegistrations);
    }
  };
  const [eventFilter, setEventFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Registration>>({});

  const events = Array.from(new Set(registrations.map(reg => reg.event_title)));

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.event_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEvent = eventFilter === 'all' || registration.event_title === eventFilter;
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const getStatusBadge = (status: Registration['status']) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      waitlist: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
      <Badge className={`capitalize ${variants[status]}`}>
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: Registration['payment_status']) => {
    const variants = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      free: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };

    return (
      <Badge className={`capitalize ${variants[status]}`}>
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleView = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const handleEdit = (registration: Registration) => {
    setSelectedRegistration(registration);
    setEditFormData(registration);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedRegistration && editFormData) {
      const updatedRegistrations = registrations.map(reg =>
        reg.id === selectedRegistration.id ? { ...reg, ...editFormData } : reg
      );
      saveRegistrations(updatedRegistrations);
      setIsEditModalOpen(false);
      setSelectedRegistration(null);
      setEditFormData({});
    }
  };

  const handleExport = () => {
    // Export filtered registrations to CSV
    const csvHeaders = [
      'Registration ID',
      'Event Title',
      'Event Date',
      'User Name',
      'User Email',
      'User College',
      'Registration Date',
      'Status',
      'Payment Status'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.id,
      reg.event_title,
      new Date(reg.event_date).toLocaleDateString(),
      reg.user_name,
      reg.user_email,
      reg.user_college,
      new Date(reg.registration_date).toLocaleDateString(),
      reg.status,
      reg.payment_status
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `registrations_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registrations</h1>
          <p className="text-muted-foreground">
            View and manage event registrations
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
              {registrations.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Registrations</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {registrations.filter(r => r.status === 'confirmed').length}
            </div>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {registrations.filter(r => r.status === 'waitlist').length}
            </div>
            <p className="text-sm text-muted-foreground">Waitlist</p>
          </CardContent>
        </Card>
        <Card className="shadow-dashboard-md">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {registrations.filter(r => r.status === 'cancelled').length}
            </div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="waitlist">Waitlist</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card className="shadow-dashboard-md">
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
          <CardDescription>
            {filteredRegistrations.length} registrations found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${registration.user_id}.png`} />
                        <AvatarFallback className="bg-gradient-stats text-primary font-medium">
                          {getInitials(registration.user_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{registration.user_name}</div>
                        <div className="text-sm text-muted-foreground">{registration.user_email}</div>
                        <div className="text-xs text-muted-foreground">{registration.user_college}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{registration.event_title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(registration.event_date)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatDateTime(registration.registration_date)}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(registration.status)}</TableCell>
                  <TableCell>{getPaymentBadge(registration.payment_status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleView(registration)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(registration)}
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

      {/* View Registration Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              View complete registration information
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">User Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedRegistration.user_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedRegistration.user_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">College</Label>
                  <p className="text-sm text-muted-foreground">{selectedRegistration.user_college}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Event</Label>
                  <p className="text-sm text-muted-foreground">{selectedRegistration.event_title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Event Date</Label>
                  <p className="text-sm text-muted-foreground">{formatDateTime(selectedRegistration.event_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Registration Date</Label>
                  <p className="text-sm text-muted-foreground">{formatDateTime(selectedRegistration.registration_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Status</Label>
                  <div className="mt-1">{getPaymentBadge(selectedRegistration.payment_status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Registration Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
            <DialogDescription>
              Update registration information
            </DialogDescription>
          </DialogHeader>
          {selectedRegistration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editFormData.status || selectedRegistration.status}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value as Registration['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="waitlist">Waitlist</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-payment">Payment Status</Label>
                  <Select
                    value={editFormData.payment_status || selectedRegistration.payment_status}
                    onValueChange={(value) => setEditFormData(prev => ({ ...prev, payment_status: value as Registration['payment_status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Registration Information (Read-only)</Label>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">User</Label>
                    <p className="text-sm text-muted-foreground">{selectedRegistration.user_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{selectedRegistration.user_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Event</Label>
                    <p className="text-sm text-muted-foreground">{selectedRegistration.event_title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Registration Date</Label>
                    <p className="text-sm text-muted-foreground">{formatDateTime(selectedRegistration.registration_date)}</p>
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