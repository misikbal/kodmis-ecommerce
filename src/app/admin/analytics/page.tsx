'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  X,
  Check,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Calendar,
  Tag,
  Star,
  TrendingUp,
  BarChart3,
  Globe,
  Copy,
  Archive,
  Unarchive,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Settings,
  Image as ImageIcon,
  Users,
  ShoppingCart,
  DollarSign,
  Target,
  Activity,
  TrendingDown,
  Minus,
  Maximize,
  Minimize,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  Wifi,
  WifiOff,
  Bell,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building2,
  Truck,
  Zap,
  Brain,
  Wand2,
  Send,
  Play,
  Pause,
  Square,
  RotateCcw,
  ExternalLink,
  Link,
  Share2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  BookOpen,
  Video,
  Headphones,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Camera,
  Gamepad2,
  Music,
  Book,
  Home,
  Car,
  Shirt,
  Watch,
  Gift,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Banknote,
  Wallet,
  Coins,
  PiggyBank,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCcw as RotateCcwIcon,
  RefreshCw as RefreshCwIcon,
  Loader,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Key as KeyIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Bell as BellIcon,
  MessageSquare as MessageSquareIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Building2 as Building2Icon,
  Truck as TruckIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Brain as BrainIcon,
  Wand2 as Wand2Icon,
  Send as SendIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Square as SquareIcon,
  RotateCcw as RotateCcwIcon2,
  ExternalLink as ExternalLinkIcon,
  Link as LinkIcon,
  Share2 as Share2Icon,
  Heart as HeartIcon,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,
  Flag as FlagIcon,
  Bookmark as BookmarkIcon,
  BookOpen as BookOpenIcon,
  Video as VideoIcon,
  Headphones as HeadphonesIcon,
  Monitor as MonitorIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as LaptopIcon,
  Camera as CameraIcon,
  Gamepad2 as Gamepad2Icon,
  Music as MusicIcon,
  Book as BookIcon,
  Home as HomeIcon,
  Car as CarIcon,
  Shirt as ShirtIcon,
  Watch as WatchIcon,
  Gift as GiftIcon
} from 'lucide-react';

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface ConversionData {
  date: string;
  visitors: number;
  addToCart: number;
  checkout: number;
  purchases: number;
  conversionRate: number;
  cartAbandonmentRate: number;
}

interface CohortData {
  cohort: string;
  period: number;
  users: number;
  retention: number;
  revenue: number;
}

interface ProductAnalytics {
  productId: string;
  productName: string;
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  category: string;
}

interface AnalyticsStats {
  totalVisitors: number;
  totalPageViews: number;
  totalSessions: number;
  averageBounceRate: number;
  averageSessionDuration: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  cartAbandonmentRate: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
  trafficData: TrafficData[];
  conversionData: ConversionData[];
  cohortData: CohortData[];
  topProducts: ProductAnalytics[];
  topCategories: Array<{
    category: string;
    views: number;
    revenue: number;
    orders: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    conversionRate: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    visitors: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    revenue: number;
    percentage: number;
  }>;
  hourlyTraffic: Array<{
    hour: number;
    visitors: number;
    conversions: number;
  }>;
  funnelData: Array<{
    step: string;
    visitors: number;
    dropoff: number;
    conversionRate: number;
  }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'conversion' | 'cohort'>('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);

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

    fetchAnalyticsData();
  }, [session, status, router, dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?dateRange=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Analitik" description="Traffic, conversion ve performans analizi">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout title="Analitik" description="Traffic, conversion ve performans analizi">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analitik" description="Traffic, conversion ve performans analizi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Analitik</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {analyticsData.totalVisitors.toLocaleString()} ziyaretçi
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Son 7 gün</option>
              <option value="30d">Son 30 gün</option>
              <option value="90d">Son 90 gün</option>
              <option value="1y">Son 1 yıl</option>
            </select>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtreler
              {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>
            
            <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Rapor İndir
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Ziyaretçi</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{analyticsData.totalSessions.toLocaleString()} oturum</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sayfa Görüntüleme</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalPageViews.toLocaleString()}</p>
                <p className="text-xs text-gray-600">%{analyticsData.averageBounceRate.toFixed(1)} bounce rate</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">%{analyticsData.conversionRate.toFixed(2)}</p>
                <p className="text-xs text-red-600">%{analyticsData.cartAbandonmentRate.toFixed(1)} cart abandonment</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş Değeri</p>
                <p className="text-2xl font-bold text-gray-900">₺{analyticsData.averageOrderValue.toLocaleString()}</p>
                <p className="text-xs text-green-600">₺{analyticsData.totalRevenue.toLocaleString()} toplam gelir</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                { id: 'traffic', label: 'Traffic', icon: Users },
                { id: 'conversion', label: 'Conversion', icon: Target },
                { id: 'cohort', label: 'Cohort', icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Top Products */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satılan Ürünler</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ürün
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Görüntüleme
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sepete Ekleme
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Satış
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Conversion Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gelir
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.topProducts.slice(0, 10).map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                                  <div className="text-sm text-gray-500">{product.category}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.views.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.addToCart.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.purchases.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  %{product.conversionRate.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₺{product.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Kaynakları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyticsData.trafficSources.map((source) => (
                      <div key={source.source} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{source.source}</h4>
                          <span className="text-sm font-medium text-blue-600">%{source.percentage.toFixed(1)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ziyaretçi:</span>
                            <span className="font-medium">{source.visitors.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversion:</span>
                            <span className="font-medium">%{source.conversionRate.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analyticsData.deviceBreakdown.map((device) => (
                      <div key={device.device} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{device.visitors.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{device.device}</div>
                        <div className="text-xs text-blue-600">%{device.percentage.toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geographic Data */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Coğrafi Dağılım</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ülke
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ziyaretçi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gelir
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Oran
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.geographicData.map((geo) => (
                            <tr key={geo.country} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {geo.country}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {geo.visitors.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₺{geo.revenue.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  %{geo.percentage.toFixed(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Traffic Tab */}
            {activeTab === 'traffic' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Traffic Analizi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Özel Rapor
                    </button>
                  </div>
                </div>

                {/* Traffic Chart Placeholder */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Günlük Traffic Trendi</h4>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Traffic grafiği burada görünecek</p>
                    </div>
                  </div>
                </div>

                {/* Hourly Traffic */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Saatlik Traffic</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-12 gap-2">
                      {analyticsData.hourlyTraffic.map((hour) => (
                        <div key={hour.hour} className="text-center">
                          <div className="text-xs text-gray-600 mb-1">{hour.hour}:00</div>
                          <div className="bg-blue-100 rounded h-16 flex items-end justify-center">
                            <div
                              className="bg-blue-600 rounded-t w-full"
                              style={{ height: `${(hour.visitors / Math.max(...analyticsData.hourlyTraffic.map(h => h.visitors))) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{hour.visitors}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Traffic Sources Detail */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı Traffic Kaynakları</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kaynak
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ziyaretçi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Oran
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Conversion Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ortalama Süre
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.trafficSources.map((source) => (
                            <tr key={source.source} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {source.source}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {source.visitors.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  %{source.percentage.toFixed(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  %{source.conversionRate.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {Math.floor(Math.random() * 5) + 2}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversion Tab */}
            {activeTab === 'conversion' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Conversion Analizi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Funnel Analizi
                    </button>
                  </div>
                </div>

                {/* Funnel Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Satış Funnel'ı</h4>
                  <div className="space-y-4">
                    {analyticsData.funnelData.map((step, index) => (
                      <div key={step.step} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-700">{step.step}</div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-8 relative">
                            <div
                              className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ width: `${step.conversionRate}%` }}
                            >
                              {step.visitors.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="w-24 text-sm text-gray-600 text-right">
                          %{step.conversionRate.toFixed(1)}
                        </div>
                        {index < analyticsData.funnelData.length - 1 && (
                          <div className="w-16 text-sm text-red-600 text-right">
                            -{step.dropoff.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">%{analyticsData.conversionRate.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Genel Conversion Rate</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">₺{analyticsData.averageOrderValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Ortalama Sipariş Değeri</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-red-600">%{analyticsData.cartAbandonmentRate.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Sepet Terk Oranı</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600">{analyticsData.totalOrders.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Toplam Sipariş</div>
                  </div>
                </div>

                {/* Top Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Performansı</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kategori
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Görüntüleme
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gelir
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.topCategories.map((category) => (
                            <tr key={category.category} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {category.category}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {category.views.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {category.orders.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₺{category.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cohort Tab */}
            {activeTab === 'cohort' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Cohort Analizi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Cohort
                    </button>
                  </div>
                </div>

                {/* Customer Retention */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Retention Oranı</h4>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">%{analyticsData.customerRetentionRate.toFixed(1)}</div>
                    <div className="text-gray-600">Ortalama müşteri retention oranı</div>
                  </div>
                </div>

                {/* Cohort Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Retention Tablosu</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cohort
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kullanıcı Sayısı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Retention Oranı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gelir
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analyticsData.cohortData.map((cohort) => (
                            <tr key={`${cohort.cohort}-${cohort.period}`} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cohort.cohort} - {cohort.period}. dönem
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {cohort.users.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  cohort.retention >= 70 ? 'bg-green-100 text-green-800' :
                                  cohort.retention >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  %{cohort.retention.toFixed(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₺{cohort.revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Customer Segments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Yeni Müşteriler</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{analyticsData.newCustomers.toLocaleString()}</div>
                      <div className="text-gray-600">Bu dönemde yeni müşteri</div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Dönen Müşteriler</h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.returningCustomers.toLocaleString()}</div>
                      <div className="text-gray-600">Tekrar satın alan müşteri</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
