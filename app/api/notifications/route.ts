import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Types for notification management
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

interface NotificationPreferences {
  eventReminders: boolean;
  eventUpdates: boolean;
  generalNotifications: boolean;
  reminderDaysBefore: number;
}

const DATA_DIR = join(process.cwd(), 'data');
const NOTIFICATIONS_FILE = join(DATA_DIR, 'notifications.json');
const ATTENDEES_FILE = join(DATA_DIR, 'attendees.json');
const EVENTS_FILE = join(DATA_DIR, 'events.json');

// Helper function to read JSON file
function readJsonFile(filePath: string): any[] {
  try {
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write JSON file
function writeJsonFile(filePath: string, data: any[]): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET - Retrieve notifications or notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const attendeeId = searchParams.get('attendeeId');
    const eventId = searchParams.get('eventId');

    if (type === 'preferences' && attendeeId) {
      // Get notification preferences for an attendee
      const attendees = readJsonFile(ATTENDEES_FILE);
      const attendee = attendees.find((a: any) => a.id === attendeeId);
      
      if (!attendee) {
        return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
      }

      const preferences = attendee.notificationPreferences || {
        eventReminders: true,
        eventUpdates: true,
        generalNotifications: true,
        reminderDaysBefore: 1
      };

      return NextResponse.json({ preferences });
    }

    if (type === 'scheduled') {
      // Get scheduled notifications
      const notifications = readJsonFile(NOTIFICATIONS_FILE);
      let filteredNotifications = notifications;

      if (eventId) {
        filteredNotifications = notifications.filter((n: ScheduledNotification) => n.eventId === eventId);
      }

      if (attendeeId) {
        filteredNotifications = filteredNotifications.filter((n: ScheduledNotification) => 
          !n.attendeeId || n.attendeeId === attendeeId
        );
      }

      return NextResponse.json({ notifications: filteredNotifications });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Schedule notification or update preferences
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'schedule') {
      // Schedule a new notification
      const { eventId, attendeeId, title, message, scheduledTime, notificationType } = body;

      if (!eventId || !title || !message || !scheduledTime) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const notifications = readJsonFile(NOTIFICATIONS_FILE);
      const newNotification: ScheduledNotification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        eventId,
        attendeeId,
        title,
        message,
        scheduledTime,
        type: notificationType || 'general',
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      notifications.push(newNotification);
      writeJsonFile(NOTIFICATIONS_FILE, notifications);

      return NextResponse.json({ 
        success: true, 
        notification: newNotification 
      });
    }

    if (type === 'schedule_event_reminders') {
      // Schedule reminders for all upcoming events
      const { daysBefore = 1 } = body;
      const events = readJsonFile(EVENTS_FILE);
      const attendees = readJsonFile(ATTENDEES_FILE);
      const notifications = readJsonFile(NOTIFICATIONS_FILE);
      
      const now = new Date();
      const scheduledNotifications: ScheduledNotification[] = [];

      events.forEach((event: any) => {
        const eventDate = new Date(event.date);
        
        // Only schedule for future events
        if (eventDate > now) {
          const reminderDate = new Date(eventDate);
          reminderDate.setDate(reminderDate.getDate() - daysBefore);
          reminderDate.setHours(9, 0, 0, 0); // 9 AM reminder

          // Check if reminder is in the future
          if (reminderDate > now) {
            // Schedule for all attendees of this event
            const eventAttendees = attendees.filter((a: any) => 
              a.event_id === event.id && 
              (a.notificationPreferences?.eventReminders !== false)
            );

            eventAttendees.forEach((attendee: any) => {
              const notification: ScheduledNotification = {
                id: `reminder_${event.id}_${attendee.id}_${Date.now()}`,
                eventId: event.id,
                attendeeId: attendee.id,
                title: `Event Reminder: ${event.title}`,
                message: `Don't forget! ${event.title} is ${daysBefore === 1 ? 'tomorrow' : `in ${daysBefore} days`}. Make sure you're ready!`,
                scheduledTime: reminderDate.toISOString(),
                type: 'event_reminder',
                status: 'scheduled',
                createdAt: new Date().toISOString()
              };

              scheduledNotifications.push(notification);
            });
          }
        }
      });

      // Add to existing notifications
      notifications.push(...scheduledNotifications);
      writeJsonFile(NOTIFICATIONS_FILE, notifications);

      return NextResponse.json({ 
        success: true, 
        scheduled: scheduledNotifications.length,
        notifications: scheduledNotifications 
      });
    }

    if (type === 'update_preferences') {
      // Update notification preferences for an attendee
      const { attendeeId, preferences } = body;

      if (!attendeeId || !preferences) {
        return NextResponse.json({ error: 'Missing attendeeId or preferences' }, { status: 400 });
      }

      const attendees = readJsonFile(ATTENDEES_FILE);
      const attendeeIndex = attendees.findIndex((a: any) => a.id === attendeeId);

      if (attendeeIndex === -1) {
        return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
      }

      attendees[attendeeIndex].notificationPreferences = preferences;
      writeJsonFile(ATTENDEES_FILE, attendees);

      return NextResponse.json({ 
        success: true, 
        preferences: attendees[attendeeIndex].notificationPreferences 
      });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update notification status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, status } = body;

    if (!notificationId || !status) {
      return NextResponse.json({ error: 'Missing notificationId or status' }, { status: 400 });
    }

    const notifications = readJsonFile(NOTIFICATIONS_FILE);
    const notificationIndex = notifications.findIndex((n: ScheduledNotification) => n.id === notificationId);

    if (notificationIndex === -1) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    notifications[notificationIndex].status = status;
    writeJsonFile(NOTIFICATIONS_FILE, notifications);

    return NextResponse.json({ 
      success: true, 
      notification: notifications[notificationIndex] 
    });
  } catch (error) {
    console.error('Error in PUT /api/notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Cancel scheduled notification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
    }

    const notifications = readJsonFile(NOTIFICATIONS_FILE);
    const filteredNotifications = notifications.filter((n: ScheduledNotification) => n.id !== notificationId);

    if (filteredNotifications.length === notifications.length) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    writeJsonFile(NOTIFICATIONS_FILE, filteredNotifications);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}