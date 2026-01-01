import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { id: marketplaceId } = await params;
    const body = await request.json();
    const { type = 'PRODUCT' } = body; // PRODUCT, STOCK, ORDER, PRICE
    
    // Mock sync process
    console.log(`Starting sync for marketplace ${marketplaceId}, type: ${type}`);
    
    // Simulate sync process
    const syncResult = {
      id: `sync_${Date.now()}`,
      marketplaceId,
      type,
      status: 'SUCCESS',
      itemsProcessed: Math.floor(Math.random() * 200) + 50,
      itemsSuccessful: Math.floor(Math.random() * 180) + 45,
      itemsFailed: Math.floor(Math.random() * 5),
      startedAt: new Date().toISOString(),
      completedAt: new Date(Date.now() + 5000).toISOString(),
      duration: 5
    };
    
    // Add some random errors for demo
    if (Math.random() < 0.2) {
      syncResult.status = 'ERROR';
      syncResult.itemsFailed = Math.floor(Math.random() * 10) + 1;
      syncResult.itemsSuccessful = syncResult.itemsProcessed - syncResult.itemsFailed;
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      result: syncResult
    });
  } catch (error) {
    console.error('Error syncing marketplace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
    
    const { id: marketplaceId } = await params;
    
    // Mock sync status
    const syncStatus = {
      marketplaceId,
      isRunning: Math.random() < 0.1, // 10% chance of running
      lastSync: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      nextSync: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      progress: Math.floor(Math.random() * 100)
    };
    
    return NextResponse.json(syncStatus);
  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
