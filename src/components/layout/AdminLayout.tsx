'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  Search, 
  Bell, 
  Plus, 
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Package,
  Tags,
  Megaphone,
  CreditCard,
  Warehouse
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export default function AdminLayout({
  children,
  title = 'Admin Panel',
  description = 'Sistem yönetimi ve kontrol paneli',
  showHeader = true,
}: AdminLayoutProps) {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <AdminSidebar isCollapsed={false} onToggle={toggleMobileMenu} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header / Navbar */}
        {showHeader && (
          <header className="h-16 bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-slate-500 hover:text-slate-700 mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Sipariş, ürün veya müşteri ara..."
                  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {/* Quick Create - Desktop Only */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="font-medium">Hızlı Oluştur</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 bg-white shadow-2xl border border-slate-200 rounded-xl p-2">
                    <DropdownMenuLabel className="px-3 py-2 text-sm font-bold text-gray-900">
                      🚀 Hızlı Oluştur
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-2" />
                    
                    {/* Ürün */}
                    <DropdownMenuItem className="px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group" asChild>
                      <Link href="/admin/products/new">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yeni Ürün</p>
                            <p className="text-xs text-gray-500">Ürün ekle ve satışa başla</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    {/* Kategori */}
                    <DropdownMenuItem className="px-3 py-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group" asChild>
                      <Link href="/admin/categories/new">
                        <div className="flex items-center">
                          <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                            <Tags className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yeni Kategori</p>
                            <p className="text-xs text-gray-500">Kategori oluştur</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    {/* Kampanya */}
                    <DropdownMenuItem className="px-3 py-3 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group" asChild>
                      <Link href="/admin/marketing?tab=campaigns">
                        <div className="flex items-center">
                          <div className="p-2 bg-orange-100 rounded-lg mr-3 group-hover:bg-orange-200 transition-colors">
                            <Megaphone className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yeni Kampanya</p>
                            <p className="text-xs text-gray-500">Kampanya başlat</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    {/* Kupon */}
                    <DropdownMenuItem className="px-3 py-3 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group" asChild>
                      <Link href="/admin/marketing?tab=coupons">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Yeni Kupon</p>
                            <p className="text-xs text-gray-500">İndirim kuponu oluştur</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />
                    
                    {/* Stok */}
                    <DropdownMenuItem className="px-3 py-3 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer group" asChild>
                      <Link href="/admin/inventory/warehouses">
                        <div className="flex items-center">
                          <div className="p-2 bg-amber-100 rounded-lg mr-3 group-hover:bg-amber-200 transition-colors">
                            <Warehouse className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">Stok Yönetimi</p>
                            <p className="text-xs text-gray-500">Stokları kontrol et</p>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

              {/* User Menu - Desktop */}
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                    <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{session?.user?.name || 'Admin'}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel className="text-gray-900">Hesabım</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Ayarlar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile only profile trigger */}
              <button className="lg:hidden h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                <User className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
