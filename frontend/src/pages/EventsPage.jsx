import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { axiosInstance } from '@/lib/axios';
import { Loader2, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events");
        setEvents(res.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [checkAuth]);

  const handleRegister = async (eventId) => {
    try {
      const res = await axiosInstance.post('/events/register', { eventId });
      const updatedEvent = res.data.event;
      setEvents(prev => prev.map(event => event._id === updatedEvent._id ? updatedEvent : event));
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="bg-IPCprimary text-white border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-IPCtext mb-4">Gatherings</p>
          <h1 className="text-4xl font-light text-white leading-tight mb-4">
            Community Events
          </h1>
          <p className="text-sm text-white/60 max-w-lg leading-relaxed">
            Join fellow collectors at exhibitions, auctions, and meetups. Discover new stamps and share your passion.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-IPCprimary" />
            <span className="text-[10px] font-semibold uppercase tracking-widest">Loading events…</span>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 border border-border bg-muted/10">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No upcoming events</p>
            <p className="text-xs text-muted-foreground mt-1">Check back later for new gatherings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event, i) => {
              const isRegistered = event.registeredUsers?.includes(user?._id);
              return (
                <article
                  key={event._id}
                  className="group flex flex-col md:flex-row border border-border bg-background hover:border-IPCprimary/40 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
                >
                  <div className="md:w-1/3 w-full h-48 md:h-auto border-b md:border-b-0 md:border-r border-border overflow-hidden bg-muted/20">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="md:w-2/3 p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-IPCsecondary">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Event</span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-IPCprimary transition-colors leading-snug mb-3">
                        {event.name}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                         <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event.registeredUsers?.length || 0} attending</span>
                      </div>
                      
                      {user ? (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={isRegistered}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all ${
                            isRegistered
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : 'bg-IPCprimary text-white hover:opacity-90'
                          }`}
                        >
                          {isRegistered ? 'Registered' : 'Register Now'} {!isRegistered && <ArrowRight className="h-3 w-3" />}
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-3 py-1.5">
                          Login to Register
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
