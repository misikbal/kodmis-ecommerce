'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Target,
  Truck,
  CreditCard,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  Zap,
  Bell,
  ExternalLink
} from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  returnRate: number;
  averageDeliveryTime: number;
  activeVisitors: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  const kpiCards = [
    {
      title: 'Brüt Ciro',
      value: `₺${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+15%',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [120, 135, 142, 158, 165, 172, 180]
    },
    {
      title: 'Net Ciro',
      value: `₺${(stats.totalRevenue * 0.85).toLocaleString()}`,
      icon: Target,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [100, 115, 120, 135, 140, 145, 153]
    },
    {
      title: 'Sipariş Adedi',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [45, 52, 48, 61, 58, 67, 72]
    },
    {
      title: 'Ortalama Sipariş Değeri',
      value: `₺${stats.averageOrderValue.toLocaleString()}`,
      icon: BarChart3,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [250, 260, 255, 270, 275, 280, 285]
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+2%',
      changeType: 'positive' as const,
      period: 'Bu hafta',
      trend: [2.1, 2.3, 2.0, 2.4, 2.5, 2.6, 2.8]
    },
    {
      title: 'Ortalama Teslim Süresi',
      value: `${stats.averageDeliveryTime} gün`,
      icon: Truck,
      color: 'bg-cyan-500',
      change: '-1 gün',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [5, 4.5, 4.2, 4.0, 3.8, 3.5, 3.2]
    },
    {
      title: 'İade Oranı',
      value: `${stats.returnRate}%`,
      icon: RefreshCw,
      color: 'bg-red-500',
      change: '-0.5%',
      changeType: 'positive' as const,
      period: 'Bu ay',
      trend: [8, 7.5, 7.2, 6.8, 6.5, 6.2, 5.8]
    },
    {
      title: 'Aktif Ziyaretçi',
      value: stats.activeVisitors.toLocaleString(),
      icon: Activity,
      color: 'bg-indigo-500',
      change: '+23%',
      changeType: 'positive' as const,
      period: 'Şu anda',
      trend: [120, 135, 142, 158, 165, 172, 180]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  return (
    <AdminLayout title="Dashboard" description="Sistem genel bakış ve KPI'lar">
      <div className="space-y-6">
        {/* Welcome & Quick Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Hoş geldiniz, {session?.user?.name}! 👋
              </h2>
              <p className="text-blue-100 mb-4">
                Bugün sisteminizde {stats.totalProducts} ürün, {stats.totalOrders} sipariş ve {stats.totalCustomers} müşteri bulunmaktadır.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  <span>{stats.activeVisitors} aktif ziyaretçi</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{stats.pendingOrders} bekleyen sipariş</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>{stats.lowStockProducts} düşük stok</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl text-black font-bold">₺{stats.monthlyRevenue.toLocaleString()}</div>
                <div className="text-blue-500 text-sm">Bu ayki gelir</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </div>
                    <div className="text-xs text-gray-500">{card.period}</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                {/* Mini trend chart placeholder */}
                <div className="mt-4 h-8 bg-gray-100 rounded flex items-end space-x-1">
                  {card.trend.map((value, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(value / Math.max(...card.trend)) * 100}%`,
                        width: '8px'
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Alerts & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-orange-500" />
                  Sistem Uyarıları
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Tümünü Gör
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'error' ? 'bg-red-50 border-red-400' :
                    alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {alert.type === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                        {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-600" />}
                        {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Plus className="h-5 w-5 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Yeni Ürün Ekle</p>
                  <p className="text-sm text-gray-500">Ürün kataloğuna yeni ürün ekleyin</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Zap className="h-5 w-5 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Kampanya Başlat</p>
                  <p className="text-sm text-gray-500">Yeni pazarlama kampanyası oluşturun</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-5 w-5 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Sipariş Oluştur</p>
                  <p className="text-sm text-gray-500">Manuel sipariş girişi yapın</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5 text-orange-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Rapor İndir</p>
                  <p className="text-sm text-gray-500">Aylık satış raporunu indirin</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Orders & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  Tümünü Gör
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₺{order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sistem Durumu</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Veritabanı</span>
                </div>
                <span className="text-sm text-green-600">Çevrimiçi</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Ödeme Sistemi</span>
                </div>
                <span className="text-sm text-green-600">Aktif</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Kargo Entegrasyonu</span>
                </div>
                <span className="text-sm text-green-600">Bağlı</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Pazaryeri Sync</span>
                </div>
                <span className="text-sm text-yellow-600">3 Hata</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sistem Durumunu Yenile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
