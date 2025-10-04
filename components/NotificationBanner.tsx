'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  X, 
  ExternalLink 
} from 'lucide-react';

interface NotificationBannerProps {
  notification: Notification;
  onDismiss: (notificationId: string) => void;
  onAction?: (actionUrl: string) => void;
}

const notificationIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

const notificationColors = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

export default function NotificationBanner({ 
  notification, 
  onDismiss, 
  onAction 
}: NotificationBannerProps) {
  const Icon = notificationIcons[notification.type];
  const colorClass = notificationColors[notification.type];

  const handleAction = () => {
    if (notification.actionUrl && onAction) {
      onAction(notification.actionUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
    >
      <Card className={`border-2 ${colorClass} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-black/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-sm mb-3">{notification.message}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {notification.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                
                {notification.actionUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAction}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (notificationId: string) => void;
  onAction?: (actionUrl: string) => void;
}

export function NotificationContainer({ 
  notifications, 
  onDismiss, 
  onAction 
}: NotificationContainerProps) {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationBanner
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
            onAction={onAction}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

