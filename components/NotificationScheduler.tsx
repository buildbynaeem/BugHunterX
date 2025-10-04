'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Calendar, Clock, Users, Settings, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { notificationService, NotificationPreferences, defaultNotificationPreferences } from '@/lib/notificationService';

interface ScheduledNotification {
  id: string;
  eventId: string;
  attendeeId?: string;
  title: string;
  message: string;
  scheduledTime: string;
  type: 'event_reminder' | 'event_update' | 'general';
  status: 'scheduled' | 'sent' | 'failed';
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
}

interface NotificationSchedulerProps {
  events?: Event[];
  onScheduleUpdate?: (notifications: ScheduledNotification[]) => void;
}

export default function NotificationScheduler({ events = [], onScheduleUpdate }: NotificationSchedulerProps) {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [customDays, setCustomDays] = useState(1);

  // Load initial data
  useEffect(() => {
    loadScheduledNotifications();
    checkNotificationPermission();
    notificationService.loadScheduledNotifications();
  }, []);

  // Check notification permission status
  const checkNotificationPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  // Request notification permission
  const requestPermission = async () => {
    const permission = await notificationService.requestPermission();
    setPermissionStatus(permission);
  };

  // Load scheduled notifications from API
  const loadScheduledNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?type=scheduled');
      if (response.ok) {
        const data = await response.json();
        setScheduledNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  // Schedule event reminders for all events
  const scheduleEventReminders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'schedule_event_reminders',
          daysBefore: preferences.reminderDaysBefore,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await loadScheduledNotifications();
        onScheduleUpdate?.(data.notifications);
        
        // Also schedule in the notification service for immediate delivery
        events.forEach(event => {
          const eventDate = new Date(event.date);
          if (eventDate > new Date()) {
            notificationService.scheduleEventReminder(
              event.id,
              event.title,
              eventDate,
              undefined,
              preferences.reminderDaysBefore
            );
          }
        });
      }
    } catch (error) {
      console.error('Error scheduling event reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Schedule custom notification
  const scheduleCustomNotification = async (eventId: string, title: string, message: string, scheduledTime: Date) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'schedule',
          eventId,
          title,
          message,
          scheduledTime: scheduledTime.toISOString(),
          notificationType: 'general',
        }),
      });

      if (response.ok) {
        await loadScheduledNotifications();
      }
    } catch (error) {
      console.error('Error scheduling custom notification:', error);
    }
  };

  // Cancel scheduled notification
  const cancelNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?notificationId=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadScheduledNotifications();
        notificationService.cancelScheduledNotification(notificationId);
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  // Update notification preferences
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'sent': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'sent': return <CheckCircle className="h-3 w-3" />;
      case 'failed': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  // Get upcoming events count
  const upcomingEventsCount = events.filter(event => new Date(event.date) > new Date()).length;

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Permission
          </CardTitle>
          <CardDescription>
            Enable browser notifications to receive event reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={permissionStatus === 'granted' ? 'secondary' : 'destructive'}>
                {permissionStatus === 'granted' ? 'Enabled' : 'Disabled'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {permissionStatus === 'granted' 
                  ? 'Notifications are enabled' 
                  : 'Click to enable notifications'}
              </span>
            </div>
            {permissionStatus !== 'granted' && (
              <Button onClick={requestPermission} size="sm">
                Enable Notifications
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="event-reminders">Event Reminders</Label>
            <Switch
              id="event-reminders"
              checked={preferences.eventReminders}
              onCheckedChange={(checked: boolean) => updatePreferences({ eventReminders: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="event-updates">Event Updates</Label>
            <Switch
              id="event-updates"
              checked={preferences.eventUpdates}
              onCheckedChange={(checked: boolean) => updatePreferences({ eventUpdates: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="general-notifications">General Notifications</Label>
            <Switch
              id="general-notifications"
              checked={preferences.generalNotifications}
              onCheckedChange={(checked: boolean) => updatePreferences({ generalNotifications: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="reminder-days">Reminder Days Before Event</Label>
            <div className="flex items-center gap-2">
              <Input
                id="reminder-days"
                type="number"
                min="1"
                max="30"
                value={preferences.reminderDaysBefore}
                onChange={(e) => updatePreferences({ reminderDaysBefore: parseInt(e.target.value) || 1 })}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">days before</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Reminder Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Reminders
          </CardTitle>
          <CardDescription>
            Schedule automatic reminders for upcoming events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Upcoming Events</p>
                <p className="text-sm text-muted-foreground">
                  {upcomingEventsCount} events scheduled
                </p>
              </div>
            </div>
            <Button 
              onClick={scheduleEventReminders}
              disabled={isLoading || permissionStatus !== 'granted' || upcomingEventsCount === 0}
              size="sm"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Reminders'}
            </Button>
          </div>

          {upcomingEventsCount === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events to schedule reminders for
            </p>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduled Notifications
          </CardTitle>
          <CardDescription>
            View and manage your scheduled notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notifications scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {scheduledNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getStatusBadgeVariant(notification.status)} className="flex items-center gap-1">
                        {getStatusIcon(notification.status)}
                        {notification.status}
                      </Badge>
                      <Badge variant="outline">{notification.type}</Badge>
                    </div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Scheduled: {new Date(notification.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                  {notification.status === 'scheduled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelNotification(notification.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}