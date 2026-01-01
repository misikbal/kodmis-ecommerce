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
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Settings,
  Image as ImageIcon,
  Target,
  Users,
  DollarSign,
  ShoppingCart,
  Gift,
  Percent,
  Zap,
  Brain,
  Wand2,
  FileText,
  Mail,
  MessageSquare,
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
  Activity,
  TrendingDown,
  Minus,
  Maximize,
  Minimize,
  Info,
  HelpCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Key,
  Wifi,
  WifiOff,
  Bell,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Truck,
  Receipt,
  Download as DownloadIcon,
  Upload as UploadIcon
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'DISCOUNT' | 'FREE_SHIPPING' | 'BUY_GET' | 'FLASH_SALE' | 'SEASONAL';
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  targetAudience: 'ALL' | 'NEW_CUSTOMERS' | 'EXISTING_CUSTOMERS' | 'VIP_CUSTOMERS' | 'SEGMENT';
  targetSegmentId?: string;
  applicableProducts: 'ALL' | 'CATEGORY' | 'BRAND' | 'SPECIFIC_PRODUCTS';
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  applicableProducts: 'ALL' | 'CATEGORY' | 'BRAND' | 'SPECIFIC_PRODUCTS';
  productIds?: string[];
  categoryIds?: string[];
  brandIds?: string[];
  totalOrders: number;
  totalDiscount: number;
  createdAt: string;
  updatedAt: string;
}

interface AIStudio {
  id: string;
  type: 'PRODUCT_DESCRIPTION' | 'AD_TEXT' | 'EMAIL_SUBJECT' | 'SOCIAL_MEDIA' | 'SEO_TITLE' | 'SEO_DESCRIPTION';
  input: string;
  output: string[];
  language: string;
  tone: 'PROFESSIONAL' | 'CASUAL' | 'FRIENDLY' | 'FORMAL' | 'CREATIVE';
  length: 'SHORT' | 'MEDIUM' | 'LONG';
  createdAt: string;
}

interface MarketingStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalCoupons: number;
  activeCoupons: number;
  totalRevenue: number;
  totalDiscounts: number;
  conversionRate: number;
  topCampaigns: Campaign[];
  recentCoupons: Coupon[];
  aiStudioHistory: AIStudio[];
  aiMarketingScore: {
    score: number;
    level: 'GELIŞTIRILEBILIR' | 'İYİ' | 'HARIKA';
    suggestions: string[];
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  aiRecommendations: {
    salesBoost: string[];
    lowStockCampaign: string[];
    competitorAnalysis: string[];
  };
}

export default function MarketingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [marketingData, setMarketingData] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'coupons' | 'ai-studio' | 'ai-campaigns' | 'ai-ads' | 'ai-automation'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiType, setAiType] = useState('PRODUCT_DESCRIPTION');
  const [aiTone, setAiTone] = useState('PROFESSIONAL');
  const [aiLength, setAiLength] = useState('MEDIUM');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'ai', message: string, timestamp: string}>>([
    {
      id: '1',
      type: 'ai',
      message: 'Merhaba! Ben AI pazarlama asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');

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

    fetchMarketingData();
  }, [session, status, router]);

  const fetchMarketingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/marketing');
      if (response.ok) {
        const data = await response.json();
        setMarketingData(data);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
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

  const handleAIGenerate = async () => {
    try {
      const response = await fetch('/api/admin/marketing/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: aiType,
          input: aiInput,
          tone: aiTone,
          length: aiLength
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle AI response
        console.log('AI generated content:', data);
        setIsAIModalOpen(false);
        setAiInput('');
        fetchMarketingData(); // Refresh to show new AI content
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: chatInput,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'Bu konuda size yardımcı olabilirim. Hangi tür kampanya oluşturmak istiyorsunuz?',
        'Müşteri segmentasyonu için önerilerim var. Hangi ürün kategorisi için kampanya düşünüyorsunuz?',
        'Reklam bütçenizi optimize etmek için birkaç önerim var. Hangi platformda reklam vermek istiyorsunuz?',
        'E-posta kampanyası için AI destekli içerik üretebilirim. Hangi ürün için kampanya yapmak istiyorsunuz?',
        'Sosyal medya stratejinizi geliştirmek için önerilerim var. Hangi platformlarda aktif olmak istiyorsunuz?'
      ];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'DRAFT': return 'Taslak';
      case 'PAUSED': return 'Duraklatıldı';
      case 'COMPLETED': return 'Tamamlandı';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DISCOUNT': return 'bg-blue-100 text-blue-800';
      case 'FREE_SHIPPING': return 'bg-green-100 text-green-800';
      case 'BUY_GET': return 'bg-purple-100 text-purple-800';
      case 'FLASH_SALE': return 'bg-red-100 text-red-800';
      case 'SEASONAL': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'DISCOUNT': return 'İndirim';
      case 'FREE_SHIPPING': return 'Ücretsiz Kargo';
      case 'BUY_GET': return 'Al Kazan';
      case 'FLASH_SALE': return 'Flash Sale';
      case 'SEASONAL': return 'Sezonsal';
      default: return type;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Pazarlama" description="Kampanyalar, kuponlar ve AI Studio">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!marketingData) {
    return (
      <AdminLayout title="Pazarlama" description="Kampanyalar, kuponlar ve AI Studio">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pazarlama" description="Kampanyalar, kuponlar ve AI Studio">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Destekli Pazarlama</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {marketingData.activeCampaigns} aktif kampanya
            </span>
          </div>
          
          {/* AI Marketing Score */}
          <div className="flex items-center space-x-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm font-medium text-gray-700">AI Pazarlama Skoru</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${
                      marketingData.aiMarketingScore.level === 'HARIKA' ? 'text-green-600' :
                      marketingData.aiMarketingScore.level === 'İYİ' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {marketingData.aiMarketingScore.score}/100
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      marketingData.aiMarketingScore.level === 'HARIKA' ? 'bg-green-100 text-green-800' :
                      marketingData.aiMarketingScore.level === 'İYİ' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {marketingData.aiMarketingScore.level}
                    </span>
                    {marketingData.aiMarketingScore.trend === 'UP' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : marketingData.aiMarketingScore.trend === 'DOWN' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
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
            
            <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kampanya
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kampanya</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData.totalCampaigns}</p>
                <p className="text-xs text-green-600">{marketingData.activeCampaigns} aktif</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kupon</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData.totalCoupons}</p>
                <p className="text-xs text-green-600">{marketingData.activeCoupons} aktif</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{marketingData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Kampanyalardan</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">%{marketingData.conversionRate.toFixed(1)}</p>
                <p className="text-xs text-gray-600">Ortalama</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Boost Recommendations */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Satışları Artırmak için 3 Öneri</h3>
              </div>
              <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                AI Önerisi
              </span>
            </div>
            <div className="space-y-3">
              {marketingData.aiRecommendations.salesBoost.map((recommendation, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                    <button className="ml-2 px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors">
                      Uygula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Campaign */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Stokta Azalan Ürün Kampanyası</h3>
              </div>
              <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                AI Önerisi
              </span>
            </div>
            <div className="space-y-3">
              {marketingData.aiRecommendations.lowStockCampaign.map((recommendation, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                    <button className="ml-2 px-3 py-1 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors">
                      Uygula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Rakip Fiyat Analizi</h3>
              </div>
              <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                AI Önerisi
              </span>
            </div>
            <div className="space-y-3">
              {marketingData.aiRecommendations.competitorAnalysis.map((recommendation, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                    <button className="ml-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors">
                      Uygula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                { id: 'ai-campaigns', label: 'AI Kampanyalar', icon: Wand2 },
                { id: 'ai-ads', label: 'AI Reklamlar', icon: Globe },
                { id: 'ai-automation', label: 'E-posta & SMS', icon: Mail },
                { id: 'campaigns', label: 'Kampanyalar', icon: Target },
                { id: 'coupons', label: 'Kuponlar', icon: Gift },
                { id: 'ai-studio', label: 'AI Studio', icon: Brain }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
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
                {/* Top Campaigns */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Başarılı Kampanyalar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketingData.topCampaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                            {getStatusText(campaign.status)}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tip:</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                              {getTypeText(campaign.type)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sipariş:</span>
                            <span className="font-medium">{campaign.totalOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Gelir:</span>
                            <span className="font-medium">₺{campaign.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversion:</span>
                            <span className="font-medium">%{campaign.conversionRate.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Performance Insights */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performans Raporu</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Geçen Aya Göre Analiz</h4>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Brain className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">AI Özet Rapor</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Geçen aya göre satışlar <strong>%15 arttı</strong>. En başarılı kampanya: <strong>Black Friday</strong>.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Satış Artışı:</span>
                            <span className="font-medium text-green-600">+%15</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Müşteri Kazanımı:</span>
                            <span className="font-medium text-green-600">+320</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">En İyi Kampanya:</span>
                            <span className="font-medium">Black Friday</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Önümüzdeki 1 Ay Tahmini</h4>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">AI Tahmin Modülü</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Önümüzdeki 1 ayda <strong>₺45,000</strong> ek gelir bekleniyor.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tahmini Gelir:</span>
                            <span className="font-medium text-blue-600">₺45,000</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Yeni Müşteri:</span>
                            <span className="font-medium text-blue-600">+180</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Önerilen Bütçe:</span>
                            <span className="font-medium">₺8,500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Performance Charts */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Kampanya Performans Grafikleri</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Kampanya Bazlı Satış</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Black Friday</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-red-600 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺125,000</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Yeni Müşteri Hoş Geldin</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺35,000</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ücretsiz Kargo</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺89,000</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">2 Al 1 Öde</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺45,000</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Müşteri Dönüş Oranı</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Flash Sale - Elektronik</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-600 h-2 rounded-full" style={{width: '90%'}}></div>
                            </div>
                            <span className="text-sm font-medium">%15.7</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Yeni Müşteri Hoş Geldin</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                            <span className="text-sm font-medium">%12.3</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">2 Al 1 Öde</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                            </div>
                            <span className="text-sm font-medium">%9.2</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ücretsiz Kargo</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '45%'}}></div>
                            </div>
                            <span className="text-sm font-medium">%6.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Coupons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Oluşturulan Kuponlar</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kupon Kodu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tip
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Değer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Kullanım
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durum
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {marketingData.recentCoupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                                  <div className="text-sm text-gray-500">{coupon.name}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {coupon.type === 'PERCENTAGE' ? 'Yüzde' : 
                                 coupon.type === 'FIXED_AMOUNT' ? 'Sabit Tutar' : 'Ücretsiz Kargo'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {coupon.type === 'PERCENTAGE' ? `%${coupon.value}` : 
                                 coupon.type === 'FIXED_AMOUNT' ? `₺${coupon.value}` : 'Ücretsiz'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {coupon.usedCount}/{coupon.usageLimit || '∞'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {coupon.isActive ? 'Aktif' : 'Pasif'}
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

            {/* AI Campaigns Tab */}
            {activeTab === 'ai-campaigns' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Kampanya Önerileri</h3>
                    <p className="text-sm text-gray-600">Yapay zeka tarafından önerilen kampanyaları tek tıkla uygulayın</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Önerileri Yenile
                  </button>
                </div>

                {/* AI Campaign Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Cart Abandonment Campaign */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Sepet Terk Kampanyası</h4>
                          <p className="text-xs text-gray-600">AI Önerisi</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                        Yüksek Dönüş
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-700">
                        Sepetini terk eden müşterilere özel %10 indirim kodu gönder
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tahmini Dönüş:</span>
                          <span className="font-medium text-green-600">%15-20</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maliyet:</span>
                          <span className="font-medium text-blue-600">₺2,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef:</span>
                          <span className="font-medium">250 müşteri</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-red-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1 inline" />
                        Hemen Uygula
                      </button>
                      <button className="px-3 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* New Customer Welcome */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Yeni Müşteri Hoş Geldin</h4>
                          <p className="text-xs text-gray-600">AI Önerisi</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                        Orta Dönüş
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-700">
                        Yeni kayıt olan müşterilere %15 hoş geldin indirimi
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tahmini Dönüş:</span>
                          <span className="font-medium text-green-600">%25-30</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maliyet:</span>
                          <span className="font-medium text-blue-600">₺1,800</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef:</span>
                          <span className="font-medium">120 müşteri</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1 inline" />
                        Hemen Uygula
                      </button>
                      <button className="px-3 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Flash Sale Campaign */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Flash Sale - Elektronik</h4>
                          <p className="text-xs text-gray-600">AI Önerisi</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-medium rounded-full">
                        Yüksek Risk
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-700">
                        Elektronik ürünlerde 24 saatlik %40 flash sale
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-purple-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tahmini Dönüş:</span>
                          <span className="font-medium text-green-600">%35-45</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maliyet:</span>
                          <span className="font-medium text-red-600">₺8,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef:</span>
                          <span className="font-medium">200 müşteri</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-purple-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-purple-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1 inline" />
                        Hemen Uygula
                      </button>
                      <button className="px-3 py-2 text-sm border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* VIP Customer Campaign */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-yellow-500 rounded-lg">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">VIP Müşteri Kampanyası</h4>
                          <p className="text-xs text-gray-600">AI Önerisi</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded-full">
                        Düşük Risk
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-700">
                        VIP müşterilere özel %20 indirim ve ücretsiz kargo
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-yellow-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tahmini Dönüş:</span>
                          <span className="font-medium text-green-600">%40-50</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maliyet:</span>
                          <span className="font-medium text-blue-600">₺3,200</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef:</span>
                          <span className="font-medium">80 müşteri</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-yellow-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-yellow-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1 inline" />
                        Hemen Uygula
                      </button>
                      <button className="px-3 py-2 text-sm border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Seasonal Campaign */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Sevgililer Günü</h4>
                          <p className="text-xs text-gray-600">AI Önerisi</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">
                        Orta Risk
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <p className="text-sm text-gray-700">
                        Sevgililer Günü için özel ürün koleksiyonu ve %25 indirim
                      </p>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tahmini Dönüş:</span>
                          <span className="font-medium text-green-600">%30-35</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maliyet:</span>
                          <span className="font-medium text-blue-600">₺4,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hedef:</span>
                          <span className="font-medium">150 müşteri</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        <Zap className="h-4 w-4 mr-1 inline" />
                        Hemen Uygula
                      </button>
                      <button className="px-3 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campaign Performance Prediction */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Kampanya Başarı Tahmini</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">%85</div>
                      <div className="text-sm text-gray-600">Ortalama Başarı Oranı</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">₺45,000</div>
                      <div className="text-sm text-gray-600">Tahmini Ek Gelir</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">320</div>
                      <div className="text-sm text-gray-600">Yeni Müşteri Kazanımı</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Ads Tab */}
            {activeTab === 'ai-ads' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Destekli Reklam Yönetimi</h3>
                    <p className="text-sm text-gray-600">Google Ads, Meta Ads ve diğer platformlarda otomatik reklam optimizasyonu</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Reklam
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Senkronize Et
                    </button>
                  </div>
                </div>

                {/* Platform Connections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Google Ads */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Google Ads</h4>
                          <p className="text-sm text-gray-600">Bağlı</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Aktif
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Günlük Bütçe:</span>
                        <span className="font-medium">₺500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bu Ay Harcama:</span>
                        <span className="font-medium">₺12,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROAS:</span>
                        <span className="font-medium text-green-600">3.2x</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700">
                        AI Optimize Et
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                        Reklamları Görüntüle
                      </button>
                    </div>
                  </div>

                  {/* Meta Ads */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Meta Ads</h4>
                          <p className="text-sm text-gray-600">Bağlı</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Aktif
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Günlük Bütçe:</span>
                        <span className="font-medium">₺300</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bu Ay Harcama:</span>
                        <span className="font-medium">₺7,800</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROAS:</span>
                        <span className="font-medium text-green-600">2.8x</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700">
                        AI Optimize Et
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                        Reklamları Görüntüle
                      </button>
                    </div>
                  </div>

                  {/* TikTok Ads */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Video className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">TikTok Ads</h4>
                          <p className="text-sm text-gray-600">Bağlanmadı</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        Pasif
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Günlük Bütçe:</span>
                        <span className="font-medium">-</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bu Ay Harcama:</span>
                        <span className="font-medium">-</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROAS:</span>
                        <span className="font-medium text-gray-400">-</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button className="w-full bg-gray-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-gray-700">
                        Hesap Bağla
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-3 py-2 text-sm rounded-lg hover:bg-gray-50" disabled>
                        Reklamları Görüntüle
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Ad Text Generator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Reklam Metni Üretici</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ürün/Kampanya Açıklaması
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Reklam metni oluşturmak istediğiniz ürün veya kampanyayı açıklayın..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="google">Google Ads</option>
                        <option value="meta">Meta Ads (Facebook/Instagram)</option>
                        <option value="tiktok">TikTok Ads</option>
                        <option value="twitter">Twitter Ads</option>
                      </select>
                      
                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                        Reklam Tipi
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="search">Arama Reklamı</option>
                        <option value="display">Görüntülü Reklam</option>
                        <option value="video">Video Reklam</option>
                        <option value="social">Sosyal Medya</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI Reklam Metni Oluştur
                    </button>
                  </div>
                </div>

                {/* AI Generated Ad Texts */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Üretilen Reklam Metinleri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                          Google Ads
                        </span>
                        <span className="text-xs text-gray-600">2 saat önce</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Başlık: iPhone 15 Pro</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "iPhone 15 Pro 256GB - Apple'ın En Yeni Teknolojisi! Şimdi %20 İndirimli. Hızlı Teslimat, Güvenli Alışveriş."
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-blue-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          Meta Ads
                        </span>
                        <span className="text-xs text-gray-600">4 saat önce</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Başlık: Samsung Galaxy S24</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "Galaxy S24 ile teknolojinin zirvesine çık! AI destekli kamera, hızlı şarj. Sınırlı süre %15 indirim!"
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-green-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-50">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                          TikTok Ads
                        </span>
                        <span className="text-xs text-gray-600">6 saat önce</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Başlık: MacBook Air M3</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "MacBook Air M3 - Yaratıcılığını sınır tanımadan ifade et! Hafif, güçlü, şık. Hemen sahip ol!"
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-purple-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-purple-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Optimization */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Bütçe Optimizasyonu</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Mevcut Bütçe Dağılımı</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Google Ads</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺500/gün</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Meta Ads</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: '30%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺300/gün</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">TikTok Ads</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{width: '10%'}}></div>
                            </div>
                            <span className="text-sm font-medium">₺100/gün</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">AI Önerilen Optimizasyon</h5>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Brain className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-900">AI Analiz Sonucu</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Trendyol Ads'de %40 daha yüksek dönüşüm görüyoruz. Bütçeyi yeniden dağıtmanızı öneriyoruz.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tahmini Ek Gelir:</span>
                            <span className="font-medium text-green-600">₺8,500/ay</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ROI Artışı:</span>
                            <span className="font-medium text-green-600">+25%</span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                        AI Önerisini Uygula
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Automation Tab */}
            {activeTab === 'ai-automation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI E-posta & SMS Otomasyonu</h3>
                    <p className="text-sm text-gray-600">Yapay zeka destekli e-posta ve SMS kampanyaları ile müşteri segmentasyonu</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Otomasyon
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Tümünü Başlat
                    </button>
                  </div>
                </div>

                {/* AI Content Generator */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI İçerik Üretici</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kampanya Tipi
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="sevgililer">Sevgililer Günü</option>
                        <option value="yeni-yil">Yeni Yıl</option>
                        <option value="black-friday">Black Friday</option>
                        <option value="sepet-hatirlatma">Sepet Hatırlatma</option>
                        <option value="yeni-urun">Yeni Ürün Duyurusu</option>
                        <option value="indirim">Özel İndirim</option>
                        <option value="dogum-gunu">Doğum Günü</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İletişim Kanalı
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex text-black items-center">
                          <input type="radio" name="channel" value="email" defaultChecked className="mr-2" />
                          <Mail className="h-4  w-4 mr-1" />
                          E-posta
                        </label>
                        <label className="flex text-black items-center">
                          <input type="radio" name="channel" value="sms" className="mr-2" />
                          <MessageSquare className="h-4 w-4 mr-1" />
                          SMS
                        </label>
                        <label className="flex text-black items-center">
                          <input type="radio" name="channel" value="both" className="mr-2" />
                          <Send className="h-4 w-4 mr-1" />
                          Her İkisi
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Özel Notlar (Opsiyonel)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AI'ya özel talimatlarınızı yazın..."
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      <Wand2 className="h-4 w-4 mr-2" />
                      AI İçerik Oluştur
                    </button>
                  </div>
                </div>

                {/* Email Templates */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Hazır E-posta Şablonları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-red-200 text-red-800 px-2 py-1 rounded-full">
                          Sepet Hatırlatma
                        </span>
                        <span className="text-xs text-gray-600">%25 dönüş</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Sepetinizde ürünler bekliyor!</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "Merhaba [İsim], sepetinizdeki ürünleri tamamlamayı unutmuş olabilirsiniz. %10 indirim kodu ile..."
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-red-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-red-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          Yeni Ürün
                        </span>
                        <span className="text-xs text-gray-600">%18 dönüş</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Yeni ürün koleksiyonu!</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "Hey [İsim]! Yeni koleksiyonumuzu keşfedin. İlk alışverişinizde %15 hoş geldin indirimi..."
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-green-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-green-300 text-green-700 rounded-lg hover:bg-green-50">
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                          Özel İndirim
                        </span>
                        <span className="text-xs text-gray-600">%32 dönüş</span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Sadece sizin için özel fırsat!</h5>
                      <p className="text-sm text-gray-700 mb-3">
                        "Değerli müşterimiz [İsim], size özel %20 indirim fırsatı. Sınırlı süre için geçerli..."
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-purple-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-purple-700">
                          Kullan
                        </button>
                        <button className="px-3 py-1 text-xs border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50">
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Segmentation */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Müşteri Segmentasyonu</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h5 className="font-medium text-gray-900">Sadık Müşteriler</h5>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">1,250</div>
                      <div className="text-sm text-gray-600 mb-3">Son 6 ayda 3+ sipariş</div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">Önerilen Kampanya:</div>
                        <div className="text-xs font-medium text-blue-800">VIP %20 indirim</div>
                      </div>
                      <button className="w-full mt-3 bg-blue-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-blue-700">
                        Kampanya Oluştur
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                        <h5 className="font-medium text-gray-900">Sepet Terk Edenler</h5>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-1">850</div>
                      <div className="text-sm text-gray-600 mb-3">Son 7 günde terk</div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">Önerilen Kampanya:</div>
                        <div className="text-xs font-medium text-orange-800">%10 hatırlatma indirimi</div>
                      </div>
                      <button className="w-full mt-3 bg-orange-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-orange-700">
                        Kampanya Oluştur
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="h-5 w-5 text-green-600" />
                        <h5 className="font-medium text-gray-900">Yeni Müşteriler</h5>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">320</div>
                      <div className="text-sm text-gray-600 mb-3">Son 30 günde kayıt</div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">Önerilen Kampanya:</div>
                        <div className="text-xs font-medium text-green-800">Hoş geldin %15</div>
                      </div>
                      <button className="w-full mt-3 bg-green-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-green-700">
                        Kampanya Oluştur
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <h5 className="font-medium text-gray-900">Pasif Müşteriler</h5>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">1,680</div>
                      <div className="text-sm text-gray-600 mb-3">90+ gün sipariş yok</div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">Önerilen Kampanya:</div>
                        <div className="text-xs font-medium text-purple-800">Geri dönüş %25</div>
                      </div>
                      <button className="w-full mt-3 bg-purple-600 text-white px-3 py-1 text-xs rounded-lg hover:bg-purple-700">
                        Kampanya Oluştur
                      </button>
                    </div>
                  </div>
                </div>

                {/* Optimal Send Time */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI En Uygun Gönderim Saati</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Müşteri Alışveriş Alışkanlıkları</h5>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">AI Analiz Sonucu</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Müşterileriniz en çok <strong>20:00-22:00</strong> saatleri arasında alışveriş yapıyor.
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">En iyi gün:</span>
                            <span className="font-medium">Salı ve Perşembe</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">En iyi saat:</span>
                            <span className="font-medium">20:30</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tahmini açılma:</span>
                            <span className="font-medium text-green-600">%35</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Otomatik Gönderim Takvimi</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Sepet Hatırlatma</div>
                            <div className="text-xs text-gray-600">2 saat sonra</div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Aktif
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Yeni Ürün Bildirimi</div>
                            <div className="text-xs text-gray-600">Her Salı 20:30</div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Aktif
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">Özel İndirim</div>
                            <div className="text-xs text-gray-600">Her Perşembe 20:30</div>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Duraklatıldı
                          </span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Takvimi Düzenle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Kampanya Listesi</h3>
                  <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Kampanya
                  </button>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedItems.length} kampanya seçildi
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
                          onClick={() => handleBulkAction('pause')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
                        >
                          Duraklat
                        </button>
                        <button
                          onClick={() => handleBulkAction('duplicate')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Kopyala
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketingData.topCampaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Tip:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(campaign.type)}`}>
                            {getTypeText(campaign.type)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>İndirim:</span>
                          <span className="font-medium">
                            {campaign.discountType === 'PERCENTAGE' ? `%${campaign.discountValue}` : 
                             campaign.discountType === 'FIXED_AMOUNT' ? `₺${campaign.discountValue}` : 
                             `${campaign.discountValue} Al ${campaign.discountValue} Kazan`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sipariş:</span>
                          <span className="font-medium">{campaign.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gelir:</span>
                          <span className="font-medium">₺{campaign.totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversion:</span>
                          <span className="font-medium">%{campaign.conversionRate.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <div>Başlangıç: {new Date(campaign.startDate).toLocaleDateString('tr-TR')}</div>
                        <div>Bitiş: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}</div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Edit className="h-4 w-4 mr-1 inline" />
                          Düzenle
                        </button>
                        <button className="flex-1 text-black px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-1 inline" />
                          Görüntüle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Kupon Listesi</h3>
                  <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Kupon
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kupon
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tip
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Değer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kullanım
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Toplam İndirim
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {marketingData.recentCoupons.map((coupon) => (
                          <tr key={coupon.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                                <div className="text-sm text-gray-500">{coupon.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {coupon.type === 'PERCENTAGE' ? 'Yüzde' : 
                               coupon.type === 'FIXED_AMOUNT' ? 'Sabit Tutar' : 'Ücretsiz Kargo'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {coupon.type === 'PERCENTAGE' ? `%${coupon.value}` : 
                               coupon.type === 'FIXED_AMOUNT' ? `₺${coupon.value}` : 'Ücretsiz'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {coupon.usedCount}/{coupon.usageLimit || '∞'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₺{coupon.totalDiscount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {coupon.isActive ? 'Aktif' : 'Pasif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Edit className="h-4 w-4" />
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

            {/* AI Studio Tab */}
            {activeTab === 'ai-studio' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Kampanya Stüdyosu</h3>
                    <p className="text-sm text-gray-600">Yapay zeka destekli gelişmiş kampanya oluşturma ve yönetim merkezi</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsAIModalOpen(true)}
                      className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Yeni Kampanya Oluştur
                    </button>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Hızlı Başlat
                    </button>
                  </div>
                </div>

                {/* Campaign Templates */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Kampanya Şablonları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-red-500 rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="font-semibold text-gray-900">Sepet Terk</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Sepetini terk eden müşterilere özel kampanya</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>%85 başarı</span>
                        <span>2 dk hazırlık</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="font-semibold text-gray-900">Yeni Müşteri</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Yeni kayıt olan müşteriler için hoş geldin kampanyası</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>%78 başarı</span>
                        <span>1 dk hazırlık</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="font-semibold text-gray-900">Flash Sale</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Sınırlı süre indirim kampanyası</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>%92 başarı</span>
                        <span>3 dk hazırlık</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <h5 className="font-semibold text-gray-900">Sezonsal</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Özel günler için sezonsal kampanya</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>%88 başarı</span>
                        <span>5 dk hazırlık</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Generation Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsAIModalOpen(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">AI Kampanya Stüdyosu - Yeni Kampanya Oluştur</h2>
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Tipi
                </label>
                <select
                  value={aiType}
                  onChange={(e) => setAiType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="CART_ABANDONMENT">Sepet Terk Kampanyası</option>
                  <option value="NEW_CUSTOMER">Yeni Müşteri Hoş Geldin</option>
                  <option value="FLASH_SALE">Flash Sale</option>
                  <option value="SEASONAL">Sezonsal Kampanya</option>
                  <option value="LOYALTY">Sadakat Programı</option>
                  <option value="WIN_BACK">Geri Kazanım</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Detayları
                </label>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Kampanya hakkında detayları yazın... (ürün kategorisi, indirim oranı, hedef kitle, süre vb.)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ton
                  </label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PROFESSIONAL">Profesyonel</option>
                    <option value="CASUAL">Günlük</option>
                    <option value="FRIENDLY">Dostane</option>
                    <option value="FORMAL">Resmi</option>
                    <option value="CREATIVE">Yaratıcı</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uzunluk
                  </label>
                  <select
                    value={aiLength}
                    onChange={(e) => setAiLength(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="SHORT">Kısa</option>
                    <option value="MEDIUM">Orta</option>
                    <option value="LONG">Uzun</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAIGenerate}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Wand2 className="h-4 w-4 mr-2 inline" />
                Kampanya Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAIChatOpen ? (
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Brain className="h-6 w-6" />
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span className="font-medium">AI Pazarlama Asistanı</span>
              </div>
              <button
                onClick={() => setIsAIChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="AI'ya soru sorun..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <button
                  onClick={handleChatSend}
                  className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
