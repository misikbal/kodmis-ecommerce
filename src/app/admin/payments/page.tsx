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
  CreditCard,
  DollarSign,
  Receipt,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  ArrowUpDown,
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
  CheckCircle2,
  XCircle2,
  AlertCircle2,
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

interface Transaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY' | 'DIGITAL_WALLET' | 'INSTALLMENT';
  paymentProvider: 'STRIPE' | 'PAYPAL' | 'IYZICO' | 'PAYTR' | 'GARANTI' | 'AKBANK' | 'ISBANK' | 'YAPIKREDI';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  transactionId: string;
  referenceNumber: string;
  commission: number;
  netAmount: number;
  fee: number;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  failedReason?: string;
  refundAmount?: number;
  refundReason?: string;
  installmentCount?: number;
  installmentAmount?: number;
  eInvoiceStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  eInvoiceNumber?: string;
  eInvoiceDate?: string;
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    iban: string;
  };
  scheduledDate: string;
  processedDate?: string;
  transactionCount: number;
  totalFees: number;
  netAmount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
}

interface PaymentStats {
  totalTransactions: number;
  totalAmount: number;
  totalFees: number;
  totalPayouts: number;
  pendingPayouts: number;
  failedTransactions: number;
  successRate: number;
  averageTransactionAmount: number;
  topPaymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
  recentPayouts: Payout[];
  eInvoiceStats: {
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  };
}

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts' | 'e-invoice'>('overview');
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
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    fetchPaymentData();
  }, [session, status, router, currentPage]);

  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPaymentData(data.stats);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
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
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'REFUNDED': return 'bg-purple-100 text-purple-800';
      case 'PARTIALLY_REFUNDED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Tamamlandı';
      case 'PROCESSING': return 'İşleniyor';
      case 'PENDING': return 'Beklemede';
      case 'FAILED': return 'Başarısız';
      case 'CANCELLED': return 'İptal Edildi';
      case 'REFUNDED': return 'İade Edildi';
      case 'PARTIALLY_REFUNDED': return 'Kısmi İade';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return 'Kredi Kartı';
      case 'DEBIT_CARD': return 'Banka Kartı';
      case 'BANK_TRANSFER': return 'Banka Havalesi';
      case 'CASH_ON_DELIVERY': return 'Kapıda Ödeme';
      case 'DIGITAL_WALLET': return 'Dijital Cüzdan';
      case 'INSTALLMENT': return 'Taksitli Ödeme';
      default: return method;
    }
  };

  const getEInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEInvoiceStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'Teslim Edildi';
      case 'SENT': return 'Gönderildi';
      case 'PENDING': return 'Beklemede';
      case 'FAILED': return 'Başarısız';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Ödeme Yönetimi" description="Transactions, payouts ve e-fatura yönetimi">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!paymentData) {
    return (
      <AdminLayout title="Ödeme Yönetimi" description="Transactions, payouts ve e-fatura yönetimi">
        <div className="text-center py-12">
          <p className="text-gray-500">Veriler yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ödeme Yönetimi" description="Transactions, payouts ve e-fatura yönetimi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              ₺{paymentData.totalAmount.toLocaleString()} toplam
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
              Yeni Payout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam İşlem</p>
                <p className="text-2xl font-bold text-gray-900">{paymentData.totalTransactions.toLocaleString()}</p>
                <p className="text-xs text-green-600">%{paymentData.successRate.toFixed(1)} başarı oranı</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-bold text-gray-900">₺{paymentData.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-600">₺{paymentData.averageTransactionAmount.toLocaleString()} ortalama</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Payout</p>
                <p className="text-2xl font-bold text-gray-900">₺{paymentData.totalPayouts.toLocaleString()}</p>
                <p className="text-xs text-yellow-600">{paymentData.pendingPayouts} beklemede</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Banknote className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Komisyon</p>
                <p className="text-2xl font-bold text-gray-900">₺{paymentData.totalFees.toLocaleString()}</p>
                <p className="text-xs text-red-600">{paymentData.failedTransactions} başarısız</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Receipt className="h-6 w-6 text-orange-600" />
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
                { id: 'transactions', label: 'İşlemler', icon: CreditCard },
                { id: 'payouts', label: 'Payouts', icon: Banknote },
                { id: 'e-invoice', label: 'E-Fatura', icon: FileText }
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
                {/* Top Payment Methods */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Kullanılan Ödeme Yöntemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentData.topPaymentMethods.map((method) => (
                      <div key={method.method} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{getPaymentMethodText(method.method)}</h4>
                          <span className="text-sm font-medium text-blue-600">%{method.percentage.toFixed(1)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">İşlem Sayısı:</span>
                            <span className="font-medium">{method.count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Toplam Tutar:</span>
                            <span className="font-medium">₺{method.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${method.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E-Invoice Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Fatura Durumu</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900">{paymentData.eInvoiceStats.total}</div>
                      <div className="text-sm text-gray-600">Toplam</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{paymentData.eInvoiceStats.pending}</div>
                      <div className="text-sm text-gray-600">Beklemede</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{paymentData.eInvoiceStats.sent}</div>
                      <div className="text-sm text-gray-600">Gönderildi</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{paymentData.eInvoiceStats.delivered}</div>
                      <div className="text-sm text-gray-600">Teslim Edildi</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">{paymentData.eInvoiceStats.failed}</div>
                      <div className="text-sm text-gray-600">Başarısız</div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                              Yöntem
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              E-Fatura
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentData.recentTransactions.slice(0, 5).map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{transaction.orderNumber}</div>
                                  <div className="text-sm text-gray-500">{transaction.transactionId}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                                  <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">₺{transaction.amount.toLocaleString()}</div>
                                  <div className="text-sm text-gray-500">Net: ₺{transaction.netAmount.toLocaleString()}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getPaymentMethodText(transaction.paymentMethod)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                  {getStatusText(transaction.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEInvoiceStatusColor(transaction.eInvoiceStatus)}`}>
                                  {getEInvoiceStatusText(transaction.eInvoiceStatus)}
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

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">İşlem Listesi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni İşlem
                    </button>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-900">
                          {selectedItems.length} işlem seçildi
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleBulkAction('refund')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          İade Et
                        </button>
                        <button
                          onClick={() => handleBulkAction('export')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Dışa Aktar
                        </button>
                        <button
                          onClick={() => handleBulkAction('e-invoice')}
                          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                        >
                          E-Fatura Gönder
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

                {/* Transactions Table */}
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
                            Sipariş
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Müşteri
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tutar
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Yöntem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            E-Fatura
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentData.recentTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(transaction.id)}
                                onChange={() => handleItemSelect(transaction.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{transaction.orderNumber}</div>
                                <div className="text-sm text-gray-500">{transaction.transactionId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                                <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">₺{transaction.amount.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">
                                  Net: ₺{transaction.netAmount.toLocaleString()}
                                  {transaction.fee > 0 && (
                                    <span className="text-red-500"> (Komisyon: ₺{transaction.fee})</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getPaymentMethodText(transaction.paymentMethod)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                {getStatusText(transaction.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEInvoiceStatusColor(transaction.eInvoiceStatus)}`}>
                                {getEInvoiceStatusText(transaction.eInvoiceStatus)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString('tr-TR')}
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

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Payout Listesi</h3>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Payout
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentData.recentPayouts.map((payout) => (
                    <div key={payout.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">₺{payout.amount.toLocaleString()}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                          {getStatusText(payout.status)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Banka:</span>
                          <span className="ml-2 text-gray-600">{payout.bankAccount.bankName}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Hesap Sahibi:</span>
                          <span className="ml-2 text-gray-600">{payout.bankAccount.accountHolder}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">IBAN:</span>
                          <span className="ml-2 text-gray-600 font-mono">{payout.bankAccount.iban}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">İşlem Sayısı:</span>
                          <span className="ml-2 text-gray-600">{payout.transactionCount}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Net Tutar:</span>
                          <span className="ml-2 text-gray-600">₺{payout.netAmount.toLocaleString()}</span>
                        </div>
                        {payout.totalFees > 0 && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Komisyon:</span>
                            <span className="ml-2 text-red-600">₺{payout.totalFees.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        <div>Planlanan: {new Date(payout.scheduledDate).toLocaleDateString('tr-TR')}</div>
                        {payout.processedDate && (
                          <div>İşlenen: {new Date(payout.processedDate).toLocaleDateString('tr-TR')}</div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-1 inline" />
                          Görüntüle
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Edit className="h-4 w-4 mr-1 inline" />
                          Düzenle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* E-Invoice Tab */}
            {activeTab === 'e-invoice' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">E-Fatura Yönetimi</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yenile
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Toplu E-Fatura
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                            E-Fatura No
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarih
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentData.recentTransactions
                          .filter(t => t.eInvoiceStatus !== 'CANCELLED')
                          .map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{transaction.orderNumber}</div>
                                <div className="text-sm text-gray-500">{transaction.transactionId}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{transaction.customerName}</div>
                                <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₺{transaction.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.eInvoiceNumber || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEInvoiceStatusColor(transaction.eInvoiceStatus)}`}>
                                {getEInvoiceStatusText(transaction.eInvoiceStatus)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.eInvoiceDate ? 
                                new Date(transaction.eInvoiceDate).toLocaleDateString('tr-TR') : 
                                new Date(transaction.createdAt).toLocaleDateString('tr-TR')
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                {transaction.eInvoiceStatus === 'PENDING' && (
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Send className="h-4 w-4" />
                                  </button>
                                )}
                                {transaction.eInvoiceStatus === 'DELIVERED' && (
                                  <button className="text-green-600 hover:text-green-900">
                                    <Download className="h-4 w-4" />
                                  </button>
                                )}
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
