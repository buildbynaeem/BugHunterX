'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SponsorMetrics as SponsorMetricsType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Eye, Target, IndianRupee } from 'lucide-react';

interface SponsorMetricsProps {
  metrics: SponsorMetricsType[];
}

export default function SponsorMetrics({ metrics }: SponsorMetricsProps) {
  const totalMetrics = metrics.reduce((acc, metric) => ({
    impressions: acc.impressions + metric.impressions,
    boothVisits: acc.boothVisits + metric.boothVisits,
    engagementRate: acc.engagementRate + metric.engagementRate,
    leads: acc.leads + metric.leads,
    revenue: acc.revenue + metric.revenue,
  }), { impressions: 0, boothVisits: 0, engagementRate: 0, leads: 0, revenue: 0 });

  const averageEngagementRate = totalMetrics.engagementRate / metrics.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Total Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.impressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all events
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
            <div className="text-2xl font-bold">{totalMetrics.boothVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Physical interactions
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
              {(averageEngagementRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average across events
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
            <div className="text-2xl font-bold">{formatCurrency(totalMetrics.revenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Generated from events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{metric.name}</h3>
                  <Badge variant="outline">
                    {metric.leads} leads
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{metric.impressions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{metric.boothVisits.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Booth Visits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{(metric.engagementRate * 100).toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{formatCurrency(metric.revenue)}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>

                {/* Simple Progress Bar for Engagement */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Engagement Rate</span>
                    <span>{(metric.engagementRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.engagementRate * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Best Performing Event</p>
                <p className="text-sm text-green-600">
                  {metrics.reduce((best, current) => 
                    current.engagementRate > best.engagementRate ? current : best
                  ).name} with {(Math.max(...metrics.map(m => m.engagementRate)) * 100).toFixed(1)}% engagement
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Total Lead Generation</p>
                <p className="text-sm text-blue-600">
                  {totalMetrics.leads} qualified leads across all events
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-800">Revenue per Lead</p>
                <p className="text-sm text-purple-600">
                  {formatCurrency(totalMetrics.revenue / Math.max(totalMetrics.leads, 1))} average value per lead
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

