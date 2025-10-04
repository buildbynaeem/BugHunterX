'use client';

import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { Download, Share2, CheckCircle } from 'lucide-react';

interface TicketQRProps {
  ticket: Ticket;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  onCheckIn?: () => void;
  isCheckedIn?: boolean;
}

export default function TicketQR({ 
  ticket, 
  eventName, 
  eventDate, 
  eventLocation, 
  onCheckIn,
  isCheckedIn = false 
}: TicketQRProps) {
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    eventId: ticket.eventId,
    timestamp: Date.now(),
  });

  const handleDownload = () => {
    // Mock download functionality
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `ticket-${ticket.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ticket for ${eventName}`,
        text: `Check out my ticket for ${eventName}`,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Ticket link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <CardTitle className="text-xl">Your Ticket</CardTitle>
          </div>
          <Badge variant="outline" className="w-fit mx-auto">
            {ticket.status === 'active' ? 'Valid' : ticket.status}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Event Info */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{eventName}</h2>
            <p className="text-muted-foreground">{formatDateTime(eventDate)}</p>
            <p className="text-sm text-muted-foreground">{eventLocation}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <QRCode
                value={qrData}
                size={200}
                level="M"
                includeMargin={true}
                renderAs="canvas"
              />
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ticket ID:</span>
              <span className="font-mono">{ticket.id}</span>
            </div>
            {ticket.seat && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seat:</span>
                <span className="font-medium">{ticket.seat}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge 
                variant={ticket.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {ticket.status}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!isCheckedIn && ticket.status === 'active' && (
              <Button 
                onClick={onCheckIn} 
                className="w-full"
                size="lg"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Check In
              </Button>
            )}
            
            {isCheckedIn && (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-600 font-medium">Checked In Successfully!</p>
                <p className="text-sm text-muted-foreground">
                  You're all set for the event
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1">How to use your ticket:</p>
            <p>Show this QR code at the event entrance for quick check-in</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

