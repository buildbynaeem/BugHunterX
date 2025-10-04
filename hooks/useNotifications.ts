"use client"

import { useState, useEffect } from 'react';
import { notificationService } from '@/lib/notificationService';

export interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermission>;
  scheduleEventReminder: (eventId: string, attendeeId: string, daysBefore?: number) => Promise<void>;
  sendNotification: (title: string, body: string, options?: NotificationOptions) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      throw new Error('Notifications are not supported in this browser');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await notificationService.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleEventReminder = async (
    eventId: string, 
    attendeeId: string, 
    daysBefore: number = 1
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // First ensure we have permission
      if (permission !== 'granted') {
        await requestPermission();
      }

      // Schedule the reminder via API
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'schedule_event_reminders',
          eventId,
          attendeeId,
          daysBefore,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule event reminder');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to schedule reminder');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule reminder';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotification = async (
    title: string, 
    body: string, 
    options?: NotificationOptions
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure we have permission
      if (permission !== 'granted') {
        await requestPermission();
      }

      await notificationService.sendNotification({
        title,
        body,
        icon: options?.icon || '/favicon.ico',
        badge: options?.badge || '/favicon.ico',
        data: options?.data,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    scheduleEventReminder,
    sendNotification,
    isLoading,
    error,
  };
}