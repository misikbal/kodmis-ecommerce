import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Invoice from '@/lib/models/Invoice';
import PaymentTransaction from '@/lib/models/PaymentTransaction';
import PaymentPayout from '@/lib/models/PaymentPayout';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, year
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    let dateQuery: any = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateQuery = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      switch (period) {
        case 'day':
          dateQuery.createdAt = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          dateQuery.createdAt = { $gte: weekAgo };
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          dateQuery.createdAt = { $gte: monthAgo };
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          dateQuery.createdAt = { $gte: yearAgo };
          break;
      }
    }

    // Fetch invoices
    const invoices = await Invoice.find(dateQuery).lean();
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const pendingInvoices = invoices.filter(inv => inv.status === 'SENT' || inv.status === 'DRAFT');
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE');

    // Fetch transactions
    const transactions = await PaymentTransaction.find(dateQuery).lean();
    const successfulTransactions = transactions.filter(t => t.status === 'COMPLETED');
    
    // Fetch payouts
    const payouts = await PaymentPayout.find(dateQuery).lean();
    const completedPayouts = payouts.filter(p => p.status === 'COMPLETED');

    // Revenue calculations
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalTransactions = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalPayouts = completedPayouts.reduce((sum, p) => sum + p.amount, 0);
    const netRevenue = totalRevenue - totalPayouts;

    // Revenue by day for chart
    const revenueByDay: { [key: string]: number } = {};
    paidInvoices.forEach(inv => {
      const date = new Date(inv.paymentDate || inv.updatedAt).toISOString().split('T')[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + inv.totalAmount;
    });

    // Invoice status breakdown
    const invoiceStats = {
      total: invoices.length,
      paid: paidInvoices.length,
      pending: pendingInvoices.length,
      overdue: overdueInvoices.length,
      cancelled: invoices.filter(inv => inv.status === 'CANCELLED').length
    };

    // Transaction stats by payment method
    const transactionsByMethod: { [key: string]: { count: number; amount: number } } = {};
    successfulTransactions.forEach(t => {
      const method = t.paymentMethod || 'Unknown';
      if (!transactionsByMethod[method]) {
        transactionsByMethod[method] = { count: 0, amount: 0 };
      }
      transactionsByMethod[method].count++;
      transactionsByMethod[method].amount += t.amount;
    });

    // Top customers by revenue
    const customerRevenue: { [key: string]: number } = {};
    paidInvoices.forEach(inv => {
      const customerId = inv.customerId?.toString() || 'Unknown';
      customerRevenue[customerId] = (customerRevenue[customerId] || 0) + inv.totalAmount;
    });
    
    const topCustomers = Object.entries(customerRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([customerId, revenue]) => ({
        customerId,
        revenue
      }));

    // Monthly comparison (current vs previous)
    const currentMonth = new Date();
    const previousMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1));
    
    const currentMonthInvoices = await Invoice.find({
      status: 'PAID',
      paymentDate: { $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) }
    }).lean();
    
    const previousMonthInvoices = await Invoice.find({
      status: 'PAID',
      paymentDate: { 
        $gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
        $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      }
    }).lean();

    const currentMonthRevenue = currentMonthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const previousMonthRevenue = previousMonthInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalPending,
        totalOverdue,
        totalTransactions,
        totalPayouts,
        netRevenue,
        revenueGrowth
      },
      invoiceStats,
      transactionsByMethod,
      revenueByDay,
      topCustomers,
      period
    });
  } catch (error) {
    console.error('Error fetching financial reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}




