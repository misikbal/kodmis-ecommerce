import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import CustomerSegment from '@/lib/models/CustomerSegment';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if segments exist, if not create sample segments
    const segmentCount = await CustomerSegment.countDocuments();
    
    if (segmentCount === 0) {
      const sampleSegments = [
        {
          name: 'VIP Müşteriler',
          description: 'En yüksek harcama yapan, en sadık müşterilerimiz. Özel avantajlar ve premium hizmetler.',
          criteria: 'Son 12 ayda 10.000₺ üzeri harcama yapmış müşteriler',
          color: '#F59E0B',
          icon: 'Star',
          customerCount: 0,
          isActive: true
        },
        {
          name: 'Sık Alışveriş Yapanlar',
          description: 'Düzenli olarak alışveriş yapan, farklı kategorilerden ürün satın alan müşteriler.',
          criteria: 'Son 3 ayda en az 5 sipariş vermiş müşteriler',
          color: '#10B981',
          icon: 'TrendingUp',
          customerCount: 0,
          isActive: true
        },
        {
          name: 'Yeni Müşteriler',
          description: 'Yakın zamanda kayıt olmuş ve ilk alışverişlerini yapmış yeni müşteriler.',
          criteria: 'Son 30 gün içinde kayıt olmuş müşteriler',
          color: '#3B82F6',
          icon: 'Users',
          customerCount: 0,
          isActive: true
        },
        {
          name: 'Risk Altındakiler',
          description: 'Uzun süredir alışveriş yapmayan, kaybolmak üzere olan müşteriler.',
          criteria: 'Son 6 ayda sipariş vermeyen aktif müşteriler',
          color: '#EF4444',
          icon: 'AlertTriangle',
          customerCount: 0,
          isActive: true
        },
        {
          name: 'Elektronik Tutkunları',
          description: 'Elektronik ürünlere ilgi duyan ve bu kategoriye odaklanan müşteriler.',
          criteria: 'Elektronik kategorisinden ürün satın alan müşteriler',
          color: '#8B5CF6',
          icon: 'Package',
          customerCount: 0,
          isActive: true
        },
        {
          name: 'Moda & Stil Severler',
          description: 'Giyim, ayakkabı ve aksesuar kategorilerinde aktif alışveriş yapan müşteriler.',
          criteria: 'Moda kategorisinden sık ürün satın alan müşteriler',
          color: '#EC4899',
          icon: 'Heart',
          customerCount: 0,
          isActive: true
        }
      ];

      await CustomerSegment.insertMany(sampleSegments);
    }
    
    const segments = await CustomerSegment.find({})
      .sort({ customerCount: -1 })
      .lean();

    // Calculate actual customer counts for each segment
    const segmentsWithCounts = await Promise.all(
      segments.map(async (segment) => {
        const query: any = {};
        
        // Parse criteria and build query
        // This is a simplified version - you can expand based on your needs
        if (segment.criteria.includes('LTV')) {
          const ltvMatch = segment.criteria.match(/(\d+)/);
          if (ltvMatch) {
            const amount = parseInt(ltvMatch[0]);
            query.loyaltyPoints = { $gte: amount };
          }
        }
        
        const count = await User.countDocuments(query);
        
        return {
          ...segment,
          customerCount: count
        };
      })
    );

    return NextResponse.json(segmentsWithCounts);
  } catch (error) {
    console.error('Error fetching customer segments:', error);
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
    const { name, description, criteria, color, icon } = body;
    
    if (!name || !description || !criteria) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const segment = new CustomerSegment({
      name,
      description,
      criteria,
      color: color || '#3B82F6',
      icon: icon || 'Users',
      customerCount: 0,
      isActive: true
    });

    await segment.save();

    return NextResponse.json({ success: true, segment });
  } catch (error) {
    console.error('Error creating customer segment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


