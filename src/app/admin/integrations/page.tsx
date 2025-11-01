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
  Key,
  Link,
  Wifi,
  WifiOff,
  Bell,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building2,
  Truck,
  Users,
  Target,
  Activity,
  Zap,
  Brain,
  Wand2,
  Send,
  Play,
  Pause,
  Square,
  RotateCcw,
  ExternalLink,
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
  Info,
  HelpCircle,
  Lock,
  Unlock,
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

interface ApiKey {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastUsed?: string;
  usageCount: number;
  rateLimit: {
    requests: number;
    period: 'MINUTE' | 'HOUR' | 'DAY';
  };
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'FAILING';
  secret: string;
  retryCount: number;
  lastTriggered?: string;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
  createdAt: string;
  updatedAt: string;
}

interface ThirdPartyApp {
  id: string;
  name: string;
  type: 'ANALYTICS' | 'PAYMENT' | 'SHIPPING' | 'MARKETING' | 'SUPPORT' | 'OTHER';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  description: string;
  logo: string;
  website: string;
  lastSync?: string;
  configuration: Record<string, any>;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface IntegrationStats {
  totalApiKeys: number;
  activeApiKeys: number;
  totalWebhooks: number;
  activeWebhooks: number;
  totalApps: number;
  connectedApps: number;
  totalApiCalls: number;
  successfulApiCalls: number;
  failedApiCalls: number;
  averageResponseTime: number;
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  thirdPartyApps: ThirdPartyApp[];
  recentApiCalls: Array<{
    id: string;
    apiKey: string;
    endpoint: string;
    method: string;
    status: number;
    responseTime: number;
    timestamp: string;
  }>;
  webhookLogs: Array<{
    id: string;
    webhookId: string;
    event: string;
    status: 'SUCCESS' | 'FAILED' | 'RETRYING';
    responseTime: number;
    timestamp: string;
    error?: string;
  }>;
}

export default function IntegrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [integrationData, setIntegrationData] = useState<IntegrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'webhooks' | 'apps'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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

    fetchIntegrationData();
  }, [session, status, router]);

  const fetchIntegrationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/integrations');
      if (response.ok) {
        const data = await response.json();
        setIntegrationData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    setSelectedItems([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'CONNECTED':
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'INACTIVE':
      case 'DISCONNECTED': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
      case 'FAILING':
      case 'ERROR':
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'RETRYING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'INACTIVE': return 'Pasif';
      case 'SUSPENDED': return 'Askıya Alındı';
      case 'CONNECTED': return 'Bağlı';
      case 'DISCONNECTED': return 'Bağlantısız';
      case 'FAILING': return 'Hata Veriyor';
      case 'ERROR': return 'Hata';
      case 'SUCCESS': return 'Başarılı';
      case 'FAILED': return 'Başarısız';
      case 'RETRYING': return 'Yeniden Deneniyor';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'ANALYTICS': return 'Analitik';
      case 'PAYMENT': return 'Ödeme';
      case 'SHIPPING': return 'Kargo';
      case 'MARKETING': return 'Pazarlama';
      case 'SUPPORT': return 'Destek';
      case 'OTHER': return 'Diğer';
      default: return type;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Entegrasyonlar" description="API keys, webhooks ve 3rd party uygulamalar">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!integrationData) {
    return (
      <AdminLayout title="Entegrasyonlar" description="API keys, webhooks ve 3rd party uygulamalar">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Entegrasyonlar" description="API keys, webhooks ve 3rd party uygulamalar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Entegrasyonlar</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {integrationData.totalApiKeys} API key
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
              Log İndir
            </button>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
                <p className="text-sm font-medium text-gray-600">API Keys</p>
                <p className="text-2xl font-bold text-gray-900">{integrationData.totalApiKeys}</p>
                <p className="text-xs text-green-600">{integrationData.activeApiKeys} aktif</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Webhooks</p>
                <p className="text-2xl font-bold text-gray-900">{integrationData.totalWebhooks}</p>
                <p className="text-xs text-green-600">{integrationData.activeWebhooks} aktif</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Link className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">3rd Party Apps</p>
                <p className="text-2xl font-bold text-gray-900">{integrationData.totalApps}</p>
                <p className="text-xs text-green-600">{integrationData.connectedApps} bağlı</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-2xl font-bold text-gray-900">{integrationData.totalApiCalls.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{integrationData.averageResponseTime}ms ortalama</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Activity className="h-6 w-6 text-orange-600" />
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
                { id: 'api-keys', label: 'API Keys', icon: Key },
                { id: 'webhooks', label: 'Webhooks', icon: Link },
                { id: 'apps', label: '3rd Party Apps', icon: Globe }
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
                {/* API Performance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API Performansı</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{integrationData.successfulApiCalls.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Başarılı Çağrılar</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{integrationData.failedApiCalls.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Başarısız Çağrılar</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{integrationData.averageResponseTime}ms</div>
                      <div className="text-sm text-gray-600">Ortalama Yanıt Süresi</div>
                    </div>
                  </div>
                </div>

                {/* Recent API Calls */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son API Çağrıları</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              API Key
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Endpoint
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Response Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {integrationData.recentApiCalls.slice(0, 10).map((call) => (
                            <tr key={call.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {call.apiKey}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {call.endpoint}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  call.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                  call.method === 'POST' ? 'bg-green-100 text-green-800' :
                                  call.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {call.method}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  call.status >= 200 && call.status < 300 ? 'bg-green-100 text-green-800' :
                                  call.status >= 400 ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {call.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {call.responseTime}ms
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(call.timestamp).toLocaleString('tr-TR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Webhook Logs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Logları</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Webhook
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Response Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {integrationData.webhookLogs.slice(0, 10).map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {log.webhookId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.event}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                                  {getStatusText(log.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {log.responseTime}ms
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(log.timestamp).toLocaleString('tr-TR')}
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

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni API Key
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedItems.length} API key seçildi
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBulkAction('activate')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Aktifleştir
                        </button>
                        <button
                          onClick={() => handleBulkAction('deactivate')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                        >
                          Pasifleştir
                        </button>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Sil
                        </button>
                        <button
                          onClick={() => setSelectedItems([])}
                          className="px-3 py-1 text-blue-600 text-sm border border-blue-300 rounded-lg hover:bg-blue-100"
                        >
                          Seçimi Temizle
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Keys Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İzinler
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kullanım
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Son Kullanım
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {integrationData.apiKeys.map((apiKey) => (
                          <tr key={apiKey.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(apiKey.id)}
                                onChange={() => handleItemSelect(apiKey.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                                <div className="text-sm text-gray-500">{apiKey.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-mono text-gray-900">
                                  {apiKey.key.substring(0, 8)}...
                                </span>
                                <button className="ml-2 text-gray-400 hover:text-gray-600">
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {apiKey.permissions.slice(0, 2).map((permission) => (
                                  <span key={permission} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {permission}
                                  </span>
                                ))}
                                {apiKey.permissions.length > 2 && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    +{apiKey.permissions.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(apiKey.status)}`}>
                                {getStatusText(apiKey.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {apiKey.usageCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString('tr-TR') : 'Hiç kullanılmadı'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks Tab */}
            {activeTab === 'webhooks' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Webhook
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrationData.webhooks.map((webhook) => (
                    <div key={webhook.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{webhook.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(webhook.status)}`}>
                          {getStatusText(webhook.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">URL:</span>
                          <span className="ml-2 text-gray-600 font-mono text-xs">{webhook.url}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Events:</span>
                          <span className="ml-2 text-gray-600">{webhook.events.length} event</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Retry Count:</span>
                          <span className="ml-2 text-gray-600">{webhook.retryCount}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Success Rate:</span>
                          <span className="ml-2 text-gray-600">
                            %{((webhook.successCount / (webhook.successCount + webhook.failureCount)) * 100).toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Avg Response:</span>
                          <span className="ml-2 text-gray-600">{webhook.averageResponseTime}ms</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <div>Son tetikleme: {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString('tr-TR') : 'Hiç tetiklenmedi'}</div>
                        <div>Oluşturulma: {new Date(webhook.createdAt).toLocaleDateString('tr-TR')}</div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-1 inline" />
                          Görüntüle
                        </button>
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Edit className="h-4 w-4 mr-1 inline" />
                          Düzenle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3rd Party Apps Tab */}
            {activeTab === 'apps' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">3rd Party Uygulamalar</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Entegrasyon
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrationData.thirdPartyApps.map((app) => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Globe className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{app.name}</h4>
                            <p className="text-sm text-gray-500">{getTypeText(app.type)}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Açıklama:</span>
                          <span className="ml-2 text-gray-600">{app.description}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Website:</span>
                          <span className="ml-2 text-blue-600">{app.website}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">İzinler:</span>
                          <span className="ml-2 text-gray-600">{app.permissions.length} izin</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Son Senkronizasyon:</span>
                          <span className="ml-2 text-gray-600">
                            {app.lastSync ? new Date(app.lastSync).toLocaleString('tr-TR') : 'Hiç senkronize edilmedi'}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <div>Oluşturulma: {new Date(app.createdAt).toLocaleDateString('tr-TR')}</div>
                        <div>Güncelleme: {new Date(app.updatedAt).toLocaleDateString('tr-TR')}</div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Settings className="h-4 w-4 mr-1 inline" />
                          Ayarlar
                        </button>
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <ExternalLink className="h-4 w-4 mr-1 inline" />
                          Website
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
