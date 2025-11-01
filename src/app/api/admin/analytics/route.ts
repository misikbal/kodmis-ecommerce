import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock data for analytics
    const trafficData = [
      {
        date: '2024-12-01',
        visitors: 1250,
        pageViews: 3200,
        sessions: 1100,
        bounceRate: 45.2,
        avgSessionDuration: 3.5
      },
      {
        date: '2024-12-02',
        visitors: 1380,
        pageViews: 3500,
        sessions: 1200,
        bounceRate: 42.8,
        avgSessionDuration: 3.8
      },
      {
        date: '2024-12-03',
        visitors: 1150,
        pageViews: 2900,
        sessions: 1000,
        bounceRate: 48.1,
        avgSessionDuration: 3.2
      },
      {
        date: '2024-12-04',
        visitors: 1420,
        pageViews: 3800,
        sessions: 1250,
        bounceRate: 41.5,
        avgSessionDuration: 4.1
      },
      {
        date: '2024-12-05',
        visitors: 1600,
        pageViews: 4200,
        sessions: 1400,
        bounceRate: 39.8,
        avgSessionDuration: 4.3
      }
    ];

    const conversionData = [
      {
        date: '2024-12-01',
        visitors: 1250,
        addToCart: 180,
        checkout: 95,
        purchases: 72,
        conversionRate: 5.76,
        cartAbandonmentRate: 47.2
      },
      {
        date: '2024-12-02',
        visitors: 1380,
        addToCart: 195,
        checkout: 105,
        purchases: 82,
        conversionRate: 5.94,
        cartAbandonmentRate: 45.8
      },
      {
        date: '2024-12-03',
        visitors: 1150,
        addToCart: 165,
        checkout: 88,
        purchases: 68,
        conversionRate: 5.91,
        cartAbandonmentRate: 46.7
      },
      {
        date: '2024-12-04',
        visitors: 1420,
        addToCart: 210,
        checkout: 115,
        purchases: 89,
        conversionRate: 6.27,
        cartAbandonmentRate: 44.3
      },
      {
        date: '2024-12-05',
        visitors: 1600,
        addToCart: 235,
        checkout: 130,
        purchases: 98,
        conversionRate: 6.13,
        cartAbandonmentRate: 45.1
      }
    ];

    const cohortData = [
      {
        cohort: '2024-11',
        period: 0,
        users: 1200,
        retention: 100,
        revenue: 45000
      },
      {
        cohort: '2024-11',
        period: 1,
        users: 850,
        retention: 70.8,
        revenue: 32000
      },
      {
        cohort: '2024-10',
        period: 0,
        users: 980,
        retention: 100,
        revenue: 38000
      },
      {
        cohort: '2024-10',
        period: 1,
        users: 720,
        retention: 73.5,
        revenue: 28000
      },
      {
        cohort: '2024-10',
        period: 2,
        users: 540,
        retention: 55.1,
        revenue: 21000
      },
      {
        cohort: '2024-09',
        period: 0,
        users: 1100,
        retention: 100,
        revenue: 42000
      },
      {
        cohort: '2024-09',
        period: 1,
        users: 780,
        retention: 70.9,
        revenue: 30000
      },
      {
        cohort: '2024-09',
        period: 2,
        users: 590,
        retention: 53.6,
        revenue: 23000
      },
      {
        cohort: '2024-09',
        period: 3,
        users: 450,
        retention: 40.9,
        revenue: 18000
      }
    ];

    const topProducts = [
      {
        productId: 'PROD-001',
        productName: 'Samsung Galaxy S24',
        views: 2500,
        addToCart: 180,
        purchases: 45,
        revenue: 45000,
        conversionRate: 1.8,
        category: 'Telefon'
      },
      {
        productId: 'PROD-002',
        productName: 'iPhone 15 Pro',
        views: 2200,
        addToCart: 165,
        purchases: 38,
        revenue: 38000,
        conversionRate: 1.73,
        category: 'Telefon'
      },
      {
        productId: 'PROD-003',
        productName: 'MacBook Pro M3',
        views: 1800,
        addToCart: 120,
        purchases: 25,
        revenue: 30000,
        conversionRate: 1.39,
        category: 'Laptop'
      },
      {
        productId: 'PROD-004',
        productName: 'iPad Air',
        views: 1600,
        addToCart: 95,
        purchases: 22,
        revenue: 17600,
        conversionRate: 1.38,
        category: 'Tablet'
      },
      {
        productId: 'PROD-005',
        productName: 'AirPods Pro',
        views: 1400,
        addToCart: 85,
        purchases: 35,
        revenue: 14000,
        conversionRate: 2.5,
        category: 'Aksesuar'
      },
      {
        productId: 'PROD-006',
        productName: 'Sony WH-1000XM5',
        views: 1200,
        addToCart: 75,
        purchases: 28,
        revenue: 11200,
        conversionRate: 2.33,
        category: 'Aksesuar'
      },
      {
        productId: 'PROD-007',
        productName: 'Dell XPS 13',
        views: 1000,
        addToCart: 60,
        purchases: 15,
        revenue: 15000,
        conversionRate: 1.5,
        category: 'Laptop'
      },
      {
        productId: 'PROD-008',
        productName: 'Samsung Galaxy Tab S9',
        views: 900,
        addToCart: 55,
        purchases: 18,
        revenue: 14400,
        conversionRate: 2.0,
        category: 'Tablet'
      }
    ];

    const topCategories = [
      {
        category: 'Telefon',
        views: 8500,
        revenue: 125000,
        orders: 180
      },
      {
        category: 'Laptop',
        views: 4200,
        revenue: 78000,
        orders: 65
      },
      {
        category: 'Tablet',
        views: 3800,
        revenue: 45000,
        orders: 55
      },
      {
        category: 'Aksesuar',
        views: 5200,
        revenue: 35000,
        orders: 120
      },
      {
        category: 'Kulaklık',
        views: 2800,
        revenue: 25000,
        orders: 85
      }
    ];

    const trafficSources = [
      {
        source: 'Google',
        visitors: 4500,
        percentage: 35.2,
        conversionRate: 6.8
      },
      {
        source: 'Facebook',
        visitors: 2800,
        percentage: 21.9,
        conversionRate: 5.2
      },
      {
        source: 'Instagram',
        visitors: 2200,
        percentage: 17.2,
        conversionRate: 4.8
      },
      {
        source: 'Direct',
        visitors: 1800,
        percentage: 14.1,
        conversionRate: 8.5
      },
      {
        source: 'Email',
        visitors: 1200,
        percentage: 9.4,
        conversionRate: 12.3
      },
      {
        source: 'Referral',
        visitors: 300,
        percentage: 2.3,
        conversionRate: 3.2
      }
    ];

    const deviceBreakdown = [
      {
        device: 'Mobile',
        visitors: 7200,
        percentage: 56.3
      },
      {
        device: 'Desktop',
        visitors: 4500,
        percentage: 35.2
      },
      {
        device: 'Tablet',
        visitors: 1100,
        percentage: 8.6
      }
    ];

    const geographicData = [
      {
        country: 'Türkiye',
        visitors: 9500,
        revenue: 180000,
        percentage: 74.2
      },
      {
        country: 'Almanya',
        visitors: 1200,
        revenue: 25000,
        percentage: 9.4
      },
      {
        country: 'Fransa',
        visitors: 800,
        revenue: 18000,
        percentage: 6.3
      },
      {
        country: 'İngiltere',
        visitors: 600,
        revenue: 15000,
        percentage: 4.7
      },
      {
        country: 'Hollanda',
        visitors: 400,
        revenue: 8000,
        percentage: 3.1
      },
      {
        country: 'Diğer',
        visitors: 300,
        revenue: 6000,
        percentage: 2.3
      }
    ];

    const hourlyTraffic = [
      { hour: 0, visitors: 45, conversions: 2 },
      { hour: 1, visitors: 32, conversions: 1 },
      { hour: 2, visitors: 28, conversions: 1 },
      { hour: 3, visitors: 25, conversions: 0 },
      { hour: 4, visitors: 30, conversions: 1 },
      { hour: 5, visitors: 35, conversions: 1 },
      { hour: 6, visitors: 55, conversions: 2 },
      { hour: 7, visitors: 85, conversions: 3 },
      { hour: 8, visitors: 120, conversions: 5 },
      { hour: 9, visitors: 150, conversions: 7 },
      { hour: 10, visitors: 180, conversions: 9 },
      { hour: 11, visitors: 200, conversions: 10 },
      { hour: 12, visitors: 220, conversions: 12 },
      { hour: 13, visitors: 210, conversions: 11 },
      { hour: 14, visitors: 195, conversions: 10 },
      { hour: 15, visitors: 185, conversions: 9 },
      { hour: 16, visitors: 175, conversions: 8 },
      { hour: 17, visitors: 160, conversions: 7 },
      { hour: 18, visitors: 140, conversions: 6 },
      { hour: 19, visitors: 125, conversions: 5 },
      { hour: 20, visitors: 110, conversions: 4 },
      { hour: 21, visitors: 95, conversions: 3 },
      { hour: 22, visitors: 80, conversions: 2 },
      { hour: 23, visitors: 65, conversions: 2 }
    ];

    const funnelData = [
      {
        step: 'Ana Sayfa',
        visitors: 12800,
        dropoff: 0,
        conversionRate: 100
      },
      {
        step: 'Ürün Sayfası',
        visitors: 8500,
        dropoff: 4300,
        conversionRate: 66.4
      },
      {
        step: 'Sepete Ekleme',
        visitors: 1200,
        dropoff: 7300,
        conversionRate: 9.4
      },
      {
        step: 'Checkout',
        visitors: 650,
        dropoff: 550,
        conversionRate: 5.1
      },
      {
        step: 'Satın Alma',
        visitors: 480,
        dropoff: 170,
        conversionRate: 3.8
      }
    ];

    // Calculate totals
    const totalVisitors = trafficData.reduce((sum, day) => sum + day.visitors, 0);
    const totalPageViews = trafficData.reduce((sum, day) => sum + day.pageViews, 0);
    const totalSessions = trafficData.reduce((sum, day) => sum + day.sessions, 0);
    const averageBounceRate = trafficData.reduce((sum, day) => sum + day.bounceRate, 0) / trafficData.length;
    const averageSessionDuration = trafficData.reduce((sum, day) => sum + day.avgSessionDuration, 0) / trafficData.length;
    
    const totalRevenue = topProducts.reduce((sum, product) => sum + product.revenue, 0);
    const totalOrders = topProducts.reduce((sum, product) => sum + product.purchases, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
    const cartAbandonmentRate = 45.5; // Mock data
    
    const newCustomers = 450; // Mock data
    const returningCustomers = 320; // Mock data
    const customerRetentionRate = 68.5; // Mock data

    const stats = {
      totalVisitors,
      totalPageViews,
      totalSessions,
      averageBounceRate,
      averageSessionDuration,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
      cartAbandonmentRate,
      newCustomers,
      returningCustomers,
      customerRetentionRate,
      trafficData,
      conversionData,
      cohortData,
      topProducts,
      topCategories,
      trafficSources,
      deviceBreakdown,
      geographicData,
      hourlyTraffic,
      funnelData
    };

    return NextResponse.json({
      stats
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
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
    
    // Create custom report or analytics query
    console.log('Creating analytics report:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Analytics report created successfully' 
    });
  } catch (error) {
    console.error('Error creating analytics report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
