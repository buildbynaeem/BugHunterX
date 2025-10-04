'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SponsorMetrics from '@/components/SponsorMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { mockSponsorData } from '@/lib/mockData';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  IndianRupee,
  BarChart3,
  Calendar,
  Building
} from 'lucide-react';
import { formatCurrency, formatDateConsistent } from '@/lib/utils';

export default function SponsorPage() {
  const data = mockSponsorData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={data.user.avatar} alt={data.user.name} />
              <AvatarFallback>
                {data.user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{data.user.name}</h1>
              <p className="text-muted-foreground">Sponsor Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Premium Sponsor
            </Badge>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Events
              </Button>

            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your Analytics Hub</h2>
                  <p className="text-purple-100 mb-4">
                    Track your sponsorship performance across all events
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>3 Active Events</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>2,450 Total Impressions</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatCurrency(data.metrics[0]?.revenue || 0)}</div>
                  <p className="text-purple-100">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Total Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.metrics.reduce((sum, m) => sum + m.impressions, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Booth Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.metrics.reduce((sum, m) => sum + m.boothVisits, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Engagement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((data.metrics.reduce((sum, m) => sum + m.engagementRate, 0) / data.metrics.length) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+3%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(data.metrics.reduce((sum, m) => sum + m.revenue, 0))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">+15%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <SponsorMetrics metrics={data.metrics} />

          {/* Events Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Sponsored Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDateConsistent(event.startDate)} • {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={event.status === 'live' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.registeredCount} attendees
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
            <Button variant="outline" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              View Upcoming Events
            </Button>
            <Button variant="outline" className="flex-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance Insights
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

