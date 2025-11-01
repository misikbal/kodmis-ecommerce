import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import StockMovement from '@/lib/models/StockMovement';
import Product from '@/lib/models/Product';

// GET - Tek bir hareketi getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const movement = await StockMovement.findById(resolvedParams.id);
    if (!movement) {
      return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
    }

    const product = await Product.findById(movement.productId).lean();
    
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Stock movement fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movement' },
      { status: 500 }
    );
  }
}

// PUT - Hareketi güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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

    await connectDB();

    const movement = await StockMovement.findById(resolvedParams.id);
    if (!movement) {
      return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
    }

    // Update movement
    movement.type = type || movement.type;
    movement.quantity = quantity || movement.quantity;
    movement.warehouse = warehouse || movement.warehouse;
    movement.reference = reference || movement.reference;
    movement.notes = notes || movement.notes;

    await movement.save();

    return NextResponse.json({
      success: true,
      movement
    });
  } catch (error) {
    console.error('Stock movement update error:', error);
    return NextResponse.json(
      { error: 'Failed to update stock movement' },
      { status: 500 }
    );
  }
}

// DELETE - Hareketi sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const movement = await StockMovement.findByIdAndDelete(resolvedParams.id);
    if (!movement) {
      return NextResponse.json({ error: 'Movement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Movement deleted successfully'
    });
  } catch (error) {
    console.error('Stock movement deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete stock movement' },
      { status: 500 }
    );
  }
}

