import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Build query
    let query: any = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }

    // Check if invoices exist, if not create sample data
    const invoiceCount = await Invoice.countDocuments();
    
    if (invoiceCount === 0) {
      // Get first user for sample data
      const sampleUser = await User.findOne();
      
      if (sampleUser) {
        const sampleInvoices = [
          {
            invoiceNumber: 'INV-2024-001',
            customerId: sampleUser._id,
            issueDate: new Date('2024-01-15'),
            dueDate: new Date('2024-02-15'),
            status: 'PAID',
            type: 'SALES',
            items: [
              {
                description: 'Premium Plan - Aylık Abonelik',
                quantity: 1,
                unitPrice: 299,
                taxRate: 18,
                total: 352.82
              }
            ],
            subtotal: 299,
            taxAmount: 53.82,
            totalAmount: 352.82,
            paidAmount: 352.82,
            currency: 'TRY',
            billingAddress: {
              name: sampleUser.name || 'Örnek Müşteri',
              company: 'ABC Şirketi',
              address: 'Örnek Mahallesi, Test Sokak No:1',
              city: 'İstanbul',
              postalCode: '34000',
              country: 'Türkiye',
              taxId: '1234567890'
            },
            paymentMethod: 'Kredi Kartı',
            paymentDate: new Date('2024-01-16')
          },
          {
            invoiceNumber: 'INV-2024-002',
            customerId: sampleUser._id,
            issueDate: new Date('2024-01-20'),
            dueDate: new Date('2024-02-20'),
            status: 'SENT',
            type: 'SALES',
            items: [
              {
                description: 'Ürün Satışı - Özel Paket',
                quantity: 2,
                unitPrice: 150,
                taxRate: 18,
                total: 354
              }
            ],
            subtotal: 300,
            taxAmount: 54,
            totalAmount: 354,
            paidAmount: 0,
            currency: 'TRY',
            billingAddress: {
              name: sampleUser.name || 'Örnek Müşteri',
              address: 'Örnek Mahallesi, Test Sokak No:2',
              city: 'Ankara',
              postalCode: '06000',
              country: 'Türkiye'
            }
          },
          {
            invoiceNumber: 'INV-2024-003',
            customerId: sampleUser._id,
            issueDate: new Date('2023-12-10'),
            dueDate: new Date('2024-01-10'),
            status: 'OVERDUE',
            type: 'SALES',
            items: [
              {
                description: 'Danışmanlık Hizmeti',
                quantity: 5,
                unitPrice: 200,
                taxRate: 18,
                total: 1180
              }
            ],
            subtotal: 1000,
            taxAmount: 180,
            totalAmount: 1180,
            paidAmount: 0,
            currency: 'TRY',
            billingAddress: {
              name: sampleUser.name || 'Örnek Müşteri',
              company: 'XYZ Ltd.',
              address: 'Örnek Mahallesi, Test Sokak No:3',
              city: 'İzmir',
              postalCode: '35000',
              country: 'Türkiye',
              taxId: '9876543210'
            }
          }
        ];

        await Invoice.insertMany(sampleInvoices);
      }
    }

    // Fetch invoices
    const invoices = await Invoice.find(query)
      .populate('customerId', 'name email')
      .populate('orderId', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalInvoices = await Invoice.countDocuments(query);

    // Transform data
    const transformedInvoices = invoices.map((inv: any) => ({
      id: inv._id.toString(),
      invoiceNumber: inv.invoiceNumber,
      orderId: inv.orderId?._id?.toString(),
      orderNumber: inv.orderId?.orderNumber,
      customerId: inv.customerId?._id?.toString(),
      customerName: inv.customerId?.name,
      customerEmail: inv.customerId?.email,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      status: inv.status,
      type: inv.type,
      items: inv.items,
      subtotal: inv.subtotal,
      taxAmount: inv.taxAmount,
      totalAmount: inv.totalAmount,
      paidAmount: inv.paidAmount,
      currency: inv.currency,
      billingAddress: inv.billingAddress,
      notes: inv.notes,
      paymentMethod: inv.paymentMethod,
      paymentDate: inv.paymentDate,
      createdAt: inv.createdAt,
      updatedAt: inv.updatedAt
    }));

    // Calculate stats
    const allInvoices = await Invoice.find({}).lean();
    const stats = {
      totalInvoices: allInvoices.length,
      draft: allInvoices.filter(i => i.status === 'DRAFT').length,
      sent: allInvoices.filter(i => i.status === 'SENT').length,
      paid: allInvoices.filter(i => i.status === 'PAID').length,
      overdue: allInvoices.filter(i => i.status === 'OVERDUE').length,
      totalRevenue: allInvoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalAmount, 0),
      pendingAmount: allInvoices.filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED').reduce((sum, i) => sum + i.totalAmount, 0)
    };

    return NextResponse.json({
      invoices: transformedInvoices,
      stats,
      totalPages: Math.ceil(totalInvoices / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
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
    const { 
      customerId, 
      orderId,
      issueDate, 
      dueDate, 
      items, 
      billingAddress,
      notes,
      type 
    } = body;
    
    if (!customerId || !issueDate || !dueDate || !items || !billingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const taxAmount = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0
    );
    const totalAmount = subtotal + taxAmount;

    // Generate invoice number
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let invoiceNumber = 'INV-2024-001';
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      invoiceNumber = `INV-2024-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      customerId,
      orderId: orderId || undefined,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      status: 'DRAFT',
      type: type || 'SALES',
      items: items.map((item: any) => ({
        ...item,
        total: item.quantity * item.unitPrice * (1 + (item.taxRate / 100))
      })),
      subtotal,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      currency: 'TRY',
      billingAddress,
      notes
    });

    await invoice.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Invoice created successfully',
      invoice 
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




