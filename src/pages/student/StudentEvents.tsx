import { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { EventCard } from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    // TODO: Fetch user's registered events
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Use mock data for now
      setEvents([
        {
          id: '1',
          title: 'Tech Talk: AI in Campus Life',
          description: 'Learn how AI is transforming campus experiences',
          venue: 'Auditorium A',
          start_time: '2024-01-15T10:00:00Z',
          end_time: '2024-01-15T12:00:00Z',
          registrations_count: 45,
        },
        {
          id: '2',
          title: 'Campus Sports Day',
          description: 'Annual sports competition for all students',
          venue: 'Sports Complex',
          start_time: '2024-01-20T08:00:00Z',
          end_time: '2024-01-20T18:00:00Z',
          registrations_count: 120,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      // TODO: Call registration API
      setRegisteredEvents([...registeredEvents, eventId]);
      toast({
        title: 'Registration Successful',
        description: 'You have been registered for this event.',
      });
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (eventId: string) => {
    try {
      // TODO: Call cancel registration API
      setRegisteredEvents(registeredEvents.filter(id => id !== eventId));
      toast({
        title: 'Registration Cancelled',
        description: 'Your registration has been cancelled.',
      });
    } catch (error) {
      toast({
        title: 'Cancellation Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const filteredEvents = events.filter((event: any) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Campus Events</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events found matching your search.
            </div>
          ) : (
            filteredEvents.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEvents.includes(event.id)}
                onRegister={handleRegister}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
}