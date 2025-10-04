import { NextRequest, NextResponse } from 'next/server';
import { createAttendee, getAttendees, getAttendeesByEventId, updateAttendee, deleteAttendee, getAttendeeById } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    let attendees;
    if (eventId) {
      attendees = getAttendeesByEventId(eventId);
    } else {
      attendees = getAttendees();
    }
    
    return NextResponse.json(attendees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const attendee = createAttendee(body);
    return NextResponse.json(attendee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create attendee' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
    }
    
    const attendee = updateAttendee(id, updates);
    if (!attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }
    
    return NextResponse.json(attendee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update attendee' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Attendee ID is required' }, { status: 400 });
    }
    
    const success = deleteAttendee(id);
    if (!success) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete attendee' }, { status: 500 });
  }
}
