'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Mail, 
  Phone, 
  MoreVertical,
  IndianRupee,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'needs attention';
  lastContact: string;
  eventId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface VendorsProps {
  eventId?: string;
}

const VendorCard = ({ vendor, index }: { vendor: Vendor; index: number }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'needs attention': return <AlertCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs attention': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white via-gray-50/30 to-white group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">
                {vendor.name}
              </h4>
              <Badge 
                variant="outline" 
                className={`text-xs mt-1 ${getStatusColor(vendor.status)}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(vendor.status)}
                  <span className="capitalize">{vendor.status.replace(' ', ' ')}</span>
                </div>
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Building className="h-3 w-3" />
              <span>{vendor.category}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-3 w-3" />
              <span className="truncate">{vendor.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-3 w-3" />
              <span>{vendor.phone}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Last: {vendor.lastContact}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                  <IndianRupee className="h-3 w-3" />
                  <span>₹{vendor.amount.toLocaleString()}</span>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const VendorForm = ({ onSave }: { onSave?: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    amount: '',
    status: 'pending' as Vendor['status'],
    lastContact: new Date().toISOString().split('T')[0],
    eventId: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount)
      });
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Vendor Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="Enter vendor name"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Label htmlFor="category" className="text-sm font-semibold text-gray-700">Category</Label>
        <Select value={formData.category} onValueChange={(value) => 
          setFormData(prev => ({ ...prev, category: value }))
        }>
          <SelectTrigger className="mt-2 shadow-sm focus:shadow-md transition-shadow">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Catering">Catering</SelectItem>
            <SelectItem value="AV Equipment">AV Equipment</SelectItem>
            <SelectItem value="Venue">Venue</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Transportation">Transportation</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="vendor@example.com"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="+1 (555) 123-4567"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          className="mt-2 shadow-sm focus:shadow-md transition-shadow"
          placeholder="0"
        />
      </motion.div>
      
      <motion.div 
        className="flex gap-3 pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          type="submit" 
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
        <Button type="button" variant="outline" className="flex-1 shadow-sm">
          Cancel
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default function Vendors({ eventId }: VendorsProps) {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Delicious Catering Co.',
      category: 'Catering',
      email: 'sarah.chef@delicious.com',
      phone: '+1 (555) 123-4567',
      amount: 25000,
      status: 'confirmed',
      lastContact: 'Oct 1',
      eventId: '1',
      createdAt: '2024-10-01T10:00:00Z',
      updatedAt: '2024-10-01T10:00:00Z'
    },
    {
      id: '2',
      name: 'TechSetup Solutions',
      category: 'AV Equipment',
      email: 'mike@techsetup.com',
      phone: '+1 (555) 234-5678',
      amount: 8500,
      status: 'pending',
      lastContact: 'Sep 28',
      eventId: '1',
      createdAt: '2024-09-28T10:00:00Z',
      updatedAt: '2024-09-28T10:00:00Z'
    },
    {
      id: '3',
      name: 'Grand Convention Center',
      category: 'Venue',
      email: 'events@grandcenter.com',
      phone: '+1 (555) 345-6789',
      amount: 45000,
      status: 'confirmed',
      lastContact: 'Sep 30',
      eventId: '1',
      createdAt: '2024-09-30T10:00:00Z',
      updatedAt: '2024-09-30T10:00:00Z'
    },
    {
      id: '4',
      name: 'PhotoPro Studios',
      category: 'Photography',
      email: 'contact@photopro.com',
      phone: '+1 (555) 456-7890',
      amount: 5000,
      status: 'needs attention',
      lastContact: 'Sep 25',
      eventId: '1',
      createdAt: '2024-09-25T10:00:00Z',
      updatedAt: '2024-09-25T10:00:00Z'
    }
  ]);

  const handleAddVendor = (newVendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const vendor: Vendor = {
      ...newVendor,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setVendors(prev => [...prev, vendor]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50/50 to-white">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
        
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
              >
                <Users className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Vendors
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Manage your event vendors</p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Add New Vendor
                    </DialogTitle>
                  </DialogHeader>
                  <VendorForm onSave={handleAddVendor} />
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            <AnimatePresence>
              {vendors.map((vendor, index) => (
                <VendorCard key={vendor.id} vendor={vendor} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
