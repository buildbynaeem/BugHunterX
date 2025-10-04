'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticket_price: number;
  description: string;
  expected_capacity?: number;
  sponsor_password?: string;
  budget_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  event_id: string;
  paid: boolean;
  qr_code?: string;
  payment_id?: string;
  verified?: boolean;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  event_id: string;
  impressions: number;
  booth_visits: number;
  engagement_rate: number;
  created_at?: string;
  updated_at?: string;
}

interface EventContextType {
  events: Event[];
  attendees: Attendee[];
  sponsors: Sponsor[];
  loading: boolean;
  createEvent: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addAttendee: (attendee: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>) => Promise<Attendee>;
  updateAttendee: (id: string, attendee: Partial<Attendee>) => Promise<void>;
  addSponsor: (sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, attendeesRes, sponsorsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/attendees'),
        fetch('/api/sponsors')
      ]);

      const [eventsData, attendeesData, sponsorsData] = await Promise.all([
        eventsRes.json(),
        attendeesRes.json(),
        sponsorsRes.json()
      ]);

      setEvents(eventsData);
      setAttendees(attendeesData);
      setSponsors(sponsorsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...eventData })
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  const addAttendee = async (attendeeData: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendeeData)
      });
      
      if (response.ok) {
        const createdAttendee = await response.json();
        await fetchData(); // Refresh data
        return createdAttendee;
      } else {
        throw new Error('Failed to create attendee');
      }
    } catch (error) {
      console.error('Error creating attendee:', error);
      throw error;
    }
  };

  const updateAttendee = async (id: string, attendeeData: Partial<Attendee>) => {
    try {
      const response = await fetch('/api/attendees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...attendeeData })
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to update attendee');
      }
    } catch (error) {
      console.error('Error updating attendee:', error);
      throw error;
    }
  };

  const addSponsor = async (sponsorData: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sponsorData)
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to create sponsor');
      }
    } catch (error) {
      console.error('Error creating sponsor:', error);
      throw error;
    }
  };

  const updateSponsor = async (id: string, sponsorData: Partial<Sponsor>) => {
    try {
      const response = await fetch('/api/sponsors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sponsorData })
      });
      
      if (response.ok) {
        await fetchData(); // Refresh data
      } else {
        throw new Error('Failed to update sponsor');
      }
    } catch (error) {
      console.error('Error updating sponsor:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  return (
    <EventContext.Provider value={{
      events,
      attendees,
      sponsors,
      loading,
      createEvent,
      updateEvent,
      deleteEvent,
      addAttendee,
      updateAttendee,
      addSponsor,
      updateSponsor,
      refreshData
    }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
