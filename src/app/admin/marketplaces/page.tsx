'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import MarketplaceConnectionModal from '@/components/admin/MarketplaceConnectionModal';
import ProductSyncInterface from '@/components/admin/ProductSyncInterface';
import OrderManagementInterface from '@/components/admin/OrderManagementInterface';
import MarketplaceAnalytics from '@/components/admin/MarketplaceAnalytics';
import MarketplaceOnboarding from '@/components/admin/MarketplaceOnboarding';
import ErrorHandlingComponents from '@/components/admin/ErrorHandlingComponents';
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
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Settings,
  Image as ImageIcon,
  ExternalLink,
  Link,
  Zap,
  Activity,
  DollarSign,
  ShoppingCart,
  Users,
  Target,
  Shield,
  Key,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  ArrowUpDown,
  FileText,
  Database,
  Server,
  Cloud,
  Lock,
  Unlock,
  Bell,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Truck,
  Receipt,
  TrendingDown,
  Minus,
  Maximize,
  Minimize,
  Info,
  HelpCircle,
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
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Share2,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'lucide-react';

interface Marketplace {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  isActive: boolean;
  isConnected: boolean;
  lastSyncDate?: string;
  syncStatus: 'SUCCESS' | 'ERROR' | 'PENDING' | 'DISABLED';
  errorCount: number;
  productCount: number;
  orderCount: number;
  totalSales: number;
  commissionRate: number;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  settings: {
    autoSync: boolean;
    syncInterval: number; // minutes
    priceMarkup: number; // percentage
    stockSync: boolean;
    orderSync: boolean;
    imageSync: boolean;
  };
  categories: Array<{
    id: string;
    name: string;
    marketplaceCategoryId: string;
    isMapped: boolean;
  }>;
  attributes: Array<{
    id: string;
    name: string;
    marketplaceAttributeId: string;
    isMapped: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SyncLog {
  id: string;
  marketplaceId: string;
  marketplaceName: string;
  type: 'PRODUCT' | 'ORDER' | 'STOCK' | 'PRICE';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  itemsProcessed: number;
  itemsSuccessful: number;
  itemsFailed: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds
}

interface MarketplaceStats {
  totalMarketplaces: number;
  activeMarketplaces: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  syncErrors: number;
  lastSyncDate: string;
  marketplaces: Marketplace[];
  recentSyncLogs: SyncLog[];
}

function MarketplacesPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [marketplaceData, setMarketplaceData] = useState<MarketplaceStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get initial tab from URL params
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'marketplaces' | 'sync-logs' | 'settings' | 'products' | 'orders' | 'analytics' | 'errors'>(initialTab as any);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if ((session.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    fetchMarketplaceData();
  }, [session, status, router]);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/marketplaces');
      if (response.ok) {
        const data = await response.json();
        setMarketplaceData(data);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (marketplaceId: string) => {
    try {
      const response = await fetch(`/api/admin/marketplaces/${marketplaceId}/sync`, {
        method: 'POST'
      });
      if (response.ok) {
        fetchMarketplaceData(); // Refresh data
      }
    } catch (error) {
      console.error('Error syncing marketplace:', error);
    }
  };

  const handleConfigure = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setIsConfigModalOpen(true);
  };

  const handleSaveMarketplaceConnection = async (data: any) => {
    try {
      const response = await fetch('/api/admin/marketplaces', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        fetchMarketplaceData(); // Refresh data
        setIsConfigModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving marketplace connection:', error);
    }
  };

  const handleSyncProducts = async (productIds: string[], marketplaceId: string) => {
    try {
      const response = await fetch(`/api/admin/marketplaces/${marketplaceId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'PRODUCT', productIds }),
      });
      
      if (response.ok) {
        fetchMarketplaceData(); // Refresh data
      }
    } catch (error) {
      console.error('Error syncing products:', error);
    }
  };

  const handleMapCategories = async (productIds: string[], categoryMapping: Record<string, string>) => {
    try {
      // Implement category mapping logic
      console.log('Mapping categories:', productIds, categoryMapping);
    } catch (error) {
      console.error('Error mapping categories:', error);
    }
  };

  const handleRetryError = async (errorId: string) => {
    try {
      // Implement error retry logic
      console.log('Retrying error:', errorId);
    } catch (error) {
      console.error('Error retrying:', error);
    }
  };

  const handleIgnoreError = async (errorId: string) => {
    try {
      // Implement error ignore logic
      console.log('Ignoring error:', errorId);
    } catch (error) {
      console.error('Error ignoring:', error);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      // Implement error resolve logic
      console.log('Resolving error:', errorId);
    } catch (error) {
      console.error('Error resolving:', error);
    }
  };

  // Handle tab changes and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    const newUrl = new URL(window.location.href);
    if (tab === 'overview') {
      newUrl.searchParams.delete('tab');
    } else {
      newUrl.searchParams.set('tab', tab);
    }
    router.replace(newUrl.pathname + newUrl.search);
  };

  // Show onboarding if no marketplaces are connected
  useEffect(() => {
    if (marketplaceData && marketplaceData.activeMarketplaces === 0) {
      setShowOnboarding(true);
    }
  }, [marketplaceData]);

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab as any);
  }, [searchParams]);

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DISABLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'Başarılı';
      case 'ERROR': return 'Hata';
      case 'PENDING': return 'Beklemede';
      case 'DISABLED': return 'Devre Dışı';
      default: return status;
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return CheckCircle;
      case 'ERROR': return XCircle;
      case 'PENDING': return Clock;
      case 'DISABLED': return Pause;
      default: return AlertCircle;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Pazaryeri Entegrasyonları" description="Hepsiburada, Trendyol, n11, Amazon entegrasyonları">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!marketplaceData) {
    return (
      <AdminLayout title="Pazaryeri Entegrasyonları" description="Hepsiburada, Trendyol, n11, Amazon entegrasyonları">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pazaryeri Entegrasyonları" description="Hepsiburada, Trendyol, n11, Amazon entegrasyonları">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Pazaryeri Entegrasyonları</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {marketplaceData.activeMarketplaces} aktif
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
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
            
            <button 
              onClick={() => setShowOnboarding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Entegrasyon
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Pazaryeri</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaceData.totalMarketplaces}</p>
                <p className="text-xs text-green-600">{marketplaceData.activeMarketplaces} aktif</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaceData.totalProducts.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Senkronize edilen</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
                <p className="text-2xl font-bold text-gray-900">₺{marketplaceData.totalSales.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Bu ay</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Senkronizasyon Hataları</p>
                <p className="text-2xl font-bold text-gray-900">{marketplaceData.syncErrors}</p>
                <p className="text-xs text-red-600">Son 24 saat</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
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
                { id: 'marketplaces', label: 'Pazaryerleri', icon: Globe },
                { id: 'products', label: 'Ürün Sync', icon: Package },
                { id: 'orders', label: 'Siparişler', icon: ShoppingCart },
                { id: 'analytics', label: 'Analitik', icon: TrendingUp },
                { id: 'errors', label: 'Hatalar', icon: AlertTriangle },
                { id: 'sync-logs', label: 'Sync Logları', icon: Activity },
                { id: 'settings', label: 'Ayarlar', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
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
                {/* Marketplace Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pazaryeri Durumu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {marketplaceData.marketplaces.map((marketplace) => {
                      const StatusIcon = getSyncStatusIcon(marketplace.syncStatus);
                      return (
                        <div key={marketplace.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={marketplace.logo}
                                alt={marketplace.name}
                                className="h-8 w-8 object-contain"
                              />
                              <h4 className="font-medium text-gray-900">{marketplace.name}</h4>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSyncStatusColor(marketplace.syncStatus)}`}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {getSyncStatusText(marketplace.syncStatus)}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Ürün:</span>
                              <span className="font-medium">{marketplace.productCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sipariş:</span>
                              <span className="font-medium">{marketplace.orderCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Satış:</span>
                              <span className="font-medium">₺{marketplace.totalSales.toLocaleString()}</span>
                            </div>
                            {marketplace.lastSyncDate && (
                              <div className="flex justify-between">
                                <span>Son Sync:</span>
                                <span className="font-medium">
                                  {new Date(marketplace.lastSyncDate).toLocaleDateString('tr-TR')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleSync(marketplace.id)}
                              className="flex-1 px-3 py-2 text-black text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <RefreshCw className="h-4 w-4 mr-1 inline" />
                              Sync
                            </button>
                            <button
                              onClick={() => handleConfigure(marketplace)}
                              className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <Settings className="h-4 w-4 mr-1 inline" />
                              Ayarlar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Sync Logs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Senkronizasyonlar</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pazaryeri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tip
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              İşlem
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Süre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {marketplaceData.recentSyncLogs.slice(0, 5).map((log) => {
                            const StatusIcon = getSyncStatusIcon(log.status);
                            return (
                              <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {log.marketplaceName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {log.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getSyncStatusColor(log.status)}`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {getSyncStatusText(log.status)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {log.itemsSuccessful}/{log.itemsProcessed}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {log.duration ? `${log.duration}s` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(log.startedAt).toLocaleDateString('tr-TR')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Marketplaces Tab */}
            {activeTab === 'marketplaces' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Pazaryeri Listesi</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Entegrasyon
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceData.marketplaces.map((marketplace) => {
                    const StatusIcon = getSyncStatusIcon(marketplace.syncStatus);
                    return (
                      <div key={marketplace.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={marketplace.logo}
                              alt={marketplace.name}
                              className="h-10 w-10 object-contain"
                            />
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{marketplace.name}</h4>
                              <a
                                href={marketplace.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                {marketplace.website}
                              </a>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSyncStatusColor(marketplace.syncStatus)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {getSyncStatusText(marketplace.syncStatus)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Ürün Sayısı:</span>
                            <span className="font-medium">{marketplace.productCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Sipariş Sayısı:</span>
                            <span className="font-medium">{marketplace.orderCount}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Toplam Satış:</span>
                            <span className="font-medium">₺{marketplace.totalSales.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Komisyon Oranı:</span>
                            <span className="font-medium">%{marketplace.commissionRate}</span>
                          </div>
                          {marketplace.lastSyncDate && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Son Sync:</span>
                              <span className="font-medium">
                                {new Date(marketplace.lastSyncDate).toLocaleDateString('tr-TR')}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSync(marketplace.id)}
                            className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-1 inline" />
                            Sync
                          </button>
                          <button
                            onClick={() => handleConfigure(marketplace)}
                            className="flex-1 px-3 py-2 text-black text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Settings className="h-4 w-4 mr-1 inline" />
                            Ayarlar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sync Logs Tab */}
            {activeTab === 'sync-logs' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Senkronizasyon Logları</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4 mr-2" />
                      Log İndir
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tümünü Sync Et
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pazaryeri
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tip
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hata
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Süre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {marketplaceData.recentSyncLogs.map((log) => {
                          const StatusIcon = getSyncStatusIcon(log.status);
                          return (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {log.marketplaceName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getSyncStatusColor(log.status)}`}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {getSyncStatusText(log.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>
                                  <div className="font-medium">{log.itemsSuccessful}/{log.itemsProcessed}</div>
                                  <div className="text-xs text-gray-500">Başarılı/Toplam</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.itemsFailed > 0 ? (
                                  <span className="text-red-600 font-medium">{log.itemsFailed}</span>
                                ) : (
                                  <span className="text-green-600">0</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.duration ? `${log.duration}s` : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>
                                  <div>{new Date(log.startedAt).toLocaleDateString('tr-TR')}</div>
                                  <div className="text-xs">{new Date(log.startedAt).toLocaleTimeString('tr-TR')}</div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <ProductSyncInterface
                  marketplaceId={selectedMarketplace?.id || ''}
                  marketplaceName={selectedMarketplace?.name || 'Tüm Pazaryerleri'}
                  onSyncProducts={handleSyncProducts}
                  onMapCategories={handleMapCategories}
                />
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <OrderManagementInterface
                  marketplaceId={selectedMarketplace?.id}
                  marketplaceName={selectedMarketplace?.name}
                />
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <MarketplaceAnalytics
                  marketplaceId={selectedMarketplace?.id}
                  marketplaceName={selectedMarketplace?.name}
                />
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div className="space-y-6">
                <ErrorHandlingComponents
                  onRetry={handleRetryError}
                  onIgnore={handleIgnoreError}
                  onResolve={handleResolveError}
                />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Ayarlar</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Varsayılan Fiyat Marjı (%)
                        </label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Otomatik Senkronizasyon Aralığı (dakika)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="15">15 dakika</option>
                          <option value="30">30 dakika</option>
                          <option value="60">1 saat</option>
                          <option value="240">4 saat</option>
                          <option value="1440">24 saat</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="autoSync"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="autoSync" className="text-sm font-medium text-gray-700">
                          Otomatik senkronizasyonu etkinleştir
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="stockSync"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="stockSync" className="text-sm font-medium text-gray-700">
                          Stok senkronizasyonu
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="orderSync"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="orderSync" className="text-sm font-medium text-gray-700">
                          Sipariş senkronizasyonu
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="imageSync"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="imageSync" className="text-sm font-medium text-gray-700">
                          Görsel senkronizasyonu
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Ayarları Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {isConfigModalOpen && selectedMarketplace && (
        <MarketplaceConnectionModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          marketplace={selectedMarketplace}
          onSave={handleSaveMarketplaceConnection}
        />
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <MarketplaceOnboarding
          onComplete={() => {
            setShowOnboarding(false);
            fetchMarketplaceData();
          }}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
    </AdminLayout>
  );
}

export default function MarketplacesPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    }>
      <MarketplacesPageContent />
    </Suspense>
  );
}
