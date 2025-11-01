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
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Plus,
  Wifi,
  WifiOff,
  Settings,
  DollarSign
} from 'lucide-react';

interface Carrier {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website?: string;
  isActive: boolean;
  supportedServices: Array<{
    name: string;
    code: string;
    description?: string;
  }>;
  pricing: {
    weightUnit: 'KG' | 'GR';
    dimensionUnit: 'CM' | 'M';
    basePrice: number;
    pricePerKg?: number;
    minimumPrice: number;
  };
  settings: {
    allowCod: boolean;
    allowInsurance: boolean;
    allowPickup: boolean;
    autoTracking: boolean;
  };
  integrationStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CarriersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterActive, setFilterActive] = useState('all');
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
      loadCarriers();
    }
  }, [status, filterStatus, filterActive]);

  const loadCarriers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/logistics/carriers');
      if (response.ok) {
        const data = await response.json();
        setCarriers(data.carriers);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Kargo firması yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'bg-green-100 text-green-800';
      case 'DISCONNECTED': return 'bg-gray-100 text-gray-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return Wifi;
      case 'DISCONNECTED': return WifiOff;
      case 'ERROR': return AlertTriangle;
      default: return FileText;
    }
  };

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = searchTerm === '' || 
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || carrier.integrationStatus === filterStatus;
    const matchesActive = filterActive === 'all' || (filterActive === 'active' && carrier.isActive) || (filterActive === 'inactive' && !carrier.isActive);
    
    return matchesSearch && matchesStatus && matchesActive;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center border-2 border-indigo-200">
              <Truck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kargo Firmaları</h1>
              <p className="text-sm text-gray-500 mt-0.5">Kargo sağlayıcıları ve entegrasyonları</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadCarriers}
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
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kargo Firması
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 mb-1">Toplam Kargo Firması</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.totalCarriers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Aktif Firmalar</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeCarriers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Bağlı Firmalar</p>
                <p className="text-3xl font-bold text-blue-900">{stats.connectedCarriers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Wifi className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bağlantı Durumu</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tümü</option>
                  <option value="CONNECTED">Bağlı</option>
                  <option value="DISCONNECTED">Bağlı Değil</option>
                  <option value="ERROR">Hata</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aktivite</label>
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
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
              placeholder="Kargo firması ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Carriers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredCarriers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <Truck className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kargo firması bulunamadı</h3>
              <p className="text-gray-600">Henüz herhangi bir kargo firması eklenmemiş</p>
            </div>
          ) : filteredCarriers.map((carrier) => {
            const StatusIcon = getStatusIcon(carrier.integrationStatus);
            return (
              <div
                key={carrier.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={carrier.logo}
                      alt={carrier.name}
                      className="h-10 w-10 rounded-lg object-contain"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{carrier.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(carrier.integrationStatus)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {carrier.integrationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taban Fiyat:</span>
                    <span className="font-medium">₺{carrier.pricing.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kg Başına:</span>
                    <span className="font-medium">₺{carrier.pricing.pricePerKg}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Minimum Fiyat:</span>
                    <span className="font-medium">₺{carrier.pricing.minimumPrice}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    {carrier.settings.allowCod && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">Kapıda Ödeme</span>
                    )}
                    {carrier.settings.allowInsurance && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Sigorta</span>
                    )}
                    {carrier.settings.autoTracking && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Otomatik Takip</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    <Edit className="h-4 w-4 mr-1 inline" />
                    Düzenle
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-1 inline" />
                    Ayarlar
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

