'use client';

import { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Package,
  Globe,
  Settings,
  MapPin,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

interface MarketplaceProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  marketplaceStatus: string;
  marketplaceId: string;
  marketplaceProductId?: string;
  lastSyncDate?: string;
  syncError?: string;
  images: string[];
  attributes: Record<string, string>;
}

interface ProductSyncInterfaceProps {
  marketplaceId: string;
  marketplaceName: string;
  onSyncProducts: (productIds: string[], marketplaceId: string) => void;
  onMapCategories: (productIds: string[], categoryMapping: Record<string, string>) => void;
}

interface CategoryMapping {
  [productId: string]: string;
}

export default function ProductSyncInterface({
  marketplaceId,
  marketplaceName,
  onSyncProducts,
  onMapCategories
}: ProductSyncInterfaceProps) {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryMapping, setCategoryMapping] = useState<CategoryMapping>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCategoryMapping, setShowCategoryMapping] = useState(false);

  // Mock categories for mapping
  const marketplaceCategories = [
    { id: 'cat1', name: 'Elektronik', path: 'Elektronik > Telefon > Akıllı Telefon' },
    { id: 'cat2', name: 'Giyim', path: 'Giyim > Erkek > Tişört' },
    { id: 'cat3', name: 'Ev & Yaşam', path: 'Ev & Yaşam > Mobilya > Yatak Odası' },
    { id: 'cat4', name: 'Spor', path: 'Spor > Fitness > Kardio' },
    { id: 'cat5', name: 'Kozmetik', path: 'Kozmetik > Cilt Bakımı > Nemlendirici' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [marketplaceId]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockProducts: MarketplaceProduct[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro Max',
          sku: 'IPH15PM-256',
          price: 45999,
          stock: 25,
          category: 'Elektronik',
          status: 'ACTIVE',
          marketplaceStatus: 'NOT_SYNCED',
          marketplaceId,
          images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop'],
          attributes: { color: 'Titanium', storage: '256GB' }
        },
        {
          id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          sku: 'SGS24U-512',
          price: 38999,
          stock: 15,
          category: 'Elektronik',
          status: 'ACTIVE',
          marketplaceStatus: 'SYNCED',
          marketplaceId,
          marketplaceProductId: 'mp_12345',
          lastSyncDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop'],
          attributes: { color: 'Titanium Black', storage: '512GB' }
        },
        {
          id: '3',
          name: 'Nike Air Max 270',
          sku: 'NAM270-BLK',
          price: 3299,
          stock: 50,
          category: 'Spor',
          status: 'ACTIVE',
          marketplaceStatus: 'ERROR',
          marketplaceId,
          lastSyncDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          syncError: 'Kategori eşlemesi bulunamadı',
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'],
          attributes: { color: 'Black', size: '42' }
        },
        {
          id: '4',
          name: 'MacBook Pro M3',
          sku: 'MBPM3-14',
          price: 52999,
          stock: 8,
          category: 'Elektronik',
          status: 'ACTIVE',
          marketplaceStatus: 'PENDING',
          marketplaceId,
          images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'],
          attributes: { color: 'Space Gray', storage: '512GB' }
        },
        {
          id: '5',
          name: 'Adidas Ultraboost 22',
          sku: 'AUB22-WHT',
          price: 2899,
          stock: 30,
          category: 'Spor',
          status: 'ACTIVE',
          marketplaceStatus: 'NOT_SYNCED',
          marketplaceId,
          images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop'],
          attributes: { color: 'White', size: '41' }
        }
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSyncSelected = () => {
    const productIds = Array.from(selectedProducts);
    onSyncProducts(productIds, marketplaceId);
    setSelectedProducts(new Set());
  };

  const handleMapCategories = () => {
    setShowCategoryMapping(true);
  };

  const handleSaveCategoryMapping = () => {
    onMapCategories(Array.from(selectedProducts), categoryMapping);
    setShowCategoryMapping(false);
    setSelectedProducts(new Set());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SYNCED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ERROR': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'NOT_SYNCED': return <AlertTriangle className="h-4 w-4 text-gray-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SYNCED': return 'Senkronize';
      case 'ERROR': return 'Hata';
      case 'PENDING': return 'Beklemede';
      case 'NOT_SYNCED': return 'Senkronize Değil';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYNCED': return 'bg-green-100 text-green-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'NOT_SYNCED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || product.marketplaceStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: products.length,
    NOT_SYNCED: products.filter(p => p.marketplaceStatus === 'NOT_SYNCED').length,
    SYNCED: products.filter(p => p.marketplaceStatus === 'SYNCED').length,
    PENDING: products.filter(p => p.marketplaceStatus === 'PENDING').length,
    ERROR: products.filter(p => p.marketplaceStatus === 'ERROR').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ürün Senkronizasyonu - {marketplaceName}
          </h3>
          <p className="text-sm text-gray-600">
            Ürünlerinizi {marketplaceName} pazar yerine senkronize edin
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchProducts}
            className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">
                {status === 'ALL' ? 'Toplam' : getStatusText(status)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="NOT_SYNCED">Senkronize Değil</option>
              <option value="SYNCED">Senkronize</option>
              <option value="PENDING">Beklemede</option>
              <option value="ERROR">Hata</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProducts.size} ürün seçildi
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMapCategories}
                className="flex items-center px-3 py-2 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-100"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Kategori Eşle
              </button>
              <button
                onClick={handleSyncSelected}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Senkronize Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {selectedProducts.size === filteredProducts.length ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Ürün</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Sync
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSelectProduct(product.id)}
                        className="flex-shrink-0"
                      >
                        {selectedProducts.has(product.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {Object.entries(product.attributes).map(([key, value]) => `${key}: ${value}`).join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.marketplaceStatus)}`}>
                      {getStatusIcon(product.marketplaceStatus)}
                      <span className="ml-1">{getStatusText(product.marketplaceStatus)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.lastSyncDate ? 
                      new Date(product.lastSyncDate).toLocaleDateString('tr-TR') : 
                      '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Settings className="h-4 w-4" />
                      </button>
                      {product.marketplaceStatus === 'ERROR' && (
                        <button className="text-red-600 hover:text-red-700">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Mapping Modal */}
      {showCategoryMapping && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCategoryMapping(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Kategori Eşleme
              </h3>
              <button
                onClick={() => setShowCategoryMapping(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {Array.from(selectedProducts).map(productId => {
                const product = products.find(p => p.id === productId);
                return (
                  <div key={productId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product?.name}</p>
                      <p className="text-sm text-gray-600">Mevcut kategori: {product?.category}</p>
                    </div>
                    <select
                      value={categoryMapping[productId] || ''}
                      onChange={(e) => setCategoryMapping(prev => ({
                        ...prev,
                        [productId]: e.target.value
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Kategori seçin</option>
                      {marketplaceCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.path}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCategoryMapping(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSaveCategoryMapping}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
