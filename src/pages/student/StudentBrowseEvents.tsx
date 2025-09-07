import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Users, Clock, Search } from "lucide-react";
import { getAllEvents, getEventRegistrations, registerForEvent, createMockAdminEvents } from '@/lib/shared-events-manager';
import type { Event } from '@/lib/shared-events-manager';
import { toast } from "@/hooks/use-toast";

const StudentEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);

  useEffect(() => {
    // Initialize mock events if none exist
    createMockAdminEvents();
    
    // Load events from admin
    const adminEvents = getAllEvents();
    setEvents(adminEvents);
    setLoading(false);
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventRegistrationCount = (eventId: string): number => {
    return getEventRegistrations(eventId).length;
  };

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    
    // Get student data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const studentData = {
      name: user.name || 'Student',
      email: user.email || 'student@example.com',
      phone: user.phone || '1234567890',
      college: user.college || 'Engineering'
    };

    const success = registerForEvent(eventId, studentData);
    
    if (success) {
      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event.",
      });
      
      // Refresh events to update registration count
      const updatedEvents = getAllEvents();
      setEvents(updatedEvents);
    } else {
      toast({
        title: "Registration Failed",
        description: "Unable to register for this event. You may already be registered.",
        variant: "destructive",
      });
    }
    
    setRegistering(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'conference': 'bg-purple-100 text-purple-800',
      'seminar': 'bg-green-100 text-green-800',
      'cultural': 'bg-pink-100 text-pink-800',
      'sports': 'bg-orange-100 text-orange-800',
      'competition': 'bg-red-100 text-red-800',
      'networking': 'bg-yellow-100 text-yellow-800',
      'academic': 'bg-indigo-100 text-indigo-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isStudentRegistered = (eventId: string): boolean => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const registrations = getEventRegistrations(eventId);
    return registrations.some(reg => reg.studentEmail === user.email);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Events</h1>
          <p className="text-gray-600">Discover and register for campus events</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'No events are currently available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const registrationCount = getEventRegistrationCount(event.id);
            const isRegistered = isStudentRegistered(event.id);
            const isFull = registrationCount >= event.max_capacity;
            
            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="flex items-center justify-center text-white font-bold text-lg">
                    {event.college}
                  </div>
                </div>
                
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{registrationCount}/{event.max_capacity} registered</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {isRegistered ? (
                      <Button disabled className="w-full">
                        Already Registered
                      </Button>
                    ) : isFull ? (
                      <Button disabled className="w-full">
                        Event Full
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleRegister(event.id)}
                        disabled={registering === event.id}
                        className="w-full"
                      >
                        {registering === event.id ? 'Registering...' : 'Register Now'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentEvents;
