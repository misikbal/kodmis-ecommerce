'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X, 
  Shield,
  LogOut,
  Settings,
  Package,
  CreditCard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  variant?: 'default' | 'admin';
  showSearch?: boolean;
  showUserActions?: boolean;
}

const navigationItems = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Ürünler', href: '/products' },
  { name: 'Kategoriler', href: '/categories' },
  { name: 'Hakkımızda', href: '/about' },
  { name: 'İletişim', href: '/contact' },
];

const adminNavigationItems = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Ürünler', href: '/admin/products' },
  { name: 'Kategoriler', href: '/admin/categories' },
  { name: 'Siparişler', href: '/admin/orders' },
  { name: 'Müşteriler', href: '/admin/customers' },
];

export default function Navbar({ 
  variant = 'default', 
  showSearch = true, 
  showUserActions = true 
}: NavbarProps) {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const items = variant === 'admin' ? adminNavigationItems : navigationItems;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={variant === 'admin' ? '/admin' : '/'} className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                {variant === 'admin' ? 'Admin Panel' : 'Kodmis'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && variant === 'default' && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          {/* User Actions */}
          {showUserActions && (
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
                  {/* Wishlist */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <Heart className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* Cart */}
                  <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{session.user?.name}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/orders" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Siparişlerim
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Ayarlar
                        </Link>
                      </DropdownMenuItem>
                      {session.user?.role === 'ADMIN' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 p-2 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {showSearch && variant === 'default' && (
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {showUserActions && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center px-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                        <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      <Link
                        href="/profile/orders"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Siparişlerim
                      </Link>
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
