import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import StockMovement from '@/lib/models/StockMovement';
import Product from '@/lib/models/Product';

// Don't export here, let Next.js handle it

// GET - Tüm stok hareketlerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const movements = await StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(100);

    // Populate product information
    const movementsWithProducts = await Promise.all(
      movements.map(async (movement) => {
        const product = await Product.findById(movement.productId).lean();
        return {
          id: movement._id.toString(),
          productId: movement.productId?.toString(),
          productName: product?.name || 'Bilinmeyen Ürün',
          sku: product?.sku || '',
          type: movement.type,
          quantity: movement.quantity,
          warehouse: movement.warehouse,
          reference: movement.reference,
          notes: movement.notes,
          createdBy: movement.createdBy,
          createdAt: movement.createdAt,
          previousStock: movement.previousStock,
          newStock: movement.newStock,
          imageUrl: product?.images?.[0]?.url
        };
      })
    );

    return NextResponse.json(movementsWithProducts);
  } catch (error) {
    console.error('Stock movements fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

// POST - Yeni stok hareketi oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId,
      type,
      quantity,
      warehouse,
      reference,
      notes
    } = body;

    if (!productId || !type || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get current stock
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const previousStock = product.quantity || 0;
    let newStock = previousStock;

    // Calculate new stock based on movement type
    if (type === 'in') {
      newStock = previousStock + quantity;
    } else if (type === 'out') {
      newStock = previousStock - quantity;
      if (newStock < 0) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        );
      }
    } else if (type === 'adjustment') {
      newStock = quantity;
    }

    // Update product stock
    await Product.findByIdAndUpdate(productId, {
      quantity: newStock
    });

    // Create movement record
    const movement = new StockMovement({
      productId,
      type,
      quantity,
      warehouse: warehouse || 'Ana Depo',
      reference: reference || '',
      notes: notes || '',
      createdBy: session.user?.name || 'Admin',
      previousStock,
      newStock
    });

    await movement.save();

    return NextResponse.json({
      success: true,
      movement
    });
  } catch (error) {
    console.error('Stock movement creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create stock movement' },
      { status: 500 }
    );
  }
}

