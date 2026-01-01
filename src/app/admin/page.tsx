'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Download,
  Calendar,
  Percent
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Hazırlanıyor';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Tamamlandı';
      case 'cancelled': return 'İptal';
      default: return status;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} dk önce`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} saat önce`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return days === 1 ? 'Dün' : `${days} gün önce`;
    }
  };

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <AdminLayout title="Dashboard" description="Sistem genel bakış ve KPI'lar">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Hoşgeldin, {session?.user?.name || 'Admin'}
            </h2>
            <p className="text-slate-500 mt-1">
              İşletmenizin genel performans özetini aşağıda bulabilirsiniz.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Bugün: {today}</span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/30">
              <Download className="h-4 w-4" />
              <span>Rapor Oluştur</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Stat Card 1 - Toplam Satış */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +%12
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Toplam Satış</p>
              <h3 className="text-2xl font-bold text-slate-900">
                ₺{stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Stat Card 2 - Yeni Siparişler */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +%5
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Yeni Siparişler</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.totalOrders}
              </h3>
            </div>
          </div>

          {/* Stat Card 3 - Ziyaretçiler */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                <TrendingDown className="h-3 w-3 mr-1" />
                -%2
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Ziyaretçiler</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {stats.activeVisitors.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Stat Card 4 - Dönüşüm Oranı */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Percent className="h-5 w-5" />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                +%0.5
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Dönüşüm Oranı</p>
              <h3 className="text-2xl font-bold text-slate-900">
                %{stats.conversionRate}
              </h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Satış Performansı</h3>
                <p className="text-sm text-slate-500">Son 30 günlük gelir grafiği</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-slate-900 shadow-sm">
                  Haftalık
                </button>
                <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900">
                  Aylık
                </button>
                <button className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-slate-900">
                  Yıllık
                </button>
              </div>
            </div>
            {/* SVG Chart Visualization */}
            <div className="relative h-64 w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                {/* Grid Lines */}
                <line stroke="#e2e8f0" strokeWidth="1" x1="0" x2="500" y1="150" y2="150" />
                <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="100" y2="100" />
                <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="50" y2="50" />
                <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="0" y2="0" />
                {/* Area Gradient Definition */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#137fec" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#137fec" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area Path */}
                <path
                  d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60 C 450 60, 450 30, 500 30 V 150 H 0 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line Path */}
                <path
                  d="M0 100 C 50 100, 50 40, 100 40 C 150 40, 150 80, 200 80 C 250 80, 250 20, 300 20 C 350 20, 350 60, 400 60 C 450 60, 450 30, 500 30"
                  fill="none"
                  stroke="#137fec"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
                {/* Tooltip Indicator */}
                <circle cx="300" cy="20" fill="#ffffff" r="5" stroke="#137fec" strokeWidth="3" />
                <g transform="translate(280, -25)">
                  <rect fill="#1e293b" height="24" rx="4" width="40" />
                  <text fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" x="20" y="16">
                    ₺12K
                  </text>
                </g>
              </svg>
            </div>
            {/* X Axis Labels */}
            <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-1">
              <span>Pzt</span>
              <span>Sal</span>
              <span>Çar</span>
              <span>Per</span>
              <span>Cum</span>
              <span>Cmt</span>
              <span>Paz</span>
            </div>
          </div>

          {/* Secondary Chart (Visitor Sources) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Ziyaretçi Kaynakları</h3>
            <p className="text-sm text-slate-500 mb-6">Trafik kaynakları dağılımı</p>
            <div className="flex-1 flex flex-col justify-center gap-6">
              {/* Source 1 */}
              <div className="group">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Sosyal Medya
                  </span>
                  <span className="text-sm font-bold text-slate-900">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              {/* Source 2 */}
              <div className="group">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    Organik Arama
                  </span>
                  <span className="text-sm font-bold text-slate-900">32%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              {/* Source 3 */}
              <div className="group">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Direkt Trafik
                  </span>
                  <span className="text-sm font-bold text-slate-900">23%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Son Siparişler</h3>
              <Link href="/admin/orders" className="text-sm text-blue-600 font-medium hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Sipariş No</th>
                    <th className="px-6 py-4">Müşteri</th>
                    <th className="px-6 py-4">Tarih</th>
                    <th className="px-6 py-4">Tutar</th>
                    <th className="px-6 py-4">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentOrders.slice(0, 4).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        #{order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatTimeAgo(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-medium">
                        ₺{order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.status === 'delivered' ? 'bg-emerald-500' :
                            order.status === 'pending' || order.status === 'processing' ? 'bg-amber-500' :
                            order.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></span>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">En Çok Satanlar</h3>
            <div className="flex flex-col gap-4">
              {/* Product items would go here - using placeholder for now */}
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-slate-100 bg-cover bg-center shrink-0 border border-slate-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    Örnek Ürün 1
                  </p>
                  <p className="text-xs text-slate-500 truncate">Kategori</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₺1,250</p>
                  <p className="text-xs text-emerald-600 font-medium">85 Satış</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-slate-100 bg-cover bg-center shrink-0 border border-slate-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    Örnek Ürün 2
                  </p>
                  <p className="text-xs text-slate-500 truncate">Kategori</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₺890</p>
                  <p className="text-xs text-emerald-600 font-medium">62 Satış</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-slate-100 bg-cover bg-center shrink-0 border border-slate-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    Örnek Ürün 3
                  </p>
                  <p className="text-xs text-slate-500 truncate">Kategori</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₺1,250</p>
                  <p className="text-xs text-emerald-600 font-medium">41 Satış</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-slate-100 bg-cover bg-center shrink-0 border border-slate-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    Örnek Ürün 4
                  </p>
                  <p className="text-xs text-slate-500 truncate">Kategori</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₺320</p>
                  <p className="text-xs text-emerald-600 font-medium">38 Satış</p>
                </div>
              </div>
            </div>
            <Link
              href="/admin/products"
              className="mt-auto w-full py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors text-center"
            >
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
