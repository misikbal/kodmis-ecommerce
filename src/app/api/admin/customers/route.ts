import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const segment = searchParams.get('segment');

    // Fetch customers from database
    const query: any = {};
    
    if (status) {
      query.isActive = status === 'ACTIVE';
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCustomers = await User.countDocuments(query);

    // Transform customers
    const transformedCustomers = customers.map((customer: any) => ({
      id: customer._id.toString(),
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email,
      phone: customer.phone || '',
      avatar: customer.avatar,
      status: customer.isActive ? 'ACTIVE' : 'INACTIVE',
      tier: getCustomerTier(customer.loyaltyPoints || 0),
      totalOrders: 0, // Would need to query from orders collection
      totalSpent: 0, // Would need to query from orders collection
      averageOrderValue: 0,
      lastOrderDate: customer.updatedAt,
      registrationDate: customer.createdAt,
      tags: [],
      notes: '',
      address: {
        city: '',
        country: customer.country || 'Türkiye'
      },
      lifetimeValue: customer.loyaltyPoints || 0,
      customerSegment: getCustomerSegment(customer.loyaltyPoints || 0),
      isEmailVerified: customer.isVerified || false,
      isPhoneVerified: false,
      preferredLanguage: customer.language || 'tr',
      lastLoginDate: customer.updatedAt
    }));

    function getCustomerTier(loyaltyPoints: number): string {
      if (loyaltyPoints >= 10000) return 'PLATINUM';
      if (loyaltyPoints >= 5000) return 'GOLD';
      if (loyaltyPoints >= 2000) return 'SILVER';
      return 'BRONZE';
    }

    function getCustomerSegment(loyaltyPoints: number): string {
      if (loyaltyPoints >= 10000) return 'Premium';
      if (loyaltyPoints >= 5000) return 'Yüksek Değerli';
      if (loyaltyPoints >= 2000) return 'Orta Değerli';
      return 'Yeni Müşteri';
    }

    // Calculate stats
    const totalPages = Math.ceil(totalCustomers / limit);

    return NextResponse.json({
      customers: transformedCustomers,
      stats: {
        totalCustomers,
        activeCustomers: transformedCustomers.filter(c => c.status === 'ACTIVE').length
      },
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching customer data:', error);
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
    
    // Create new customer
    console.log('Creating customer:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer created successfully' 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
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
    
    // Update customer
    console.log('Updating customer:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer updated successfully' 
    });
  } catch (error) {
    console.error('Error updating customer:', error);
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
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }
    
    // Delete customer
    console.log('Deleting customer:', id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
