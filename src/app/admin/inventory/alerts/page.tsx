'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import {
  AlertTriangle,
  Package,
  TrendingDown,
  Zap,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Edit,
  Bell,
  TrendingUp,
  BarChart3,
  Search
} from 'lucide-react';

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  lowStockThreshold: number;
  status: 'critical' | 'warning' | 'normal';
  lastUpdated: string;
  imageUrl?: string;
  category?: string;
  alertType: 'low_stock' | 'out_of_stock' | 'critical_stock';
}

export default function InventoryAlerts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [thresholdValue, setThresholdValue] = useState(10);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      if (response.ok) {
        const products = await response.json();
        const generatedAlerts: StockAlert[] = [];

        products.forEach((product: any) => {
          const currentStock = product.quantity || 0;
          const lowStockThreshold = product.lowStockAlert || 10;
          
          // Determine alert status
          let alertStatus: 'critical' | 'warning' | 'normal' = 'normal';
          let alertType: 'low_stock' | 'out_of_stock' | 'critical_stock' = 'low_stock';

          if (currentStock === 0) {
            alertStatus = 'critical';
            alertType = 'out_of_stock';
          } else if (currentStock <= lowStockThreshold) {
            alertStatus = 'critical';
            alertType = 'critical_stock';
          } else if (currentStock <= lowStockThreshold * 1.5) {
            alertStatus = 'warning';
            alertType = 'low_stock';
          }

          if (alertStatus !== 'normal') {
            generatedAlerts.push({
              id: product._id,
              productId: product._id,
              productName: product.name,
              sku: product.sku,
              currentStock,
              lowStockThreshold,
              status: alertStatus,
              lastUpdated: product.updatedAt || product.createdAt,
              imageUrl: product.images?.[0]?.url,
              category: product.categoryId?.name || 'Kategori Yok',
              alertType
            });
          }
        });

        setAlerts(generatedAlerts.sort((a, b) => {
          if (a.status === 'critical' && b.status !== 'critical') return -1;
          if (b.status === 'critical' && a.status !== 'critical') return 1;
          if (a.status === 'warning' && b.status === 'normal') return -1;
          if (b.status === 'warning' && a.status === 'normal') return 1;
          return 0;
        }));
      }
    } catch (error) {
      console.error('Uyarı yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (alert: StockAlert) => {
    setSelectedAlert(alert);
    setShowViewModal(true);
  };

  const handleEditThreshold = (alert: StockAlert) => {
    setSelectedAlert(alert);
    setThresholdValue(alert.lowStockThreshold);
    setShowEditModal(true);
  };

  const handleSaveThreshold = async () => {
    if (!selectedAlert) return;

    try {
      const response = await fetch(`/api/admin/products/${selectedAlert.productId}`);
      if (response.ok) {
        const product = await response.json();
        
        const updateResponse = await fetch(`/api/admin/products/${selectedAlert.productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...product,
            lowStockAlert: thresholdValue
          }),
        });

        if (updateResponse.ok) {
          loadAlerts();
          setShowEditModal(false);
          setSelectedAlert(null);
        }
      }
    } catch (error) {
      console.error('Threshold güncelleme hatası:', error);
      alert('Eşik değeri güncellenemedi');
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock':
        return <XCircle className="h-5 w-5" />;
      case 'critical_stock':
        return <AlertTriangle className="h-5 w-5" />;
      case 'low_stock':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getAlertLabel = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock':
        return 'Stok Tükendi';
      case 'critical_stock':
        return 'Kritik Stok';
      case 'low_stock':
        return 'Düşük Stok';
      default:
        return 'Bilinmeyen';
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

  const criticalAlerts = alerts.filter(a => a.status === 'critical').length;
  const warningAlerts = alerts.filter(a => a.status === 'warning').length;
  const totalAlerts = alerts.length;
  const needsAttention = criticalAlerts;

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
    <AdminLayout title="Stok Uyarıları" description="Düşük stok ve kritik uyarılar">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <AlertTriangle className="h-8 w-8 mr-3 text-orange-600" />
              Stok Uyarıları
            </h1>
            <p className="text-gray-600 mt-2">
              Düşük stok seviyeleri ve kritik uyarılar
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={loadAlerts}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border-2 border-red-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Kritik Uyarı</h3>
            <p className="text-2xl font-bold text-red-800">{criticalAlerts}</p>
            <p className="text-xs text-red-600 mt-1">Acil müdahale gerekir</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-lg border-2 border-yellow-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Düşük Stok</h3>
            <p className="text-2xl font-bold text-yellow-800">{warningAlerts}</p>
            <p className="text-xs text-yellow-600 mt-1">Yakında tükenecek</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border-2 border-blue-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Toplam Uyarı</h3>
            <p className="text-2xl font-bold text-blue-800">{totalAlerts}</p>
            <p className="text-xs text-blue-600 mt-1">Aktif uyarı sayısı</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border-2 border-orange-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Acil Müdahale</h3>
            <p className="text-2xl font-bold text-orange-800">{needsAttention}</p>
            <p className="text-xs text-orange-600 mt-1">Dikkat gerektirir</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="critical">Kritik</option>
                <option value="warning">Uyarı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
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
                    Mevcut Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eşik Değeri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Güncelleme
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {alert.imageUrl ? (
                          <img
                            src={alert.imageUrl}
                            alt={alert.productName}
                            className="h-12 w-12 rounded-lg object-cover mr-3"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {alert.productName}
                          </div>
                          <div className="text-xs text-gray-500">{alert.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={`text-sm font-bold ${
                          alert.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {alert.currentStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alert.lowStockThreshold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-2 ${getAlertColor(alert.status)}`}>
                        {getAlertIcon(alert.alertType)}
                        <span className="ml-2">{getAlertLabel(alert.alertType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(alert.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => router.push(`/admin/products/${alert.productId}/edit`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => router.push(`/admin/inventory/warehouses`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <ArrowRight className="h-4 w-4" />
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
              Toplam {filteredAlerts.length} uyarı bulundu
            </div>
          </div>
        </div>

        {/* Edit Threshold Modal */}
        {showEditModal && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Eşik Değeri Düzenle</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAlert(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ürün
                  </label>
                  <p className="text-sm text-gray-600">{selectedAlert.productName}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yeni Eşik Değeri
                  </label>
                  <input
                    type="number"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(parseInt(e.target.value) || 0)}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bu değerin altına düştüğünde uyarı verilecek
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedAlert(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveThreshold}
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


