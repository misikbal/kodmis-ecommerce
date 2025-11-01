'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { 
  Menu, 
  X, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Upload,
  Filter,
  Grid,
  List,
  Sun,
  Moon,
  Maximize,
  Minimize
} from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function ResponsiveLayout({ children, title, description }: ResponsiveLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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
  }, [session, status, router]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-collapse sidebar on mobile
      if (width < 768) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${
        isMobile
          ? mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          : sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      } ${isMobile ? 'w-64' : sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          isMobile={isMobile}
          onMobileMenuClose={closeMobileMenu}
        />
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile
          ? 'ml-0'
          : sidebarCollapsed ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-64'
      }`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Side */}
              <div className="flex items-center">
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                  onClick={toggleSidebar}
                  className="hidden lg:block p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </button>

                {/* Page Title */}
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                  {description && (
                    <p className="text-sm text-gray-600 hidden sm:block">{description}</p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center space-x-4">
                {/* Search - Hidden on mobile */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ara..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                </div>

                {/* Quick Actions - Responsive */}
                <div className="flex items-center space-x-2">
                  {/* Mobile Search Button */}
                  <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <Search className="h-5 w-5" />
                  </button>

                  {/* Quick Create - Hidden on mobile */}
                  <button className="hidden sm:flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Hızlı Oluştur</span>
                  </button>

                  {/* Notifications */}
                  <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="ml-2 hidden md:inline text-sm font-medium">
                        {session?.user?.name}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// Responsive Hook
export function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
}

// Responsive Utilities
export const responsiveClasses = {
  // Grid
  grid: {
    mobile: 'grid-cols-1',
    tablet: 'md:grid-cols-2',
    desktop: 'lg:grid-cols-3 xl:grid-cols-4'
  },
  
  // Spacing
  padding: {
    mobile: 'p-4',
    tablet: 'md:p-6',
    desktop: 'lg:p-8'
  },
  
  // Text
  text: {
    mobile: 'text-sm',
    tablet: 'md:text-base',
    desktop: 'lg:text-lg'
  },
  
  // Visibility
  visibility: {
    mobileOnly: 'block md:hidden',
    tabletOnly: 'hidden md:block lg:hidden',
    desktopOnly: 'hidden lg:block',
    mobileHidden: 'hidden md:block',
    tabletHidden: 'hidden lg:block'
  }
};

// Breakpoint Constants
export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;
