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
        {/* Top Header */}
        {showHeader && (
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Left side */}
                <div className="flex items-center">
                  {/* Mobile menu button */}
                  <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <Menu className="h-6 w-6" />
                  </button>

                  {/* Page title */}
                  <div className="ml-4 lg:ml-0">
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    {description && (
                      <p className="text-sm text-gray-600 hidden sm:block">{description}</p>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                  {/* Global Search */}
                  <div className="hidden md:block relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Global arama..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Quick Create - Modern Design */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline font-medium">Hızlı Oluştur</span>
                      <ChevronDown className="h-4 w-4 ml-2 hidden sm:inline" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 bg-white shadow-2xl border border-gray-200 rounded-xl p-2">
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

                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{session?.user?.name}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
              </div>
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
