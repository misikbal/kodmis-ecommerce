'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    category: string;
    isNew?: boolean;
    isOnSale?: boolean;
    discount?: number;
  };
  layout?: 'grid' | 'list' | 'masonry';
  showActions?: boolean;
}

export default function ProductCard({ 
  product, 
  layout = 'grid', 
  showActions = true 
}: ProductCardProps) {
  const { currentTheme } = useTheme();
  const [isLiked, setIsLiked] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const cardClasses = `
    theme-card relative overflow-hidden group cursor-pointer
    ${layout === 'list' ? 'flex items-center space-x-4' : ''}
    ${layout === 'masonry' ? 'break-inside-avoid' : ''}
  `;

  const imageClasses = `
    ${layout === 'grid' ? 'aspect-square' : ''}
    ${layout === 'list' ? 'w-24 h-24 flex-shrink-0' : ''}
    ${layout === 'masonry' ? 'aspect-[4/5]' : ''}
    w-full object-cover transition-transform duration-300 group-hover:scale-105
  `;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderBadges = () => {
    const badges = [];
    
    if (product.isNew) {
      badges.push(
        <span
          key="new"
          className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: currentTheme?.colors.success || '#10b981' }}
        >
          Yeni
        </span>
      );
    }
    
    if (product.isOnSale && product.discount) {
      badges.push(
        <span
          key="sale"
          className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: currentTheme?.colors.error || '#ef4444' }}
        >
          %{product.discount} İndirim
        </span>
      );
    }
    
    return badges;
  };

  const renderActions = () => {
    if (!showActions) return null;

    return (
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          <button
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              // Ürün detayına git
            }}
          >
            <Eye className="h-4 w-4 text-gray-700" />
          </button>
          <button
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-700'
              }`} 
            />
          </button>
          <button
            className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              // Sepete ekle
            }}
          >
            <ShoppingCart className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  if (layout === 'list') {
    return (
      <div className={cardClasses} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="relative">
          <img src={product.image} alt={product.name} className={imageClasses} />
          {renderBadges()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-semibold truncate"
                style={{ color: currentTheme?.colors.text || '#111827' }}
              >
                {product.name}
              </h3>
              <p 
                className="text-sm truncate"
                style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
              >
                {product.category}
              </p>
              
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(product.rating)}
                <span 
                  className="text-xs ml-1"
                  style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
                >
                  ({product.reviewCount})
                </span>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="flex items-center space-x-2">
                {product.originalPrice && (
                  <span 
                    className="text-sm line-through"
                    style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
                  >
                    ₺{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span 
                  className="text-lg font-bold"
                  style={{ color: currentTheme?.colors.primary || '#2563eb' }}
                >
                  ₺{product.price.toLocaleString()}
                </span>
              </div>
              
              {showActions && (
                <button
                  className="mt-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: currentTheme?.colors.primary || '#2563eb',
                    color: 'white'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Sepete ekle
                  }}
                >
                  Sepete Ekle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative">
        <img src={product.image} alt={product.name} className={imageClasses} />
        {renderBadges()}
        {renderActions()}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="text-lg font-semibold line-clamp-2"
            style={{ color: currentTheme?.colors.text || '#111827' }}
          >
            {product.name}
          </h3>
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
          >
            <Heart 
              className={`h-5 w-5 ${
                isLiked ? 'text-red-500 fill-current' : 'text-gray-400'
              }`} 
            />
          </button>
        </div>
        
        <p 
          className="text-sm mb-2"
          style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
        >
          {product.category}
        </p>
        
        <div className="flex items-center space-x-1 mb-3">
          {renderStars(product.rating)}
          <span 
            className="text-xs ml-1"
            style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
          >
            ({product.reviewCount})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.originalPrice && (
              <span 
                className="text-sm line-through"
                style={{ color: currentTheme?.colors.textSecondary || '#6b7280' }}
              >
                ₺{product.originalPrice.toLocaleString()}
              </span>
            )}
            <span 
              className="text-xl font-bold"
              style={{ color: currentTheme?.colors.primary || '#2563eb' }}
            >
              ₺{product.price.toLocaleString()}
            </span>
          </div>
          
          {showActions && (
            <button
              className="px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                backgroundColor: currentTheme?.colors.primary || '#2563eb',
                color: 'white'
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Sepete ekle
              }}
            >
              Sepete Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
