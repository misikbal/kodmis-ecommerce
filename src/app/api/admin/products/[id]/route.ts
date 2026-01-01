import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// GET - Tek ürün getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug icon color')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Ürün güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    
    // Debug: Log the full body received
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    const {
      name,
      slug,
      description,
      content,
      price,
      comparePrice,
      costPrice,
      sku,
      barcode,
      quantity,
      lowStockThreshold,
      status,
      type,
      brandId,
      images,
      categories,
      tags,
      variants,
      seoTitle,
      seoDescription,
      seoKeywords,
      weight,
      dimensions,
      technicalSpecs,
      shipping,
      faqs,
      videos,
      warranty,
      returnPolicy,
      relatedProducts
    } = body;

    // Validation
    if (!name || !slug || !sku || price <= 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if SKU is unique (excluding current product)
    const existingProduct = await Product.findOne({ 
      sku, 
      _id: { $ne: id } 
    });
    
    if (existingProduct) {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      slug,
      description,
      content,
      price,
      comparePrice,
      costPrice,
      sku,
      barcode,
      quantity,
      lowStockAlert: lowStockThreshold,
      status,
      type,
      images: images || [],
      tags: tags || [],
      variants: variants || [],
      seoTitle,
      seoDescription,
      seoKeywords,
      weight,
      dimensions: dimensions || {},
      technicalSpecs: technicalSpecs || [],
      shipping: shipping || {},
      faqs: faqs || [],
      videos: videos || [],
      warranty: warranty || {},
      returnPolicy: returnPolicy || {},
      relatedProducts: relatedProducts || [],
      updatedAt: new Date()
    };

    // Set categoryId from categories array
    if (categories && categories.length > 0) {
      updateData.categoryId = categories[0];
    }

    // Set brandId if provided
    if (brandId) {
      updateData.brandId = brandId;
    } else {
      // Remove brandId if it's set to empty or null
      updateData.brandId = null;
    }

    // Set hasVariants based on variants
    updateData.hasVariants = variants && variants.length > 0;

    // Debug: Log the update data
    console.log('Updating product with data:', JSON.stringify(updateData, null, 2));

    // Clean updateData to only include defined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Manually populate brandId and categoryId
    if (updatedProduct.brandId) {
      const Brand = (await import('@/lib/models/Brand')).default;
      const brand = await Brand.findById(updatedProduct.brandId).lean();
      updatedProduct.brandId = brand;
    }

    if (updatedProduct.categoryId) {
      const Category = (await import('@/lib/models/Category')).default;
      const category = await Category.findById(updatedProduct.categoryId).lean();
      if (category) {
        updatedProduct.categoryId = category;
      }
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Ürün sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}