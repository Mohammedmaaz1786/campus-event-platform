import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    venue: string;
    start_time: string;
    end_time: string;
    registrations_count?: number;
  };
  isRegistered?: boolean;
  onRegister?: (id: string) => void;
  onCancel?: (id: string) => void;
  onCheckIn?: (id: string) => void;
  onFeedback?: (id: string) => void;
  showActions?: boolean;
}

export function EventCard({ 
  event, 
  isRegistered = false, 
  onRegister, 
  onCancel, 
  onCheckIn, 
  onFeedback,
  showActions = true 
}: EventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const isEventOver = new Date() > endDate;
  const isEventActive = new Date() >= startDate && new Date() <= endDate;

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {event.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{format(startDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          {event.registrations_count !== undefined && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.registrations_count} registered</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="pt-2">
            {!isRegistered ? (
              <Button 
                onClick={() => onRegister?.(event.id)}
                className="w-full"
                disabled={isEventOver}
              >
                {isEventOver ? 'Event Ended' : 'Register'}
              </Button>
            ) : (
              <div className="space-y-2">
                {isEventActive && onCheckIn && (
                  <Button onClick={() => onCheckIn(event.id)} className="w-full">
                    Check In
                  </Button>
                )}
                {isEventOver && onFeedback && (
                  <Button onClick={() => onFeedback(event.id)} variant="secondary" className="w-full">
                    Give Feedback
                  </Button>
                )}
                {onCancel && !isEventActive && (
                  <Button onClick={() => onCancel(event.id)} variant="outline" className="w-full">
                    Cancel Registration
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}