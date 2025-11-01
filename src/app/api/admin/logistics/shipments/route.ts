import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Shipping from '@/lib/models/Shipping';
import ShippingCarrier from '@/lib/models/ShippingCarrier';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const carrierId = searchParams.get('carrierId');

    // Build query
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (carrierId) {
      query.carrierId = carrierId;
    }

    // Fetch shipments
    const shipments = await Shipping.find(query)
      .populate('orderId', 'orderNumber totalAmount')
      .populate('carrierId', 'name logo')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalShipments = await Shipping.countDocuments(query);

    // Transform data
    const transformedShipments = shipments.map((s: any) => ({
      id: s._id.toString(),
      orderId: s.orderId?._id.toString(),
      orderNumber: s.orderId?.orderNumber,
      carrierId: s.carrierId?._id.toString(),
      carrierName: s.carrierId?.name,
      carrierLogo: s.carrierId?.logo,
      trackingNumber: s.trackingNumber,
      status: s.status,
      shippingMethod: s.shippingMethod,
      weight: s.weight,
      dimensions: s.dimensions,
      shippingAddress: s.shippingAddress,
      cost: s.cost,
      estimatedDeliveryDate: s.estimatedDeliveryDate,
      actualDeliveryDate: s.actualDeliveryDate,
      notes: s.notes,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt
    }));

    // Calculate stats
    const stats = {
      totalShipments,
      pending: await Shipping.countDocuments({ status: 'PENDING' }),
      preparing: await Shipping.countDocuments({ status: 'PREPARING' }),
      inTransit: await Shipping.countDocuments({ status: 'IN_TRANSIT' }),
      delivered: await Shipping.countDocuments({ status: 'DELIVERED' }),
      returned: await Shipping.countDocuments({ status: 'RETURNED' })
    };

    return NextResponse.json({
      shipments: transformedShipments,
      stats,
      totalPages: Math.ceil(totalShipments / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

