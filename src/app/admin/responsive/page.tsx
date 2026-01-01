'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Monitor,
  Tablet,
  Smartphone,
  Menu,
  X,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Settings,
  User,
  Bell,
  Sun,
  Moon,
  Maximize,
  Minimize,
  RotateCcw,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Share2,
  Link,
  ExternalLink,
  Copy,
  Archive,
  Loader,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Home,
  ShoppingBag,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  PiggyBank,
  Target,
  Zap,
  Sparkles,
  Wand2,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge,
  Tag,
  Ticket,
  Gift,
  Box,
  Truck,
  Car,
  Shirt,
  Watch,
  Camera,
  Gamepad2,
  Music,
  Book,
  Video,
  Headphones,
  Laptop,
  Gamepad,
  MousePointer,
  Hand,
  Focus,
  Crosshair,
  Target as TargetIcon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Sparkles as SparklesIcon,
  Wand2 as Wand2Icon,
  Crown as CrownIcon,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Medal as MedalIcon,
  Badge as BadgeIcon,
  Tag as TagIcon,
  Label as LabelIcon,
  Ticket as TicketIcon,
  Gift as GiftIcon,
  Box as BoxIcon,
  Truck as TruckIcon,
  Car as CarIcon,
  Shirt as ShirtIcon,
  Watch as WatchIcon,
  Camera as CameraIcon,
  Gamepad2 as Gamepad2Icon,
  Music as MusicIcon,
  Book as BookIcon,
  Video as VideoIcon,
  Headphones as HeadphonesIcon,
  Laptop as LaptopIcon,
  Gamepad as GamepadIcon,
  MousePointer as MousePointerIcon,
  Hand as HandIcon,
  Focus as FocusIcon,
  Crosshair as CrosshairIcon
} from 'lucide-react';

// Mock data for responsive demo
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    status: 'Pending',
    total: 1250.00,
    date: '2024-12-01',
    items: 3
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: 'Ayşe Demir',
    email: 'ayse@example.com',
    status: 'Shipped',
    total: 890.50,
    date: '2024-12-01',
    items: 2
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    status: 'Delivered',
    total: 2100.75,
    date: '2024-11-30',
    items: 5
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: 'Fatma Özkan',
    email: 'fatma@example.com',
    status: 'Cancelled',
    total: 450.00,
    date: '2024-11-30',
    items: 1
  }
];

const mockStats = [
  {
    title: 'Toplam Sipariş',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: ShoppingCart
  },
  {
    title: 'Toplam Gelir',
    value: '₺45,678',
    change: '+8%',
    trend: 'up',
    icon: DollarSign
  },
  {
    title: 'Aktif Müşteri',
    value: '567',
    change: '+5%',
    trend: 'up',
    icon: Users
  },
  {
    title: 'Ortalama Sipariş',
    value: '₺890',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp
  }
];

export default function ResponsivePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeView, setActiveView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

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
  }, [session, status, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'Beklemede';
      case 'Shipped': return 'Kargoda';
      case 'Delivered': return 'Teslim Edildi';
      case 'Cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(mockOrders.map(order => order.id));
    } else {
      setSelectedItems([]);
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout title="Responsive Tasarım" description="Desktop-first, tablet/mobile optimizasyonu">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Responsive Tasarım" description="Desktop-first, tablet/mobile optimizasyonu">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Responsive Tasarım</h1>
            <p className="text-gray-600">Desktop-first, tablet/mobile optimizasyonu</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('desktop')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Monitor className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setActiveView('tablet')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'tablet'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tablet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setActiveView('mobile')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Responsive Container */}
        <div className={`transition-all duration-300 ${
          activeView === 'desktop' ? 'max-w-full' :
          activeView === 'tablet' ? 'max-w-4xl mx-auto' :
          'max-w-sm mx-auto'
        }`}>
          {/* Stats Cards - Responsive Grid */}
          <div className={`grid gap-4 mb-6 ${
            activeView === 'desktop' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            activeView === 'tablet' ? 'grid-cols-1 md:grid-cols-2' :
            'grid-cols-1'
          }`}>
            {mockStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">önceki aya göre</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Siparişler</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {mockOrders.length} sipariş bulundu
                  </p>
                </div>
                
                {/* Action Buttons - Responsive */}
                <div className={`flex items-center space-x-2 w-full sm:w-auto ${
                  activeView === 'mobile' ? 'flex-col space-y-2 space-x-0' : ''
                }`}>
                  {/* Mobile Menu Toggle */}
                  {activeView === 'mobile' && (
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Menu className="h-4 w-4 mr-2" />
                      Menü
                    </button>
                  )}
                  
                  {/* Desktop/Tablet Actions */}
                  {(activeView === 'desktop' || activeView === 'tablet') && (
                    <>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Filtreler</span>
                      </button>
                      
                      <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Dışa Aktar</span>
                      </button>
                      
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Yeni Sipariş</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {activeView === 'mobile' && mobileMenuOpen && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="space-y-2">
                  <button className="flex items-center w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtreler
                  </button>
                  <button className="flex items-center w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-white">
                    <Download className="h-4 w-4 mr-2" />
                    Dışa Aktar
                  </button>
                  <button className="flex items-center w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Sipariş
                  </button>
                </div>
              </div>
            )}

            {/* Filters */}
            {showFilters && (activeView === 'desktop' || activeView === 'tablet') && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className={`grid gap-4 ${
                  activeView === 'desktop' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'
                }`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Tümü</option>
                      <option>Beklemede</option>
                      <option>Kargoda</option>
                      <option>Teslim Edildi</option>
                      <option>İptal Edildi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarih Aralığı</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
                    <input
                      type="text"
                      placeholder="Müşteri ara..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Filtrele
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedItems.length} sipariş seçildi
                    </span>
                  </div>
                  <div className={`flex items-center space-x-2 ${
                    activeView === 'mobile' ? 'flex-wrap gap-2' : ''
                  }`}>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      Toplu Gönder
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                      Toplu İptal
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

            {/* Orders Table/List */}
            <div className="overflow-x-auto">
              {activeView === 'mobile' ? (
                /* Mobile Card View */
                <div className="p-4 space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Toplam</p>
                          <p className="font-medium text-gray-900">₺{order.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ürün Sayısı</p>
                          <p className="font-medium text-gray-900">{order.items}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{order.date}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(order.id)}
                            onChange={() => handleItemSelect(order.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop/Tablet Table View */
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === mockOrders.length}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(order.id)}
                            onChange={() => handleItemSelect(order.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.items} ürün</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                            <div className="text-sm text-gray-500">{order.email}</div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₺{order.total.toLocaleString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.date}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
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
              )}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Sayfa 1 / 5 (Toplam 20 sipariş)
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Önceki
                  </button>
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    1
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsive Tasarım Prensipleri</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-3">
                <Monitor className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">Desktop First</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 1280x800 hedef çözünürlük</li>
                <li>• Geniş layout ve çoklu sütun</li>
                <li>• Hover efektleri ve detaylı bilgiler</li>
                <li>• Klavye kısayolları desteği</li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Tablet className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-medium text-gray-900">Tablet Optimizasyonu</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 768px-1024px arası</li>
                <li>• Touch-friendly butonlar (44px+)</li>
                <li>• Collapsible sidebar</li>
                <li>• Swipe gesture desteği</li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center mb-3">
                <Smartphone className="h-5 w-5 text-purple-600 mr-2" />
                <h4 className="font-medium text-gray-900">Mobile Optimizasyonu</h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 320px-768px arası</li>
                <li>• Tek sütun layout</li>
                <li>• Card-based design</li>
                <li>• Thumb-friendly navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
