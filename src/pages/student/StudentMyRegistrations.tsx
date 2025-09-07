import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Clock, Star } from "lucide-react";
import { getStudentRegistrations, getEventById, submitFeedback, canProvideFeedback } from '@/lib/shared-events-manager';
import type { Registration } from '@/lib/shared-events-manager';
import { toast } from "@/hooks/use-toast";

const StudentRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      const userRegistrations = getStudentRegistrations(user.email);
      setRegistrations(userRegistrations);
    }
    setLoading(false);
  }, []);

  const handleFeedbackSubmit = async () => {
    if (!selectedRegistration || feedbackRating === 0) {
      toast({
        title: "Please provide a rating",
        description: "Rating is required to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    
    const success = submitFeedback(selectedRegistration.id, feedbackRating, feedbackComments);
    
    if (success) {
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback.",
      });
      
      // Refresh registrations
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedRegistrations = getStudentRegistrations(user.email);
      setRegistrations(updatedRegistrations);
      
      // Reset form and close dialog
      setFeedbackRating(0);
      setFeedbackComments('');
      setSelectedRegistration(null);
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
    
    setIsSubmittingFeedback(false);
  };

  const openFeedbackDialog = (registration: Registration) => {
    setSelectedRegistration(registration);
    setFeedbackRating(0);
    setFeedbackComments('');
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventStatus = (registration: Registration) => {
    const event = getEventById(registration.eventId);
    if (!event) return 'unknown';
    
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate > now) return 'upcoming';
    if (registration.attended) return 'attended';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'attended': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-600">View and manage your event registrations</p>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Register for events to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => {
            const event = getEventById(registration.eventId);
            const status = getEventStatus(registration);
            const canGiveFeedback = canProvideFeedback(registration);
            
            if (!event) return null;

            return (
              <Card key={registration.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm text-gray-500">
                      Registered: {formatDate(registration.registeredAt)}
                    </div>
                    
                    <div className="flex gap-2">
                      {registration.feedback_given ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Feedback Given
                        </Badge>
                      ) : canGiveFeedback ? (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openFeedbackDialog(registration)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Give Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Event Feedback</DialogTitle>
                              <DialogDescription>
                                How was your experience at "{event.title}"?
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Rating *</label>
                                <div className="flex gap-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setFeedbackRating(star)}
                                      className={`p-1 rounded ${
                                        star <= feedbackRating 
                                          ? 'text-yellow-400' 
                                          : 'text-gray-300'
                                      }`}
                                    >
                                      <Star 
                                        className="h-6 w-6" 
                                        fill={star <= feedbackRating ? 'currentColor' : 'none'}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Comments</label>
                                <Textarea
                                  placeholder="Share your thoughts about the event..."
                                  value={feedbackComments}
                                  onChange={(e) => setFeedbackComments(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsDialogOpen(false)}
                                  disabled={isSubmittingFeedback}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleFeedbackSubmit}
                                  disabled={isSubmittingFeedback || feedbackRating === 0}
                                >
                                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : null}
                    </div>
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

export default StudentRegistrations;
