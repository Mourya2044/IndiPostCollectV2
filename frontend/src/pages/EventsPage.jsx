import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Example event data
const events = [
  {
    id: 1,
    title: 'Hackathon 2025',
    description: 'Join our flagship hackathon and compete with the best minds in tech!',
    image: '/images/hackathon.jpg',
  },
  {
    id: 2,
    title: 'Tech Talk: AI & Ethics',
    description: 'Explore the ethical implications of modern AI with expert speakers.',
    image: '/images/ai-talk.jpg',
  },
  {
    id: 3,
    title: 'Workshop: Web Dev Bootcamp',
    description: 'Hands-on workshop covering HTML, CSS, JavaScript, and React.',
    image: '/images/web-dev.jpg',
  },
];

const EventsPage = () => {
  return (
    <div className="px-4 md:px-16 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center text-IPCaccent mb-8">Upcoming Events</h1>

      {events.map((event) => (
        <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden shadow-md">
          
          {/* Left Image */}
          <div className="md:w-2/5 w-full h-48 md:h-auto">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="md:w-3/5 w-full p-4 flex flex-col justify-between">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-xl font-semibold text-IPCaccent">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-gray-700 mb-4">
              {event.description}
            </CardContent>
            <div>
              <Button className="bg-IPCaccent text-white hover:bg-IPCaccent/90">
                Register
              </Button>
            </div>
          </div>

        </Card>
      ))}
    </div>
  );
};

export default EventsPage;
