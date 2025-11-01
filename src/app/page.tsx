'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sliderData = [
    {
      id: 1,
      title: 'Yeni Sezon Koleksiyonu',
      subtitle: 'En Trend Ürünler',
      description: '2024 yılının en popüler ürünlerini keşfedin',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      buttonText: 'Alışverişe Başla',
      buttonLink: '/products',
    },
    {
      id: 2,
      title: 'Elektronik Ürünler',
      subtitle: 'Teknoloji Dünyası',
      description: 'En son teknoloji ürünleri ile tanışın',
      image: 'https://images.unsplash.com/photo-1498049794561-7780c7234a63?w=1200&h=600&fit=crop',
      buttonText: 'Elektronik Keşfet',
      buttonLink: '/categories/electronics',
    },
    {
      id: 3,
      title: 'Ev & Yaşam',
      subtitle: 'Konforlu Yaşam',
      description: 'Evinizi güzelleştiren ürünler',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop',
      buttonText: 'Ev Ürünleri',
      buttonLink: '/categories/home',
    },
  ];

  const categories = [
    { name: 'Elektronik', image: 'https://images.unsplash.com/photo-1498049794561-7780c7234a63?w=300&h=200&fit=crop', count: 1250 },
    { name: 'Giyim', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop', count: 890 },
    { name: 'Ev & Yaşam', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop', count: 650 },
    { name: 'Spor', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', count: 420 },
    { name: 'Kitap', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', count: 320 },
    { name: 'Oyuncak', image: 'https://images.unsplash.com/photo-1558060370-5397c4d1d2a1?w=300&h=200&fit=crop', count: 180 },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 45000,
      originalPrice: 50000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      rating: 4.8,
      reviewCount: 125,
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
      badge: 'İndirim',
    },
  ];

  const features = [
    {
      icon: Truck,
      title: 'Ücretsiz Kargo',
      description: '500₺ ve üzeri alışverişlerde',
    },
    {
      icon: Shield,
      title: 'Güvenli Ödeme',
      description: '256-bit SSL şifreleme',
    },
    {
      icon: RefreshCw,
      title: 'Kolay İade',
      description: '30 gün içinde ücretsiz iade',
    },
    {
      icon: Star,
      title: 'Müşteri Memnuniyeti',
      description: '7/24 müşteri desteği',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Mutlu Müşteri' },
    { number: '50K+', label: 'Ürün Çeşidi' },
    { number: '99%', label: 'Müşteri Memnuniyeti' },
    { number: '24/7', label: 'Müşteri Desteği' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Slider */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl mb-4 text-blue-200">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-gray-200">
                    {slide.description}
                  </p>
                  <a
                    href={slide.buttonLink}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                  >
                    {slide.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {sliderData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
              <p className="text-lg text-gray-600">İhtiyacınız olan her şeyi bulun</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={`/categories/${category.name.toLowerCase()}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.count} ürün</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
              <p className="text-lg text-gray-600">En popüler ve en çok tercih edilen ürünler</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.badge}
                      </span>
                    </div>
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
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
                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="/products"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Tüm Ürünleri Gör
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Kodmis?</h2>
              <p className="text-lg text-gray-600">Müşteri memnuniyeti odaklı hizmet anlayışımız</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}