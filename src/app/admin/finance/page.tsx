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
  Receipt,
  FileText,
  DollarSign,
  CreditCard,
  Banknote,
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'INCOMING' | 'OUTGOING';
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  supplierId?: string;
  supplierName?: string;
  supplierEmail?: string;
  orderId?: string;
  orderNumber?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxRate: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Commission {
  id: string;
  marketplaceId: string;
  marketplaceName: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  salePrice: number;
  commissionRate: number;
  commissionAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinancialReport {
  id: string;
  name: string;
  type: 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW' | 'SALES_REPORT' | 'COMMISSION_REPORT';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  grossProfit: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalCommissions: number;
  paidCommissions: number;
  pendingCommissions: number;
  cashFlow: {
    inflow: number;
    outflow: number;
    net: number;
  };
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentInvoices: Invoice[];
  recentCommissions: Commission[];
  recentReports: FinancialReport[];
  marketplaceCommissions: Array<{
    marketplace: string;
    totalCommission: number;
    orderCount: number;
    averageCommission: number;
  }>;
}

export default function FinancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [financeData, setFinanceData] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'commissions' | 'reports'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

    fetchFinanceData();
  }, [session, status, router, currentPage]);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/finance');
      if (response.ok) {
        const data = await response.json();
        setFinanceData(data.stats);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
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
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'GENERATING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID': return 'Ödendi';
      case 'SENT': return 'Gönderildi';
      case 'DRAFT': return 'Taslak';
      case 'OVERDUE': return 'Vadesi Geçmiş';
      case 'CANCELLED': return 'İptal Edildi';
      case 'COMPLETED': return 'Tamamlandı';
      case 'GENERATING': return 'Oluşturuluyor';
      case 'FAILED': return 'Başarısız';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'INCOMING': return 'Gelen Fatura';
      case 'OUTGOING': return 'Giden Fatura';
      case 'INCOME_STATEMENT': return 'Gelir Tablosu';
      case 'BALANCE_SHEET': return 'Bilanço';
      case 'CASH_FLOW': return 'Nakit Akışı';
      case 'SALES_REPORT': return 'Satış Raporu';
      case 'COMMISSION_REPORT': return 'Komisyon Raporu';
      default: return type;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Finans Yönetimi" description="Faturalar, raporlar ve komisyon takibi">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!financeData) {
    return (
      <AdminLayout title="Finans Yönetimi" description="Faturalar, raporlar ve komisyon takibi">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Finans Yönetimi" description="Faturalar, raporlar ve komisyon takibi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Finans Yönetimi</h1>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              ₺{financeData.netProfit.toLocaleString()} net kar
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
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Fatura
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">₺{financeData.grossProfit.toLocaleString()} brüt kar</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData.totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-red-600">{financeData.overdueInvoices} vadesi geçmiş</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Kar</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData.netProfit.toLocaleString()}</p>
                <p className="text-xs text-blue-600">%{((financeData.netProfit / financeData.totalRevenue) * 100).toFixed(1)} kar marjı</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nakit Akışı</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData.cashFlow.net.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Giriş: ₺{financeData.cashFlow.inflow.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Banknote className="h-6 w-6 text-purple-600" />
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
                { id: 'invoices', label: 'Faturalar', icon: Receipt },
                { id: 'commissions', label: 'Komisyonlar', icon: CreditCard },
                { id: 'reports', label: 'Raporlar', icon: FileText }
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
                {/* Monthly Trend */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Trend</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {financeData.monthlyTrend.slice(-3).map((month) => (
                        <div key={month.month} className="text-center">
                          <div className="text-sm font-medium text-gray-600 mb-2">{month.month}</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Gelir:</span>
                              <span className="text-sm font-medium text-green-600">₺{month.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Gider:</span>
                              <span className="text-sm font-medium text-red-600">₺{month.expenses.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="text-sm font-medium text-gray-900">Kar:</span>
                              <span className={`text-sm font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ₺{month.profit.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Expense Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Yüksek Gider Kategorileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {financeData.topExpenseCategories.map((category) => (
                      <div key={category.category} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{category.category}</h4>
                          <span className="text-sm font-medium text-blue-600">%{category.percentage.toFixed(1)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tutar:</span>
                            <span className="font-medium">₺{category.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marketplace Commissions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pazaryeri Komisyonları</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pazaryeri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Toplam Komisyon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş Sayısı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ortalama Komisyon
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {financeData.marketplaceCommissions.map((commission) => (
                            <tr key={commission.marketplace} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {commission.marketplace}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₺{commission.totalCommission.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {commission.orderCount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₺{commission.averageCommission.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Invoices */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Faturalar</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fatura No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tip
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Müşteri/Tedarikçi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tutar
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vade Tarihi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {financeData.recentInvoices.slice(0, 5).map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                  <div className="text-sm text-gray-500">{invoice.orderNumber}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getTypeText(invoice.type)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {invoice.customerName || invoice.supplierName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {invoice.customerEmail || invoice.supplierEmail}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">₺{invoice.totalAmount.toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">KDV: ₺{invoice.taxAmount.toLocaleString()}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                  {getStatusText(invoice.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
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

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Fatura Listesi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Fatura
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedItems.length} fatura seçildi
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBulkAction('send')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Gönder
                        </button>
                        <button
                          onClick={() => handleBulkAction('export')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Dışa Aktar
                        </button>
                        <button
                          onClick={() => handleBulkAction('print')}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                        >
                          Yazdır
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

                {/* Invoices Table */}
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
                            Fatura No
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tip
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Müşteri/Tedarikçi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tutar
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vade Tarihi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financeData.recentInvoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(invoice.id)}
                                onChange={() => handleItemSelect(invoice.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                <div className="text-sm text-gray-500">{invoice.orderNumber}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getTypeText(invoice.type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {invoice.customerName || invoice.supplierName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {invoice.customerEmail || invoice.supplierEmail}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">₺{invoice.totalAmount.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">KDV: ₺{invoice.taxAmount.toLocaleString()}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                                {getStatusText(invoice.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <Download className="h-4 w-4" />
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

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Sayfa {currentPage} / {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Commissions Tab */}
            {activeTab === 'commissions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Komisyon Listesi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Komisyon Hesapla
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
                            Sipariş
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ürün
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Satış Fiyatı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Komisyon Oranı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Komisyon Tutarı
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {financeData.recentCommissions.map((commission) => (
                          <tr key={commission.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {commission.marketplaceName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {commission.orderNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {commission.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₺{commission.salePrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              %{commission.commissionRate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₺{commission.commissionAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                                {getStatusText(commission.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(commission.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Finansal Raporlar</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Rapor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {financeData.recentReports.map((report) => (
                    <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{report.name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Tip:</span>
                          <span className="ml-2 text-gray-600">{getTypeText(report.type)}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Dönem:</span>
                          <span className="ml-2 text-gray-600">{report.period}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Tarih Aralığı:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(report.startDate).toLocaleDateString('tr-TR')} - {new Date(report.endDate).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        {report.status === 'COMPLETED' && report.fileUrl ? (
                          <button className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <Download className="h-4 w-4 mr-1 inline" />
                            İndir
                          </button>
                        ) : (
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50" disabled>
                            <Clock className="h-4 w-4 mr-1 inline" />
                            Hazırlanıyor
                          </button>
                        )}
                        <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-1 inline" />
                          Görüntüle
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
