'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import ThemeButton from '@/components/ui/ThemeButton';
import ThemeInput from '@/components/ui/ThemeInput';
import ProductCard from '@/components/ui/ProductCard';
import ThemeSelector from '@/components/admin/ThemeSelector';
import { 
  Palette, 
  ShoppingCart, 
  Heart, 
  Star, 
  Search,
  Filter,
  Grid,
  List,
  Sun,
  Moon
} from 'lucide-react';

export default function ThemeDemoPage() {
  const { currentTheme, isDarkMode, toggleDarkMode, availableThemes, setTheme } = useTheme();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Örnek ürün verileri
  const sampleProducts = [
    {
      id: '1',
      name: 'Modern Bluetooth Kulaklık',
      price: 299,
      originalPrice: 399,
      image: '/api/placeholder/300/300',
      rating: 4.5,
      reviewCount: 128,
      category: 'Elektronik',
      isNew: true,
      isOnSale: true,
      discount: 25
    },
    {
      id: '2',
      name: 'Zarif Kadın Çantası',
      price: 450,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 89,
      category: 'Moda',
      isNew: false,
      isOnSale: false
    },
    {
      id: '3',
      name: 'Premium Kozmetik Seti',
      price: 199,
      originalPrice: 249,
      image: '/api/placeholder/300/300',
      rating: 4.3,
      reviewCount: 156,
      category: 'Kozmetik',
      isNew: false,
      isOnSale: true,
      discount: 20
    },
    {
      id: '4',
      name: 'Ahşap Masa Lambası',
      price: 350,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviewCount: 67,
      category: 'Mobilya',
      isNew: true,
      isOnSale: false
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme?.colors.background || '#ffffff' }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-40 border-b"
        style={{ 
          backgroundColor: currentTheme?.colors.surface || '#ffffff',
          borderColor: currentTheme?.colors.border || '#e5e7eb'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: currentTheme?.colors.primary || '#2563eb' }}
              >
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span 
                className="text-xl font-bold"
                style={{ 
                  color: currentTheme?.colors.text || '#111827',
                  fontFamily: currentTheme?.typography.fontFamily.display || 'Inter'
                }}
              >
                Kodmis E-commerce
              </span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-8">
              <ThemeInput
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="search"
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <ThemeButton
                variant="outline"
                onClick={() => setShowThemeSelector(true)}
                leftIcon={<Palette className="h-4 w-4" />}
              >
                Temalar
              </ThemeButton>
              
              <ThemeButton variant="primary" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                Sepet (3)
              </ThemeButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              color: currentTheme?.colors.text || '#111827',
              fontFamily: currentTheme?.typography.fontFamily.display || 'Inter'
            }}
          >
            Tema Sistemi Demo
          </h1>
          <p 
            className="text-lg"
            style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
          >
            Mevcut tema: <strong>{currentTheme?.name}</strong> - {currentTheme?.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            
            <ThemeButton variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filtrele
            </ThemeButton>
          </div>

          <div className="text-sm" style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}>
            {sampleProducts.length} ürün bulundu
          </div>
        </div>

        {/* Product Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout={viewMode}
            />
          ))}
        </div>

        {/* Theme Info */}
        <div 
          className="mt-12 p-6 rounded-xl"
          style={{ 
            backgroundColor: currentTheme?.colors.surface || '#f8fafc',
            borderColor: currentTheme?.colors.border || '#e5e7eb'
          }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: currentTheme?.colors.text || '#111827' }}
          >
            Mevcut Tema Bilgileri
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 
                className="font-medium mb-2"
                style={{ color: currentTheme?.colors.text || '#111827' }}
              >
                Renk Paleti
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: currentTheme?.colors.primary || '#2563eb' }}
                  ></div>
                  <span className="text-sm">Primary: {currentTheme?.colors.primary}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: currentTheme?.colors.secondary || '#64748b' }}
                  ></div>
                  <span className="text-sm">Secondary: {currentTheme?.colors.secondary}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: currentTheme?.colors.accent || '#f59e0b' }}
                  ></div>
                  <span className="text-sm">Accent: {currentTheme?.colors.accent}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 
                className="font-medium mb-2"
                style={{ color: currentTheme?.colors.text || '#111827' }}
              >
                Tipografi
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Primary:</strong> {currentTheme?.typography.fontFamily.primary}
                </p>
                <p className="text-sm">
                  <strong>Display:</strong> {currentTheme?.typography.fontFamily.display}
                </p>
                <p className="text-sm">
                  <strong>Weight:</strong> {currentTheme?.typography.fontWeight.semibold}
                </p>
              </div>
            </div>
            
            <div>
              <h3 
                className="font-medium mb-2"
                style={{ color: currentTheme?.colors.text || '#111827' }}
              >
                Özellikler
              </h3>
              <div className="space-y-1">
                {Object.entries(currentTheme?.features || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        value ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}
    </div>
  );
}
