'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckSquare, 
  Users, 
  IndianRupee, 
  BarChart3, 
  Menu, 
  X,
  Settings,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  unreadNotifications: number;
}

const navigationItems = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'vendors', label: 'Vendors', icon: Users },
  { id: 'budget', label: 'Budget', icon: IndianRupee },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ 
  isCollapsed, 
  onToggle, 
  activeTab, 
  onTabChange, 
  user,
  unreadNotifications 
}: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-card border-r border-border h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/logo.png" alt="Planora Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Planora</h1>
                <p className="text-sm text-muted-foreground">Event Management</p>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="shrink-0"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </motion.div>
          )}
        </div>
        
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex space-x-2 mt-3"
          >
            <Button variant="ghost" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </motion.div>
        )}
        

      </div>
    </motion.div>
  );
}

