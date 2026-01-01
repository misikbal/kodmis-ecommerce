'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { AccessibilityProvider, useAccessibility, KeyboardShortcuts } from '@/components/accessibility';
import { 
  Accessibility,
  Keyboard,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Contrast,
  Type,
  MousePointer,
  Hand,
  Monitor,
  Smartphone,
  Tablet,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye as EyeIcon,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
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
  MousePointer as MousePointerIcon,
  Hand as HandIcon,
  Focus,
  Crosshair,
  X
} from 'lucide-react';

// Mock data for accessibility demo
const mockAccessibilityFeatures = [
  {
    id: '1',
    name: 'Klavye Navigasyonu',
    description: 'Tüm özellikler klavye ile erişilebilir',
    status: 'enabled',
    category: 'navigation',
    wcagLevel: 'AA',
    keyboardShortcut: 'Tab, Shift+Tab, Enter, Space, Arrow keys'
  },
  {
    id: '2',
    name: 'Screen Reader Desteği',
    description: 'ARIA labels ve semantic HTML',
    status: 'enabled',
    category: 'screen-reader',
    wcagLevel: 'AA',
    keyboardShortcut: 'Screen reader navigation'
  },
  {
    id: '3',
    name: 'Yüksek Kontrast',
    description: 'Renk kontrastı WCAG AA standartlarında',
    status: 'enabled',
    category: 'visual',
    wcagLevel: 'AA',
    keyboardShortcut: 'Ctrl+Shift+C'
  },
  {
    id: '4',
    name: 'Focus Indicators',
    description: 'Görünür focus göstergeleri',
    status: 'enabled',
    category: 'visual',
    wcagLevel: 'AA',
    keyboardShortcut: 'Tab navigation'
  },
  {
    id: '5',
    name: 'RTL Desteği',
    description: 'Right-to-left dil desteği',
    status: 'enabled',
    category: 'language',
    wcagLevel: 'AA',
    keyboardShortcut: 'Language switcher'
  },
  {
    id: '6',
    name: 'Renk Körlüğü Desteği',
    description: 'Renk alternatifleri ve desenler',
    status: 'enabled',
    category: 'visual',
    wcagLevel: 'AA',
    keyboardShortcut: 'Alt+C'
  }
];

const mockKeyboardShortcuts = [
  {
    key: 'Ctrl + /',
    description: 'Klavye kısayolları yardımını göster',
    category: 'general'
  },
  {
    key: 'Ctrl + K',
    description: 'Global arama',
    category: 'navigation'
  },
  {
    key: 'Ctrl + N',
    description: 'Yeni öğe oluştur',
    category: 'actions'
  },
  {
    key: 'Ctrl + S',
    description: 'Kaydet',
    category: 'actions'
  },
  {
    key: 'Ctrl + Z',
    description: 'Geri al',
    category: 'actions'
  },
  {
    key: 'Ctrl + Y',
    description: 'Yinele',
    category: 'actions'
  },
  {
    key: 'Ctrl + C',
    description: 'Kopyala',
    category: 'actions'
  },
  {
    key: 'Ctrl + V',
    description: 'Yapıştır',
    category: 'actions'
  },
  {
    key: 'Ctrl + X',
    description: 'Kes',
    category: 'actions'
  },
  {
    key: 'Ctrl + A',
    description: 'Tümünü seç',
    category: 'selection'
  },
  {
    key: 'Ctrl + F',
    description: 'Sayfada ara',
    category: 'navigation'
  },
  {
    key: 'Ctrl + R',
    description: 'Yenile',
    category: 'navigation'
  },
  {
    key: 'Escape',
    description: 'Modal/drawer kapat',
    category: 'navigation'
  },
  {
    key: 'Tab',
    description: 'Sonraki öğe',
    category: 'navigation'
  },
  {
    key: 'Shift + Tab',
    description: 'Önceki öğe',
    category: 'navigation'
  },
  {
    key: 'Enter',
    description: 'Seç/Onayla',
    category: 'actions'
  },
  {
    key: 'Space',
    description: 'Toggle/Seç',
    category: 'actions'
  },
  {
    key: 'Arrow Keys',
    description: 'Yön navigasyonu',
    category: 'navigation'
  },
  {
    key: 'Home',
    description: 'Sayfa başına git',
    category: 'navigation'
  },
  {
    key: 'End',
    description: 'Sayfa sonuna git',
    category: 'navigation'
  },
  {
    key: 'Page Up',
    description: 'Yukarı kaydır',
    category: 'navigation'
  },
  {
    key: 'Page Down',
    description: 'Aşağı kaydır',
    category: 'navigation'
  }
];

function AccessibilityPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { settings, updateSetting } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'shortcuts' | 'settings'>('overview');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + / - Show shortcuts
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      // Ctrl + K - Global search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Focus search input
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape - Close modals/shortcuts
      if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'bg-green-100 text-green-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enabled': return 'Aktif';
      case 'disabled': return 'Pasif';
      case 'partial': return 'Kısmi';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <MousePointer className="h-4 w-4" />;
      case 'screen-reader': return <Volume2 className="h-4 w-4" />;
      case 'visual': return <Eye className="h-4 w-4" />;
      case 'language': return <Type className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const filteredShortcuts = selectedCategory === 'all' 
    ? mockKeyboardShortcuts 
    : mockKeyboardShortcuts.filter(shortcut => shortcut.category === selectedCategory);

  if (status === 'loading') {
    return (
      <AdminLayout title="Erişilebilirlik" description="WCAG uyumluluğu, klavye kısayolları">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Erişilebilirlik" description="WCAG uyumluluğu, klavye kısayolları">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Erişilebilirlik</h1>
            <p className="text-gray-600">WCAG uyumluluğu, klavye kısayolları ve erişilebilirlik ayarları</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Kısayollar
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişilebilirlik Ayarları</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Contrast className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Yüksek Kontrast</div>
                  <div className="text-sm text-gray-600">WCAG AA uyumlu</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Type className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Büyük Metin</div>
                  <div className="text-sm text-gray-600">%125 büyütme</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={(e) => updateSetting('largeText', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">Azaltılmış Hareket</div>
                  <div className="text-sm text-gray-600">Animasyonları kapat</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Volume2 className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">RTL Modu</div>
                  <div className="text-sm text-gray-600">Sağdan sola</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.rtlMode}
                  onChange={(e) => updateSetting('rtlMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: Accessibility },
                { id: 'features', label: 'Özellikler', icon: Settings },
                { id: 'shortcuts', label: 'Kısayollar', icon: Keyboard },
                { id: 'settings', label: 'Ayarlar', icon: Settings }
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
                {/* WCAG Compliance Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">WCAG 2.1 AA Uyumluluk Durumu</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-semibold text-green-900">AA Seviyesi</h4>
                          <p className="text-green-700">%95 uyumlu</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <Info className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900">Klavye Erişimi</h4>
                          <p className="text-blue-700">%100 uyumlu</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <Volume2 className="h-8 w-8 text-purple-600 mr-3" />
                        <div>
                          <h4 className="text-lg font-semibold text-purple-900">Screen Reader</h4>
                          <p className="text-purple-700">%90 uyumlu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accessibility Features Grid */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Erişilebilirlik Özellikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockAccessibilityFeatures.map((feature) => (
                      <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              {getCategoryIcon(feature.category)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{feature.name}</h4>
                              <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feature.status)}`}>
                            {getStatusText(feature.status)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">WCAG Seviyesi:</span>
                            <span className="font-medium">{feature.wcagLevel}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kısayol:</span>
                            <span className="font-medium text-blue-600">{feature.keyboardShortcut}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detaylı Özellik Listesi</h3>
                  
                  <div className="space-y-4">
                    {mockAccessibilityFeatures.map((feature) => (
                      <div key={feature.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              {getCategoryIcon(feature.category)}
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">{feature.name}</h4>
                              <p className="text-gray-600 mt-1">{feature.description}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(feature.status)}`}>
                            {getStatusText(feature.status)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">WCAG Seviyesi</h5>
                            <p className="text-sm text-gray-600">{feature.wcagLevel}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Kategori</h5>
                            <p className="text-sm text-gray-600 capitalize">{feature.category}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Klavye Kısayolu</h5>
                            <p className="text-sm text-blue-600 font-mono">{feature.keyboardShortcut}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Shortcuts Tab */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Klavye Kısayolları</h3>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Kategori:</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Tümü</option>
                      <option value="general">Genel</option>
                      <option value="navigation">Navigasyon</option>
                      <option value="actions">İşlemler</option>
                      <option value="selection">Seçim</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div>
                        <div className="font-medium text-gray-900">{shortcut.description}</div>
                        <div className="text-sm text-gray-600 capitalize">{shortcut.category}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <kbd className="px-2 text-blue-600 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                          {shortcut.key}
                        </kbd>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelişmiş Erişilebilirlik Ayarları</h3>
                  
                  <div className="space-y-6">
                    {/* Visual Settings */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Görsel Ayarlar</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">Yüksek Kontrast Modu</h5>
                            <p className="text-sm text-gray-600">Renk kontrastını artırır</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.highContrast}
                              onChange={(e) => updateSetting('highContrast', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">Büyük Metin</h5>
                            <p className="text-sm text-gray-600">Metin boyutunu %125 artırır</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.largeText}
                              onChange={(e) => updateSetting('largeText', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">Azaltılmış Hareket</h5>
                            <p className="text-sm text-gray-600">Animasyonları ve geçişleri kapatır</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.reducedMotion}
                              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Dil Ayarları</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">RTL (Right-to-Left) Modu</h5>
                            <p className="text-sm text-gray-600">Arapça, İbranice gibi diller için</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.rtlMode}
                              onChange={(e) => updateSetting('rtlMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Screen Reader Settings */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Screen Reader Ayarları</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">Screen Reader Modu</h5>
                            <p className="text-sm text-gray-600">ARIA labels ve semantic HTML'i optimize eder</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.screenReader}
                              onChange={(e) => updateSetting('screenReader', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        shortcuts={mockKeyboardShortcuts}
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </AdminLayout>
  );
}

export default function AccessibilityPage() {
  return (
    <AccessibilityProvider>
      <AccessibilityPageContent />
    </AccessibilityProvider>
  );
}
