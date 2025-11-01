import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Brand from '@/lib/models/Brand';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const brands = await Brand.find()
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Brands fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      slug,
      description,
      logo,
      bannerImage,
      website,
      isActive,
      country,
      foundedYear,
      sortOrder,
      seoTitle,
      seoDescription,
      seoKeywords,
      socialLinks
    } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand with this slug already exists' },
        { status: 400 }
      );
    }

    const brand = new Brand({
      name,
      slug,
      description,
      logo,
      bannerImage,
      website,
      isActive: isActive !== undefined ? isActive : true,
      country,
      foundedYear,
      sortOrder,
      seoTitle,
      seoDescription,
      seoKeywords,
      socialLinks
    });

    await brand.save();

    return NextResponse.json({
      success: true,
      brand
    });
  } catch (error: any) {
    console.error('Brand creation error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Brand with this name or slug already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const brand = await Brand.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      brand
    });
  } catch (error: any) {
    console.error('Brand update error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Brand deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}