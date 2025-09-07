import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { initializeEnhancedMockData } from '../../lib/enhanced-mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, MapPin, Clock, Users, Edit, Trash2, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addActivity } from '@/lib/activity-manager';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  college: string;
  max_capacity: number;
  current_registrations: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  image_url?: string;
  registration_deadline?: string;
  requirements?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[];
}

const eventTypes = [
  'Workshop',
  'Conference', 
  'Seminar',
  'Cultural',
  'Sports',
  'Competition',
  'Networking',
  'Academic',
  'Training',
  'Webinar',
  'Exhibition',
  'Festival'
];

const colleges = [
  'Main Campus',
  'Engineering',
  'Arts & Sciences', 
  'Business School',
  'Medical College',
  'Law School',
  'Computer Science',
  'Architecture',
  'Agriculture',
  'Pharmacy'
];

const locations = [
  'Main Auditorium',
  'Central Conference Hall',
  'University Theater',
  'Campus Center',
  'Student Union Building',
  'Academic Building A',
  'Academic Building B',
  'Library Meeting Room',
  'Outdoor Amphitheater',
  'Sports Complex',
  'Recreation Center',
  'Dining Hall',
  'Science Building',
  'Technology Center',
  'Art Gallery',
  'Music Hall',
  'Gymnasium',
  'Lecture Hall 101',
  'Seminar Room 201',
  'Exhibition Space',
  'Innovation Hub',
  'Study Lounge',
  'Courtyard',
  'Memorial Garden',
  'Campus Plaza'
];

export default function AdminEventsEnhanced() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'created_at' | 'current_registrations'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: '',
    college: '',
    max_capacity: 100,
    status: 'upcoming',
    created_by: '',
    image_url: '',
    registration_deadline: '',
    requirements: '',
    contact_email: '',
    contact_phone: '',
    tags: []
  });

  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      // Initialize enhanced mock data if needed
      initializeEnhancedMockData();
      
      const savedEvents = localStorage.getItem('admin_events');
      const events = savedEvents ? JSON.parse(savedEvents) : [];
      setEvents(events);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const saveEvents = (updatedEvents: Event[]) => {
    localStorage.setItem('admin_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.type || !newEvent.college) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const event: Event = {
      ...newEvent,
      id: Date.now().toString(),
      created_by: user.email || 'admin@campus.edu',
      created_at: new Date().toISOString(),
      current_registrations: 0,
      tags: newEvent.tags || []
    };

    const updatedEvents = [...events, event];
    saveEvents(updatedEvents);

    // Add activity
    addActivity({
      event: event.title,
      action: `New event created for ${event.college}`,
      user: user.name || 'Admin'
    });

    toast({
      title: "Event Created",
      description: `"${event.title}" has been successfully created.`,
    });

    setIsCreateDialogOpen(false);
    resetNewEvent();
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = events.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    );
    saveEvents(updatedEvents);

    addActivity({
      event: editingEvent.title,
      action: 'Event details updated',
      user: JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'
    });

    toast({
      title: "Event Updated",
      description: `"${editingEvent.title}" has been successfully updated.`,
    });

    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const updatedEvents = events.filter(e => e.id !== eventId);
    saveEvents(updatedEvents);

    addActivity({
      event: event.title,
      action: 'Event deleted',
      user: JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'
    });

    toast({
      title: "Event Deleted",
      description: `"${event.title}" has been deleted.`,
    });
  };

  const resetNewEvent = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: '',
      college: user.college || '',
      max_capacity: 100,
      status: 'upcoming',
      created_by: '',
      image_url: '',
      registration_deadline: '',
      requirements: '',
      contact_email: user.email || '',
      contact_phone: user.phone || '',
      tags: []
    });
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'Workshop': 'bg-blue-100 text-blue-800',
      'Conference': 'bg-purple-100 text-purple-800',
      'Seminar': 'bg-green-100 text-green-800',
      'Cultural': 'bg-pink-100 text-pink-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Competition': 'bg-red-100 text-red-800',
      'Networking': 'bg-yellow-100 text-yellow-800',
      'Academic': 'bg-indigo-100 text-indigo-800',
      'Training': 'bg-teal-100 text-teal-800',
      'Webinar': 'bg-cyan-100 text-cyan-800',
      'Exhibition': 'bg-lime-100 text-lime-800',
      'Festival': 'bg-rose-100 text-rose-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Type', 'College', 'Date', 'Time', 'Location', 'Capacity', 'Registrations', 'Status'];
    const csvData = [
      headers.join(','),
      ...filteredEvents.map(event => [
        event.title,
        event.type,
        event.college,
        event.date,
        event.time,
        event.location,
        event.max_capacity,
        event.current_registrations,
        event.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Create and manage campus events • {currentTime}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new campus event
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Event Type *</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College/Department *</Label>
                  <Select value={newEvent.college} onValueChange={(value) => setNewEvent({ ...newEvent, college: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college} value={college}>{college}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Venue *</Label>
                  <Select value={newEvent.location} onValueChange={(value) => setNewEvent({ ...newEvent, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Max Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={newEvent.max_capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, max_capacity: parseInt(e.target.value) || 100 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Registration Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newEvent.registration_deadline}
                    onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })}
                    max={newEvent.date}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newEvent.contact_email}
                    onChange={(e) => setNewEvent({ ...newEvent, contact_email: e.target.value })}
                    placeholder="contact@campus.edu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={newEvent.contact_phone}
                    onChange={(e) => setNewEvent({ ...newEvent, contact_phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Event Description *</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Describe the event details, agenda, and what attendees can expect..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements/Prerequisites</Label>
                <Textarea
                  id="requirements"
                  value={newEvent.requirements}
                  onChange={(e) => setNewEvent({ ...newEvent, requirements: e.target.value })}
                  placeholder="Any specific requirements, materials needed, or prerequisites..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total: {events.length}</span>
          <span>Upcoming: {events.filter(e => e.status === 'upcoming').length}</span>
          <span>Completed: {events.filter(e => e.status === 'completed').length}</span>
        </div>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
          <CardDescription>
            Manage all campus events and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first event.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Details</TableHead>
                    <TableHead>Type & College</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{event.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getTypeColor(event.type)}>
                            {event.type}
                          </Badge>
                          <div className="text-sm text-gray-600">{event.college}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.current_registrations}/{event.max_capacity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {((event.current_registrations / event.max_capacity) * 100).toFixed(0)}% full
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingEvent(event);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details
            </DialogDescription>
          </DialogHeader>
          
          {editingEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title *</Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Event Type *</Label>
                <Select value={editingEvent.type} onValueChange={(value) => setEditingEvent({ ...editingEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-college">College *</Label>
                <Select value={editingEvent.college} onValueChange={(value) => setEditingEvent({ ...editingEvent, college: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college} value={college}>{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Venue *</Label>
                <Select value={editingEvent.location} onValueChange={(value) => setEditingEvent({ ...editingEvent, location: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-date">Event Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-time">Event Time *</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Max Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={editingEvent.max_capacity}
                  onChange={(e) => setEditingEvent({ ...editingEvent, max_capacity: parseInt(e.target.value) || 100 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingEvent.status} onValueChange={(value: any) => setEditingEvent({ ...editingEvent, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Update Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
