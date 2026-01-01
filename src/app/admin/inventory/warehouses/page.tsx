'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import {
  Warehouse,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  RefreshCw,
  X
} from 'lucide-react';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  warehouse: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockAlert: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reserved';
  lastUpdated: string;
  imageUrl?: string;
  category?: string;
}

export default function InventoryWarehouses() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'productName' | 'stock' | 'warehouse'>('productName');
  const [products, setProducts] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockFormData, setStockFormData] = useState({
    quantity: 0,
    lowStockAlert: 10,
    reason: ''
  });

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        
        // Transform products to stock items
        const transformed = data.map((product: any) => ({
          id: product._id,
          productName: product.name,
          sku: product.sku,
          warehouse: 'Ana Depo', // Default warehouse
          currentStock: product.quantity || 0,
          reservedStock: 0, // Could be calculated from orders
          availableStock: product.quantity || 0,
          lowStockAlert: product.lowStockAlert || 10,
          status: getStockStatus(product.quantity || 0, product.lowStockAlert || 10),
          lastUpdated: product.updatedAt || product.createdAt,
          imageUrl: product.images?.[0]?.url,
          category: product.categoryId?.name || 'Kategori Yok'
        }));
        
        setStockItems(transformed);
      }
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (currentStock: number, lowStockAlert: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= lowStockAlert) return 'low_stock';
    return 'in_stock';
  };

  const handleViewProduct = (item: StockItem) => {
    const product = products.find(p => p._id === item.id);
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditStock = (item: StockItem) => {
    const product = products.find(p => p._id === item.id);
    setSelectedProduct(product);
    setStockFormData({
      quantity: product?.quantity || 0,
      lowStockAlert: product?.lowStockAlert || 10,
      reason: ''
    });
    setShowEditModal(true);
  };

  const handleAddStock = () => {
    // Redirect to products page to add new product with stock
    router.push('/admin/products/new');
  };

  const handleSaveStock = async () => {
    if (!selectedProduct && !stockFormData.quantity) {
      alert('Lütfen ürün seçin ve stok miktarı girin');
      return;
    }

    try {
      const productId = selectedProduct?._id;
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedProduct,
          quantity: stockFormData.quantity,
          lowStockAlert: stockFormData.lowStockAlert
        }),
      });

      if (response.ok) {
        loadProducts();
        setShowEditModal(false);
        setShowStockModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Stok güncelleme hatası:', error);
      alert('Stok güncellenemedi');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'Stokta';
      case 'low_stock':
        return 'Düşük Stok';
      case 'out_of_stock':
        return 'Tükendi';
      case 'reserved':
        return 'Rezerve';
      default:
        return status;
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouse === filterWarehouse;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, product: any) => sum + (product.quantity || 0), 0);
  const lowStockCount = products.filter((product: any) => {
    const stock = product.quantity || 0;
    const alert = product.lowStockAlert || 10;
    return stock === 0 || stock <= alert;
  }).length;
  const averageStock = totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0;

  return (
    <AdminLayout title="Stok Yönetimi" description="Depo ve stok takibi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Warehouse className="h-8 w-8 mr-3 text-orange-600" />
              Stok Yönetimi
            </h1>
            <p className="text-gray-600 mt-2">
              Depo stokları ve stok hareketlerini yönetin
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={loadProducts}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button 
              onClick={handleAddStock}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ürün Ekle
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Ürün</h3>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Aktif ürün sayısı</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Warehouse className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Stok</h3>
            <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
            <p className="text-xs text-gray-500 mt-1">Birim stok miktarı</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Düşük Stok</h3>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
            <p className="text-xs text-gray-500 mt-1">Dikkat gerektirir</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Ortalama Stok</h3>
            <p className="text-2xl font-bold text-gray-900">{averageStock}</p>
            <p className="text-xs text-gray-500 mt-1">Birim başına ortalama</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün veya SKU ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Warehouse Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterWarehouse}
                onChange={(e) => setFilterWarehouse(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Depolar</option>
                <option value="Ana Depo">Ana Depo</option>
                <option value="Satış Mağazası">Satış Mağazası</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="in_stock">Stokta</option>
                <option value="low_stock">Düşük Stok</option>
                <option value="out_of_stock">Tükendi</option>
                <option value="reserved">Rezerve</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="productName">Ürün Adı</option>
                <option value="stock">Stok</option>
                <option value="warehouse">Depo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Depo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mevcut Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanılabilir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.productName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.currentStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-600">
                          {item.availableStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewProduct(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditStock(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Toplam {filteredItems.length} ürün bulundu
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Önceki
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Sonraki
              </button>
            </div>
          </div>
        </div>

        {/* View Product Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Ürün Detayları</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {selectedProduct.images?.[0]?.url ? (
                    <img
                      src={selectedProduct.images[0].url}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Mevcut Stok</p>
                      <p className="text-lg font-bold text-gray-900">{selectedProduct.quantity || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uyarı Seviyesi</p>
                      <p className="text-lg font-bold text-gray-900">{selectedProduct.lowStockAlert || 10}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Fiyat</p>
                    <p className="text-lg font-bold text-green-600">₺{selectedProduct.price?.toFixed(2) || '0.00'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Durum</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(selectedProduct.quantity <= (selectedProduct.lowStockAlert || 10) ? 'low_stock' : 'in_stock')
                    }`}>
                      {selectedProduct.quantity <= (selectedProduct.lowStockAlert || 10) ? 'Düşük Stok' : 'Stokta'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Açıklama</h5>
                <p className="text-sm text-gray-600">{selectedProduct.description || 'Açıklama bulunmuyor'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Stock Modal */}
        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Stok Düzenle</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mevcut Stok
                  </label>
                  <input
                    type="number"
                    value={stockFormData.quantity}
                    onChange={(e) => setStockFormData({ ...stockFormData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Düşük Stok Uyarısı
                  </label>
                  <input
                    type="number"
                    value={stockFormData.lowStockAlert}
                    onChange={(e) => setStockFormData({ ...stockFormData, lowStockAlert: parseInt(e.target.value) || 10 })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bu miktarın altına düştüğünde uyarı verilecek
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Değişiklik Nedeni (Opsiyonel)
                  </label>
                  <textarea
                    value={stockFormData.reason}
                    onChange={(e) => setStockFormData({ ...stockFormData, reason: e.target.value })}
                    rows={3}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Stok değişikliğinin nedeni..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveStock}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

