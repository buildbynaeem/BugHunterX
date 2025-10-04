'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useEvents } from '@/lib/event-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PasswordAccess from '@/components/PasswordAccess';
import { cn, formatDateConsistent } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar, 
  MapPin, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Eye, 
  Target, 
  Award, 
  BarChart3, 
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Star,
  Gift,
  Trophy,
  Crown,
  Gem,
  Heart,
  ThumbsUp,
  Share2,
  Download,
  ExternalLink,
  RefreshCw,
  Filter,
  Search,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Building
} from 'lucide-react';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

export default function SponsorDashboardPage() {
  const { events, sponsors, attendees } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);
  const [verificationAttempts, setVerificationAttempts] = useState<{ [key: string]: boolean }>({});

  const selectedEvent = events.find(event => event.id === selectedEventId);
  const eventSponsors = selectedEvent ? sponsors.filter(sponsor => sponsor.event_id === selectedEventId) : [];
  const eventAttendees = selectedEvent ? attendees.filter(attendee => attendee.event_id === selectedEventId) : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getChartData = () => {
    if (!selectedEvent) return [];
    
    return eventSponsors.map(sponsor => ({
      name: sponsor.name,
      impressions: sponsor.impressions,
      boothVisits: sponsor.booth_visits,
      engagementRate: sponsor.engagement_rate
    }));
  };

  const getEngagementData = () => {
    if (!selectedEvent) return [];
    
    return eventSponsors.map(sponsor => ({
      name: sponsor.name,
      value: sponsor.engagement_rate,
      color: COLORS[eventSponsors.indexOf(sponsor) % COLORS.length]
    }));
  };

  const handlePasswordVerification = (password: string) => {
    if (selectedEvent && selectedEvent.sponsor_password === password) {
      setIsPasswordVerified(true);
      setVerificationAttempts(prev => ({
        ...prev,
        [selectedEventId]: true
      }));
    }
  };

  const handleEventSelection = (eventId: string) => {
    setSelectedEventId(eventId);
    // Reset password verification when switching events
    setIsPasswordVerified(verificationAttempts[eventId] || false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-background">
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Planora
              </h1>
              <p className="text-sm text-muted-foreground">Sponsor Analytics Dashboard</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-4">

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 px-4 py-2 shadow-sm">
                <Star className="h-4 w-4 mr-1" />
                Premium Sponsor
              </Badge>
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
          {/* Event Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Select Event to Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Select value={selectedEventId} onValueChange={handleEventSelection}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Choose an event to view sponsor metrics" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateConsistent(event.date)} • {event.venue}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedEvent && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDateConsistent(selectedEvent.date)}
                      </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedEvent.venue}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedEvent ? (
            <>
              {!isPasswordVerified ? (
                <PasswordAccess
                  eventId={selectedEventId}
                  eventTitle={selectedEvent.title}
                  onPasswordVerified={handlePasswordVerification}
                />
              ) : (
                <>
                  {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                          <Eye className="h-4 w-4 text-white" />
                        </motion.div>
                        Total Impressions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-primary bg-clip-text text-transparent">
                        {eventSponsors.reduce((sum, sponsor) => sum + sponsor.impressions, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Total reach</p>
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
                        Booth Visits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {eventSponsors.reduce((sum, sponsor) => sum + sponsor.booth_visits, 0).toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Physical visits</p>
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
                          <Target className="h-4 w-4 text-white" />
                        </motion.div>
                        Avg Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        {eventSponsors.length > 0 
                          ? (eventSponsors.reduce((sum, sponsor) => sum + sponsor.engagement_rate, 0) / eventSponsors.length).toFixed(1)
                          : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Engagement rate</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-orange-50/30 to-white group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="pb-2 relative z-10">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <motion.div
                          className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mr-3 shadow-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Users className="h-4 w-4 text-white" />
                        </motion.div>
                        Total Attendees
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        {eventAttendees.filter(a => a.paid).length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Paid attendees</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsor Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                        <Bar dataKey="boothVisits" fill="#82ca9d" name="Booth Visits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Rate Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getEngagementData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getEngagementData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Sponsor Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Sponsor Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {eventSponsors.map((sponsor) => (
                      <div key={sponsor.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">{sponsor.name}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {sponsor.impressions.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Impressions</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {sponsor.booth_visits.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Booth Visits</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {sponsor.engagement_rate}%
                            </div>
                            <div className="text-sm text-muted-foreground">Engagement Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {eventSponsors.length === 0 && (
                      <div className="text-center py-8">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Sponsors Yet</h3>
                        <p className="text-muted-foreground">
                          This event doesn't have any sponsor data yet.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
                </>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select an Event</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Choose an event from the dropdown above to view detailed sponsor metrics and analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}
