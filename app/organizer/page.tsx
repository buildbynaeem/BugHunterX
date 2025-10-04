'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/event-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import BudgetTracker from '@/components/BudgetTracker';
import TaskManagement from '@/components/TaskManagement';
import Vendors from '@/components/Vendors';
import QRScanner from '@/components/QRScanner';
import { cn, formatDateConsistent } from '@/lib/utils';
import { Plus, Calendar, MapPin, IndianRupee, Users, Edit, Trash2, Eye, RefreshCw, Sparkles, Zap, Target, TrendingUp, Award, BarChart3, Key } from 'lucide-react';

export default function OrganizerPage() {
  const { events, createEvent, updateEvent, deleteEvent, attendees, loading, refreshData } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    ticketPrice: '',
    description: '',
    expectedCapacity: ''
  });
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEventForPassword, setSelectedEventForPassword] = useState<any>(null);
  const [showExistingPasswordModal, setShowExistingPasswordModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEvent = await createEvent({
        title: formData.title,
        date: formData.date,
        venue: formData.venue,
        ticket_price: parseFloat(formData.ticketPrice),
        description: formData.description,
        expected_capacity: formData.expectedCapacity ? parseInt(formData.expectedCapacity) : undefined
      });
      setCreatedEvent(newEvent);
      setFormData({ title: '', date: '', venue: '', ticketPrice: '', description: '', expectedCapacity: '' });
      setShowForm(false);
      setShowPasswordModal(true);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const getEventAttendees = (eventId: string) => {
    return attendees.filter(attendee => attendee.event_id === eventId);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleShowPassword = async (event: any) => {
    let eventWithPassword = event;
    
    // If event doesn't have a password, generate one
    if (!event.sponsor_password) {
      const newPassword = generatePassword();
      await updateEvent(event.id, { sponsor_password: newPassword });
      eventWithPassword = { ...event, sponsor_password: newPassword };
    }
    
    setSelectedEventForPassword(eventWithPassword);
    setShowExistingPasswordModal(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: event.date || '',
      venue: event.venue || '',
      ticketPrice: event.ticket_price?.toString() || '',
      description: event.description || '',
      expectedCapacity: event.expected_capacity?.toString() || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    try {
      await updateEvent(editingEvent.id, {
        title: formData.title,
        date: formData.date,
        venue: formData.venue,
        ticket_price: parseFloat(formData.ticketPrice),
        description: formData.description,
        expected_capacity: formData.expectedCapacity ? parseInt(formData.expectedCapacity) : undefined
      });
      setFormData({ title: '', date: '', venue: '', ticketPrice: '', description: '', expectedCapacity: '' });
      setShowEditForm(false);
      setEditingEvent(null);
      await refreshData(); // Refresh the data to show updated event
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-50/50 to-background">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Planora
              </h1>
              <p className="text-sm text-muted-foreground">Event Organizer Dashboard</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="flex items-center shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </motion.div>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-blue-50/30 to-white group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-primary rounded-lg flex items-center justify-center mr-3 shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Calendar className="h-4 w-4 text-white" />
                    </motion.div>
                    Total Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
                    {loading ? '...' : events.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active events</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-green-50/30 to-white group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="h-4 w-4 text-white" />
                    </motion.div>
                    Total Attendees
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {loading ? '...' : attendees.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Registered attendees</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-purple-50/30 to-white group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mr-3 shadow-lg"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IndianRupee className="h-4 w-4 text-white" />
                    </motion.div>
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    {loading ? '...' : `₹${events.reduce((sum, event) => {
                      const eventAttendees = getEventAttendees(event.id);
                      const paidAttendees = eventAttendees.filter(a => a.paid);
                      return sum + (paidAttendees.length * event.ticket_price);
                    }, 0).toLocaleString()}`}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Budget Tracker and Vendors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <BudgetTracker />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Vendors />
            </motion.div>
          </div>

          {/* Task Management */}
          <div className="mt-8">
            <TaskManagement />
          </div>

          {/* QR Scanner */}
          <div className="mt-8">
            <QRScanner />
          </div>



          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => {
                    const eventAttendees = getEventAttendees(event.id);
                    const paidAttendees = eventAttendees.filter(a => a.paid);
                    const isUpcoming = new Date(event.date) > new Date();
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{formatDateConsistent(event.date)}</TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>₹{event.ticket_price}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{paidAttendees.length}/{event.expected_capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isUpcoming ? "default" : "secondary"}>
                            {isUpcoming ? "Upcoming" : "Past"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                              title="Edit Event"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleShowPassword(event)}
                              title="View Sponsor Password"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Create Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Venue</label>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Enter venue"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Ticket Price (₹)</label>
                <Input
                  type="number"
                  value={formData.ticketPrice}
                  onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                  placeholder="Enter price"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Expected Audience Capacity</label>
                <Input
                  type="number"
                  value={formData.expectedCapacity}
                  onChange={(e) => setFormData({ ...formData, expectedCapacity: e.target.value })}
                  placeholder="Enter expected capacity"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  required
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1">
                  Create Event
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Event Created Successfully!
            </DialogTitle>
          </DialogHeader>
          
          {createdEvent && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">{createdEvent.title}</h3>
                <p className="text-sm text-green-700 mb-3">Your event has been created successfully!</p>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Sponsor Access Password:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded font-mono text-lg font-bold tracking-wider">
                      {createdEvent.sponsor_password}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(createdEvent.sponsor_password)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-3">
                  Share this password with sponsors to grant them access to event analytics.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Done
                </Button>
                <Button 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setShowForm(true);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Existing Event Password Modal */}
      <Dialog open={showExistingPasswordModal} onOpenChange={setShowExistingPasswordModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Event Sponsor Password
            </DialogTitle>
          </DialogHeader>
          
          {selectedEventForPassword && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">{selectedEventForPassword.title}</h3>
                <p className="text-sm text-blue-700 mb-3">Sponsor access password for this event:</p>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600 mb-1">Sponsor Access Password:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded font-mono text-lg font-bold tracking-wider">
                      {selectedEventForPassword.sponsor_password || 'No Password'}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(selectedEventForPassword.sponsor_password || '')}
                      disabled={!selectedEventForPassword.sponsor_password}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-3">
                  Share this password with sponsors to grant them access to event analytics.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowExistingPasswordModal(false)}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Modal */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Edit Event
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateEvent} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Venue</label>
              <Input
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Ticket Price (₹)</label>
              <Input
                type="number"
                value={formData.ticketPrice}
                onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                placeholder="Enter price"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Expected Audience Capacity</label>
              <Input
                type="number"
                value={formData.expectedCapacity}
                onChange={(e) => setFormData({ ...formData, expectedCapacity: e.target.value })}
                placeholder="Enter expected capacity"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                required
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Event
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEvent(null);
                  setFormData({ title: '', date: '', venue: '', ticketPrice: '', description: '', expectedCapacity: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
