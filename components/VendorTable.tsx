'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Vendor } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, CreditCard, Star, Phone, Mail } from 'lucide-react';

interface VendorTableProps {
  vendors: Vendor[];
  onUpdateVendor: (vendorId: string, updates: Partial<Vendor>) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function VendorTable({ vendors, onUpdateVendor }: VendorTableProps) {
  const handleStatusChange = (vendorId: string, status: Vendor['status']) => {
    onUpdateVendor(vendorId, { status });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <motion.tr
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${vendor.name}&background=random`} />
                      <AvatarFallback>
                        {vendor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.contact}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{vendor.phone}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {vendor.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                
                <TableCell>
                  {vendor.rating ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {renderStars(vendor.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground ml-1">
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No rating</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <Badge className={statusColors[vendor.status]}>
                    {vendor.status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Mock message functionality
                        alert(`Opening message to ${vendor.name}`);
                      }}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Mock payment functionality
                        alert(`Opening payment for ${vendor.name}`);
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                    {vendor.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(vendor.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(vendor.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

