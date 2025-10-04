import { 
  OrganizerData, 
  AttendeeData, 
  SponsorData, 
  User, 
  Event, 
  Task, 
  BudgetItem, 
  Vendor, 
  Session, 
  Ticket, 
  Notification, 
  SponsorMetrics 
} from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@planora.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'organizer',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'attendee',
  },
  {
    id: '3',
    name: 'TechCorp Inc.',
    email: 'sponsor@techcorp.com',
    role: 'sponsor',
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'TechConf 2024',
    description: 'The premier technology conference featuring the latest innovations in AI, blockchain, and cloud computing.',
    startDate: new Date('2024-03-15T09:00:00'),
    endDate: new Date('2024-03-17T18:00:00'),
    location: 'San Francisco Convention Center',
    capacity: 2000,
    registeredCount: 1450,
    status: 'published',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Startup Summit',
    description: 'Connecting entrepreneurs with investors and industry leaders.',
    startDate: new Date('2024-04-20T08:00:00'),
    endDate: new Date('2024-04-20T20:00:00'),
    location: 'New York Marriott Marquis',
    capacity: 500,
    registeredCount: 320,
    status: 'live',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize keynote speaker lineup',
    description: 'Confirm all keynote speakers and prepare introduction materials',
    assignee: mockUsers[0],
    dueDate: new Date('2024-03-01T17:00:00'),
    priority: 'high',
    status: 'in-progress',
    category: 'Speakers',
    createdAt: new Date('2024-02-15T10:00:00'),
  },
  {
    id: '2',
    title: 'Setup registration system',
    description: 'Configure online registration and payment processing',
    assignee: mockUsers[0],
    dueDate: new Date('2024-02-28T12:00:00'),
    priority: 'urgent',
    status: 'todo',
    category: 'Registration',
    createdAt: new Date('2024-02-10T09:00:00'),
  },
  {
    id: '3',
    title: 'Order catering for lunch',
    description: 'Finalize catering menu and place order for 2000 attendees',
    assignee: mockUsers[0],
    dueDate: new Date('2024-03-10T15:00:00'),
    priority: 'medium',
    status: 'done',
    category: 'Catering',
    createdAt: new Date('2024-02-05T14:00:00'),
  },
];

// Mock Budget Items
export const mockBudget: BudgetItem[] = [
  {
    id: '1',
    name: 'Venue Rental',
    category: 'Venue',
    amount: 50000,
    status: 'paid',
    vendor: 'SF Convention Center',
    notes: '3-day rental with setup/teardown',
  },
  {
    id: '2',
    name: 'Catering',
    category: 'Food & Beverage',
    amount: 25000,
    status: 'approved',
    vendor: 'Gourmet Catering Co.',
    notes: 'Lunch for 2000 attendees',
  },
  {
    id: '3',
    name: 'AV Equipment',
    category: 'Technology',
    amount: 15000,
    status: 'planned',
    vendor: 'Pro AV Solutions',
    notes: 'Sound system, projectors, lighting',
  },
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'SF Convention Center',
    contact: 'John Smith',
    email: 'john@sfcc.com',
    phone: '(555) 123-4567',
    services: ['Venue Rental', 'Event Planning'],
    status: 'approved',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Gourmet Catering Co.',
    contact: 'Maria Garcia',
    email: 'maria@gourmet.com',
    phone: '(555) 234-5678',
    services: ['Catering', 'Event Services'],
    status: 'approved',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Pro AV Solutions',
    contact: 'David Lee',
    email: 'david@proav.com',
    phone: '(555) 345-6789',
    services: ['Audio/Visual', 'Technical Support'],
    status: 'pending',
    rating: 4.9,
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'The Future of AI in Business',
    description: 'Exploring how artificial intelligence is transforming modern business operations.',
    speaker: {
      name: 'Dr. Amanda Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      bio: 'AI Research Director at TechCorp',
    },
    startTime: new Date('2024-03-15T10:00:00'),
    endTime: new Date('2024-03-15T11:00:00'),
    location: 'Main Hall A',
    capacity: 500,
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Blockchain Beyond Cryptocurrency',
    description: 'Real-world applications of blockchain technology in various industries.',
    speaker: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Blockchain Architect at ChainCorp',
    },
    startTime: new Date('2024-03-15T11:30:00'),
    endTime: new Date('2024-03-15T12:30:00'),
    location: 'Hall B',
    capacity: 300,
    isFavorite: false,
  },
];

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: '1',
    eventId: '1',
    attendeeId: '2',
    seat: 'A-15',
    qrCode: 'QR_CODE_DATA_1',
    status: 'active',
    createdAt: new Date('2024-02-20T10:00:00'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Session Update',
    message: 'The "Future of AI" session has been moved to Hall A due to high demand.',
    type: 'info',
    isRead: false,
    createdAt: new Date('2024-03-14T15:30:00'),
    actionUrl: '/schedule',
  },
  {
    id: '2',
    title: 'Check-in Reminder',
    message: 'Your event starts in 2 hours. Don\'t forget to check in at the registration desk.',
    type: 'warning',
    isRead: false,
    createdAt: new Date('2024-03-15T07:00:00'),
  },
];

// Mock Sponsor Metrics
export const mockSponsorMetrics: SponsorMetrics[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    impressions: 15420,
    boothVisits: 342,
    engagementRate: 0.68,
    leads: 89,
    revenue: 125000,
  },
];

// Complete Mock Data Sets
export const mockOrganizerData: OrganizerData = {
  user: mockUsers[0],
  events: mockEvents,
  tasks: mockTasks,
  budget: mockBudget,
  vendors: mockVendors,
  notifications: mockNotifications,
};

export const mockAttendeeData: AttendeeData = {
  user: mockUsers[1],
  tickets: mockTickets,
  schedule: mockSessions,
  notifications: mockNotifications,
};

export const mockSponsorData: SponsorData = {
  user: mockUsers[2],
  metrics: mockSponsorMetrics,
  events: mockEvents,
};

