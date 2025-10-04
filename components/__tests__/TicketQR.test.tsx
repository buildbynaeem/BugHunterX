import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicketQR from '../TicketQR';
import { Ticket } from '@/lib/types';

// Mock the QRCode component
vi.mock('qrcode.react', () => ({
  default: ({ value, size }: { value: string; size: number }) => (
    <canvas data-testid="qr-code" data-value={value} data-size={size} />
  ),
}));

describe('TicketQR Component', () => {
  const mockTicket: Ticket = {
    id: 'ticket-123',
    eventId: 'event-456',
    attendeeId: 'attendee-789',
    seat: 'A-15',
    qrCode: 'QR_CODE_DATA_123',
    status: 'active',
    createdAt: new Date('2024-03-01T10:00:00'),
  };

  const defaultProps = {
    ticket: mockTicket,
    eventName: 'TechConf 2024',
    eventDate: new Date('2024-03-15T09:00:00'),
    eventLocation: 'San Francisco Convention Center',
  };

  it('renders ticket information correctly', () => {
    render(<TicketQR {...defaultProps} />);
    
    expect(screen.getByText('TechConf 2024')).toBeInTheDocument();
    expect(screen.getByText('San Francisco Convention Center')).toBeInTheDocument();
    expect(screen.getByText('ticket-123')).toBeInTheDocument();
    expect(screen.getByText('A-15')).toBeInTheDocument();
  });

  it('renders QR code with correct data', () => {
    render(<TicketQR {...defaultProps} />);
    
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('data-size', '200');
  });

  it('shows check-in button when not checked in', () => {
    const mockOnCheckIn = vi.fn();
    render(<TicketQR {...defaultProps} onCheckIn={mockOnCheckIn} />);
    
    const checkInButton = screen.getByText('Check In');
    expect(checkInButton).toBeInTheDocument();
    
    fireEvent.click(checkInButton);
    expect(mockOnCheckIn).toHaveBeenCalledTimes(1);
  });

  it('shows checked-in state when isCheckedIn is true', () => {
    render(<TicketQR {...defaultProps} isCheckedIn={true} />);
    
    expect(screen.getByText('Checked In Successfully!')).toBeInTheDocument();
    expect(screen.queryByText('Check In')).not.toBeInTheDocument();
  });

  it('handles download functionality', () => {
    // Mock canvas toDataURL
    const mockToDataURL = vi.fn().mockReturnValue('data:image/png;base64,test');
    HTMLCanvasElement.prototype.toDataURL = mockToDataURL;
    
    // Mock document.createElement and click
    const mockClick = vi.fn();
    const mockCreateElement = vi.fn().mockReturnValue({
      download: '',
      href: '',
      click: mockClick,
    });
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
    });

    render(<TicketQR {...defaultProps} />);
    
    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);
    
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockClick).toHaveBeenCalled();
  });

  it('handles share functionality', () => {
    // Mock navigator.share
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
    });

    render(<TicketQR {...defaultProps} />);
    
    const shareButton = screen.getByText('Share');
    fireEvent.click(shareButton);
    
    expect(mockShare).toHaveBeenCalledWith({
      title: 'My ticket for TechConf 2024',
      text: 'Check out my ticket for TechConf 2024',
      url: window.location.href,
    });
  });

  it('shows correct status badge', () => {
    render(<TicketQR {...defaultProps} />);
    
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('shows cancelled status when ticket is cancelled', () => {
    const cancelledTicket = { ...mockTicket, status: 'cancelled' as const };
    render(<TicketQR {...defaultProps} ticket={cancelledTicket} />);
    
    expect(screen.getByText('cancelled')).toBeInTheDocument();
  });
});

