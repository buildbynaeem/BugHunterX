'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Session } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Calendar, MapPin, Clock, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface ScheduleListProps {
  sessions: Session[];
  onToggleFavorite: (sessionId: string) => void;
  onAddToCalendar?: (session: Session) => void;
}

export default function ScheduleList({ 
  sessions, 
  onToggleFavorite, 
  onAddToCalendar 
}: ScheduleListProps) {
  const handleAddToCalendar = (session: Session) => {
    if (onAddToCalendar) {
      onAddToCalendar(session);
    } else {
      // Mock Google Calendar integration
      const startTime = session.startTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endTime = session.endTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const title = encodeURIComponent(session.title);
      const details = encodeURIComponent(session.description);
      const location = encodeURIComponent(session.location);
      
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
      
      window.open(googleCalendarUrl, '_blank');
    }
  };

  const isSessionLive = (session: Session) => {
    const now = new Date();
    return now >= session.startTime && now <= session.endTime;
  };

  const isSessionUpcoming = (session: Session) => {
    const now = new Date();
    return now < session.startTime;
  };

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={`hover:shadow-md transition-shadow ${
            isSessionLive(session) ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{session.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {session.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(session.id)}
                    className={`shrink-0 ${
                      session.isFavorite ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        session.isFavorite ? 'fill-current' : ''
                      }`} 
                    />
                  </Button>
                </div>

                {/* Speaker */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.speaker.avatar} alt={session.speaker.name} />
                    <AvatarFallback>
                      {session.speaker.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{session.speaker.name}</p>
                    {session.speaker.bio && (
                      <p className="text-xs text-muted-foreground">{session.speaker.bio}</p>
                    )}
                  </div>
                </div>

                {/* Time and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{session.location}</span>
                  </div>
                </div>

                {/* Status and Capacity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isSessionLive(session) && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Live Now
                      </Badge>
                    )}
                    {isSessionUpcoming(session) && (
                      <Badge variant="outline">
                        Upcoming
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {session.capacity} seats
                    </Badge>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCalendar(session)}
                    className="flex items-center space-x-1"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Add to Calendar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No sessions scheduled</h3>
          <p className="text-muted-foreground">
            Check back later for updates to your schedule
          </p>
        </motion.div>
      )}
    </div>
  );
}

