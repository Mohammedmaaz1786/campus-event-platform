import { useEffect, useState } from 'react';
import { StudentLayout } from '@/components/StudentLayout';
import { EventCard } from '@/components/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function StudentRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      // TODO: Fetch user's registrations from API
      // Mock data for now
      setRegistrations([
        {
          id: '1',
          title: 'Tech Talk: AI in Campus Life',
          description: 'Learn how AI is transforming campus experiences',
          venue: 'Auditorium A',
          start_time: '2024-01-15T10:00:00Z',
          end_time: '2024-01-15T12:00:00Z',
          status: 'upcoming',
          checked_in: false,
          feedback_given: false,
        },
        {
          id: '2',
          title: 'Campus Sports Day',
          description: 'Annual sports competition for all students',
          venue: 'Sports Complex',
          start_time: '2024-01-10T08:00:00Z',
          end_time: '2024-01-10T18:00:00Z',
          status: 'completed',
          checked_in: true,
          feedback_given: false,
        },
      ]);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (eventId: string) => {
    try {
      // TODO: Call check-in API
      toast({
        title: 'Checked In Successfully',
        description: 'You have been checked in to the event.',
      });
    } catch (error) {
      toast({
        title: 'Check-in Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleFeedback = async (eventId: string) => {
    try {
      // TODO: Open feedback modal or navigate to feedback page
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      });
    } catch (error) {
      toast({
        title: 'Feedback Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const upcomingEvents = registrations.filter((reg: any) => reg.status === 'upcoming');
  const completedEvents = registrations.filter((reg: any) => reg.status === 'completed');

  return (
    <StudentLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">My Events</h1>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {registrations.length} Total Registrations
            </Badge>
            <Badge variant="outline">
              {upcomingEvents.length} Upcoming
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading registrations...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events registered.
              </div>
            ) : (
              upcomingEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={true}
                  onCheckIn={handleCheckIn}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading registrations...</div>
            ) : completedEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No completed events yet.
              </div>
            ) : (
              completedEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={true}
                  onFeedback={!event.feedback_given ? handleFeedback : undefined}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}