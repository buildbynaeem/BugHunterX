import { NextRequest, NextResponse } from 'next/server';
import { createSponsor, getSponsors, getSponsorsByEventId, updateSponsor, deleteSponsor, getSponsorById } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    let sponsors;
    if (eventId) {
      sponsors = getSponsorsByEventId(eventId);
    } else {
      sponsors = getSponsors();
    }
    
    return NextResponse.json(sponsors);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sponsor = createSponsor(body);
    return NextResponse.json(sponsor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sponsor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 });
    }
    
    const sponsor = updateSponsor(id, updates);
    if (!sponsor) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }
    
    return NextResponse.json(sponsor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 });
    }
    
    const success = deleteSponsor(id);
    if (!success) {
      return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
