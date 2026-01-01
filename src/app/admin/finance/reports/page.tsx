'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
  Users,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>({});
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/admin/unauthorized');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadReports();
    }
  }, [status, period, startDate, endDate]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (showCustomDate && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else {
        params.append('period', period);
      }
      
      const response = await fetch(`/api/admin/finance/reports?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Rapor yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finansal Raporlar</h1>
              <p className="text-sm text-gray-500 mt-0.5">Gelir, gider ve performans analizleri</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadReports}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Excel İndir
            </button>
          </div>
        </div>

        {/* Period Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Rapor Dönemi</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCustomDate(!showCustomDate)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  showCustomDate
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Özel Tarih
              </button>
              <button
                onClick={() => { setPeriod('day'); setShowCustomDate(false); }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  period === 'day' && !showCustomDate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bugün
              </button>
              <button
                onClick={() => { setPeriod('week'); setShowCustomDate(false); }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  period === 'week' && !showCustomDate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Hafta
              </button>
              <button
                onClick={() => { setPeriod('month'); setShowCustomDate(false); }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  period === 'month' && !showCustomDate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Ay
              </button>
              <button
                onClick={() => { setPeriod('year'); setShowCustomDate(false); }}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  period === 'year' && !showCustomDate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Yıl
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {showCustomDate && (
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-6">
                <button
                  onClick={loadReports}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Uygula
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-700">Toplam Gelir</p>
                  <div className="h-10 w-10 bg-green-200 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(reportData.summary?.totalRevenue || 0)}
                </p>
                {reportData.summary?.revenueGrowth !== undefined && (
                  <div className="flex items-center mt-2 text-sm">
                    {getGrowthIcon(reportData.summary.revenueGrowth)}
                    <span className={`ml-1 font-medium ${getGrowthColor(reportData.summary.revenueGrowth)}`}>
                      {Math.abs(reportData.summary.revenueGrowth).toFixed(1)}%
                    </span>
                    <span className="text-gray-600 ml-1">önceki aya göre</span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-700">Bekleyen Ödemeler</p>
                  <div className="h-10 w-10 bg-blue-200 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(reportData.summary?.totalPending || 0)}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  {reportData.invoiceStats?.pending || 0} bekleyen fatura
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-red-700">Gecikmiş Ödemeler</p>
                  <div className="h-10 w-10 bg-red-200 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(reportData.summary?.totalOverdue || 0)}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  {reportData.invoiceStats?.overdue || 0} gecikmiş fatura
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-purple-700">Net Gelir</p>
                  <div className="h-10 w-10 bg-purple-200 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(reportData.summary?.netRevenue || 0)}
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  Gelir - Giderler
                </p>
              </div>
            </div>

            {/* Invoice Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Fatura İstatistikleri
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Toplam Fatura</span>
                    <span className="font-bold text-gray-900">{reportData.invoiceStats?.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">Ödendi</span>
                    <span className="font-bold text-green-900">{reportData.invoiceStats?.paid || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Beklemede</span>
                    <span className="font-bold text-blue-900">{reportData.invoiceStats?.pending || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-red-700">Gecikmiş</span>
                    <span className="font-bold text-red-900">{reportData.invoiceStats?.overdue || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">İptal</span>
                    <span className="font-bold text-gray-900">{reportData.invoiceStats?.cancelled || 0}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                  Ödeme Yöntemleri
                </h3>
                <div className="space-y-3">
                  {reportData.transactionsByMethod && Object.keys(reportData.transactionsByMethod).length > 0 ? (
                    Object.entries(reportData.transactionsByMethod).map(([method, data]: [string, any]) => (
                      <div key={method} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{method}</p>
                          <p className="text-xs text-gray-600">{data.count} işlem</p>
                        </div>
                        <span className="font-bold text-indigo-900">{formatCurrency(data.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Henüz işlem bulunmuyor</p>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            {reportData.revenueByDay && Object.keys(reportData.revenueByDay).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Günlük Gelir Grafiği
                </h3>
                <div className="space-y-2">
                  {Object.entries(reportData.revenueByDay)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([date, amount]: [string, any]) => (
                      <div key={date} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-32">
                          {new Date(date).toLocaleDateString('tr-TR')}
                        </span>
                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center justify-end pr-3"
                            style={{
                              width: `${Math.min(
                                (amount / Math.max(...Object.values(reportData.revenueByDay))) * 100,
                                100
                              )}%`
                            }}
                          >
                            <span className="text-xs font-medium text-white">
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Top Customers */}
            {reportData.topCustomers && reportData.topCustomers.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  En Çok Gelir Getiren Müşteriler
                </h3>
                <div className="space-y-2">
                  {reportData.topCustomers.map((customer: any, index: number) => (
                    <div key={customer.customerId} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center h-8 w-8 bg-purple-200 rounded-full text-sm font-bold text-purple-700">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          Müşteri #{customer.customerId.substring(0, 8)}
                        </span>
                      </div>
                      <span className="font-bold text-purple-900">{formatCurrency(customer.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

