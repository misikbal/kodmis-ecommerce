import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CustomerSegment from '@/lib/models/CustomerSegment';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    const segment = await CustomerSegment.findById(resolvedParams.id);
    
    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    return NextResponse.json(segment);
  } catch (error) {
    console.error('Error fetching customer segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    const body = await request.json();
    
    const segment = await CustomerSegment.findByIdAndUpdate(
      resolvedParams.id,
      body,
      { new: true }
    );
    
    if (!segment) {
      return NextResponse.json({ error: 'Segment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, segment });
  } catch (error) {
    console.error('Error updating customer segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    await CustomerSegment.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


