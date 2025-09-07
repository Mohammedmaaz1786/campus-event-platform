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
];

export default function Registrations() {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');

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

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting registrations...');
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