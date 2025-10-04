'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Plus,
  BellRing,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';

interface AttendeeNotificationsProps {
  attendeeEmail: string;
  attendeeName: string;
  userEvents: any[];
}

interface NotificationPreferences {
  eventReminders: boolean;
  eventUpdates: boolean;
  generalNotifications: boolean;
  reminderDaysBefore: number;
}

interface ScheduledNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  scheduledTime: string;
  eventId?: string;
  attendeeId?: string;
  status: 'pending' | 'sent' | 'cancelled';
}

export default function AttendeeNotifications({ 
  attendeeEmail, 
  attendeeName, 
  userEvents 
}: AttendeeNotificationsProps) {
  const { 
    permission, 
    requestPermission, 
    scheduleEventReminder, 
    isLoading 
  } = useNotifications();

  const hasPermission = permission === 'granted';

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    eventReminders: true,
    eventUpdates: true,
    generalNotifications: false,
    reminderDaysBefore: 1
  });

  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Load notification preferences and scheduled notifications
  useEffect(() => {
    if (attendeeEmail) {
      loadNotificationPreferences();
      loadScheduledNotifications();
    }
  }, [attendeeEmail]);

  const loadNotificationPreferences = async () => {
    try {
      const response = await fetch(`/api/notifications?type=preferences&attendeeEmail=${encodeURIComponent(attendeeEmail)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const loadScheduledNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await fetch(`/api/notifications?type=scheduled&attendeeEmail=${encodeURIComponent(attendeeEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setScheduledNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'updatePreferences',
          attendeeEmail,
          preferences: newPreferences
        }),
      });

      if (response.ok) {
        setPreferences(newPreferences);
      } else {
        console.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const scheduleRemindersForMyEvents = async () => {
    if (!hasPermission) {
      await requestPermission();
      return;
    }

    try {
      const upcomingEvents = userEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > new Date();
      });

      for (const event of upcomingEvents) {
        // Find attendee ID for this event
        const attendeeId = `${attendeeEmail}_${event.id}`;
        await scheduleEventReminder(event.id, attendeeId, preferences.reminderDaysBefore);
      }

      // Reload scheduled notifications
      await loadScheduledNotifications();
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        await loadScheduledNotifications();
      }
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  };

  const getEventTitle = (eventId: string) => {
    const event = userEvents.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  const formatScheduledTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!attendeeEmail || !attendeeName) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Complete Your Profile First</h3>
          <p className="text-muted-foreground text-center mb-4">
            Please fill in your <strong>Name</strong> and <strong>Email</strong> in the information section above to access notification settings.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Info className="h-4 w-4" />
            <span>Scroll up to the "Your Information" section to get started</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Customize how you want to receive notifications about your events.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {hasPermission ? (
                <Volume2 className="h-5 w-5 text-green-600" />
              ) : (
                <VolumeX className="h-5 w-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  Browser Notifications {hasPermission ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasPermission 
                    ? 'You will receive push notifications in your browser'
                    : 'Enable notifications to receive event reminders'
                  }
                </p>
              </div>
            </div>
            {!hasPermission && (
              <Button onClick={requestPermission} disabled={isLoading}>
                {isLoading ? 'Requesting...' : 'Enable'}
              </Button>
            )}
          </div>

          <Separator />

          {/* Notification Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-reminders">Event Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified before your registered events
                </p>
              </div>
              <Switch
                id="event-reminders"
                checked={preferences.eventReminders}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ ...preferences, eventReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-updates">Event Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about event changes
                </p>
              </div>
              <Switch
                id="event-updates"
                checked={preferences.eventUpdates}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ ...preferences, eventUpdates: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="general-notifications">General Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive general announcements and updates
                </p>
              </div>
              <Switch
                id="general-notifications"
                checked={preferences.generalNotifications}
                onCheckedChange={(checked: boolean) =>
                  updatePreferences({ ...preferences, generalNotifications: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Reminders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up automatic reminders for your registered events.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {userEvents.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No registered events found. Purchase tickets to set up reminders.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Your Registered Events</p>
                  <p className="text-sm text-muted-foreground">
                    {userEvents.length} event{userEvents.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <Button 
                  onClick={scheduleRemindersForMyEvents}
                  disabled={!hasPermission || isLoading}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Reminders
                </Button>
              </div>

              <div className="grid gap-3">
                {userEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()} • {event.venue}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Scheduled Notifications
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            View and manage your upcoming notification reminders.
          </p>
        </CardHeader>
        <CardContent>
          {loadingNotifications ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading notifications...</p>
            </div>
          ) : scheduledNotifications.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                No scheduled notifications. Set up event reminders above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(notification.status)}
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.eventId && getEventTitle(notification.eventId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled: {formatScheduledTime(notification.scheduledTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={notification.status === 'pending' ? 'default' : 'secondary'}
                    >
                      {notification.status}
                    </Badge>
                    {notification.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}