'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  ChevronDown,
  X
} from 'lucide-react';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 45000,
      originalPrice: 50000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      rating: 4.8,
      reviewCount: 125,
      category: 'Elektronik',
      brand: 'Apple',
      inStock: true,
      badge: 'Yeni',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 42000,
      originalPrice: 45000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 98,
      category: 'Elektronik',
      brand: 'Samsung',
      inStock: true,
      badge: 'Popüler',
    },
    {
      id: 3,
      name: 'MacBook Pro M3',
      price: 65000,
      originalPrice: 70000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      rating: 4.9,
      reviewCount: 76,
      category: 'Elektronik',
      brand: 'Apple',
      inStock: true,
      badge: 'Öne Çıkan',
    },
    {
      id: 4,
      name: 'AirPods Pro 2',
      price: 8500,
      originalPrice: 9500,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&fit=crop',
      rating: 4.6,
      reviewCount: 203,
      category: 'Elektronik',
      brand: 'Apple',
      inStock: true,
      badge: 'İndirim',
    },
    {
      id: 5,
      name: 'Nike Air Max 270',
      price: 2500,
      originalPrice: 3000,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      rating: 4.5,
      reviewCount: 156,
      category: 'Spor',
      brand: 'Nike',
      inStock: true,
      badge: 'İndirim',
    },
    {
      id: 6,
      name: 'Adidas Ultraboost 22',
      price: 2800,
      originalPrice: 3200,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
      rating: 4.4,
      reviewCount: 89,
      category: 'Spor',
      brand: 'Adidas',
      inStock: false,
      badge: 'Tükendi',
    },
  ];

  const categories = ['Elektronik', 'Giyim', 'Ev & Yaşam', 'Spor', 'Kitap', 'Oyuncak'];
  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ürün ara..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₺{priceRange[0].toLocaleString()}</span>
                    <span>₺{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriler</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Markalar</label>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange([0, 100000]);
                  setSearchTerm('');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
                <p className="text-gray-600">{filteredProducts.length} ürün bulundu</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">En Yeni</option>
                  <option value="price-low">Fiyat (Düşük → Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek → Düşük)</option>
                  <option value="rating">En Yüksek Puan</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <div key={product.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'h-48' : 'h-48'
                        }`}
                      />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.badge === 'Yeni' ? 'bg-green-500 text-white' :
                          product.badge === 'Popüler' ? 'bg-blue-500 text-white' :
                          product.badge === 'Öne Çıkan' ? 'bg-yellow-500 text-white' :
                          product.badge === 'İndirim' ? 'bg-red-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ₺{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₺{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button 
                          disabled={!product.inStock}
                          className={`p-2 rounded-full transition-colors ${
                            product.inStock 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                      {!product.inStock && (
                        <p className="text-sm text-red-600 mt-2">Stokta yok</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

