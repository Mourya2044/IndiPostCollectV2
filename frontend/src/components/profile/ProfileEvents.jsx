import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Package } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { axiosInstance } from "@/lib/axios";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";

// Mock events data
const mockEvents = [
  {
    _id: "event1",
    eventId: "EVT001234567890",
    title: "React Conference 2024",
    description: "Annual React developers conference",
    location: "San Francisco, CA",
    date: "2024-03-15T09:00:00Z",
    price: 299,
    status: "confirmed",
    category: "Technology",
    createdAt: "2024-02-01T10:30:00Z"
  },
  {
    _id: "event2",
    eventId: "EVT001234567891",
    title: "Web Dev Workshop",
    description: "Hands-on JavaScript workshop",
    location: "Online",
    date: "2024-03-20T14:00:00Z",
    price: 99,
    status: "pending",
    category: "Workshop",
    createdAt: "2024-02-05T15:45:00Z"
  },
  {
    _id: "event3",
    eventId: "EVT001234567892",
    title: "UI/UX Design Summit",
    description: "Design trends and best practices",
    location: "New York, NY",
    date: "2024-04-10T10:00:00Z",
    price: 199,
    status: "confirmed",
    category: "Design",
    createdAt: "2024-02-10T09:15:00Z"
  },
  {
    _id: "event4",
    eventId: "EVT001234567893",
    title: "DevOps Meetup",
    description: "Monthly DevOps community meetup",
    location: "Austin, TX",
    date: "2024-02-28T18:00:00Z",
    price: 0,
    status: "cancelled",
    category: "Meetup",
    createdAt: "2024-01-15T12:00:00Z"
  }
];

const ProfileEvents = () => {
  const [events, setEvents] = useState(mockEvents);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Registered Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No events found</p>
          </div>
        ) : (
          <ScrollArea className="max-h-88 space-y-4 overflow-y-auto">
            {events.map((event, index) => (
              <Link key={event._id} to={`/event/${event.eventId}`} >
                <div className="cursor-pointer p-2 hover:bg-muted rounded-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">Event #{event.eventId.slice(-8)}</p>
                      <div className="mt-1">
                        <div className="text-xs text-muted-foreground">
                          {event.location} • {formatEventDate(event.date)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.category}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <span>Registered: {formatDate(event.createdAt)}</span>
                    <span className="font-medium text-foreground">
                      {event.price > 0 ? `₹${event.price}` : 'Free'}
                    </span>
                  </div>
                  {index < events.length - 1 && <Separator className="mt-4" />}
                </div>
              </Link>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default ProfileEvents