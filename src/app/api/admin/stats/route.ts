import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get basic counts
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'CUSTOMER' }),
      Order.find()
        .populate('userId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    // Calculate total revenue
    const orders = await Order.find({ status: { $in: ['DELIVERED', 'SHIPPED'] } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate monthly revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyOrders = await Order.find({
      status: { $in: ['DELIVERED', 'SHIPPED'] },
      createdAt: { $gte: thirtyDaysAgo }
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate additional KPIs
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = 2.8; // Mock data - would be calculated from analytics
    const returnRate = 5.8; // Mock data - would be calculated from returns
    const averageDeliveryTime = 3.2; // Mock data - would be calculated from delivery times
    const activeVisitors = 180; // Mock data - would be from analytics
    const lowStockProducts = await Product.countDocuments({ 
      quantity: { $lte: 5 },
      trackQuantity: true 
    });
    const pendingOrders = await Order.countDocuments({ status: 'PENDING' });

    // Mock alerts data
    const alerts = [
      {
        id: '1',
        type: 'warning',
        title: 'Düşük Stok Uyarısı',
        message: `${lowStockProducts} ürünün stoku kritik seviyede`,
        timestamp: '2 dakika önce'
      },
      {
        id: '2',
        type: 'error',
        title: 'Pazaryeri Sync Hatası',
        message: 'Trendyol entegrasyonunda 3 ürün senkronizasyon hatası',
        timestamp: '15 dakika önce'
      },
      {
        id: '3',
        type: 'info',
        title: 'Yeni Sipariş',
        message: 'Yeni sipariş alındı: #ORD-2024-001',
        timestamp: '1 saat önce'
      },
      {
        id: '4',
        type: 'success',
        title: 'Kargo Gönderildi',
        message: '15 sipariş kargo firmasına teslim edildi',
        timestamp: '2 saat önce'
      }
    ];

    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      customerName: order.userId 
        ? `${order.userId.firstName} ${order.userId.lastName}`
        : order.guestEmail || 'Misafir',
      total: order.total,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString(),
    }));

    const stats = {
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue,
      monthlyRevenue,
      conversionRate,
      averageOrderValue,
      returnRate,
      averageDeliveryTime,
      activeVisitors,
      lowStockProducts,
      pendingOrders,
      recentOrders: formattedRecentOrders,
      alerts,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}