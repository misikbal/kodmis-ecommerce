import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange');
    const paymentMethod = searchParams.get('paymentMethod');
    const totalRange = searchParams.get('totalRange');
    const search = searchParams.get('search');

    // Build filter object
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      filter.createdAt = { $gte: startDate };
    }
    
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }
    
    if (totalRange) {
      const [min, max] = totalRange.split('-').map(Number);
      if (max) {
        filter.total = { $gte: min, $lte: max };
      } else {
        filter.total = { $gte: min };
      }
    }
    
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { 'billingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'billingAddress.lastName': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format orders
    const formattedOrders = orders.map(order => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.userId 
        ? `${order.userId.firstName} ${order.userId.lastName}`
        : order.guestEmail || 'Misafir',
      customerEmail: order.userId?.email || order.guestEmail || '',
      customerPhone: order.userId?.phone || order.guestPhone || '',
      total: order.total,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      items: order.items.map(item => ({
        id: item._id?.toString() || '',
        productName: `Ürün ${item.productId}`, // Would be populated from Product model
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        image: undefined // Would be populated from Product model
      })),
      shippingAddress: {
        title: order.billingAddress?.title || '',
        firstName: order.billingAddress?.firstName || '',
        lastName: order.billingAddress?.lastName || '',
        address1: order.billingAddress?.address1 || '',
        address2: order.billingAddress?.address2 || '',
        city: order.billingAddress?.city || '',
        state: order.billingAddress?.state || '',
        postalCode: order.billingAddress?.postalCode || '',
        country: order.billingAddress?.country || '',
        phone: order.billingAddress?.phone || ''
      },
      billingAddress: order.billingAddress,
      paymentMethod: 'Kredi Kartı', // Mock data - would be from payment integration
      trackingNumber: order.trackingNumber,
      notes: order.notes,
      adminNotes: order.adminNotes,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    }));

    return NextResponse.json({
      orders: formattedOrders,
      total,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    
    // Create new order
    const order = new Order({
      ...body,
      orderNumber: `ORD-${Date.now()}`,
      status: 'PENDING'
    });
    
    await order.save();
    
    return NextResponse.json({ 
      success: true, 
      order: order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      order: order 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}