'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { 
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Home,
  Warehouse,
  Tags,
  Store,
  Megaphone,
  CreditCard,
  Truck,
  Receipt,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  FileText,
  Activity,
  UserCheck,
  Palette,
  Languages,
  LogOut,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: SidebarItem[];
  badge?: string;
  color?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
    color: 'text-blue-600'
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: ShoppingCart,
    href: '/admin/orders',
    color: 'text-green-600',
    children: [
      { id: 'orders-list', label: 'Tüm Siparişler', icon: ShoppingCart, href: '/admin/orders' },
      { id: 'orders-returns', label: 'İadeler', icon: Package, href: '/admin/orders/returns' },
      { id: 'orders-shipments', label: 'Kargo', icon: Truck, href: '/admin/orders/shipments' }
    ]
  },
  {
    id: 'products',
    label: 'Ürünler',
    icon: Package,
    href: '/admin/products',
    color: 'text-purple-600',
    children: [
      { id: 'products-list', label: 'Ürün Listesi', icon: Package, href: '/admin/products' },
      { id: 'products-new', label: 'Yeni Ürün', icon: Plus, href: '/admin/products/new' },
      { id: 'products-import', label: 'Toplu İçe Aktar', icon: FileText, href: '/admin/products/import' }
    ]
  },
  {
    id: 'inventory',
    label: 'Stok',
    icon: Warehouse,
    href: '/admin/inventory/warehouses',
    color: 'text-orange-600',
    children: [
      { id: 'inventory-warehouses', label: 'Depolar', icon: Warehouse, href: '/admin/inventory/warehouses' },
      { id: 'inventory-movements', label: 'Stok Hareketleri', icon: Activity, href: '/admin/inventory/movements' },
      { id: 'inventory-alerts', label: 'Stok Uyarıları', icon: Bell, href: '/admin/inventory/alerts' }
    ]
  },
  {
    id: 'categories',
    label: 'Kategoriler',
    icon: Tags,
    href: '/admin/categories',
    color: 'text-indigo-600',
    children: [
      { id: 'categories-list', label: 'Kategori Listesi', icon: Tags, href: '/admin/categories' },
      { id: 'categories-new', label: 'Yeni Kategori', icon: Plus, href: '/admin/categories/new' }
    ]
  },
  {
    id: 'brands',
    label: 'Markalar',
    icon: Store,
    href: '/admin/brands',
    color: 'text-orange-600',
    children: [
      { id: 'brands-list', label: 'Marka Listesi', icon: Store, href: '/admin/brands' },
      { id: 'brands-new', label: 'Yeni Marka', icon: Plus, href: '/admin/brands/new' }
    ]
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Users,
    href: '/admin/customers',
    color: 'text-pink-600',
    children: [
      { id: 'customers-list', label: 'Müşteri Listesi', icon: Users, href: '/admin/customers' },
      { id: 'customers-segments', label: 'Segmentler', icon: UserCheck, href: '/admin/customers/segments' }
    ]
  },
  {
    id: 'marketplaces',
    label: 'Pazaryerleri',
    icon: Globe,
    href: '/admin/marketplaces',
    color: 'text-cyan-600',
    badge: '5',
    children: [
      { id: 'marketplaces-overview', label: 'Genel Bakış', icon: BarChart3, href: '/admin/marketplaces' },
      { id: 'marketplaces-connections', label: 'Bağlantılar', icon: Globe, href: '/admin/marketplaces?tab=marketplaces' },
      { id: 'marketplaces-products', label: 'Ürün Sync', icon: Package, href: '/admin/marketplaces?tab=products' },
      { id: 'marketplaces-orders', label: 'Siparişler', icon: ShoppingCart, href: '/admin/marketplaces?tab=orders' },
      { id: 'marketplaces-analytics', label: 'Analitik', icon: TrendingUp, href: '/admin/marketplaces?tab=analytics' },
      { id: 'marketplaces-errors', label: 'Hatalar', icon: AlertTriangle, href: '/admin/marketplaces?tab=errors' },
      { id: 'marketplaces-sync-logs', label: 'Sync Logları', icon: Activity, href: '/admin/marketplaces?tab=sync-logs' },
      { id: 'marketplaces-settings', label: 'Ayarlar', icon: Settings, href: '/admin/marketplaces?tab=settings' }
    ]
  },
  {
    id: 'marketing',
    label: 'AI Destekli Pazarlama',
    icon: Megaphone,
    href: '/admin/marketing',
    color: 'text-orange-600',
    badge: 'AI',
    children: [
      { id: 'marketing-overview', label: 'Genel Bakış', icon: BarChart3, href: '/admin/marketing' },
      { id: 'marketing-ai-campaigns', label: 'AI Kampanyalar', icon: Zap, href: '/admin/marketing?tab=ai-campaigns' },
      { id: 'marketing-ai-ads', label: 'AI Reklamlar', icon: Globe, href: '/admin/marketing?tab=ai-ads' },
      { id: 'marketing-ai-automation', label: 'E-posta & SMS', icon: Megaphone, href: '/admin/marketing?tab=ai-automation' },
      { id: 'marketing-campaigns', label: 'Kampanyalar', icon: Megaphone, href: '/admin/marketing?tab=campaigns' },
      { id: 'marketing-coupons', label: 'Kuponlar', icon: CreditCard, href: '/admin/marketing?tab=coupons' },
      { id: 'marketing-ai-studio', label: 'AI Studio', icon: Brain, href: '/admin/marketing?tab=ai-studio' }
    ]
  },
  {
    id: 'payments',
    label: 'Ödemeler',
    icon: CreditCard,
    href: '/admin/payments',
    color: 'text-emerald-600',
    children: [
      { id: 'payments-transactions', label: 'İşlemler', icon: CreditCard, href: '/admin/payments/transactions' },
      { id: 'payments-payouts', label: 'Ödemeler', icon: Receipt, href: '/admin/payments/payouts' }
    ]
  },
  {
    id: 'logistics',
    label: 'Lojistik',
    icon: Truck,
    href: '/admin/logistics',
    color: 'text-amber-600',
    children: [
      { id: 'logistics-carriers', label: 'Kargo Firmaları', icon: Truck, href: '/admin/logistics/carriers' },
      { id: 'logistics-shipments', label: 'Gönderimler', icon: Package, href: '/admin/logistics/shipments' }
    ]
  },
  {
    id: 'finance',
    label: 'Finans',
    icon: Receipt,
    href: '/admin/finance',
    color: 'text-teal-600',
    children: [
      { id: 'finance-invoices', label: 'Faturalar', icon: Receipt, href: '/admin/finance/invoices' },
      { id: 'finance-reports', label: 'Raporlar', icon: BarChart3, href: '/admin/finance/reports' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analitik',
    icon: TrendingUp,
    href: '/admin/analytics',
    color: 'text-violet-600'
  },
  {
    id: 'integrations',
    label: 'Entegrasyonlar',
    icon: Zap,
    href: '/admin/integrations',
    color: 'text-yellow-600'
  },
  {
    id: 'users',
    label: 'Kullanıcılar',
    icon: UserCheck,
    href: '/admin/users',
    color: 'text-slate-600',
    children: [
      { id: 'users-admins', label: 'Admin Kullanıcılar', icon: UserCheck, href: '/admin/users' },
      { id: 'users-roles', label: 'Roller & İzinler', icon: Shield, href: '/admin/users/roles' }
    ]
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    icon: Settings,
    href: '/admin/settings',
    color: 'text-gray-600',
    children: [
      { id: 'settings-store', label: 'Mağaza Ayarları', icon: Store, href: '/admin/settings/store' },
      { id: 'settings-theme', label: 'Tema Ayarları', icon: Palette, href: '/admin/settings/theme' },
      { id: 'settings-locale', label: 'Dil & Bölge', icon: Languages, href: '/admin/settings/locale' }
    ]
  }
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { currentTheme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    
    // Handle marketplace tab parameters
    if (href.includes('?tab=')) {
      const [basePath, tabParam] = href.split('?tab=');
      const currentUrl = new URL(window.location.href);
      const currentTab = currentUrl.searchParams.get('tab');
      
      return pathname.startsWith(basePath) && currentTab === tabParam;
    }
    
    return pathname.startsWith(href);
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.href || '');

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
            level > 0 ? 'ml-4' : ''
          } ${
            active 
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              window.location.href = item.href;
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : item.color || 'text-gray-500'}`} />
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
          {!isCollapsed && hasChildren && (
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
          )}
        </div>
        
        {!isCollapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Admin</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && session && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {session.user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className={`flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">Çıkış Yap</span>}
        </button>
      </div>
    </div>
  );
}
