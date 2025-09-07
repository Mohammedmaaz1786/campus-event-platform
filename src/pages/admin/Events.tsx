import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { addActivity } from '@/lib/activity-manager';

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  start_time: string;
  end_time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations: number;
}

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Symposium 2024',
    description: 'Annual technology conference featuring industry leaders',
    venue: 'Main Auditorium',
    start_time: '2024-03-15T09:00:00',
    end_time: '2024-03-15T17:00:00',
    status: 'upcoming',
    registrations: 245,
  },
  {
    id: '2',
    title: 'Cultural Fest',
    description: 'Celebrate diversity with music, dance, and art',
    venue: 'Campus Grounds',
    start_time: '2024-03-20T10:00:00',
    end_time: '2024-03-22T22:00:00',
    status: 'upcoming',
    registrations: 189,
  },
  {
    id: '3',
    title: 'Career Fair 2024',
    description: 'Meet top employers and explore career opportunities',
    venue: 'Exhibition Hall',
    start_time: '2024-02-28T09:00:00',
    end_time: '2024-02-28T16:00:00',
    status: 'completed',
    registrations: 134,
  },
];

export default function Events() {
  const location = useLocation();
  
  // Load events from localStorage or use mock data as fallback
  const getStoredEvents = (): Event[] => {
    try {
      const stored = localStorage.getItem('campusEvents');
      return stored ? JSON.parse(stored) : mockEvents;
    } catch {
      return mockEvents;
    }
  };

  const [events, setEvents] = useState<Event[]>(getStoredEvents);
  const [loading, setLoading] = useState(false);

  // Save events to localStorage whenever events change
  const saveEvents = (newEvents: Event[]) => {
    try {
      localStorage.setItem('campusEvents', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Failed to save events to localStorage:', error);
      setEvents(newEvents); // Still update state even if localStorage fails
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    venue: '',
    start_time: '',
    end_time: '',
  });
  const [editEvent, setEditEvent] = useState({
    id: '',
    title: '',
    description: '',
    venue: '',
    start_time: '',
    end_time: '',
  });
  const { toast } = useToast();

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search query from navigation
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchTerm(location.state.searchQuery);
    }
  }, [location.state]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call - replace with real API when backend is ready
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
        status: 'upcoming',
        registrations: 0,
      };
      
      // Add to beginning of events list for immediate visibility
      const updatedEvents = [event, ...events];
      saveEvents(updatedEvents);
      setIsCreateDialogOpen(false);
      setNewEvent({ title: '', description: '', venue: '', start_time: '', end_time: '' });
      
      // Add activity for the dashboard
      addActivity({
        event: event.title,
        action: 'Event created',
        user: 'Admin', // In real app, get from auth context
      });
      
      toast({
        title: 'Event created',
        description: `"${event.title}" has been created successfully and is now visible in the events list.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedEvents = events.map(event =>
        event.id === editEvent.id
          ? {
              ...event,
              title: editEvent.title,
              description: editEvent.description,
              venue: editEvent.venue,
              start_time: editEvent.start_time,
              end_time: editEvent.end_time,
            }
          : event
      );

      saveEvents(updatedEvents);
      setIsEditDialogOpen(false);
      setEditEvent({ id: '', title: '', description: '', venue: '', start_time: '', end_time: '' });
      
      // Add activity for the dashboard
      addActivity({
        event: editEvent.title,
        action: 'Event updated',
        user: 'Admin', // In real app, get from auth context
      });
      
      toast({
        title: "Event updated",
        description: "Event has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditEvent({
      id: event.id,
      title: event.title,
      description: event.description,
      venue: event.venue,
      start_time: event.start_time,
      end_time: event.end_time,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: Event['status']) => {
    const variants = {
      upcoming: 'default',
      ongoing: 'secondary',
      completed: 'outline',
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">
            Manage campus events and registrations
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new campus event.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})}
                  placeholder="Enter venue location"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time (Optional)</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({...newEvent, end_time: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="bg-gradient-primary text-white">
                  Create Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-dashboard-md">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="shadow-dashboard-md">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            {filteredEvents.length} events found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {event.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {event.venue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDateTime(event.start_time)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatDateTime(event.end_time)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {event.registrations}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewEvent(event)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEvent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_title">Event Title</Label>
              <Input
                id="edit_title"
                value={editEvent.title}
                onChange={(e) => setEditEvent({...editEvent, title: e.target.value})}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={editEvent.description}
                onChange={(e) => setEditEvent({...editEvent, description: e.target.value})}
                placeholder="Enter event description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_venue">Venue</Label>
              <Input
                id="edit_venue"
                value={editEvent.venue}
                onChange={(e) => setEditEvent({...editEvent, venue: e.target.value})}
                placeholder="Enter venue location"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_start_time">Start Time</Label>
                <Input
                  id="edit_start_time"
                  type="datetime-local"
                  value={editEvent.start_time}
                  onChange={(e) => setEditEvent({...editEvent, start_time: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_end_time">End Time (Optional)</Label>
                <Input
                  id="edit_end_time"
                  type="datetime-local"
                  value={editEvent.end_time}
                  onChange={(e) => setEditEvent({...editEvent, end_time: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-gradient-primary text-white">
                {loading ? 'Updating...' : 'Update Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                <p className="text-sm">{selectedEvent.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Venue</Label>
                <p className="text-sm">{selectedEvent.venue}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Time</Label>
                  <p className="text-sm">{formatDateTime(selectedEvent.start_time)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Time</Label>
                  <p className="text-sm">{selectedEvent.end_time ? formatDateTime(selectedEvent.end_time) : 'Not specified'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Registrations</Label>
                  <p className="text-sm">{selectedEvent.registrations}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}