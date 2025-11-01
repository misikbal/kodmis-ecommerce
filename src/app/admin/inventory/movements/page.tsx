'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import {
  ArrowUpDown,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Package,
  RefreshCw,
  Calendar,
  User,
  Building2,
  FileText,
  X,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  warehouse?: string;
  reference?: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
  previousStock: number;
  newStock: number;
  imageUrl?: string;
}

export default function InventoryMovements() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'product' | 'type' | 'quantity'>('date');
  const [products, setProducts] = useState<any[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [movementFormData, setMovementFormData] = useState({
    productId: '',
    type: 'in' as 'in' | 'out' | 'transfer' | 'adjustment',
    quantity: 0,
    warehouse: 'Ana Depo',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    loadProducts();
    loadMovements();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
    }
  };

  const loadMovements = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/inventory/movements');
      if (response.ok) {
        const data = await response.json();
        setMovements(data);
      }
    } catch (error) {
      console.error('Hareket yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovement = () => {
    setMovementFormData({
      productId: '',
      type: 'in',
      quantity: 0,
      warehouse: 'Ana Depo',
      reference: '',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleSaveMovement = async () => {
    if (!movementFormData.productId || !movementFormData.quantity) {
      alert('Lütfen ürün seçin ve miktar girin');
      return;
    }

    try {
      let response;
      
      if (showEditModal && selectedMovement) {
        // Update existing movement
        response = await fetch(`/api/admin/inventory/movements/${selectedMovement.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movementFormData),
        });
      } else {
        // Create new movement
        response = await fetch('/api/admin/inventory/movements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(movementFormData),
        });
      }

      if (response.ok) {
        loadProducts();
        loadMovements();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedMovement(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Hareket kaydedilemedi');
      }
    } catch (error) {
      console.error('Hareket kaydetme hatası:', error);
      alert('Hareket kaydedilemedi');
    }
  };

  const handleEditMovement = (movement: StockMovement) => {
    setMovementFormData({
      productId: movement.productId,
      type: movement.type,
      quantity: movement.quantity,
      warehouse: movement.warehouse || 'Ana Depo',
      reference: movement.reference || '',
      notes: movement.notes || ''
    });
    setSelectedMovement(movement);
    setShowEditModal(true);
  };

  const handleDownloadMovement = (movement: StockMovement) => {
    // Create CSV content
    const csvContent = `Hareket Detayları
Ürün,${movement.productName}
SKU,${movement.sku}
Tip,${getTypeLabel(movement.type)}
Miktar,${movement.quantity}
Önceki Stok,${movement.previousStock}
Yeni Stok,${movement.newStock}
Depo,${movement.warehouse}
Referans,${movement.reference}
Notlar,${movement.notes}
Tarih,${formatDate(movement.createdAt)}
Oluşturan,${movement.createdBy}
`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Hareket-${movement.reference || movement.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'out':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'in':
        return 'Giriş';
      case 'out':
        return 'Çıkış';
      case 'transfer':
        return 'Transfer';
      case 'adjustment':
        return 'Düzeltme';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <ArrowUp className="h-4 w-4" />;
      case 'out':
        return <ArrowDown className="h-4 w-4" />;
      case 'transfer':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'adjustment':
        return <Edit className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movement.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'product':
        return a.productName.localeCompare(b.productName);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'quantity':
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  const totalMovements = movements.length;
  const inMovements = movements.filter(m => m.type === 'in').length;
  const outMovements = movements.filter(m => m.type === 'out').length;
  const totalInQuantity = movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0);
  const totalOutQuantity = movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0);

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <AdminLayout title="Stok Hareketleri" description="Ürün giriş ve çıkış takibi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ArrowUpDown className="h-8 w-8 mr-3 text-orange-600" />
              Stok Hareketleri
            </h1>
            <p className="text-gray-600 mt-2">
              Ürün giriş, çıkış ve transfer hareketlerini yönetin
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={loadMovements}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button 
              onClick={handleAddMovement}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Hareket
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
            <h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Hareket</h3>
            <p className="text-2xl font-bold text-gray-900">{totalMovements}</p>
            <p className="text-xs text-gray-500 mt-1">Son 30 gün</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowUp className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Giriş Hareketleri</h3>
            <p className="text-2xl font-bold text-gray-900">{inMovements}</p>
            <p className="text-xs text-gray-500 mt-1">{totalInQuantity} birim</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <ArrowDown className="h-6 w-6 text-red-600" />
              </div>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Çıkış Hareketleri</h3>
            <p className="text-2xl font-bold text-gray-900">{outMovements}</p>
            <p className="text-xs text-gray-500 mt-1">{totalOutQuantity} birim</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Net Değişim</h3>
            <p className="text-2xl font-bold text-gray-900">{totalInQuantity - totalOutQuantity}</p>
            <p className="text-xs text-gray-500 mt-1">Giriş - Çıkış</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Hareketler</option>
                <option value="in">Giriş</option>
                <option value="out">Çıkış</option>
                <option value="transfer">Transfer</option>
                <option value="adjustment">Düzeltme</option>
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
                <option value="date">Tarihe Göre</option>
                <option value="product">Ürüne Göre</option>
                <option value="type">Tipe Göre</option>
                <option value="quantity">Miktara Göre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Movements Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miktar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Önceki Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yeni Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(movement.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {movement.imageUrl ? (
                          <img
                            src={movement.imageUrl}
                            alt={movement.productName}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movement.productName}
                          </div>
                          <div className="text-xs text-gray-500">{movement.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`mr-2 ${getTypeColor(movement.type)}`}>
                          {getTypeIcon(movement.type)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(movement.type)}`}>
                          {getTypeLabel(movement.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {movement.type === 'in' ? (
                          <ArrowUp className="h-4 w-4 mr-2 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 mr-2 text-red-600" />
                        )}
                        <span className={`text-sm font-bold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {movement.previousStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {movement.newStock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditMovement(movement)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadMovement(movement)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-4 w-4" />
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
              Toplam {filteredMovements.length} hareket bulundu
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

        {/* Edit Movement Modal */}
        {showEditModal && selectedMovement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Düzenle Stok Hareketi</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMovement(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ürün
                  </label>
                  <select
                    value={movementFormData.productId}
                    onChange={(e) => setMovementFormData({ ...movementFormData, productId: e.target.value })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Ürün seçin</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hareket Tipi
                  </label>
                  <select
                    value={movementFormData.type}
                    onChange={(e) => setMovementFormData({ ...movementFormData, type: e.target.value as any })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="in">Giriş</option>
                    <option value="out">Çıkış</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Düzeltme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Miktar
                  </label>
                  <input
                    type="number"
                    value={movementFormData.quantity}
                    onChange={(e) => setMovementFormData({ ...movementFormData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Depo
                  </label>
                  <select
                    value={movementFormData.warehouse}
                    onChange={(e) => setMovementFormData({ ...movementFormData, warehouse: e.target.value })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Ana Depo">Ana Depo</option>
                    <option value="Satış Mağazası">Satış Mağazası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Referans (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={movementFormData.reference}
                    onChange={(e) => setMovementFormData({ ...movementFormData, reference: e.target.value })}
                    placeholder="Örn: PO-12345"
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    value={movementFormData.notes}
                    onChange={(e) => setMovementFormData({ ...movementFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Hareket hakkında notlar..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMovement(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveMovement}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Movement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Yeni Stok Hareketi</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ürün
                  </label>
                  <select
                    value={movementFormData.productId}
                    onChange={(e) => setMovementFormData({ ...movementFormData, productId: e.target.value })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Ürün seçin</option>
                    {products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hareket Tipi
                  </label>
                  <select
                    value={movementFormData.type}
                    onChange={(e) => setMovementFormData({ ...movementFormData, type: e.target.value as any })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="in">Giriş</option>
                    <option value="out">Çıkış</option>
                    <option value="transfer">Transfer</option>
                    <option value="adjustment">Düzeltme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Miktar
                  </label>
                  <input
                    type="number"
                    value={movementFormData.quantity}
                    onChange={(e) => setMovementFormData({ ...movementFormData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Depo
                  </label>
                  <select
                    value={movementFormData.warehouse}
                    onChange={(e) => setMovementFormData({ ...movementFormData, warehouse: e.target.value })}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Ana Depo">Ana Depo</option>
                    <option value="Satış Mağazası">Satış Mağazası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Referans (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={movementFormData.reference}
                    onChange={(e) => setMovementFormData({ ...movementFormData, reference: e.target.value })}
                    placeholder="Örn: PO-12345"
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    value={movementFormData.notes}
                    onChange={(e) => setMovementFormData({ ...movementFormData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Hareket hakkında notlar..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveMovement}
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

