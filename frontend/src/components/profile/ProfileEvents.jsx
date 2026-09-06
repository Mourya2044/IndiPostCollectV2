import { CalendarDays, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const ProfileEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        // Fetch all events, then filter to show only those the user is registered for
        const response = await axiosInstance.get('/events');
        const allEvents = response.data.events;
        const registered = allEvents.filter(event => event.registeredUsers?.includes(user?._id));
        setEvents(registered);
      } catch (error) {
        console.error('Error fetching user events:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserEvents();
  }, [user]);

  if (loading) {
    return (
      <div className="border border-border bg-background p-8 flex flex-col items-center justify-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-IPCprimary"></div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Loading Events…</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-background flex flex-col max-h-[400px]">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-IPCprimary" />
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Registered Events</h2>
        </div>
        <Link to="/events" className="text-[10px] uppercase tracking-widest text-IPCprimary hover:underline font-semibold flex items-center gap-1">
          Browse <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <CalendarDays className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            Not registered for any events yet.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {events.map((event) => (
              <div key={event._id} className="p-5 hover:bg-muted/30 transition-colors flex gap-4">
                <div className="w-20 h-20 shrink-0 border border-border bg-muted overflow-hidden hidden sm:block">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{event.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-IPCaccent shrink-0" />
                      <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-IPCaccent shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEvents;