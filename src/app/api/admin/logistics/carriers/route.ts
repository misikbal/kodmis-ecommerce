import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import ShippingCarrier from '@/lib/models/ShippingCarrier';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if carriers exist, if not create sample data
    const carrierCount = await ShippingCarrier.countDocuments();
    
    if (carrierCount === 0) {
      const sampleCarriers = [
        {
          name: 'Yurtiçi Kargo',
          slug: 'yurtici-kargo',
          logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop',
          website: 'https://yurticikargo.com',
          isActive: true,
          supportedServices: [
            { name: 'Standart Kargo', code: 'STANDARD', description: 'Standart teslimat' },
            { name: 'Hızlı Kargo', code: 'EXPRESS', description: 'Hızlı teslimat' }
          ],
          pricing: {
            weightUnit: 'KG',
            dimensionUnit: 'CM',
            basePrice: 25,
            pricePerKg: 3,
            minimumPrice: 25
          },
          settings: {
            allowCod: true,
            allowInsurance: true,
            allowPickup: false,
            autoTracking: true
          },
          integrationStatus: 'CONNECTED',
          lastSyncDate: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          name: 'MNG Kargo',
          slug: 'mng-kargo',
          logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
          website: 'https://mngkargo.com.tr',
          isActive: true,
          supportedServices: [
            { name: 'Standart Kargo', code: 'STANDARD', description: 'Standart teslimat' }
          ],
          pricing: {
            weightUnit: 'KG',
            dimensionUnit: 'CM',
            basePrice: 503,
            pricePerKg: 4,
            minimumPrice: 30
          },
          settings: {
            allowCod: true,
            allowInsurance: true,
            allowPickup: true,
            autoTracking: true
          },
          integrationStatus: 'CONNECTED',
          lastSyncDate: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          name: 'Aras Kargo',
          slug: 'aras-kargo',
          logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
          website: 'https://araskargo.com.tr',
          isActive: true,
          supportedServices: [
            { name: 'Standart Kargo', code: 'STANDARD', description: 'Standart teslimat' },
            { name: 'Kurumsal Kargo', code: 'CORPORATE', description: 'Kurumsal teslimat' }
          ],
          pricing: {
            weightUnit: 'KG',
            dimensionUnit: 'CM',
            basePrice: 28,
            pricePerKg: 3.5,
            minimumPrice: 28
          },
          settings: {
            allowCod: true,
            allowInsurance: true,
            allowPickup: false,
            autoTracking: true
          },
          integrationStatus: 'CONNECTED'
        }
      ];

      await ShippingCarrier.insertMany(sampleCarriers);
    }

    const carriers = await ShippingCarrier.find({}).sort({ createdAt: -1 }).lean();

    const transformedCarriers = carriers.map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      logo: c.logo,
      website: c.website,
      isActive: c.isActive,
      supportedServices: c.supportedServices,
      pricing: c.pricing,
      settings: c.settings,
      integrationStatus: c.integrationStatus,
      lastSyncDate: c.lastSyncDate,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    }));

    const stats = {
      totalCarriers: carriers.length,
      activeCarriers: carriers.filter(c => c.isActive).length,
      connectedCarriers: carriers.filter(c => c.integrationStatus === 'CONNECTED').length
    };

    return NextResponse.json({
      carriers: transformedCarriers,
      stats
    });
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { name, slug, logo, website, apiKey, apiSecret, apiEndpoint, supportedServices, pricing, settings } = body;
    
    if (!name || !slug || !logo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if carrier already exists
    const existing = await ShippingCarrier.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'Carrier already exists' },
        { status: 400 }
      );
    }

    // Create new carrier
    const carrier = new ShippingCarrier({
      name,
      slug,
      logo,
      website,
      apiKey: apiKey || '',
      apiSecret: apiSecret || '',
      apiEndpoint: apiEndpoint || '',
      supportedServices: supportedServices || [],
      pricing: pricing || {
        weightUnit: 'KG',
        dimensionUnit: 'CM',
        basePrice: 0,
        pricePerKg: 0,
        minimumPrice: 0
      },
      settings: settings || {
        allowCod: false,
        allowInsurance: false,
        allowPickup: false,
        autoTracking: false
      },
      isActive: apiKey ? true : false,
      integrationStatus: apiKey ? 'CONNECTED' : 'DISCONNECTED'
    });

    await carrier.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Carrier created successfully',
      carrier 
    });
  } catch (error) {
    console.error('Error creating carrier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

