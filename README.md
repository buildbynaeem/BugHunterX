# Planora – Unified Event Management Hub

A complete, hackathon-ready UI scaffold for event management with React + TypeScript + Tailwind + Next.js app-router.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

## 📱 Demo Sequence

1. **Register Attendee** → Navigate to `/attendee` → View QR ticket, schedule
2. **Show QR** → Scan QR code (opens verification URL in new tab)
3. **Check-in** → Reflects in analytics
4. **Sponsor Analytics** → Navigate to `/sponsor` → View performance metrics

## 🏗️ Architecture

### Pages & Routes
- `/` - Landing page with role selection
- `/attendee` - Mobile-first attendee app
- `/sponsor` - Sponsor analytics panel

### Key Components
- **Sidebar** - Collapsible navigation with user profile
- **Kanban** - Drag-and-drop task management
- **TicketQR** - QR code generation with check-in functionality
- **ScheduleList** - Personalized session management
- **NotificationBanner** - Live updates with actions
- **SponsorMetrics** - Performance analytics with charts

### Data Management
- **useOrganizerData** - Centralized state management for organizers
- **AttendeeContext** - Session state for attendees
- **Mock Data** - Comprehensive seed data for all user types

## 🎨 Design System

### Colors
- Primary: Blue/Teal gradient (`#0ea5e9` to `#14b8a6`)
- Status: Green (success), Yellow (warning), Red (error)
- Neutral: Gray scale for text and backgrounds

### Components
- **shadcn/ui** base components with custom styling
- **Framer Motion** for smooth animations
- **Tailwind CSS** for responsive design
- **Mobile-first** approach for attendee interface

## 🔌 Integration Points

### Google Calendar Sync
```typescript
// Placeholder in ScheduleList component
const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
```

### QR Verification API
```typescript
// Mock endpoint in TicketQR component
const qrData = JSON.stringify({
  ticketId: ticket.id,
  eventId: ticket.eventId,
  timestamp: Date.now(),
});
```

### Google Maps Integration
```typescript
// Placeholder for venue location
<iframe
  src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${eventLocation}`}
  width="100%" height="200"
/>
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Example test for TicketQR component
npm test TicketQR
```

## 📦 Dependencies

### Core
- **Next.js 14** - App router with TypeScript
- **React 18** - Hooks and context
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations

### UI Components
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon system
- **@dnd-kit** - Drag and drop functionality

### Data & Utils
- **qrcode.react** - QR code generation
- **recharts** - Data visualization
- **class-variance-authority** - Component variants

## 🔧 Development Notes

### API Integration Points
1. **QR Verification** - Replace mock check-in with real API endpoint
2. **Calendar Sync** - Implement OAuth flow for Google Calendar
3. **Maps Integration** - Add Google Maps API key for venue locations
4. **Real-time Updates** - WebSocket connection for live notifications

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_QR_VERIFICATION_URL=https://api.oneflow.com/verify
NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID=your_client_id
```

### Production Considerations
- Add error boundaries for component failures
- Implement proper loading states
- Add authentication middleware
- Set up analytics tracking
- Configure CDN for static assets

## 🎯 Hackathon Focus

This scaffold prioritizes:
- **Rapid Development** - Drop-in components ready for customization
- **Mobile-First** - Responsive design for all screen sizes
- **Production-Ready** - TypeScript types and error handling
- **Integration-Ready** - Clear API integration points
- **Demo-Friendly** - Mock data and interactive flows

## 📄 License

Built for hackathon demonstration. Ready for production deployment with proper API integrations.

