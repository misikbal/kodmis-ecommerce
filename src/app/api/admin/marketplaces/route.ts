import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Marketplace from '@/lib/models/Marketplace';
import MarketplaceSyncLog from '@/lib/models/MarketplaceSyncLog';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if marketplaces exist, if not create sample data
    const marketplaceCount = await Marketplace.countDocuments();
    
    if (marketplaceCount === 0) {
      const sampleMarketplaces = [
        {
          name: 'Hepsiburada',
          slug: 'hepsiburada',
          logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
          website: 'https://hepsiburada.com',
          isActive: true,
          isConnected: true,
          lastSyncDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
          syncStatus: 'SUCCESS',
          errorCount: 0,
          productCount: 1250,
          orderCount: 45,
          totalSales: 125000,
          commissionRate: 12.5,
          settings: {
            autoSync: true,
            syncInterval: 30,
            priceMarkup: 15,
            stockSync: true,
            orderSync: true,
            imageSync: true
          }
        },
        {
          name: 'Trendyol',
          slug: 'trendyol',
          logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
          website: 'https://trendyol.com',
          isActive: true,
          isConnected: true,
          lastSyncDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
          syncStatus: 'ERROR',
          errorCount: 3,
          productCount: 980,
          orderCount: 32,
          totalSales: 89000,
          commissionRate: 15.0,
          settings: {
            autoSync: true,
            syncInterval: 60,
            priceMarkup: 18,
            stockSync: true,
            orderSync: true,
            imageSync: false
          }
        },
        {
          name: 'n11',
          slug: 'n11',
          logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
          website: 'https://n11.com',
          isActive: true,
          isConnected: true,
          lastSyncDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
          syncStatus: 'SUCCESS',
          errorCount: 0,
          productCount: 750,
          orderCount: 28,
          totalSales: 67000,
          commissionRate: 10.0,
          settings: {
            autoSync: true,
            syncInterval: 15,
            priceMarkup: 12,
            stockSync: true,
            orderSync: true,
            imageSync: true
          }
        }
      ];

      const createdMarketplaces = await Marketplace.insertMany(sampleMarketplaces);

      // Create sample sync logs
      const sampleSyncLogs = [
        {
          marketplaceId: createdMarketplaces[0]._id,
          type: 'PRODUCT',
          status: 'SUCCESS',
          itemsProcessed: 150,
          itemsSuccessful: 150,
          itemsFailed: 0,
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
          duration: 300
        },
        {
          marketplaceId: createdMarketplaces[1]._id,
          type: 'STOCK',
          status: 'ERROR',
          itemsProcessed: 200,
          itemsSuccessful: 197,
          itemsFailed: 3,
          errorMessage: 'API rate limit exceeded',
          startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 8 * 60 * 1000),
          duration: 480
        },
        {
          marketplaceId: createdMarketplaces[2]._id,
          type: 'ORDER',
          status: 'SUCCESS',
          itemsProcessed: 25,
          itemsSuccessful: 25,
          itemsFailed: 0,
          startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2 * 60 * 1000),
          duration: 120
        }
      ];

      await MarketplaceSyncLog.insertMany(sampleSyncLogs);
    }
    
    // Fetch real data from database
    const marketplacesData = await Marketplace.find({}).lean();
    const syncLogsData = await MarketplaceSyncLog.find({})
      .populate('marketplaceId', 'name')
      .sort({ startedAt: -1 })
      .limit(50)
      .lean();

    // Transform data
    const marketplaces = marketplacesData.map((m: any) => ({
      id: m._id.toString(),
      name: m.name,
      slug: m.slug,
      logo: m.logo,
      website: m.website,
      isActive: m.isActive,
      isConnected: m.isConnected,
      lastSyncDate: m.lastSyncDate?.toISOString(),
      syncStatus: m.syncStatus,
      errorCount: m.errorCount,
      productCount: m.productCount,
      orderCount: m.orderCount,
      totalSales: m.totalSales,
      commissionRate: m.commissionRate,
      apiKey: m.apiKey,
      apiSecret: m.apiSecret,
      webhookUrl: m.webhookUrl,
      settings: m.settings,
      categories: [],
      attributes: [],
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString()
    }));

    const syncLogs = syncLogsData.map((log: any) => ({
      id: log._id.toString(),
      marketplaceId: log.marketplaceId._id.toString(),
      marketplaceName: log.marketplaceId.name,
      type: log.type,
      status: log.status,
      itemsProcessed: log.itemsProcessed,
      itemsSuccessful: log.itemsSuccessful,
      itemsFailed: log.itemsFailed,
      errorMessage: log.errorMessage,
      startedAt: log.startedAt.toISOString(),
      completedAt: log.completedAt?.toISOString(),
      duration: log.duration
    }));

    // Calculate stats from real database data
    const totalMarketplaces = marketplaces.length;
    const activeMarketplaces = marketplaces.filter(m => m.isActive).length;
    const totalProducts = marketplaces.reduce((sum, m) => sum + m.productCount, 0);
    const totalOrders = marketplaces.reduce((sum, m) => sum + m.orderCount, 0);
    const totalSales = marketplaces.reduce((sum, m) => sum + m.totalSales, 0);
    const syncErrors = marketplaces.reduce((sum, m) => sum + m.errorCount, 0);
    const lastSyncDate = marketplaces
      .filter(m => m.lastSyncDate)
      .sort((a, b) => new Date(b.lastSyncDate!).getTime() - new Date(a.lastSyncDate!).getTime())[0]?.lastSyncDate || '';

    return NextResponse.json({
      totalMarketplaces,
      activeMarketplaces,
      totalProducts,
      totalOrders,
      totalSales,
      syncErrors,
      lastSyncDate,
      marketplaces,
      recentSyncLogs: syncLogs
    });

    // REMOVED: All old mock data below - keeping for reference only
    /* const oldMarketplaces = [
      {
        id: '1',
        name: 'Hepsiburada',
        slug: 'hepsiburada',
        logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
        website: 'https://hepsiburada.com',
        isActive: true,
        isConnected: true,
        lastSyncDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        syncStatus: 'SUCCESS',
        errorCount: 0,
        productCount: 1250,
        orderCount: 45,
        totalSales: 125000,
        commissionRate: 12.5,
        apiKey: 'hb_api_key_***',
        apiSecret: 'hb_secret_***',
        webhookUrl: 'https://api.kodmis.com/webhooks/hepsiburada',
        settings: {
          autoSync: true,
          syncInterval: 30,
          priceMarkup: 15,
          stockSync: true,
          orderSync: true,
          imageSync: true
        },
        categories: [
          {
            id: '1',
            name: 'Elektronik',
            marketplaceCategoryId: 'hb_elektronik',
            isMapped: true
          },
          {
            id: '2',
            name: 'Giyim',
            marketplaceCategoryId: 'hb_giyim',
            isMapped: true
          }
        ],
        attributes: [
          {
            id: '1',
            name: 'Renk',
            marketplaceAttributeId: 'hb_renk',
            isMapped: true
          },
          {
            id: '2',
            name: 'Beden',
            marketplaceAttributeId: 'hb_beden',
            isMapped: true
          }
        ],
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString()
      },
      {
        id: '2',
        name: 'Trendyol',
        slug: 'trendyol',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
        website: 'https://trendyol.com',
        isActive: true,
        isConnected: true,
        lastSyncDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        syncStatus: 'ERROR',
        errorCount: 3,
        productCount: 980,
        orderCount: 32,
        totalSales: 89000,
        commissionRate: 15.0,
        apiKey: 'ty_api_key_***',
        apiSecret: 'ty_secret_***',
        webhookUrl: 'https://api.kodmis.com/webhooks/trendyol',
        settings: {
          autoSync: true,
          syncInterval: 60,
          priceMarkup: 18,
          stockSync: true,
          orderSync: true,
          imageSync: false
        },
        categories: [
          {
            id: '1',
            name: 'Elektronik',
            marketplaceCategoryId: 'ty_elektronik',
            isMapped: true
          },
          {
            id: '2',
            name: 'Giyim',
            marketplaceCategoryId: 'ty_giyim',
            isMapped: false
          }
        ],
        attributes: [
          {
            id: '1',
            name: 'Renk',
            marketplaceAttributeId: 'ty_renk',
            isMapped: true
          },
          {
            id: '2',
            name: 'Beden',
            marketplaceAttributeId: 'ty_beden',
            isMapped: false
          }
        ],
        createdAt: new Date('2024-01-02').toISOString(),
        updatedAt: new Date('2024-01-16').toISOString()
      },
      {
        id: '3',
        name: 'n11',
        slug: 'n11',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
        website: 'https://n11.com',
        isActive: true,
        isConnected: true,
        lastSyncDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        syncStatus: 'SUCCESS',
        errorCount: 0,
        productCount: 750,
        orderCount: 28,
        totalSales: 67000,
        commissionRate: 10.0,
        apiKey: 'n11_api_key_***',
        apiSecret: 'n11_secret_***',
        webhookUrl: 'https://api.kodmis.com/webhooks/n11',
        settings: {
          autoSync: true,
          syncInterval: 15,
          priceMarkup: 12,
          stockSync: true,
          orderSync: true,
          imageSync: true
        },
        categories: [
          {
            id: '1',
            name: 'Elektronik',
            marketplaceCategoryId: 'n11_elektronik',
            isMapped: true
          },
          {
            id: '2',
            name: 'Giyim',
            marketplaceCategoryId: 'n11_giyim',
            isMapped: true
          }
        ],
        attributes: [
          {
            id: '1',
            name: 'Renk',
            marketplaceAttributeId: 'n11_renk',
            isMapped: true
          },
          {
            id: '2',
            name: 'Beden',
            marketplaceAttributeId: 'n11_beden',
            isMapped: true
          }
        ],
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-17').toISOString()
      },
      {
        id: '4',
        name: 'Amazon',
        slug: 'amazon',
        logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
        website: 'https://amazon.com.tr',
        isActive: false,
        isConnected: false,
        syncStatus: 'DISABLED',
        errorCount: 0,
        productCount: 0,
        orderCount: 0,
        totalSales: 0,
        commissionRate: 8.0,
        settings: {
          autoSync: false,
          syncInterval: 240,
          priceMarkup: 20,
          stockSync: false,
          orderSync: false,
          imageSync: false
        },
        categories: [],
        attributes: [],
        createdAt: new Date('2024-01-04').toISOString(),
        updatedAt: new Date('2024-01-18').toISOString()
      },
      {
        id: '5',
        name: 'GittiGidiyor',
        slug: 'gittigidiyor',
        logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
        website: 'https://gittigidiyor.com',
        isActive: true,
        isConnected: true,
        lastSyncDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        syncStatus: 'PENDING',
        errorCount: 1,
        productCount: 420,
        orderCount: 15,
        totalSales: 35000,
        commissionRate: 5.0,
        apiKey: 'gg_api_key_***',
        apiSecret: 'gg_secret_***',
        webhookUrl: 'https://api.kodmis.com/webhooks/gittigidiyor',
        settings: {
          autoSync: true,
          syncInterval: 120,
          priceMarkup: 10,
          stockSync: true,
          orderSync: false,
          imageSync: true
        },
        categories: [
          {
            id: '1',
            name: 'Elektronik',
            marketplaceCategoryId: 'gg_elektronik',
            isMapped: true
          }
        ],
        attributes: [
          {
            id: '1',
            name: 'Renk',
            marketplaceAttributeId: 'gg_renk',
            isMapped: true
          }
        ],
        createdAt: new Date('2024-01-05').toISOString(),
        updatedAt: new Date('2024-01-19').toISOString()
      }
    ];

    // Mock sync logs removed - we're using database data
    const oldSyncLogs = [
      {
        id: '1',
        marketplaceId: '1',
        marketplaceName: 'Hepsiburada',
        type: 'PRODUCT',
        status: 'SUCCESS',
        itemsProcessed: 150,
        itemsSuccessful: 150,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
        duration: 300
      },
      {
        id: '2',
        marketplaceId: '2',
        marketplaceName: 'Trendyol',
        type: 'STOCK',
        status: 'ERROR',
        itemsProcessed: 200,
        itemsSuccessful: 197,
        itemsFailed: 3,
        errorMessage: 'API rate limit exceeded',
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
        duration: 480
      },
      {
        id: '3',
        marketplaceId: '3',
        marketplaceName: 'n11',
        type: 'ORDER',
        status: 'SUCCESS',
        itemsProcessed: 25,
        itemsSuccessful: 25,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 2 * 60 * 1000).toISOString(),
        duration: 120
      },
      {
        id: '4',
        marketplaceId: '1',
        marketplaceName: 'Hepsiburada',
        type: 'PRICE',
        status: 'SUCCESS',
        itemsProcessed: 300,
        itemsSuccessful: 300,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
        duration: 180
      },
      {
        id: '5',
        marketplaceId: '5',
        marketplaceName: 'GittiGidiyor',
        type: 'PRODUCT',
        status: 'PENDING',
        itemsProcessed: 0,
        itemsSuccessful: 0,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        marketplaceId: '2',
        marketplaceName: 'Trendyol',
        type: 'PRODUCT',
        status: 'ERROR',
        itemsProcessed: 100,
        itemsSuccessful: 95,
        itemsFailed: 5,
        errorMessage: 'Invalid product data format',
        startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
        duration: 240
      },
      {
        id: '7',
        marketplaceId: '3',
        marketplaceName: 'n11',
        type: 'STOCK',
        status: 'SUCCESS',
        itemsProcessed: 180,
        itemsSuccessful: 180,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString(),
        duration: 360
      },
      {
        id: '8',
        marketplaceId: '1',
        marketplaceName: 'Hepsiburada',
        type: 'ORDER',
        status: 'SUCCESS',
        itemsProcessed: 45,
        itemsSuccessful: 45,
        itemsFailed: 0,
        startedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 18 * 60 * 60 * 1000 + 1 * 60 * 1000).toISOString(),
        duration: 60
      }
    ]; */

  } catch (error) {
    console.error('Error fetching marketplace data:', error);
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
    const { name, slug, logo, website, commissionRate, settings } = body;
    
    if (!name || !slug || !logo || !website) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if marketplace already exists
    const existing = await Marketplace.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'Marketplace already exists' },
        { status: 400 }
      );
    }

    // Create new marketplace
    const marketplace = new Marketplace({
      name,
      slug,
      logo,
      website,
      commissionRate: commissionRate || 0,
      settings: settings || {
        autoSync: false,
        syncInterval: 60,
        priceMarkup: 15,
        stockSync: true,
        orderSync: true,
        imageSync: true
      },
      isActive: false,
      isConnected: false,
      syncStatus: 'DISABLED'
    });

    await marketplace.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketplace integration created successfully',
      marketplace 
    });
  } catch (error) {
    console.error('Error creating marketplace integration:', error);
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
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Marketplace ID is required' },
        { status: 400 }
      );
    }

    const marketplace = await Marketplace.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!marketplace) {
      return NextResponse.json(
        { error: 'Marketplace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketplace integration updated successfully',
      marketplace
    });
  } catch (error) {
    console.error('Error updating marketplace integration:', error);
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
      return NextResponse.json({ error: 'Marketplace ID is required' }, { status: 400 });
    }
    
    const marketplace = await Marketplace.findByIdAndDelete(id);

    if (!marketplace) {
      return NextResponse.json(
        { error: 'Marketplace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketplace integration deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting marketplace integration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


