import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Mock data for inventory summary
    const inventorySummary = {
      totalProducts: 1250,
      totalValue: 2850000,
      lowStockProducts: 45,
      outOfStockProducts: 12,
      totalMovements: 1250,
      pendingTransfers: 8,
      warehouses: [
        {
          id: '1',
          name: 'Ana Depo',
          code: 'MAIN',
          address: 'Sanayi Mahallesi, 123. Sokak No:45',
          city: 'İstanbul',
          country: 'Türkiye',
          isActive: true,
          totalProducts: 850,
          totalValue: 1950000,
          capacity: 10000,
          usedCapacity: 7500
        },
        {
          id: '2',
          name: 'Ankara Depo',
          code: 'ANK',
          address: 'Organize Sanayi Bölgesi, 2. Kısım',
          city: 'Ankara',
          country: 'Türkiye',
          isActive: true,
          totalProducts: 400,
          totalValue: 900000,
          capacity: 5000,
          usedCapacity: 3200
        },
        {
          id: '3',
          name: 'İzmir Depo',
          code: 'IZM',
          address: 'Atatürk Organize Sanayi Bölgesi',
          city: 'İzmir',
          country: 'Türkiye',
          isActive: true,
          totalProducts: 300,
          totalValue: 650000,
          capacity: 3000,
          usedCapacity: 2100
        },
        {
          id: '4',
          name: 'Bursa Depo',
          code: 'BUR',
          address: 'Nilüfer Organize Sanayi Bölgesi',
          city: 'Bursa',
          country: 'Türkiye',
          isActive: false,
          totalProducts: 0,
          totalValue: 0,
          capacity: 2000,
          usedCapacity: 0
        }
      ],
      recentMovements: [
        {
          id: '1',
          productId: 'prod1',
          productName: 'iPhone 15 Pro',
          productSku: 'IPH15P-256',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          type: 'OUT',
          quantity: -5,
          reason: 'Sipariş sevkiyatı',
          reference: 'ORD-2024-001',
          userId: 'user1',
          userName: 'Ahmet Yılmaz',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          productId: 'prod2',
          productName: 'Samsung Galaxy S24',
          productSku: 'SGS24-128',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          type: 'IN',
          quantity: 50,
          reason: 'Tedarikçi teslimatı',
          reference: 'SUP-2024-002',
          userId: 'user2',
          userName: 'Mehmet Demir',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          productId: 'prod3',
          productName: 'MacBook Air M3',
          productSku: 'MBA-M3-256',
          warehouseId: '2',
          warehouseName: 'Ankara Depo',
          type: 'TRANSFER',
          quantity: 10,
          reason: 'Depo transferi',
          reference: 'TRF-2024-003',
          userId: 'user1',
          userName: 'Ahmet Yılmaz',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          productId: 'prod4',
          productName: 'iPad Pro 12.9"',
          productSku: 'IPP-129-256',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          type: 'ADJUSTMENT',
          quantity: 2,
          reason: 'Envanter düzeltmesi',
          reference: 'ADJ-2024-004',
          userId: 'user3',
          userName: 'Ayşe Kaya',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '5',
          productId: 'prod5',
          productName: 'AirPods Pro 2',
          productSku: 'APP2-GEN2',
          warehouseId: '3',
          warehouseName: 'İzmir Depo',
          type: 'OUT',
          quantity: -15,
          reason: 'Sipariş sevkiyatı',
          reference: 'ORD-2024-005',
          userId: 'user2',
          userName: 'Mehmet Demir',
          createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '6',
          productId: 'prod6',
          productName: 'Apple Watch Series 9',
          productSku: 'AWS9-45MM',
          warehouseId: '2',
          warehouseName: 'Ankara Depo',
          type: 'IN',
          quantity: 25,
          reason: 'Tedarikçi teslimatı',
          reference: 'SUP-2024-006',
          userId: 'user1',
          userName: 'Ahmet Yılmaz',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '7',
          productId: 'prod7',
          productName: 'Sony WH-1000XM5',
          productSku: 'SONY-WH1000XM5',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          type: 'TRANSFER',
          quantity: 8,
          reason: 'Depo transferi',
          reference: 'TRF-2024-007',
          userId: 'user3',
          userName: 'Ayşe Kaya',
          createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '8',
          productId: 'prod8',
          productName: 'Dell XPS 13',
          productSku: 'DELL-XPS13-512',
          warehouseId: '3',
          warehouseName: 'İzmir Depo',
          type: 'OUT',
          quantity: -3,
          reason: 'Sipariş sevkiyatı',
          reference: 'ORD-2024-008',
          userId: 'user2',
          userName: 'Mehmet Demir',
          createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
        }
      ],
      stockAlerts: [
        {
          id: '1',
          productId: 'prod1',
          productName: 'iPhone 15 Pro',
          productSku: 'IPH15P-256',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          currentStock: 2,
          minStock: 10,
          maxStock: 100,
          suggestedReorder: 50,
          lastSaleDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 3.2,
          priority: 'CRITICAL'
        },
        {
          id: '2',
          productId: 'prod2',
          productName: 'Samsung Galaxy S24',
          productSku: 'SGS24-128',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          currentStock: 5,
          minStock: 15,
          maxStock: 80,
          suggestedReorder: 40,
          lastSaleDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 2.8,
          priority: 'HIGH'
        },
        {
          id: '3',
          productId: 'prod3',
          productName: 'MacBook Air M3',
          productSku: 'MBA-M3-256',
          warehouseId: '2',
          warehouseName: 'Ankara Depo',
          currentStock: 8,
          minStock: 12,
          maxStock: 50,
          suggestedReorder: 25,
          lastSaleDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 1.5,
          priority: 'MEDIUM'
        },
        {
          id: '4',
          productId: 'prod4',
          productName: 'iPad Pro 12.9"',
          productSku: 'IPP-129-256',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          currentStock: 15,
          minStock: 20,
          maxStock: 60,
          suggestedReorder: 30,
          lastSaleDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 2.1,
          priority: 'MEDIUM'
        },
        {
          id: '5',
          productId: 'prod5',
          productName: 'AirPods Pro 2',
          productSku: 'APP2-GEN2',
          warehouseId: '3',
          warehouseName: 'İzmir Depo',
          currentStock: 3,
          minStock: 8,
          maxStock: 40,
          suggestedReorder: 20,
          lastSaleDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 1.8,
          priority: 'HIGH'
        },
        {
          id: '6',
          productId: 'prod6',
          productName: 'Apple Watch Series 9',
          productSku: 'AWS9-45MM',
          warehouseId: '2',
          warehouseName: 'Ankara Depo',
          currentStock: 12,
          minStock: 15,
          maxStock: 35,
          suggestedReorder: 18,
          lastSaleDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 1.2,
          priority: 'LOW'
        },
        {
          id: '7',
          productId: 'prod7',
          productName: 'Sony WH-1000XM5',
          productSku: 'SONY-WH1000XM5',
          warehouseId: '1',
          warehouseName: 'Ana Depo',
          currentStock: 6,
          minStock: 10,
          maxStock: 30,
          suggestedReorder: 15,
          lastSaleDate: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 0.9,
          priority: 'MEDIUM'
        },
        {
          id: '8',
          productId: 'prod8',
          productName: 'Dell XPS 13',
          productSku: 'DELL-XPS13-512',
          warehouseId: '3',
          warehouseName: 'İzmir Depo',
          currentStock: 4,
          minStock: 6,
          maxStock: 25,
          suggestedReorder: 12,
          lastSaleDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
          salesVelocity: 0.7,
          priority: 'LOW'
        }
      ]
    };

    return NextResponse.json(inventorySummary);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
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
    
    // Create new stock movement
    // This would typically involve updating product quantities and creating movement records
    console.log('Creating stock movement:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Stock movement created successfully' 
    });
  } catch (error) {
    console.error('Error creating stock movement:', error);
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
    
    // Update stock movement or warehouse
    console.log('Updating inventory:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inventory updated successfully' 
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Delete stock movement or warehouse
    console.log('Deleting inventory item:', id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inventory item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
