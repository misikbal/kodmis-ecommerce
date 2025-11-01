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
    
    const products = await Product.find({})
      .populate('categoryId', 'name slug icon color')
      .sort({ createdAt: -1 })
      .lean();
    
    // Manually populate brandId for products that have it
    const brandIds = products
      .filter(p => p.brandId && typeof p.brandId === 'object')
      .map(p => (p.brandId as any)?._id || p.brandId);
    
    if (brandIds.length > 0) {
      const brands = await Brand.find({ _id: { $in: brandIds } }).lean();
      const brandMap = new Map(brands.map(b => [b._id.toString(), b]));
      
      products.forEach((product: any) => {
        if (product.brandId) {
          const brandId = typeof product.brandId === 'object' ? product.brandId._id : product.brandId;
          product.brandId = brandMap.get(brandId?.toString());
        }
      });
    }

    return NextResponse.json(products);
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