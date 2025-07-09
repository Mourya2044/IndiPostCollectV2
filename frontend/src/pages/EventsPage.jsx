import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { axiosInstance } from '@/lib/axios';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const { user,checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 

    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        console.log("Error fetching events: ", err);
      }
    };
    fetchEvents();
  }, [checkAuth]);

  const handleRegister = async (eventId) => {
    try {
      await axiosInstance.post('/events/register', { eventId }, { withCredentials: true });
      alert('Registered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="px-4 md:px-16 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-IPCaccent mb-8">Upcoming Events</h1>

       {events.length === 0  && (
        <p className="text-center text-gray-500">No upcoming events at the moment.</p>
      )} 

      {events.map((event) => (
        <Card key={event._id} className="flex flex-col md:flex-row overflow-hidden shadow-md">
          <div className="md:w-2/5 w-full h-48 md:h-auto">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-3/5 w-full p-4 flex flex-col justify-between">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-xl font-semibold text-IPCaccent">{event.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-gray-700 mb-4">
              {event.description}
            </CardContent>
            {user ? (
              <Button
                className="bg-IPCaccent text-white hover:bg-IPCaccent/90"
                onClick={() => handleRegister(event._id)}
              >
                Register
              </Button>
            ) : (
              <p className="text-sm text-gray-600">Login to register for this event.</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventsPage;
