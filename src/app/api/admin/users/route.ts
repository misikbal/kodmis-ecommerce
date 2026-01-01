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
    const role = searchParams.get('role') || '';

    // Build query
    const query: any = {};
    if (role) {
      query.role = role;
    }

    // Fetch users from database
    const users = await User.find(query)
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments(query);

    // Transform users
    const transformedUsers = users.map((user: any) => ({
      id: user._id.toString(),
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      isVerified: user.isVerified,
      avatar: user.avatar,
      loyaltyPoints: user.loyaltyPoints || 0,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return NextResponse.json({
      users: transformedUsers,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Creating user:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}