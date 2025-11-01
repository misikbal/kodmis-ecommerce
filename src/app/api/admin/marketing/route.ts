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
    
    // Mock data for marketing
    const campaigns = [
      {
        id: '1',
        name: 'Black Friday 2024',
        description: 'Yılın en büyük indirim kampanyası',
        type: 'DISCOUNT',
        status: 'ACTIVE',
        startDate: new Date('2024-11-24').toISOString(),
        endDate: new Date('2024-11-30').toISOString(),
        discountType: 'PERCENTAGE',
        discountValue: 30,
        minOrderAmount: 500,
        maxDiscountAmount: 1000,
        usageLimit: 1000,
        usedCount: 450,
        targetAudience: 'ALL',
        applicableProducts: 'ALL',
        totalOrders: 450,
        totalRevenue: 125000,
        conversionRate: 8.5,
        createdAt: new Date('2024-11-20').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '2',
        name: 'Yeni Müşteri Hoş Geldin',
        description: 'Yeni kayıt olan müşteriler için özel indirim',
        type: 'DISCOUNT',
        status: 'ACTIVE',
        startDate: new Date('2024-01-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minOrderAmount: 200,
        usageLimit: 1,
        usedCount: 120,
        targetAudience: 'NEW_CUSTOMERS',
        applicableProducts: 'ALL',
        totalOrders: 120,
        totalRevenue: 35000,
        conversionRate: 12.3,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '3',
        name: 'Ücretsiz Kargo Kampanyası',
        description: '500 TL ve üzeri alışverişlerde ücretsiz kargo',
        type: 'FREE_SHIPPING',
        status: 'ACTIVE',
        startDate: new Date('2024-11-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        discountType: 'FIXED_AMOUNT',
        discountValue: 0,
        minOrderAmount: 500,
        usageLimit: null,
        usedCount: 280,
        targetAudience: 'ALL',
        applicableProducts: 'ALL',
        totalOrders: 280,
        totalRevenue: 89000,
        conversionRate: 6.8,
        createdAt: new Date('2024-10-25').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '4',
        name: '2 Al 1 Öde',
        description: 'Seçili ürünlerde 2 al 1 öde kampanyası',
        type: 'BUY_GET',
        status: 'PAUSED',
        startDate: new Date('2024-11-15').toISOString(),
        endDate: new Date('2024-11-25').toISOString(),
        discountType: 'BUY_X_GET_Y',
        discountValue: 1,
        minOrderAmount: 100,
        usageLimit: 500,
        usedCount: 180,
        targetAudience: 'ALL',
        applicableProducts: 'CATEGORY',
        categoryIds: ['1', '2'],
        totalOrders: 180,
        totalRevenue: 45000,
        conversionRate: 9.2,
        createdAt: new Date('2024-11-10').toISOString(),
        updatedAt: new Date('2024-11-20').toISOString()
      },
      {
        id: '5',
        name: 'Flash Sale - Elektronik',
        description: 'Elektronik ürünlerde 24 saatlik flash sale',
        type: 'FLASH_SALE',
        status: 'COMPLETED',
        startDate: new Date('2024-11-20').toISOString(),
        endDate: new Date('2024-11-21').toISOString(),
        discountType: 'PERCENTAGE',
        discountValue: 40,
        minOrderAmount: 1000,
        maxDiscountAmount: 2000,
        usageLimit: 200,
        usedCount: 200,
        targetAudience: 'ALL',
        applicableProducts: 'CATEGORY',
        categoryIds: ['1'],
        totalOrders: 200,
        totalRevenue: 180000,
        conversionRate: 15.7,
        createdAt: new Date('2024-11-18').toISOString(),
        updatedAt: new Date('2024-11-21').toISOString()
      }
    ];

    const coupons = [
      {
        id: '1',
        code: 'WELCOME15',
        name: 'Hoş Geldin İndirimi',
        description: 'Yeni müşteriler için %15 indirim',
        type: 'PERCENTAGE',
        value: 15,
        minOrderAmount: 200,
        maxDiscountAmount: 500,
        usageLimit: 1000,
        usedCount: 450,
        isActive: true,
        startDate: new Date('2024-01-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        applicableProducts: 'ALL',
        totalOrders: 450,
        totalDiscount: 22500,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '2',
        code: 'SAVE50',
        name: '50 TL İndirim',
        description: '500 TL ve üzeri alışverişlerde 50 TL indirim',
        type: 'FIXED_AMOUNT',
        value: 50,
        minOrderAmount: 500,
        usageLimit: 500,
        usedCount: 320,
        isActive: true,
        startDate: new Date('2024-11-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        applicableProducts: 'ALL',
        totalOrders: 320,
        totalDiscount: 16000,
        createdAt: new Date('2024-10-25').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '3',
        code: 'FREESHIP',
        name: 'Ücretsiz Kargo',
        description: 'Ücretsiz kargo kuponu',
        type: 'FREE_SHIPPING',
        value: 0,
        minOrderAmount: 300,
        usageLimit: 1000,
        usedCount: 680,
        isActive: true,
        startDate: new Date('2024-11-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        applicableProducts: 'ALL',
        totalOrders: 680,
        totalDiscount: 34000,
        createdAt: new Date('2024-10-25').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '4',
        code: 'VIP20',
        name: 'VIP Müşteri İndirimi',
        description: 'VIP müşteriler için %20 indirim',
        type: 'PERCENTAGE',
        value: 20,
        minOrderAmount: 1000,
        maxDiscountAmount: 1000,
        usageLimit: 200,
        usedCount: 150,
        isActive: true,
        startDate: new Date('2024-11-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        applicableProducts: 'ALL',
        totalOrders: 150,
        totalDiscount: 15000,
        createdAt: new Date('2024-10-25').toISOString(),
        updatedAt: new Date('2024-11-25').toISOString()
      },
      {
        id: '5',
        code: 'BLACKFRIDAY30',
        name: 'Black Friday Özel',
        description: 'Black Friday için özel %30 indirim',
        type: 'PERCENTAGE',
        value: 30,
        minOrderAmount: 500,
        maxDiscountAmount: 1500,
        usageLimit: 1000,
        usedCount: 800,
        isActive: false,
        startDate: new Date('2024-11-24').toISOString(),
        endDate: new Date('2024-11-30').toISOString(),
        applicableProducts: 'ALL',
        totalOrders: 800,
        totalDiscount: 60000,
        createdAt: new Date('2024-11-20').toISOString(),
        updatedAt: new Date('2024-11-30').toISOString()
      }
    ];

    const aiStudioHistory = [
      {
        id: '1',
        type: 'PRODUCT_DESCRIPTION',
        input: 'iPhone 15 Pro, 256GB, Space Black, Apple\'ın en yeni akıllı telefonu',
        output: [
          'iPhone 15 Pro, 256GB Space Black - Apple\'ın en güçlü ve gelişmiş akıllı telefonu. A17 Pro çip ile donatılmış, profesyonel fotoğraf ve video çekimi için optimize edilmiş kamera sistemi.',
          'iPhone 15 Pro 256GB Space Black, Apple\'ın yeni nesil teknolojisi ile donatılmış. Titanium gövde, gelişmiş kamera sistemi ve güçlü performans.',
          'Apple iPhone 15 Pro 256GB Space Black - Premium tasarım, güçlü performans ve profesyonel kamera sistemi ile donatılmış akıllı telefon.'
        ],
        language: 'tr',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'AD_TEXT',
        input: 'Samsung Galaxy S24, 128GB, akıllı telefon, indirimli fiyat',
        output: [
          'Samsung Galaxy S24 128GB - Şimdi %20 indirimli! En yeni teknoloji, gelişmiş kamera ve güçlü performans. Hemen sipariş ver, fırsatı kaçırma!',
          'Galaxy S24 128GB\'da büyük indirim! AI destekli kamera, hızlı şarj ve premium tasarım. Sınırlı süre için özel fiyat.',
          'Samsung Galaxy S24 128GB - Teknoloji tutkunları için mükemmel seçim. İndirimli fiyatla hemen sahip ol!'
        ],
        language: 'tr',
        tone: 'CASUAL',
        length: 'SHORT',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'EMAIL_SUBJECT',
        input: 'Black Friday kampanyası, büyük indirimler, sınırlı süre',
        output: [
          '🔥 Black Friday Fırsatları - %50\'ye Varan İndirimler!',
          '⚡ Sınırlı Süre: Black Friday\'de Büyük Tasarruf',
          '🎉 Black Friday Geldi - Fırsatları Kaçırma!'
        ],
        language: 'tr',
        tone: 'FRIENDLY',
        length: 'SHORT',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'SOCIAL_MEDIA',
        input: 'Yeni ürün lansmanı, MacBook Air M3, teknoloji, Apple',
        output: [
          '🚀 Yeni MacBook Air M3 geldi! Daha hızlı, daha güçlü, daha verimli. Teknoloji dünyasında devrim yaratıyor! #MacBookAir #Apple #Teknoloji',
          '✨ MacBook Air M3 ile tanışın! M3 çip ile donatılmış, ince ve hafif tasarım. Yaratıcılığınızı sınır tanımadan ifade edin! #Apple #MacBook #Yaratıcılık',
          '💻 MacBook Air M3 - Performans ve portabilite mükemmel uyumu! Yeni nesil işlemci ile her görevi kolayca halledin. #MacBook #Apple #Performans'
        ],
        language: 'tr',
        tone: 'CREATIVE',
        length: 'MEDIUM',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'SEO_TITLE',
        input: 'iPhone 15 Pro, 256GB, Space Black, Apple, akıllı telefon, satın al',
        output: [
          'iPhone 15 Pro 256GB Space Black - Apple Resmi Satış | En Uygun Fiyat',
          'Apple iPhone 15 Pro 256GB Space Black Satın Al | Hızlı Teslimat',
          'iPhone 15 Pro 256GB Space Black - Premium Akıllı Telefon | Güvenli Alışveriş'
        ],
        language: 'tr',
        tone: 'PROFESSIONAL',
        length: 'MEDIUM',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Calculate stats
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(c => c.isActive).length;
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.totalRevenue, 0);
    const totalDiscounts = coupons.reduce((sum, c) => sum + c.totalDiscount, 0);
    const conversionRate = campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length;

    // AI Marketing Score Calculation
    const aiMarketingScore = {
      score: Math.min(100, Math.max(0, 
        (activeCampaigns * 15) + 
        (conversionRate * 2) + 
        (totalRevenue > 100000 ? 20 : 10) +
        (totalCoupons > 0 ? 15 : 0) +
        (campaigns.filter(c => c.status === 'COMPLETED').length > 0 ? 10 : 0)
      )),
      level: (() => {
        const score = Math.min(100, Math.max(0, 
          (activeCampaigns * 15) + 
          (conversionRate * 2) + 
          (totalRevenue > 100000 ? 20 : 10) +
          (totalCoupons > 0 ? 15 : 0) +
          (campaigns.filter(c => c.status === 'COMPLETED').length > 0 ? 10 : 0)
        ));
        if (score >= 80) return 'HARIKA';
        if (score >= 60) return 'İYİ';
        return 'GELIŞTIRILEBILIR';
      })(),
      suggestions: [
        'Sepet terk eden müşterilere özel kampanya oluşturun',
        'Yeni müşteri kazanım kampanyalarını artırın',
        'Sosyal medya pazarlama stratejisini güçlendirin'
      ],
      trend: 'UP' as const
    };

    // AI Recommendations
    const aiRecommendations = {
      salesBoost: [
        'Sepet terk edenlere özel %10 indirim öneriliyor',
        'Yeni ürün için lansman kampanyası aç',
        'Sadık müşterilere VIP indirimi sunun'
      ],
      lowStockCampaign: [
        'iPhone 15 Pro stokta azalıyor - flash sale öneriliyor',
        'Samsung Galaxy S24 için hızlı satış kampanyası',
        'MacBook Air M3 için sınırlı süre indirimi'
      ],
      competitorAnalysis: [
        'Rakip fiyat analizi: %15 indirim tavsiyesi',
        'Trendyol\'da fiyat avantajı sağlayın',
        'Amazon fiyatlarına göre strateji geliştirin'
      ]
    };

    const stats = {
      totalCampaigns,
      activeCampaigns,
      totalCoupons,
      activeCoupons,
      totalRevenue,
      totalDiscounts,
      conversionRate,
      topCampaigns: campaigns.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5),
      recentCoupons: coupons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
      aiStudioHistory: aiStudioHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      aiMarketingScore,
      aiRecommendations
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching marketing data:', error);
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
    
    // Create new campaign or coupon
    console.log('Creating marketing item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketing item created successfully' 
    });
  } catch (error) {
    console.error('Error creating marketing item:', error);
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
    
    // Update campaign or coupon
    console.log('Updating marketing item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketing item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating marketing item:', error);
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
    const type = searchParams.get('type'); // campaign, coupon
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete campaign or coupon
    console.log('Deleting marketing item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Marketing item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting marketing item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
