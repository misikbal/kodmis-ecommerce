'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  RefreshCw,
  Calendar,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Plus,
  FileText,
  ExternalLink
} from 'lucide-react';

interface Shipment {
  id: string;
  orderId?: string;
  orderNumber?: string;
  carrierId?: string;
  carrierName?: string;
  carrierLogo?: string;
  trackingNumber?: string;
  status: 'PENDING' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';
  shippingMethod: string;
  weight?: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  cost: number;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ShipmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/admin/unauthorized');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadShipments();
    }
  }, [status, filterStatus]);

  const loadShipments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`/api/admin/logistics/shipments?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setShipments(data.shipments);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Gönderi yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      case 'RETURNED': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return CheckCircle;
      case 'IN_TRANSIT': return Truck;
      case 'PREPARING': return Package;
      case 'PENDING': return Clock;
      case 'RETURNED': return AlertTriangle;
      case 'CANCELLED': return XCircle;
      default: return FileText;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === '' || 
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrierName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center border-2 border-green-200">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kargo Gönderileri</h1>
              <p className="text-sm text-gray-500 mt-0.5">Sipariş gönderileri ve takip işlemleri</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadShipments}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-700 rounded-lg hover:from-green-700 hover:to-teal-800 transition-all shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Gönderi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Toplam Gönderi</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalShipments || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Beklemede</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending || 0}</p>
              </div>
              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Hazırlanıyor</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.preparing || 0}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 mb-1">Yolda</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.inTransit || 0}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Teslim Edildi</p>
                <p className="text-3xl font-bold text-green-900">{stats.delivered || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">İade</p>
                <p className="text-3xl font-bold text-orange-900">{stats.returned || 0}</p>
              </div>
              <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tümü</option>
                  <option value="PENDING">Beklemede</option>
                  <option value="PREPARING">Hazırlanıyor</option>
                  <option value="IN_TRANSIT">Yolda</option>
                  <option value="DELIVERED">Teslim Edildi</option>
                  <option value="RETURNED">İade</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Takip no, sipariş no, müşteri adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gönderi bulunamadı</h3>
                <p className="text-gray-600">Henüz herhangi bir gönderi kaydı bulunmuyor</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Takip No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kargo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => {
                    const StatusIcon = getStatusIcon(shipment.status);
                    return (
                      <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">#{shipment.orderNumber || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{shipment.trackingNumber || '-'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {shipment.carrierLogo && (
                              <img src={shipment.carrierLogo} alt={shipment.carrierName} className="h-6 w-6 rounded" />
                            )}
                            <span className="text-sm text-gray-900">{shipment.carrierName || '-'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {shipment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{shipment.shippingAddress.city}</div>
                          <div className="text-sm text-gray-500">{shipment.shippingAddress.address.substring(0, 30)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₺{shipment.cost.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(shipment.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

