import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Feature from '@/lib/models/Feature';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const features = await Feature.find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, isRequired, isFilterable, isSearchable, options, unit, minValue, maxValue, defaultValue, isActive, sortOrder } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    await connectDB();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const feature = new Feature({
      name,
      slug,
      description,
      type,
      isRequired: isRequired || false,
      isFilterable: isFilterable !== false,
      isSearchable: isSearchable || false,
      options: options || [],
      unit,
      minValue,
      maxValue,
      defaultValue,
      isActive: isActive !== false,
      sortOrder: sortOrder || 0,
      productCount: 0,
    });

    await feature.save();

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
