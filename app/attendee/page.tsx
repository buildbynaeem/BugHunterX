'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatDateConsistent } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/event-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import QRCode from 'qrcode.react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { RAZORPAY_CONFIG } from '@/lib/config';
import AttendeeNotifications from '@/components/AttendeeNotifications';
import { 
  Calendar, 
  MapPin,
  IndianRupee, 
  QrCode,
  CreditCard,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Award,
  Star,
  ArrowRight,
  Ticket,
  Heart,
  Share2,
  Download,
  Gift,
  Trophy,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Bell,
  Settings,
  User,
  History,
  HelpCircle
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function AttendeePage() {
  const { events, attendees, addAttendee, updateAttendee, refreshData } = useEvents();
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [purchasedTicketsOpen, setPurchasedTicketsOpen] = useState(false);
  const { razorpayLoaded, loading } = useRazorpay();

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('attendeeName');
    const savedEmail = localStorage.getItem('attendeeEmail');
    
    if (savedName) setAttendeeName(savedName);
    if (savedEmail) setAttendeeEmail(savedEmail);
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (attendeeName) {
      localStorage.setItem('attendeeName', attendeeName);
    }
  }, [attendeeName]);

  useEffect(() => {
    if (attendeeEmail) {
      localStorage.setItem('attendeeEmail', attendeeEmail);
    }
  }, [attendeeEmail]);

  const handleBuy = async (event: any) => {
    console.log('Buy button clicked for event:', event);
    
    // Validate user information
    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      alert('Please fill in your name and email before purchasing a ticket.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(attendeeEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    setPaymentLoading(true);

    try {
      // Check if Razorpay is loaded
      if (!razorpayLoaded || !window.Razorpay) {
        console.log('Razorpay not loaded, using mock payment');
        await handleMockPayment(event);
        return;
      }

      // Create Razorpay order
      const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: event.ticket_price * 100, // Amount in paise
        currency: 'INR',
        name: 'Planora Events',
        description: `Ticket for ${event.title}`,
        image: '/logo.png',
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          await handlePaymentSuccess(event, response.razorpay_payment_id);
        },
        prefill: {
          name: attendeeName,
          email: attendeeEmail,
        },
        theme: {
          color: '#10b981'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed');
            setPaymentLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleMockPayment = async (event: any) => {
    console.log('Processing mock payment...');
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPaymentId = 'mock_' + Date.now();
    await handlePaymentSuccess(event, mockPaymentId);
  };

  const handlePaymentSuccess = async (event: any, paymentId: string) => {
    try {
      console.log('Processing payment success...');
      console.log('Event:', event);
      console.log('Payment ID:', paymentId);
      console.log('Attendee Name:', attendeeName);
      console.log('Attendee Email:', attendeeEmail);
      
      // Validate required fields
      if (!attendeeName || !attendeeEmail) {
        throw new Error('Name and email are required');
      }
      
      // Generate QR code data
      const qrCodeData = `${event.title}_${attendeeName}_${Date.now()}`;
      
      // Create new attendee record
      const newAttendee = {
        name: attendeeName,
        email: attendeeEmail,
        event_id: event.id,
        paid: true,
        payment_id: paymentId,
        qr_code: qrCodeData
      };

      console.log('Creating attendee with data:', newAttendee);

      // Add attendee to the system
      const createdAttendee = await addAttendee(newAttendee);
      
      console.log('Attendee created successfully:', createdAttendee);
      
      // Force refresh the attendees data
      await refreshData();
      
      console.log('Data refreshed, current attendees:', attendees);
      
      setPaymentLoading(false);
      
      // Automatically switch to My Tickets tab and open purchased tickets modal
      setActiveTab('tickets');
      
      // Open the purchased tickets modal after a short delay
      setTimeout(() => {
        setPurchasedTicketsOpen(true);
      }, 500);
      
      alert(`Payment successful! Your ticket for "${event.title}" has been generated.`);
      
    } catch (error) {
      console.error('Error processing payment success:', error);
      alert('Payment was successful but there was an error generating your ticket. Please contact support.');
      setPaymentLoading(false);
    }
  };

  const getMyAttendees = () => {
    console.log('getMyAttendees called with:', { attendeeName, attendeeEmail });
    console.log('All attendees:', attendees);
    const filtered = attendees.filter(attendee => 
      attendee.name === attendeeName && attendee.email === attendeeEmail
    );
    console.log('Filtered attendees:', filtered);
    return filtered;
  };

  const generateTicketManually = async (attendeeId: string, eventTitle: string) => {
    try {
      const qrCodeData = `${eventTitle}_${attendeeName}_${Date.now()}`;
      await updateAttendee(attendeeId, {
        paid: true,
        qr_code: qrCodeData,
        payment_id: 'manual_generation_' + Date.now()
      });
      alert('Ticket generated successfully! Check "My Tickets" tab.');
    } catch (error) {
      console.error('Error generating ticket:', error);
      alert('Failed to generate ticket. Please try again.');
    }
  };

  const getUpcomingEvents = () => {
    return events.filter(event => new Date(event.date) > new Date());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-background">
      {/* Header */}
      <motion.header 
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-16 h-16 flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img src="/logo.png" alt="Planora Logo" className="w-16 h-16 object-contain" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-black">
                Planora
              </h1>
              <p className="text-sm text-muted-foreground">Register for Events</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-4">
            {/* Notifications Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('notifications')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
            </motion.div>
            
            {/* Purchased Tickets Button */}
            <Dialog open={purchasedTicketsOpen} onOpenChange={setPurchasedTicketsOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                  >
                    <Ticket className="h-4 w-4" />
                    Purchased Tickets
                    {getMyAttendees().filter(attendee => attendee.paid).length > 0 && (
                      <Badge className="ml-1 bg-white text-green-600 hover:bg-white">
                        {getMyAttendees().filter(attendee => attendee.paid).length}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Ticket className="h-5 w-5 text-green-600" />
                    Your Purchased Tickets
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {!attendeeName || !attendeeEmail ? (
                    <div className="text-center py-8">
                      <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Enter Your Details</h3>
                      <p className="text-muted-foreground mb-4">
                        Please enter your name and email in the form above to view your tickets.
                      </p>
                      <Button 
                        onClick={() => setPurchasedTicketsOpen(false)}
                        variant="outline"
                      >
                        Close & Enter Details
                      </Button>
                    </div>
                  ) : getMyAttendees().filter(attendee => attendee.paid).length === 0 ? (
                    <div className="text-center py-8">
                      <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Tickets Found</h3>
                      <p className="text-muted-foreground mb-4">
                        No tickets found for {attendeeEmail}. Purchase a ticket to get started!
                      </p>
                      <Button 
                        onClick={() => setPurchasedTicketsOpen(false)}
                        variant="outline"
                      >
                        Close & Buy Tickets
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {getMyAttendees()
                        .filter(attendee => attendee.paid)
                        .map((attendee) => {
                          const event = events.find(e => e.id === attendee.event_id);
                          if (!event) return null;

                          return (
                            <Card key={attendee.id} className="overflow-hidden border-green-200">
                              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg text-green-800">{event.title}</CardTitle>
                                    <p className="text-sm text-green-600 mt-1">
                                      <Calendar className="inline h-4 w-4 mr-1" />
                                      {formatDateConsistent(event.date)}
                                    </p>
                                    <p className="text-sm text-green-600">
                                      <MapPin className="inline h-4 w-4 mr-1" />
                                      {event.venue}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Payment Confirmed
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-800">Ticket Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><span className="font-medium">Name:</span> {attendee.name}</p>
                                      <p><span className="font-medium">Email:</span> {attendee.email}</p>
                                      <p><span className="font-medium">Payment ID:</span> {attendee.payment_id}</p>
                                      <p><span className="font-medium">Ticket ID:</span> {attendee.id}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <h4 className="font-semibold mb-3 text-gray-800">QR Code</h4>
                                    <div className="bg-white p-4 rounded-lg border-2 border-green-200 shadow-sm">
                                      <QRCode 
                                        value={attendee.qr_code || `${event.title}_${attendee.name}_${attendee.id}`}
                                        size={120}
                                        level="M"
                                        includeMargin={true}
                                      />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                      Show this QR code at the event entrance
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            

          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* User Info Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-green-50/20 to-white group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative z-10">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="h-5 w-5 text-white" />
                  </motion.div>
                  Your Information
                </CardTitle>
                <p className="text-muted-foreground">Please provide your details to proceed with event registration</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                    <Input
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Enter your full name"
                      className="shadow-sm focus:shadow-md transition-shadow border-2 focus:border-green-500"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="shadow-sm focus:shadow-md transition-shadow border-2 focus:border-green-500"
                    />
                  </motion.div>
          </div>
        </CardContent>
      </Card>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="events">Available Events</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getUpcomingEvents().map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDateConsistent(event.date)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.venue}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDateConsistent(event.date)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-lg font-semibold">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          ₹{event.ticket_price}
                        </div>
                        <Button 
                          onClick={() => handleBuy(event)}
                          className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg relative z-10 cursor-pointer"
                          size="sm"
                          type="button"
                          disabled={paymentLoading || loading}
                        >
                          {paymentLoading ? 'Processing...' : loading ? 'Loading...' : 'Buy'}
                        </Button>
      </div>

                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <AttendeeNotifications 
                attendeeEmail="user@example.com"
                attendeeName="Current User"
                userEvents={getUpcomingEvents()}
              />
            </TabsContent>

          </Tabs>
          </motion.div>
        </main>
      </div>
  );
}