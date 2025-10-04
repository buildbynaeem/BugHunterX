// Core types for Planora Event Management Hub

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'organizer' | 'attendee' | 'sponsor';
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  registeredCount: number;
  status: 'draft' | 'published' | 'live' | 'completed';
  coverImage?: string;
  budget_limit?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: User;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: Date;
}

export interface BudgetItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  status: 'planned' | 'approved' | 'paid';
  vendor?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  services: string[];
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  isFavorite?: boolean;
}

export interface Ticket {
  id: string;
  eventId: string;
  attendeeId: string;
  seat?: string;
  qrCode: string;
  status: 'active' | 'used' | 'cancelled';
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface SponsorMetrics {
  id: string;
  name: string;
  impressions: number;
  boothVisits: number;
  engagementRate: number;
  leads: number;
  revenue: number;
}

export interface OrganizerData {
  user: User;
  events: Event[];
  tasks: Task[];
  budget: BudgetItem[];
  vendors: Vendor[];
  notifications: Notification[];
}

export interface NotificationPreferences {
  eventReminders: boolean;
  eventUpdates: boolean;
  generalNotifications: boolean;
  reminderDaysBefore: number; // Days before event to send reminder
}

export interface AttendeeData {
  user: User;
  tickets: Ticket[];
  schedule: Session[];
  notifications: Notification[];
  notificationPreferences?: NotificationPreferences;
}

export interface SponsorData {
  user: User;
  metrics: SponsorMetrics[];
  events: Event[];
}

