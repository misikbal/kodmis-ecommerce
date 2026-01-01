import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ShippingCarrier, { IShippingCarrier } from '@/lib/models/ShippingCarrier';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    const carrier = await ShippingCarrier.findById(resolvedParams.id).lean() as IShippingCarrier | null;

    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }

    return NextResponse.json({
      carrier: {
        id: carrier._id.toString(),
        name: carrier.name,
        slug: carrier.slug,
        logo: carrier.logo,
        website: carrier.website,
        isActive: carrier.isActive,
        supportedServices: carrier.supportedServices,
        pricing: carrier.pricing,
        settings: carrier.settings,
        integrationStatus: carrier.integrationStatus,
        lastSyncDate: carrier.lastSyncDate,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching carrier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    const body = await request.json();
    const { name, slug, logo, website, apiKey, apiSecret, apiEndpoint, supportedServices, pricing, settings, isActive } = body;

    // Build update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (logo !== undefined) updateData.logo = logo;
    if (website !== undefined) updateData.website = website;
    if (apiKey !== undefined && apiKey !== '') updateData.apiKey = apiKey;
    if (apiSecret !== undefined && apiSecret !== '') updateData.apiSecret = apiSecret;
    if (apiEndpoint !== undefined && apiEndpoint !== '') updateData.apiEndpoint = apiEndpoint;
    if (supportedServices !== undefined) updateData.supportedServices = supportedServices;
    if (pricing !== undefined) updateData.pricing = pricing;
    if (settings !== undefined) updateData.settings = settings;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update integration status if API key is provided
    if (apiKey !== undefined && apiKey !== '') {
      updateData.integrationStatus = 'CONNECTED';
      updateData.isActive = true;
    }

    const carrier = await ShippingCarrier.findByIdAndUpdate(
      resolvedParams.id,
      { $set: updateData },
      { new: true }
    ).lean() as IShippingCarrier | null;

    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Carrier updated successfully',
      carrier: {
        id: carrier._id.toString(),
        name: carrier.name,
        slug: carrier.slug,
        logo: carrier.logo,
        website: carrier.website,
        isActive: carrier.isActive,
        supportedServices: carrier.supportedServices,
        pricing: carrier.pricing,
        settings: carrier.settings,
        integrationStatus: carrier.integrationStatus,
        lastSyncDate: carrier.lastSyncDate,
        createdAt: carrier.createdAt,
        updatedAt: carrier.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating carrier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const resolvedParams = await params;
    const carrier = await ShippingCarrier.findByIdAndDelete(resolvedParams.id);

    if (!carrier) {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Carrier deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting carrier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

