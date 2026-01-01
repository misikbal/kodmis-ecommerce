import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Brand from '@/lib/models/Brand';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const stockStatus = searchParams.get('stockStatus') || '';
    const featured = searchParams.get('featured') || '';

    // Build query
    const query: any = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category) {
      query.categoryId = category;
    }

    // Brand filter
    if (brand) {
      query.brandId = brand;
    }

    // Stock status filter
    if (stockStatus === 'in_stock') {
      query.quantity = { $gt: 0 };
    } else if (stockStatus === 'out_of_stock') {
      query.quantity = { $lte: 0 };
    } else if (stockStatus === 'low_stock') {
      query.quantity = { $lte: 5, $gt: 0 };
    }

    // Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    } else if (featured === 'false') {
      query.isFeatured = false;
    }

    // Get total count
    const total = await Product.countDocuments(query);

    // Get products with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .populate('brandId', 'name slug logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format products for frontend
    const formattedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      sku: product.sku || '',
      price: product.price,
      comparePrice: product.comparePrice,
      costPrice: product.costPrice,
      quantity: product.quantity || 0,
      status: product.status,
      type: product.type,
      images: product.images || [],
      category: product.categoryId ? {
        id: product.categoryId._id?.toString() || product.categoryId.toString(),
        name: product.categoryId.name || '',
        slug: product.categoryId.slug || '',
      } : null,
      brand: product.brandId ? {
        id: product.brandId._id?.toString() || product.brandId.toString(),
        name: product.brandId.name || '',
        slug: product.brandId.slug || '',
        logo: product.brandId.logo || '',
      } : null,
      isFeatured: product.isFeatured || false,
      isBestseller: product.isBestseller || false,
      isNew: product.isNew || false,
      viewCount: product.viewCount || 0,
      salesCount: product.salesCount || 0,
      hasVariants: product.hasVariants || false,
      variants: product.variants || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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
    const { 
      name, 
      description, 
      content, 
      type, 
      status, 
      price, 
      comparePrice, 
      costPrice, 
      sku, 
      trackQuantity, 
      quantity, 
      lowStockAlert, 
      weight, 
      dimensions, 
      downloadUrl, 
      downloadLimit, 
      images, 
      categoryId,
      categories, // Yeni: Çoklu kategori desteği
      brandId, // Marka ID
      hasVariants, 
      variants, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      tags, 
      isFeatured, 
      isBestseller, 
      isNew 
    } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    await connectDB();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = new Product({
      name,
      slug,
      description,
      content,
      type: type || 'PHYSICAL',
      status: status || 'DRAFT',
      price,
      comparePrice,
      costPrice,
      sku,
      trackQuantity: trackQuantity !== false,
      quantity: quantity || 0,
      lowStockAlert: lowStockAlert || 5,
      weight,
      dimensions,
      downloadUrl,
      downloadLimit,
      images: images || [],
      // Eğer categories array'i varsa ilkini categoryId olarak kullan
      categoryId: (categories && categories.length > 0) ? categories[0] : (categoryId || null),
      brandId: brandId || null,
      hasVariants: hasVariants || (variants && variants.length > 0) || false,
      variants: variants || [],
      seoTitle,
      seoDescription,
      seoKeywords,
      tags: tags || [],
      isFeatured: isFeatured || false,
      isBestseller: isBestseller || false,
      isNew: isNew || false,
      viewCount: 0,
      salesCount: 0,
    });

    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}