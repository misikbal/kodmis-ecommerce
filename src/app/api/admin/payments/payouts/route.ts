import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import PaymentPayout from '@/lib/models/PaymentPayout';

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

    // Build query
    let query: any = {};
    
    if (status) {
      query.status = status;
    }

    // Fetch payouts
    const payouts = await PaymentPayout.find(query)
      .populate('marketplaceId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalPayouts = await PaymentPayout.countDocuments(query);

    // Transform data
    const transformedPayouts = payouts.map((p: any) => ({
      id: p._id.toString(),
      marketplaceId: p.marketplaceId?._id.toString(),
      marketplaceName: p.marketplaceId?.name,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      payoutMethod: p.payoutMethod,
      accountDetails: p.accountDetails,
      referenceId: p.referenceId,
      description: p.description,
      scheduledDate: p.scheduledDate,
      processedDate: p.processedDate,
      failureReason: p.failureReason,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    // Calculate stats
    const totalAmount = await PaymentPayout.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = {
      totalPayouts,
      totalAmount: totalAmount[0]?.total || 0,
      completed: await PaymentPayout.countDocuments({ status: 'COMPLETED' }),
      pending: await PaymentPayout.countDocuments({ status: 'PENDING' }),
      processing: await PaymentPayout.countDocuments({ status: 'PROCESSING' })
    };

    return NextResponse.json({
      payouts: transformedPayouts,
      stats,
      totalPages: Math.ceil(totalPayouts / limit),
      currentPage: page,
      limit
    });
  } catch (error) {
    console.error('Error fetching payouts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

