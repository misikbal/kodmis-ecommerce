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
    const paymentMethod = searchParams.get('paymentMethod');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Mock data for payments
    const transactions = [
      {
        id: '1',
        orderId: 'ORD-2024-001',
        orderNumber: 'ORD-2024-001',
        customerName: 'Ahmet Yılmaz',
        customerEmail: 'ahmet.yilmaz@email.com',
        amount: 1250,
        currency: 'TRY',
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'IYZICO',
        status: 'COMPLETED',
        transactionId: 'TXN-001-2024',
        referenceNumber: 'REF-001-2024',
        commission: 37.5,
        netAmount: 1212.5,
        fee: 37.5,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        installmentCount: 1,
        installmentAmount: 1250,
        eInvoiceStatus: 'DELIVERED',
        eInvoiceNumber: 'EINV-2024-001',
        eInvoiceDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        orderId: 'ORD-2024-002',
        orderNumber: 'ORD-2024-002',
        customerName: 'Ayşe Demir',
        customerEmail: 'ayse.demir@email.com',
        amount: 850,
        currency: 'TRY',
        paymentMethod: 'DEBIT_CARD',
        paymentProvider: 'GARANTI',
        status: 'COMPLETED',
        transactionId: 'TXN-002-2024',
        referenceNumber: 'REF-002-2024',
        commission: 25.5,
        netAmount: 824.5,
        fee: 25.5,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        installmentCount: 1,
        installmentAmount: 850,
        eInvoiceStatus: 'SENT',
        eInvoiceNumber: 'EINV-2024-002',
        eInvoiceDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        orderId: 'ORD-2024-003',
        orderNumber: 'ORD-2024-003',
        customerName: 'Mehmet Kaya',
        customerEmail: 'mehmet.kaya@email.com',
        amount: 2100,
        currency: 'TRY',
        paymentMethod: 'INSTALLMENT',
        paymentProvider: 'AKBANK',
        status: 'COMPLETED',
        transactionId: 'TXN-003-2024',
        referenceNumber: 'REF-003-2024',
        commission: 63,
        netAmount: 2037,
        fee: 63,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        installmentCount: 6,
        installmentAmount: 350,
        eInvoiceStatus: 'PENDING'
      },
      {
        id: '4',
        orderId: 'ORD-2024-004',
        orderNumber: 'ORD-2024-004',
        customerName: 'Fatma Özkan',
        customerEmail: 'fatma.ozkan@email.com',
        amount: 450,
        currency: 'TRY',
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentProvider: 'CASH',
        status: 'PENDING',
        transactionId: 'TXN-004-2024',
        referenceNumber: 'REF-004-2024',
        commission: 0,
        netAmount: 450,
        fee: 0,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        eInvoiceStatus: 'PENDING'
      },
      {
        id: '5',
        orderId: 'ORD-2024-005',
        orderNumber: 'ORD-2024-005',
        customerName: 'Ali Şahin',
        customerEmail: 'ali.sahin@email.com',
        amount: 750,
        currency: 'TRY',
        paymentMethod: 'DIGITAL_WALLET',
        paymentProvider: 'PAYPAL',
        status: 'FAILED',
        transactionId: 'TXN-005-2024',
        referenceNumber: 'REF-005-2024',
        commission: 0,
        netAmount: 0,
        fee: 0,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        failedReason: 'Insufficient funds',
        eInvoiceStatus: 'CANCELLED'
      },
      {
        id: '6',
        orderId: 'ORD-2024-006',
        orderNumber: 'ORD-2024-006',
        customerName: 'Zeynep Yıldız',
        customerEmail: 'zeynep.yildiz@email.com',
        amount: 1800,
        currency: 'TRY',
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'ISBANK',
        status: 'REFUNDED',
        transactionId: 'TXN-006-2024',
        referenceNumber: 'REF-006-2024',
        commission: 54,
        netAmount: 0,
        fee: 54,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        refundAmount: 1800,
        refundReason: 'Customer request',
        installmentCount: 1,
        installmentAmount: 1800,
        eInvoiceStatus: 'DELIVERED',
        eInvoiceNumber: 'EINV-2024-006',
        eInvoiceDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        orderId: 'ORD-2024-007',
        orderNumber: 'ORD-2024-007',
        customerName: 'Can Özdemir',
        customerEmail: 'can.ozdemir@email.com',
        amount: 3200,
        currency: 'TRY',
        paymentMethod: 'BANK_TRANSFER',
        paymentProvider: 'YAPIKREDI',
        status: 'COMPLETED',
        transactionId: 'TXN-007-2024',
        referenceNumber: 'REF-007-2024',
        commission: 96,
        netAmount: 3104,
        fee: 96,
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        installmentCount: 1,
        installmentAmount: 3200,
        eInvoiceStatus: 'DELIVERED',
        eInvoiceNumber: 'EINV-2024-007',
        eInvoiceDate: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        orderId: 'ORD-2024-008',
        orderNumber: 'ORD-2024-008',
        customerName: 'Elif Korkmaz',
        customerEmail: 'elif.korkmaz@email.com',
        amount: 950,
        currency: 'TRY',
        paymentMethod: 'CREDIT_CARD',
        paymentProvider: 'IYZICO',
        status: 'PARTIALLY_REFUNDED',
        transactionId: 'TXN-008-2024',
        referenceNumber: 'REF-008-2024',
        commission: 28.5,
        netAmount: 475,
        fee: 28.5,
        createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        refundAmount: 475,
        refundReason: 'Defective product',
        installmentCount: 1,
        installmentAmount: 950,
        eInvoiceStatus: 'DELIVERED',
        eInvoiceNumber: 'EINV-2024-008',
        eInvoiceDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
      }
    ];

    const payouts = [
      {
        id: '1',
        amount: 15000,
        currency: 'TRY',
        status: 'COMPLETED',
        bankAccount: {
          bankName: 'Garanti BBVA',
          accountNumber: '1234567890',
          accountHolder: 'Kodmis E-Ticaret Ltd.',
          iban: 'TR12 0006 2000 1234 5678 9012 34'
        },
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        processedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        transactionCount: 25,
        totalFees: 450,
        netAmount: 14550,
        description: 'Haftalık payout - 25 işlem',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        amount: 22000,
        currency: 'TRY',
        status: 'PENDING',
        bankAccount: {
          bankName: 'Akbank',
          accountNumber: '0987654321',
          accountHolder: 'Kodmis E-Ticaret Ltd.',
          iban: 'TR34 0004 1000 0987 6543 2109 87'
        },
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        transactionCount: 35,
        totalFees: 660,
        netAmount: 21340,
        description: 'Haftalık payout - 35 işlem',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        amount: 18000,
        currency: 'TRY',
        status: 'PROCESSING',
        bankAccount: {
          bankName: 'İş Bankası',
          accountNumber: '1122334455',
          accountHolder: 'Kodmis E-Ticaret Ltd.',
          iban: 'TR56 0006 4000 0011 2233 4455 67'
        },
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        transactionCount: 28,
        totalFees: 540,
        netAmount: 17460,
        description: 'Haftalık payout - 28 işlem',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        amount: 12000,
        currency: 'TRY',
        status: 'FAILED',
        bankAccount: {
          bankName: 'Yapı Kredi',
          accountNumber: '5566778899',
          accountHolder: 'Kodmis E-Ticaret Ltd.',
          iban: 'TR78 0006 7010 0000 5566 7788 99'
        },
        scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        transactionCount: 20,
        totalFees: 360,
        netAmount: 11640,
        description: 'Haftalık payout - 20 işlem',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        failureReason: 'Invalid bank account details'
      }
    ];

    // Calculate payment method stats
    const paymentMethodStats = transactions.reduce((acc, transaction) => {
      const method = transaction.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count++;
      acc[method].amount += transaction.amount;
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0);
    const totalPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayouts = payouts.filter(p => p.status === 'PENDING').length;
    const failedTransactions = transactions.filter(t => t.status === 'FAILED').length;
    const successRate = ((totalTransactions - failedTransactions) / totalTransactions) * 100;
    const averageTransactionAmount = totalAmount / totalTransactions;

    const topPaymentMethods = Object.entries(paymentMethodStats)
      .map(([method, stats]) => ({
        method,
        count: stats.count,
        amount: stats.amount,
        percentage: (stats.count / totalTransactions) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // E-Invoice stats
    const eInvoiceStats = {
      total: transactions.filter(t => t.eInvoiceStatus !== 'CANCELLED').length,
      pending: transactions.filter(t => t.eInvoiceStatus === 'PENDING').length,
      sent: transactions.filter(t => t.eInvoiceStatus === 'SENT').length,
      delivered: transactions.filter(t => t.eInvoiceStatus === 'DELIVERED').length,
      failed: transactions.filter(t => t.eInvoiceStatus === 'FAILED').length
    };

    // Apply filters
    let filteredTransactions = transactions;
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }
    
    if (paymentMethod) {
      filteredTransactions = filteredTransactions.filter(t => t.paymentMethod === paymentMethod);
    }
    
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(t => 
        new Date(t.createdAt) <= new Date(dateTo)
      );
    }

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / limit);
    const startIndex = (page - 1) * limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + limit);

    const stats = {
      totalTransactions,
      totalAmount,
      totalFees,
      totalPayouts,
      pendingPayouts,
      failedTransactions,
      successRate,
      averageTransactionAmount,
      topPaymentMethods,
      recentTransactions: paginatedTransactions,
      recentPayouts: payouts,
      eInvoiceStats
    };

    return NextResponse.json({
      stats,
      totalPages,
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching payment data:', error);
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
    
    // Create new payout or process refund
    console.log('Creating payment item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment item created successfully' 
    });
  } catch (error) {
    console.error('Error creating payment item:', error);
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
    
    // Update transaction or payout
    console.log('Updating payment item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating payment item:', error);
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
    const type = searchParams.get('type'); // transaction, payout
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete transaction or payout
    console.log('Deleting payment item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Payment item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting payment item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
