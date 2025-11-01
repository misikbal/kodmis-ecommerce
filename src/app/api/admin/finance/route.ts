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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Mock data for finance
    const invoices = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        type: 'OUTGOING',
        status: 'PAID',
        customerId: 'CUST-001',
        customerName: 'Ahmet Yılmaz',
        customerEmail: 'ahmet.yilmaz@email.com',
        orderId: 'ORD-2024-001',
        orderNumber: 'ORD-2024-001',
        subtotal: 1000,
        taxAmount: 180,
        discountAmount: 0,
        totalAmount: 1180,
        currency: 'TRY',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paidDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'CREDIT_CARD',
        notes: 'Müşteri memnuniyeti yüksek',
        items: [
          {
            description: 'Samsung Galaxy S24',
            quantity: 1,
            unitPrice: 1000,
            total: 1000,
            taxRate: 18
          }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        type: 'OUTGOING',
        status: 'SENT',
        customerId: 'CUST-002',
        customerName: 'Ayşe Demir',
        customerEmail: 'ayse.demir@email.com',
        orderId: 'ORD-2024-002',
        orderNumber: 'ORD-2024-002',
        subtotal: 750,
        taxAmount: 135,
        discountAmount: 50,
        totalAmount: 835,
        currency: 'TRY',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'İndirim uygulandı',
        items: [
          {
            description: 'iPhone 15 Pro',
            quantity: 1,
            unitPrice: 750,
            total: 750,
            taxRate: 18
          }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        type: 'INCOMING',
        status: 'OVERDUE',
        supplierId: 'SUPP-001',
        supplierName: 'Teknoloji Distribütörü A.Ş.',
        supplierEmail: 'fatura@teknoloji.com',
        subtotal: 5000,
        taxAmount: 900,
        discountAmount: 0,
        totalAmount: 5900,
        currency: 'TRY',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Vadesi geçmiş fatura',
        items: [
          {
            description: 'Toplu ürün alımı',
            quantity: 10,
            unitPrice: 500,
            total: 5000,
            taxRate: 18
          }
        ],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        type: 'OUTGOING',
        status: 'DRAFT',
        customerId: 'CUST-003',
        customerName: 'Mehmet Kaya',
        customerEmail: 'mehmet.kaya@email.com',
        orderId: 'ORD-2024-003',
        orderNumber: 'ORD-2024-003',
        subtotal: 1200,
        taxAmount: 216,
        discountAmount: 0,
        totalAmount: 1416,
        currency: 'TRY',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Taslak fatura',
        items: [
          {
            description: 'MacBook Pro M3',
            quantity: 1,
            unitPrice: 1200,
            total: 1200,
            taxRate: 18
          }
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        invoiceNumber: 'INV-2024-005',
        type: 'OUTGOING',
        status: 'CANCELLED',
        customerId: 'CUST-004',
        customerName: 'Fatma Özkan',
        customerEmail: 'fatma.ozkan@email.com',
        orderId: 'ORD-2024-004',
        orderNumber: 'ORD-2024-004',
        subtotal: 800,
        taxAmount: 144,
        discountAmount: 0,
        totalAmount: 944,
        currency: 'TRY',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Müşteri iptal etti',
        items: [
          {
            description: 'iPad Air',
            quantity: 1,
            unitPrice: 800,
            total: 800,
            taxRate: 18
          }
        ],
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const commissions = [
      {
        id: '1',
        marketplaceId: 'HEPSIBURADA',
        marketplaceName: 'Hepsiburada',
        orderId: 'ORD-2024-001',
        orderNumber: 'ORD-2024-001',
        productId: 'PROD-001',
        productName: 'Samsung Galaxy S24',
        salePrice: 1000,
        commissionRate: 8.5,
        commissionAmount: 85,
        currency: 'TRY',
        status: 'PAID',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        marketplaceId: 'TRENDYOL',
        marketplaceName: 'Trendyol',
        orderId: 'ORD-2024-002',
        orderNumber: 'ORD-2024-002',
        productId: 'PROD-002',
        productName: 'iPhone 15 Pro',
        salePrice: 750,
        commissionRate: 12.0,
        commissionAmount: 90,
        currency: 'TRY',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        marketplaceId: 'N11',
        marketplaceName: 'n11',
        orderId: 'ORD-2024-003',
        orderNumber: 'ORD-2024-003',
        productId: 'PROD-003',
        productName: 'MacBook Pro M3',
        salePrice: 1200,
        commissionRate: 10.0,
        commissionAmount: 120,
        currency: 'TRY',
        status: 'PAID',
        paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        marketplaceId: 'AMAZON',
        marketplaceName: 'Amazon',
        orderId: 'ORD-2024-004',
        orderNumber: 'ORD-2024-004',
        productId: 'PROD-004',
        productName: 'iPad Air',
        salePrice: 800,
        commissionRate: 15.0,
        commissionAmount: 120,
        currency: 'TRY',
        status: 'CANCELLED',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        marketplaceId: 'HEPSIBURADA',
        marketplaceName: 'Hepsiburada',
        orderId: 'ORD-2024-005',
        orderNumber: 'ORD-2024-005',
        productId: 'PROD-005',
        productName: 'AirPods Pro',
        salePrice: 400,
        commissionRate: 8.5,
        commissionAmount: 34,
        currency: 'TRY',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const reports = [
      {
        id: '1',
        name: 'Aralık 2024 Gelir Tablosu',
        type: 'INCOME_STATEMENT',
        period: 'MONTHLY',
        startDate: new Date('2024-12-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        status: 'COMPLETED',
        fileUrl: '/reports/income-statement-2024-12.pdf',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Q4 2024 Bilanço',
        type: 'BALANCE_SHEET',
        period: 'QUARTERLY',
        startDate: new Date('2024-10-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        status: 'GENERATING',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: '2024 Yıllık Nakit Akışı',
        type: 'CASH_FLOW',
        period: 'YEARLY',
        startDate: new Date('2024-01-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        status: 'COMPLETED',
        fileUrl: '/reports/cash-flow-2024.pdf',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Aralık 2024 Satış Raporu',
        type: 'SALES_REPORT',
        period: 'MONTHLY',
        startDate: new Date('2024-12-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        status: 'FAILED',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Q4 2024 Komisyon Raporu',
        type: 'COMMISSION_REPORT',
        period: 'QUARTERLY',
        startDate: new Date('2024-10-01').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
        status: 'COMPLETED',
        fileUrl: '/reports/commission-report-q4-2024.pdf',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Calculate financial stats
    const totalRevenue = invoices
      .filter(i => i.type === 'OUTGOING' && i.status === 'PAID')
      .reduce((sum, i) => sum + i.totalAmount, 0);
    
    const totalExpenses = invoices
      .filter(i => i.type === 'INCOMING')
      .reduce((sum, i) => sum + i.totalAmount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const grossProfit = totalRevenue * 0.85; // Assuming 15% cost of goods sold
    
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(i => i.status === 'PAID').length;
    const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE').length;
    
    const totalCommissions = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const paidCommissions = commissions
      .filter(c => c.status === 'PAID')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    const pendingCommissions = commissions
      .filter(c => c.status === 'PENDING')
      .reduce((sum, c) => sum + c.commissionAmount, 0);
    
    const cashFlow = {
      inflow: totalRevenue,
      outflow: totalExpenses + totalCommissions,
      net: totalRevenue - (totalExpenses + totalCommissions)
    };

    const monthlyTrend = [
      {
        month: 'Ekim 2024',
        revenue: 45000,
        expenses: 32000,
        profit: 13000
      },
      {
        month: 'Kasım 2024',
        revenue: 52000,
        expenses: 38000,
        profit: 14000
      },
      {
        month: 'Aralık 2024',
        revenue: 48000,
        expenses: 35000,
        profit: 13000
      }
    ];

    const topExpenseCategories = [
      {
        category: 'Ürün Alımı',
        amount: 25000,
        percentage: 45.5
      },
      {
        category: 'Kargo Maliyetleri',
        amount: 8000,
        percentage: 14.5
      },
      {
        category: 'Pazaryeri Komisyonları',
        amount: 6500,
        percentage: 11.8
      },
      {
        category: 'Reklam ve Pazarlama',
        amount: 5500,
        percentage: 10.0
      },
      {
        category: 'Ofis Giderleri',
        amount: 3000,
        percentage: 5.5
      }
    ];

    const marketplaceCommissions = [
      {
        marketplace: 'Hepsiburada',
        totalCommission: 2500,
        orderCount: 45,
        averageCommission: 55.56
      },
      {
        marketplace: 'Trendyol',
        totalCommission: 3200,
        orderCount: 38,
        averageCommission: 84.21
      },
      {
        marketplace: 'n11',
        totalCommission: 1800,
        orderCount: 25,
        averageCommission: 72.00
      },
      {
        marketplace: 'Amazon',
        totalCommission: 1500,
        orderCount: 20,
        averageCommission: 75.00
      }
    ];

    // Apply filters
    let filteredInvoices = invoices;
    
    if (type) {
      filteredInvoices = filteredInvoices.filter(i => i.type === type);
    }
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(i => i.status === status);
    }
    
    if (dateFrom) {
      filteredInvoices = filteredInvoices.filter(i => 
        new Date(i.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredInvoices = filteredInvoices.filter(i => 
        new Date(i.createdAt) <= new Date(dateTo)
      );
    }

    // Pagination
    const totalPages = Math.ceil(filteredInvoices.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + limit);

    const stats = {
      totalRevenue,
      totalExpenses,
      netProfit,
      grossProfit,
      totalInvoices,
      paidInvoices,
      overdueInvoices,
      totalCommissions,
      paidCommissions,
      pendingCommissions,
      cashFlow,
      monthlyTrend,
      topExpenseCategories,
      recentInvoices: paginatedInvoices,
      recentCommissions: commissions,
      recentReports: reports,
      marketplaceCommissions
    };

    return NextResponse.json({
      stats,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching finance data:', error);
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
    
    // Create new invoice, commission, or report
    console.log('Creating finance item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Finance item created successfully' 
    });
  } catch (error) {
    console.error('Error creating finance item:', error);
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
    
    // Update invoice, commission, or report
    console.log('Updating finance item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Finance item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating finance item:', error);
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
    const type = searchParams.get('type'); // invoice, commission, report
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete invoice, commission, or report
    console.log('Deleting finance item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Finance item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting finance item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
