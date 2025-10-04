import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const eventsFile = path.join(dataDir, 'events.json');
const attendeesFile = path.join(dataDir, 'attendees.json');
const sponsorsFile = path.join(dataDir, 'sponsors.json');
const budgetsFile = path.join(dataDir, 'budgets.json');
const tasksFile = path.join(dataDir, 'tasks.json');

// Ensure data directory exists
try {
  fs.mkdirSync(dataDir, { recursive: true });
} catch (error) {
  // Directory already exists
}

// Helper functions for file operations
const readJsonFile = (filePath: string, defaultValue: any[] = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

const writeJsonFile = (filePath: string, data: any[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
};

// Generate sponsor password for events
const generateSponsorPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Initialize database with sample data if files don't exist
const initDatabase = () => {
  const events: Event[] = readJsonFile(eventsFile);
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  const budgets: Budget[] = readJsonFile(budgetsFile);
  const tasks: Task[] = readJsonFile(tasksFile);

  if (events.length === 0) {
    const sampleEvents = [
      {
        id: '1',
        title: 'Tech Conference 2024',
        date: '2024-12-15',
        venue: 'Convention Center, Mumbai',
        ticket_price: 1500,
        description: 'Annual technology conference featuring the latest trends in AI, blockchain, and cloud computing.',
        sponsor_password: 'TC2024XY',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Startup Pitch Day',
        date: '2024-12-20',
        venue: 'Innovation Hub, Bangalore',
        ticket_price: 500,
        description: 'Join us for an exciting day of startup pitches and networking opportunities.',
        sponsor_password: 'SPD2024AB',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const sampleAttendees = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        event_id: '1',
        paid: true,
        qr_code: 'TECH_CONF_2024_JOHN_DOE',
        payment_id: 'pay_123456789',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        event_id: '1',
        paid: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const sampleSponsors = [
      {
        id: '1',
        name: 'TechCorp',
        event_id: '1',
        impressions: 1250,
        booth_visits: 180,
        engagement_rate: 14.4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'InnovateLab',
        event_id: '1',
        impressions: 890,
        booth_visits: 120,
        engagement_rate: 13.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const sampleBudgets = [
      {
        id: '1',
        event_id: '1',
        category: 'Venue',
        allocated: 45000,
        spent: 35000,
        status: 'on track',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        event_id: '1',
        category: 'Catering',
        allocated: 30000,
        spent: 25000,
        status: 'on track',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const sampleTasks = [
      {
        id: '1',
        title: 'Book venue for conference',
        description: 'Research and book main conference venue',
        priority: 'high',
        assignedTo: 'Sarah M.',
        dueDate: '2024-10-15',
        status: 'todo',
        eventId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Design event branding',
        description: 'Create logos and brand guidelines',
        priority: 'medium',
        assignedTo: 'Mike R.',
        dueDate: '2024-10-20',
        status: 'todo',
        eventId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    writeJsonFile(eventsFile, sampleEvents);
    writeJsonFile(attendeesFile, sampleAttendees);
    writeJsonFile(sponsorsFile, sampleSponsors);
    writeJsonFile(budgetsFile, sampleBudgets);
    writeJsonFile(tasksFile, sampleTasks);
  }
};

// Initialize database
initDatabase();

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  ticket_price: number;
  description: string;
  sponsor_password?: string;
  budget_limit?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  event_id: string;
  paid: boolean;
  qr_code?: string;
  payment_id?: string;
  verified?: boolean;
  verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  event_id: string;
  impressions: number;
  booth_visits: number;
  engagement_rate: number;
  created_at?: string;
  updated_at?: string;
}

export interface Budget {
  id: string;
  event_id: string;
  category: string;
  allocated: number;
  spent: number;
  status: 'on track' | 'over' | 'under' | 'pending';
  budget_limit?: number; // Overall budget limit for the event
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  status: 'todo' | 'inprogress' | 'done';
  eventId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Event operations
export const createEvent = (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Event => {
  const events: Event[] = readJsonFile(eventsFile);
  const newEvent: Event = {
    ...event,
    sponsor_password: generateSponsorPassword(),
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  events.push(newEvent);
  writeJsonFile(eventsFile, events);
  
  return newEvent;
};

export const getEvents = (): Event[] => {
  return readJsonFile(eventsFile);
};

export const getEventById = (id: string): Event | null => {
  const events: Event[] = readJsonFile(eventsFile);
  return events.find((event: Event) => event.id === id) || null;
};

export const updateEvent = (id: string, updates: Partial<Event>): Event | null => {
  const events: Event[] = readJsonFile(eventsFile);
  const eventIndex = events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) return null;
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  writeJsonFile(eventsFile, events);
  return events[eventIndex];
};

export const deleteEvent = (id: string): boolean => {
  const events: Event[] = readJsonFile(eventsFile);
  const eventIndex = events.findIndex((event: Event) => event.id === id);
  
  if (eventIndex === -1) return false;
  
  events.splice(eventIndex, 1);
  writeJsonFile(eventsFile, events);
  
  // Also delete related attendees and sponsors
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  const filteredAttendees = attendees.filter((attendee: Attendee) => attendee.event_id !== id);
  writeJsonFile(attendeesFile, filteredAttendees);
  
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  const filteredSponsors = sponsors.filter((sponsor: Sponsor) => sponsor.event_id !== id);
  writeJsonFile(sponsorsFile, filteredSponsors);
  
  return true;
};

// Attendee operations
export const createAttendee = (attendee: Omit<Attendee, 'id' | 'created_at' | 'updated_at'>): Attendee => {
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  const newAttendee: Attendee = {
    ...attendee,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  attendees.push(newAttendee);
  writeJsonFile(attendeesFile, attendees);
  
  return newAttendee;
};

export const getAttendees = (): Attendee[] => {
  return readJsonFile(attendeesFile);
};

export const getAttendeesByEventId = (eventId: string): Attendee[] => {
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  return attendees.filter((attendee: Attendee) => attendee.event_id === eventId);
};

export const getAttendeeById = (id: string): Attendee | null => {
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  return attendees.find((attendee: Attendee) => attendee.id === id) || null;
};

export const updateAttendee = (id: string, updates: Partial<Attendee>): Attendee | null => {
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  const attendeeIndex = attendees.findIndex((attendee: Attendee) => attendee.id === id);
  
  if (attendeeIndex === -1) return null;
  
  attendees[attendeeIndex] = {
    ...attendees[attendeeIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  writeJsonFile(attendeesFile, attendees);
  return attendees[attendeeIndex];
};

export const deleteAttendee = (id: string): boolean => {
  const attendees: Attendee[] = readJsonFile(attendeesFile);
  const attendeeIndex = attendees.findIndex((attendee: Attendee) => attendee.id === id);
  
  if (attendeeIndex === -1) return false;
  
  attendees.splice(attendeeIndex, 1);
  writeJsonFile(attendeesFile, attendees);
  
  return true;
};

// Sponsor operations
export const createSponsor = (sponsor: Omit<Sponsor, 'id' | 'created_at' | 'updated_at'>): Sponsor => {
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  const newSponsor: Sponsor = {
    ...sponsor,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  sponsors.push(newSponsor);
  writeJsonFile(sponsorsFile, sponsors);
  
  return newSponsor;
};

export const getSponsors = (): Sponsor[] => {
  return readJsonFile(sponsorsFile);
};

export const getSponsorsByEventId = (eventId: string): Sponsor[] => {
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  return sponsors.filter((sponsor: Sponsor) => sponsor.event_id === eventId);
};

export const getSponsorById = (id: string): Sponsor | null => {
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  return sponsors.find((sponsor: Sponsor) => sponsor.id === id) || null;
};

export const updateSponsor = (id: string, updates: Partial<Sponsor>): Sponsor | null => {
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  const sponsorIndex = sponsors.findIndex((sponsor: Sponsor) => sponsor.id === id);
  
  if (sponsorIndex === -1) return null;
  
  sponsors[sponsorIndex] = {
    ...sponsors[sponsorIndex],
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  writeJsonFile(sponsorsFile, sponsors);
  return sponsors[sponsorIndex];
};

export const deleteSponsor = (id: string): boolean => {
  const sponsors: Sponsor[] = readJsonFile(sponsorsFile);
  const sponsorIndex = sponsors.findIndex((sponsor: Sponsor) => sponsor.id === id);
  
  if (sponsorIndex === -1) return false;
  
  sponsors.splice(sponsorIndex, 1);
  writeJsonFile(sponsorsFile, sponsors);
  
  return true;
};

// Budget operations
export const getBudgets = (eventId?: string): Budget[] => {
  const budgets: Budget[] = readJsonFile(budgetsFile);
  if (eventId) {
    return budgets.filter((budget: Budget) => budget.event_id === eventId);
  }
  return budgets;
};

export const getBudgetById = (id: string): Budget | null => {
  const budgets: Budget[] = readJsonFile(budgetsFile);
  return budgets.find((budget: Budget) => budget.id === id) || null;
};

export const createBudget = (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>): Budget => {
  const budgets: Budget[] = readJsonFile(budgetsFile);
  const newBudget: Budget = {
    ...budget,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  budgets.push(newBudget);
  writeJsonFile(budgetsFile, budgets);
  return newBudget;
};

export const updateBudget = (id: string, budgetData: Partial<Budget>): Budget | null => {
  const budgets: Budget[] = readJsonFile(budgetsFile);
  const index = budgets.findIndex((budget: Budget) => budget.id === id);
  if (index === -1) return null;
  
  budgets[index] = {
    ...budgets[index],
    ...budgetData,
    updated_at: new Date().toISOString()
  };
  
  writeJsonFile(budgetsFile, budgets);
  return budgets[index];
};

export const deleteBudget = (id: string): boolean => {
  const budgets: Budget[] = readJsonFile(budgetsFile);
  const index = budgets.findIndex((budget: Budget) => budget.id === id);
  if (index === -1) return false;
  
  budgets.splice(index, 1);
  writeJsonFile(budgetsFile, budgets);
  return true;
};

// Task operations
export const getTasks = (eventId?: string): Task[] => {
  const tasks: Task[] = readJsonFile(tasksFile);
  if (eventId) {
    return tasks.filter((task: Task) => task.eventId === eventId);
  }
  return tasks;
};

export const getTaskById = (id: string): Task | null => {
  const tasks: Task[] = readJsonFile(tasksFile);
  return tasks.find((task: Task) => task.id === id) || null;
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const tasks: Task[] = readJsonFile(tasksFile);
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  writeJsonFile(tasksFile, tasks);
  return newTask;
};

export const updateTask = (id: string, taskData: Partial<Task>): Task | null => {
  const tasks: Task[] = readJsonFile(tasksFile);
  const index = tasks.findIndex((task: Task) => task.id === id);
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...taskData,
    updatedAt: new Date().toISOString()
  };
  
  writeJsonFile(tasksFile, tasks);
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const tasks: Task[] = readJsonFile(tasksFile);
  const index = tasks.findIndex((task: Task) => task.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  writeJsonFile(tasksFile, tasks);
  return true;
};