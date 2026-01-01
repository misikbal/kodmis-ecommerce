'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Settings, 
  Store, 
  Palette, 
  Globe, 
  Shield, 
  Mail, 
  Database, 
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info,
  Clock,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Lock,
  Key,
  FileText,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon,
  Languages,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail as MailIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  ExternalLink,
  Copy,
  Trash2,
  Plus,
  Edit,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info as InfoIcon,
  HelpCircle,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Bookmark,
  Share2,
  Link,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Archive,
  RotateCcw,
  Loader,
  Loader2,
  Grid,
  List,
  MoreHorizontal,
  MoreVertical,
  Menu,
  X as XIcon,
  Maximize,
  Minimize,
  Move,
  Grip,
  GripVertical,
  MousePointer,
  Hand,
  MousePointer2,
  Target,
  Crosshair,
  Focus,
  Zap,
  Flash,
  Bolt,
  Sparkles,
  Wand2,
  Magic,
  Star as StarIcon,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge,
  Tag,
  Label,
  Ticket,
  Gift,
  Box,
  Package,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Pulse,
  Heart as HeartIcon,
  Activity as ActivityIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Crosshair as CrosshairIcon,
  Focus as FocusIcon,
  MousePointer as MousePointerIcon,
  Hand as HandIcon,
  MousePointer2 as MousePointer2Icon,
  Grip as GripIcon,
  GripVertical as GripVerticalIcon,
  Move as MoveIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Menu as MenuIcon,
  X as XIcon2,
  MoreHorizontal as MoreHorizontalIcon,
  MoreVertical as MoreVerticalIcon,
  List as ListIcon,
  Grid as GridIcon,
  Loader as LoaderIcon,
  Loader2 as Loader2Icon,
  RotateCcw as RotateCcwIcon,
  Archive as ArchiveIcon,
  Upload as UploadIcon2,
  Download as DownloadIcon2,
  Link as LinkIcon,
  Share2 as Share2Icon,
  Bookmark as BookmarkIcon,
  Flag as FlagIcon,
  ThumbsDown as ThumbsDownIcon,
  ThumbsUp as ThumbsUpIcon,
  Heart as HeartIcon2,
  Star as StarIcon2,
  Info as InfoIcon2,
  HelpCircle as HelpCircleIcon,
  AlertCircle as AlertCircleIcon,
  XCircle as XCircleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Plus as PlusIcon,
  Trash2 as Trash2Icon,
  Copy as CopyIcon,
  ExternalLink as ExternalLinkIcon,
  Github as GithubIcon,
  Youtube as YoutubeIcon,
  Linkedin as LinkedinIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Mail as MailIcon2,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  Languages as LanguagesIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Tablet as TabletIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Image as ImageIcon2,
  FileText as FileTextIcon,
  Key as KeyIcon,
  Lock as LockIcon,
  Wifi as WifiIcon,
  MemoryStick as MemoryStickIcon,
  Cpu as CpuIcon,
  HardDrive as HardDriveIcon,
  Server as ServerIcon,
  Clock as ClockIcon,
  Info as InfoIcon3,
  AlertTriangle as AlertTriangleIcon,
  X as XIcon3,
  Check as CheckIcon,
  EyeOff as EyeOffIcon,
  Eye as EyeIcon,
  Download as DownloadIcon3,
  Upload as UploadIcon3,
  RefreshCw as RefreshCwIcon,
  Save as SaveIcon,
  Database as DatabaseIcon,
  Mail as MailIcon3,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  Palette as PaletteIcon,
  Store as StoreIcon,
  Settings as SettingsIcon
} from 'lucide-react';

interface StoreSettings {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  mersisNumber: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  shadow: string;
  mode: 'light' | 'dark' | 'auto';
}

interface LocaleSettings {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  rtl: boolean;
}

interface SecuritySettings {
  sslEnabled: boolean;
  corsEnabled: boolean;
  rateLimitEnabled: boolean;
  twoFactorRequired: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  templates: Array<{
    id: string;
    name: string;
    subject: string;
    content: string;
    type: string;
  }>;
}

interface SystemSettings {
  cacheEnabled: boolean;
  cacheTimeout: number;
  logLevel: string;
  backupEnabled: boolean;
  backupFrequency: string;
  maintenanceMode: boolean;
  systemInfo: {
    version: string;
    uptime: string;
    memory: string;
    disk: string;
    cpu: string;
  };
}

interface SettingsData {
  store: StoreSettings;
  theme: ThemeSettings;
  locale: LocaleSettings;
  security: SecuritySettings;
  email: EmailSettings;
  system: SystemSettings;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'store' | 'theme' | 'locale' | 'security' | 'email' | 'system'>('store');
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    fetchSettings();
  }, [session, status, router]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Sistem Ayarları" description="Mağaza, tema, güvenlik ve sistem ayarları">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout title="Sistem Ayarları" description="Mağaza, tema, güvenlik ve sistem ayarları">
        <div className="text-center py-12">
          <p className="text-gray-500">Ayarlar yüklenirken bir hata oluştu.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sistem Ayarları" description="Mağaza, tema, güvenlik ve sistem ayarları">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
            <p className="text-gray-600">Mağaza, tema, güvenlik ve sistem ayarlarını yönetin</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSettings}
              className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Kaydet
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'store', label: 'Mağaza', icon: Store },
                { id: 'theme', label: 'Tema', icon: Palette },
                { id: 'locale', label: 'Lokalizasyon', icon: Globe },
                { id: 'security', label: 'Güvenlik', icon: Shield },
                { id: 'email', label: 'E-posta', icon: Mail },
                { id: 'system', label: 'Sistem', icon: Settings }
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
            {/* Store Settings Tab */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mağaza Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Adı
                      </label>
                      <input
                        type="text"
                        value={settings.store.name}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, name: e.target.value }
                        })}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        value={settings.store.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, email: e.target.value }
                        })}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={settings.store.phone}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, phone: e.target.value }
                        })}
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={settings.store.website}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { ...settings.store, website: e.target.value }
                        })}
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.store.socialMedia.facebook}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { 
                            ...settings.store, 
                            socialMedia: { ...settings.store.socialMedia, facebook: e.target.value }
                          }
                        })}
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.store.socialMedia.instagram}
                        onChange={(e) => setSettings({
                          ...settings,
                          store: { 
                            ...settings.store, 
                            socialMedia: { ...settings.store.socialMedia, instagram: e.target.value }
                          }
                        })}
                        className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Renk Paleti</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ana Renk
                      </label>
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, primaryColor: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İkincil Renk
                      </label>
                      <input
                        type="color"
                        value={settings.theme.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, secondaryColor: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vurgu Rengi
                      </label>
                      <input
                        type="color"
                        value={settings.theme.accentColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          theme: { ...settings.theme, accentColor: e.target.value }
                        })}
                        className="w-full h-10 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tema Modu</h3>
                  <div className="flex space-x-4">
                    {['light', 'dark', 'auto'].map((mode) => (
                      <label key={mode} className="flex items-center text-gray-700">
                        <input
                          type="radio"
                          name="themeMode"
                          value={mode}
                          checked={settings.theme.mode === mode}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, mode: e.target.value as any }
                          })}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize text-gray-900">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Locale Settings Tab */}
            {activeTab === 'locale' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dil ve Bölge</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 text-gray-900 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dil
                      </label>
                      <select
                        value={settings.locale.language}
                        onChange={(e) => setSettings({
                          ...settings,
                          locale: { ...settings.locale, language: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para Birimi
                      </label>
                      <select
                        value={settings.locale.currency}
                        onChange={(e) => setSettings({
                          ...settings,
                          locale: { ...settings.locale, currency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="TRY">₺ Türk Lirası</option>
                        <option value="USD">$ US Dollar</option>
                        <option value="EUR">€ Euro</option>
                        <option value="GBP">£ British Pound</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik Ayarları</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SSL Zorunlu</h4>
                        <p className="text-sm text-gray-600">Tüm bağlantıları HTTPS üzerinden zorla</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.sslEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, sslEnabled: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">2FA Zorunlu</h4>
                        <p className="text-sm text-gray-600">Tüm kullanıcılar için iki faktörlü kimlik doğrulama</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorRequired}
                          onChange={(e) => setSettings({
                            ...settings,
                            security: { ...settings.security, twoFactorRequired: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SMTP Ayarları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpHost: e.target.value }
                        })}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpPort: parseInt(e.target.value) }
                        })}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) => setSettings({
                          ...settings,
                          email: { ...settings.email, smtpUser: e.target.value }
                        })}
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Şifre
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={settings.email.smtpPassword}
                          onChange={(e) => setSettings({
                            ...settings,
                            email: { ...settings.email, smtpPassword: e.target.value }
                          })}
                          className="w-full text-black px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Bilgileri</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Versiyon:</span>
                        <span className="ml-2 text-sm text-gray-900">{settings.system.systemInfo.version}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Çalışma Süresi:</span>
                        <span className="ml-2 text-sm text-gray-900">{settings.system.systemInfo.uptime}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Bellek:</span>
                        <span className="ml-2 text-sm text-gray-900">{settings.system.systemInfo.memory}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Disk:</span>
                        <span className="ml-2 text-sm text-gray-900">{settings.system.systemInfo.disk}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bakım Modu</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Bakım Modu</h4>
                      <p className="text-sm text-gray-600">Siteyi bakım moduna al</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.system.maintenanceMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          system: { ...settings.system, maintenanceMode: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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
