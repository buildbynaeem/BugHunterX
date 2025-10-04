// Notification Service for Event Push Notifications
'use client';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
}

export interface ScheduledNotification {
  id: string;
  eventId: string;
  attendeeId?: string; // If null, send to all attendees
  title: string;
  message: string;
  scheduledTime: Date;
  type: 'event_reminder' | 'event_update' | 'general';
  status: 'scheduled' | 'sent' | 'failed';
  createdAt: Date;
}

export interface NotificationPreferences {
  eventReminders: boolean;
  eventUpdates: boolean;
  generalNotifications: boolean;
  reminderDaysBefore: number; // Days before event to send reminder
}

class NotificationService {
  private static instance: NotificationService;
  private scheduledNotifications: ScheduledNotification[] = [];
  private isSupported: boolean = false;
  private permission: NotificationPermission = 'default';

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
      this.permission = this.isSupported ? Notification.permission : 'denied';
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return 'denied';
    }

    if (this.permission === 'granted') {
      return 'granted';
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Check if notifications are supported and permitted
  isNotificationEnabled(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  // Send immediate push notification
  async sendNotification(payload: PushNotificationPayload): Promise<boolean> {
    if (!this.isNotificationEnabled()) {
      console.warn('Notifications are not enabled');
      return false;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/icon-192x192.png',
        data: payload.data,
        requireInteraction: true,
        tag: payload.data?.eventId || 'general'
      });

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (payload.data?.url) {
          window.open(payload.data.url, '_blank');
        }
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // Schedule a notification for an event
  scheduleEventReminder(
    eventId: string,
    eventTitle: string,
    eventDate: Date,
    attendeeId?: string,
    daysBefore: number = 1
  ): string {
    const notificationId = `reminder_${eventId}_${Date.now()}`;
    const scheduledTime = new Date(eventDate);
    scheduledTime.setDate(scheduledTime.getDate() - daysBefore);
    scheduledTime.setHours(9, 0, 0, 0); // Send at 9 AM

    const scheduledNotification: ScheduledNotification = {
      id: notificationId,
      eventId,
      attendeeId,
      title: `Event Reminder: ${eventTitle}`,
      message: `Don't forget! ${eventTitle} is ${daysBefore === 1 ? 'tomorrow' : `in ${daysBefore} days`}. Make sure you're ready!`,
      scheduledTime,
      type: 'event_reminder',
      status: 'scheduled',
      createdAt: new Date()
    };

    this.scheduledNotifications.push(scheduledNotification);
    this.scheduleNotificationDelivery(scheduledNotification);
    
    return notificationId;
  }

  // Schedule notification delivery
  private scheduleNotificationDelivery(notification: ScheduledNotification): void {
    const now = new Date();
    const delay = notification.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // If the scheduled time has passed, send immediately
      this.deliverScheduledNotification(notification);
      return;
    }

    // Schedule the notification
    setTimeout(() => {
      this.deliverScheduledNotification(notification);
    }, delay);
  }

  // Deliver a scheduled notification
  private async deliverScheduledNotification(notification: ScheduledNotification): Promise<void> {
    try {
      const success = await this.sendNotification({
        title: notification.title,
        body: notification.message,
        data: {
          eventId: notification.eventId,
          type: notification.type,
          url: `/attendee?event=${notification.eventId}`
        }
      });

      // Update notification status
      const index = this.scheduledNotifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.scheduledNotifications[index].status = success ? 'sent' : 'failed';
      }

      // Store in local storage for persistence
      this.saveScheduledNotifications();
    } catch (error) {
      console.error('Error delivering scheduled notification:', error);
      const index = this.scheduledNotifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.scheduledNotifications[index].status = 'failed';
      }
    }
  }

  // Get all scheduled notifications
  getScheduledNotifications(): ScheduledNotification[] {
    return this.scheduledNotifications;
  }

  // Cancel a scheduled notification
  cancelScheduledNotification(notificationId: string): boolean {
    const index = this.scheduledNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.scheduledNotifications.splice(index, 1);
      this.saveScheduledNotifications();
      return true;
    }
    return false;
  }

  // Save scheduled notifications to localStorage
  private saveScheduledNotifications(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('scheduledNotifications', JSON.stringify(this.scheduledNotifications));
    }
  }

  // Load scheduled notifications from localStorage
  loadScheduledNotifications(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('scheduledNotifications');
      if (stored) {
        try {
          this.scheduledNotifications = JSON.parse(stored);
          // Re-schedule any pending notifications
          this.scheduledNotifications
            .filter(n => n.status === 'scheduled')
            .forEach(n => this.scheduleNotificationDelivery(n));
        } catch (error) {
          console.error('Error loading scheduled notifications:', error);
        }
      }
    }
  }

  // Schedule notifications for all upcoming events
  async scheduleEventNotifications(events: any[], preferences: NotificationPreferences): Promise<void> {
    if (!this.isNotificationEnabled()) {
      return;
    }

    const now = new Date();
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      
      // Only schedule for future events
      if (eventDate > now && preferences.eventReminders) {
        // Schedule reminder notification
        this.scheduleEventReminder(
          event.id,
          event.title,
          eventDate,
          undefined, // Send to all attendees
          preferences.reminderDaysBefore
        );
      }
    });
  }

  // Send event update notification
  async sendEventUpdate(eventId: string, eventTitle: string, updateMessage: string): Promise<boolean> {
    return await this.sendNotification({
      title: `Event Update: ${eventTitle}`,
      body: updateMessage,
      data: {
        eventId,
        type: 'event_update',
        url: `/attendee?event=${eventId}`
      }
    });
  }

  // Get notification statistics
  getNotificationStats(): {
    total: number;
    scheduled: number;
    sent: number;
    failed: number;
  } {
    const total = this.scheduledNotifications.length;
    const scheduled = this.scheduledNotifications.filter(n => n.status === 'scheduled').length;
    const sent = this.scheduledNotifications.filter(n => n.status === 'sent').length;
    const failed = this.scheduledNotifications.filter(n => n.status === 'failed').length;

    return { total, scheduled, sent, failed };
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  eventReminders: true,
  eventUpdates: true,
  generalNotifications: true,
  reminderDaysBefore: 1
};