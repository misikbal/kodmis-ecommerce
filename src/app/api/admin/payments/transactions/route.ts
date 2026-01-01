import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import PaymentTransaction from '@/lib/models/PaymentTransaction';

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
    const provider = searchParams.get('provider');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (provider) {
      query.provider = provider;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Fetch transactions
    const transactions = await PaymentTransaction.find(query)
      .populate('orderId', 'orderNumber totalAmount')
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalTransactions = await PaymentTransaction.countDocuments(query);

    // Transform data
    const transformedTransactions = transactions.map((t: any) => ({
      id: t._id.toString(),
      orderId: t.orderId?._id.toString(),
      orderNumber: t.orderId?.orderNumber,
      customerId: t.customerId?._id.toString(),
      customerName: t.customerId ? `${t.customerId.firstName} ${t.customerId.lastName}` : 'N/A',
      customerEmail: t.customerId?.email,
      type: t.type,
      status: t.status,
      amount: t.amount,
      currency: t.currency,
      paymentMethod: t.paymentMethod,
      provider: t.provider,
      transactionId: t.transactionId,
      referenceId: t.referenceId,
      description: t.description,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));

    // Calculate stats
    const totalAmount = await PaymentTransaction.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalTransactions,
      totalAmount: totalAmount[0]?.total || 0,
      completed: totalTransactions
    };

    return NextResponse.json({
      transactions: transformedTransactions,
      stats,
      totalPages: Math.ceil(totalTransactions / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

