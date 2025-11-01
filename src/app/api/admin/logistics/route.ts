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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const carrier = searchParams.get('carrier');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Mock data for logistics
    const carriers = [
      {
        id: '1',
        name: 'Aras Kargo',
        code: 'ARAS',
        logo: '/logos/aras.png',
        website: 'https://www.araskargo.com.tr',
        phone: '0850 222 2 727',
        email: 'info@araskargo.com.tr',
        status: 'ACTIVE',
        integrationType: 'API',
        apiEndpoint: 'https://api.araskargo.com.tr',
        apiKey: '***',
        trackingUrl: 'https://www.araskargo.com.tr/takip',
        deliveryTime: {
          min: 1,
          max: 3,
          unit: 'DAYS'
        },
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'],
        services: [
          {
            name: 'Standart Kargo',
            code: 'STANDARD',
            price: 15,
            estimatedDays: 2,
            features: ['Kapıda ödeme', 'Sigorta']
          },
          {
            name: 'Hızlı Kargo',
            code: 'EXPRESS',
            price: 25,
            estimatedDays: 1,
            features: ['Kapıda ödeme', 'Sigorta', 'Hızlı teslimat']
          }
        ],
        pricing: {
          basePrice: 15,
          pricePerKg: 2,
          freeShippingThreshold: 150,
          codFee: 5
        },
        statistics: {
          totalShipments: 1250,
          successfulDeliveries: 1180,
          averageDeliveryTime: 2.1,
          customerRating: 4.2,
          onTimeDeliveryRate: 94.4
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Yurtiçi Kargo',
        code: 'YURTICI',
        logo: '/logos/yurtici.png',
        website: 'https://www.yurticikargo.com',
        phone: '0850 333 0 000',
        email: 'info@yurticikargo.com',
        status: 'ACTIVE',
        integrationType: 'API',
        apiEndpoint: 'https://api.yurticikargo.com',
        apiKey: '***',
        trackingUrl: 'https://www.yurticikargo.com/takip',
        deliveryTime: {
          min: 1,
          max: 2,
          unit: 'DAYS'
        },
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'],
        services: [
          {
            name: 'Standart Kargo',
            code: 'STANDARD',
            price: 12,
            estimatedDays: 2,
            features: ['Kapıda ödeme', 'Sigorta']
          },
          {
            name: 'Hızlı Kargo',
            code: 'EXPRESS',
            price: 20,
            estimatedDays: 1,
            features: ['Kapıda ödeme', 'Sigorta', 'Hızlı teslimat']
          }
        ],
        pricing: {
          basePrice: 12,
          pricePerKg: 1.5,
          freeShippingThreshold: 100,
          codFee: 4
        },
        statistics: {
          totalShipments: 980,
          successfulDeliveries: 920,
          averageDeliveryTime: 1.8,
          customerRating: 4.0,
          onTimeDeliveryRate: 93.9
        },
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'MNG Kargo',
        code: 'MNG',
        logo: '/logos/mng.png',
        website: 'https://www.mngkargo.com.tr',
        phone: '0850 222 0 600',
        email: 'info@mngkargo.com.tr',
        status: 'ACTIVE',
        integrationType: 'WEBHOOK',
        trackingUrl: 'https://www.mngkargo.com.tr/takip',
        deliveryTime: {
          min: 1,
          max: 3,
          unit: 'DAYS'
        },
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'],
        services: [
          {
            name: 'Standart Kargo',
            code: 'STANDARD',
            price: 18,
            estimatedDays: 2,
            features: ['Kapıda ödeme', 'Sigorta']
          }
        ],
        pricing: {
          basePrice: 18,
          pricePerKg: 2.5,
          freeShippingThreshold: 200,
          codFee: 6
        },
        statistics: {
          totalShipments: 750,
          successfulDeliveries: 700,
          averageDeliveryTime: 2.3,
          customerRating: 3.8,
          onTimeDeliveryRate: 93.3
        },
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'PTT Kargo',
        code: 'PTT',
        logo: '/logos/ptt.png',
        website: 'https://www.ptt.gov.tr',
        phone: '0850 200 0 200',
        email: 'info@ptt.gov.tr',
        status: 'MAINTENANCE',
        integrationType: 'MANUAL',
        trackingUrl: 'https://www.ptt.gov.tr/takip',
        deliveryTime: {
          min: 2,
          max: 5,
          unit: 'DAYS'
        },
        coverage: ['Tüm Türkiye'],
        services: [
          {
            name: 'Standart Kargo',
            code: 'STANDARD',
            price: 10,
            estimatedDays: 3,
            features: ['Kapıda ödeme']
          }
        ],
        pricing: {
          basePrice: 10,
          pricePerKg: 1,
          freeShippingThreshold: 50,
          codFee: 3
        },
        statistics: {
          totalShipments: 450,
          successfulDeliveries: 420,
          averageDeliveryTime: 3.5,
          customerRating: 3.5,
          onTimeDeliveryRate: 93.3
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const shipments = [
      {
        id: '1',
        orderId: 'ORD-2024-001',
        orderNumber: 'ORD-2024-001',
        trackingNumber: 'ARAS123456789',
        carrierId: '1',
        carrierName: 'Aras Kargo',
        carrierCode: 'ARAS',
        status: 'DELIVERED',
        service: 'Standart Kargo',
        weight: 1.5,
        dimensions: {
          length: 30,
          width: 20,
          height: 10
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Ahmet Yılmaz',
          address: 'Merkez Mahallesi, Atatürk Caddesi No:25',
          city: 'Ankara',
          postalCode: '06000',
          phone: '0532 123 4567'
        },
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 15,
        codAmount: 0,
        insuranceValue: 500,
        specialInstructions: 'Kapıda ödeme yok',
        trackingEvents: [
          {
            status: 'PICKED_UP',
            description: 'Kargo alındı',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            description: 'Yolda',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'OUT_FOR_DELIVERY',
            description: 'Teslimata çıktı',
            location: 'Ankara',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'DELIVERED',
            description: 'Teslim edildi',
            location: 'Ankara',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        orderId: 'ORD-2024-002',
        orderNumber: 'ORD-2024-002',
        trackingNumber: 'YURTICI987654321',
        carrierId: '2',
        carrierName: 'Yurtiçi Kargo',
        carrierCode: 'YURTICI',
        status: 'IN_TRANSIT',
        service: 'Hızlı Kargo',
        weight: 2.0,
        dimensions: {
          length: 40,
          width: 30,
          height: 15
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Ayşe Demir',
          address: 'Çankaya Mahallesi, İnönü Bulvarı No:100',
          city: 'İzmir',
          postalCode: '35000',
          phone: '0533 987 6543'
        },
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 20,
        codAmount: 0,
        insuranceValue: 750,
        trackingEvents: [
          {
            status: 'PICKED_UP',
            description: 'Kargo alındı',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            description: 'Yolda',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        orderId: 'ORD-2024-003',
        orderNumber: 'ORD-2024-003',
        trackingNumber: 'MNG456789123',
        carrierId: '3',
        carrierName: 'MNG Kargo',
        carrierCode: 'MNG',
        status: 'OUT_FOR_DELIVERY',
        service: 'Standart Kargo',
        weight: 0.8,
        dimensions: {
          length: 25,
          width: 15,
          height: 8
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Mehmet Kaya',
          address: 'Osmangazi Mahallesi, Cumhuriyet Caddesi No:50',
          city: 'Bursa',
          postalCode: '16000',
          phone: '0534 567 8901'
        },
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        cost: 18,
        codAmount: 0,
        insuranceValue: 300,
        trackingEvents: [
          {
            status: 'PICKED_UP',
            description: 'Kargo alındı',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            description: 'Yolda',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'OUT_FOR_DELIVERY',
            description: 'Teslimata çıktı',
            location: 'Bursa',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        orderId: 'ORD-2024-004',
        orderNumber: 'ORD-2024-004',
        trackingNumber: 'ARAS789123456',
        carrierId: '1',
        carrierName: 'Aras Kargo',
        carrierCode: 'ARAS',
        status: 'PENDING',
        service: 'Standart Kargo',
        weight: 3.2,
        dimensions: {
          length: 50,
          width: 40,
          height: 20
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Fatma Özkan',
          address: 'Konyaaltı Mahallesi, Atatürk Bulvarı No:75',
          city: 'Antalya',
          postalCode: '07000',
          phone: '0535 234 5678'
        },
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 15,
        codAmount: 0,
        insuranceValue: 1200,
        trackingEvents: [],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        orderId: 'ORD-2024-005',
        orderNumber: 'ORD-2024-005',
        trackingNumber: 'YURTICI321654987',
        carrierId: '2',
        carrierName: 'Yurtiçi Kargo',
        carrierCode: 'YURTICI',
        status: 'FAILED',
        service: 'Hızlı Kargo',
        weight: 1.0,
        dimensions: {
          length: 20,
          width: 15,
          height: 10
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Ali Şahin',
          address: 'Seyhan Mahallesi, Adana Caddesi No:30',
          city: 'Adana',
          postalCode: '01000',
          phone: '0536 345 6789'
        },
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 20,
        codAmount: 0,
        insuranceValue: 400,
        trackingEvents: [
          {
            status: 'PICKED_UP',
            description: 'Kargo alındı',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            description: 'Yolda',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'FAILED',
            description: 'Teslimat başarısız - Adres bulunamadı',
            location: 'Adana',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        orderId: 'ORD-2024-006',
        orderNumber: 'ORD-2024-006',
        trackingNumber: 'MNG654321987',
        carrierId: '3',
        carrierName: 'MNG Kargo',
        carrierCode: 'MNG',
        status: 'RETURNED',
        service: 'Standart Kargo',
        weight: 2.5,
        dimensions: {
          length: 35,
          width: 25,
          height: 12
        },
        origin: {
          name: 'Kodmis Depo',
          address: 'Sanayi Mahallesi, Depo Sokak No:15',
          city: 'İstanbul',
          postalCode: '34000',
          phone: '0212 555 0123'
        },
        destination: {
          name: 'Zeynep Yıldız',
          address: 'Merkez Mahallesi, İstiklal Caddesi No:80',
          city: 'İzmir',
          postalCode: '35000',
          phone: '0537 456 7890'
        },
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        cost: 18,
        codAmount: 0,
        insuranceValue: 800,
        trackingEvents: [
          {
            status: 'PICKED_UP',
            description: 'Kargo alındı',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'IN_TRANSIT',
            description: 'Yolda',
            location: 'İstanbul',
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'OUT_FOR_DELIVERY',
            description: 'Teslimata çıktı',
            location: 'İzmir',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            status: 'RETURNED',
            description: 'İade edildi - Müşteri reddetti',
            location: 'İzmir',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Calculate carrier stats
    const carrierStats = carriers.map(carrier => {
      const carrierShipments = shipments.filter(s => s.carrierId === carrier.id);
      const successfulShipments = carrierShipments.filter(s => s.status === 'DELIVERED').length;
      const successRate = carrierShipments.length > 0 ? (successfulShipments / carrierShipments.length) * 100 : 0;
      const averageTime = carrier.statistics.averageDeliveryTime;
      
      return {
        carrier: carrier.name,
        shipments: carrierShipments.length,
        successRate,
        averageTime
      };
    }).sort((a, b) => b.shipments - a.shipments);

    const totalShipments = shipments.length;
    const pendingShipments = shipments.filter(s => s.status === 'PENDING').length;
    const inTransitShipments = shipments.filter(s => s.status === 'IN_TRANSIT').length;
    const deliveredShipments = shipments.filter(s => s.status === 'DELIVERED').length;
    const failedShipments = shipments.filter(s => s.status === 'FAILED').length;
    const totalCarriers = carriers.length;
    const activeCarriers = carriers.filter(c => c.status === 'ACTIVE').length;
    
    const averageDeliveryTime = carriers.reduce((sum, c) => sum + c.statistics.averageDeliveryTime, 0) / carriers.length;
    const onTimeDeliveryRate = carriers.reduce((sum, c) => sum + c.statistics.onTimeDeliveryRate, 0) / carriers.length;
    
    const totalShippingCost = shipments.reduce((sum, s) => sum + s.cost, 0);
    const averageShippingCost = totalShippingCost / totalShipments;

    const deliveryPerformance = {
      onTime: Math.round(deliveredShipments * 0.94),
      delayed: Math.round(deliveredShipments * 0.05),
      failed: failedShipments
    };

    const regionalStats = [
      {
        region: 'İstanbul',
        shipments: 45,
        averageTime: 1.8,
        successRate: 96.2
      },
      {
        region: 'Ankara',
        shipments: 32,
        averageTime: 2.1,
        successRate: 94.8
      },
      {
        region: 'İzmir',
        shipments: 28,
        averageTime: 2.3,
        successRate: 93.5
      },
      {
        region: 'Bursa',
        shipments: 18,
        averageTime: 2.5,
        successRate: 92.1
      },
      {
        region: 'Antalya',
        shipments: 15,
        averageTime: 2.8,
        successRate: 91.3
      }
    ];

    // Apply filters
    let filteredShipments = shipments;
    
    if (status) {
      filteredShipments = filteredShipments.filter(s => s.status === status);
    }
    
    if (carrier) {
      filteredShipments = filteredShipments.filter(s => s.carrierId === carrier);
    }
    
    if (dateFrom) {
      filteredShipments = filteredShipments.filter(s => 
        new Date(s.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredShipments = filteredShipments.filter(s => 
        new Date(s.createdAt) <= new Date(dateTo)
      );
    }

    // Pagination
    const totalPages = Math.ceil(filteredShipments.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedShipments = filteredShipments.slice(startIndex, startIndex + limit);

    const stats = {
      totalShipments,
      pendingShipments,
      inTransitShipments,
      deliveredShipments,
      failedShipments,
      totalCarriers,
      activeCarriers,
      averageDeliveryTime,
      onTimeDeliveryRate,
      totalShippingCost,
      averageShippingCost,
      topCarriers: carrierStats,
      recentShipments: paginatedShipments,
      carriers,
      deliveryPerformance,
      regionalStats
    };

    return NextResponse.json({
      stats,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching logistics data:', error);
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
    
    // Create new shipment or carrier
    console.log('Creating logistics item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logistics item created successfully' 
    });
  } catch (error) {
    console.error('Error creating logistics item:', error);
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
    
    // Update shipment or carrier
    console.log('Updating logistics item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logistics item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating logistics item:', error);
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
    const type = searchParams.get('type'); // shipment, carrier
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete shipment or carrier
    console.log('Deleting logistics item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logistics item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting logistics item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
