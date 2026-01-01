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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [addMode, setAddMode] = useState<'quick' | 'manual'>('quick');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo: '',
    website: '',
    apiKey: '',
    apiSecret: '',
    apiEndpoint: '',
    supportedServices: [{ name: 'Standart Kargo', code: 'STANDARD', description: '' }],
    pricing: {
      weightUnit: 'KG' as 'KG' | 'GR',
      dimensionUnit: 'CM' as 'CM' | 'M',
      basePrice: 0,
      pricePerKg: 0,
      minimumPrice: 0
    },
    settings: {
      allowCod: false,
      allowInsurance: false,
      allowPickup: false,
      autoTracking: false
    }
  });

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

  const carrierTemplates = [
    {
      id: 'yurtici',
      name: 'Yurtiçi Kargo',
      slug: 'yurtici-kargo',
      logo: 'https://www.yurticikargo.com/documents/10184/160958/YKH_Logo_300x150.png',
      website: 'https://www.yurticikargo.com',
      apiEndpoint: 'https://api.yurticikargo.com/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 25, pricePerKg: 3, minimumPrice: 25 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: true, autoTracking: true }
    },
    {
      id: 'mng',
      name: 'MNG Kargo',
      slug: 'mng-kargo',
      logo: 'https://www.mngkargo.com.tr/img/mng-logo.png',
      website: 'https://www.mngkargo.com.tr',
      apiEndpoint: 'https://api.mngkargo.com.tr/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 30, pricePerKg: 4, minimumPrice: 30 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: true, autoTracking: true }
    },
    {
      id: 'aras',
      name: 'Aras Kargo',
      slug: 'aras-kargo',
      logo: 'https://www.araskargo.com.tr/img/aras-logo.png',
      website: 'https://www.araskargo.com.tr',
      apiEndpoint: 'https://api.araskargo.com.tr/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 28, pricePerKg: 3.5, minimumPrice: 28 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: false, autoTracking: true }
    },
    {
      id: 'ptt',
      name: 'PTT Kargo',
      slug: 'ptt-kargo',
      logo: 'https://www.ptt.gov.tr/images/ptt-logo.png',
      website: 'https://www.ptt.gov.tr',
      apiEndpoint: 'https://api.ptt.gov.tr/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 20, pricePerKg: 2.5, minimumPrice: 20 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: false, autoTracking: true }
    },
    {
      id: 'surat',
      name: 'Sürat Kargo',
      slug: 'surat-kargo',
      logo: 'https://www.suratkargo.com.tr/img/surat-logo.png',
      website: 'https://www.suratkargo.com.tr',
      apiEndpoint: 'https://api.suratkargo.com.tr/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 27, pricePerKg: 3.2, minimumPrice: 27 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: true, autoTracking: true }
    },
    {
      id: 'ups',
      name: 'UPS Kargo',
      slug: 'ups-kargo',
      logo: 'https://www.ups.com/assets/resources/images/ups-logo.png',
      website: 'https://www.ups.com/tr',
      apiEndpoint: 'https://onlinetools.ups.com/api',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 45, pricePerKg: 8, minimumPrice: 45 },
      settings: { allowCod: false, allowInsurance: true, allowPickup: true, autoTracking: true }
    },
    {
      id: 'hepsijet',
      name: 'HepsiJet',
      slug: 'hepsijet',
      logo: 'https://www.hepsijet.com/img/hepsijet-logo.png',
      website: 'https://www.hepsijet.com',
      apiEndpoint: 'https://api.hepsijet.com/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 22, pricePerKg: 2.8, minimumPrice: 22 },
      settings: { allowCod: true, allowInsurance: true, allowPickup: true, autoTracking: true }
    },
    {
      id: 'trendyol-express',
      name: 'Trendyol Express',
      slug: 'trendyol-express',
      logo: 'https://cdn.dsmcdn.com/ty/trendyol-express-logo.png',
      website: 'https://www.trendyolexpress.com',
      apiEndpoint: 'https://api.trendyolexpress.com/v1',
      pricing: { weightUnit: 'KG', dimensionUnit: 'CM', basePrice: 18, pricePerKg: 2.5, minimumPrice: 18 },
      settings: { allowCod: true, allowInsurance: false, allowPickup: true, autoTracking: true }
    }
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = carrierTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      // Add timestamp to slug to make it unique
      const uniqueSlug = `${template.slug}-${Date.now()}`;
      setFormData({
        ...formData,
        name: template.name,
        slug: uniqueSlug,
        logo: template.logo,
        website: template.website,
        apiEndpoint: template.apiEndpoint,
        pricing: template.pricing as any,
        settings: template.settings
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo: '',
      website: '',
      apiKey: '',
      apiSecret: '',
      apiEndpoint: '',
      supportedServices: [{ name: 'Standart Kargo', code: 'STANDARD', description: '' }],
      pricing: {
        weightUnit: 'KG',
        dimensionUnit: 'CM',
        basePrice: 0,
        pricePerKg: 0,
        minimumPrice: 0
      },
      settings: {
        allowCod: false,
        allowInsurance: false,
        allowPickup: false,
        autoTracking: false
      }
    });
    setSelectedTemplate('');
  };

  const handleAddCarrier = async () => {
    try {
      const response = await fetch('/api/admin/logistics/carriers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          logo: formData.logo,
          website: formData.website,
          apiKey: formData.apiKey,
          apiSecret: formData.apiSecret,
          apiEndpoint: formData.apiEndpoint,
          supportedServices: formData.supportedServices,
          pricing: formData.pricing,
          settings: formData.settings
        })
      });

      if (response.ok) {
        alert('✅ Kargo firması başarıyla eklendi!');
        setShowAddModal(false);
        loadCarriers();
        resetForm();
      } else {
        const data = await response.json();
        if (data.error === 'Carrier already exists') {
          alert('❌ Bu slug ile zaten bir kargo firması var. Slug alanını değiştirin veya farklı bir isim kullanın.');
        } else {
          alert('❌ Hata: ' + (data.error || 'Bilinmeyen hata'));
        }
      }
    } catch (error) {
      console.error('Kargo firması ekleme hatası:', error);
      alert('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleEditCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setFormData({
      name: carrier.name,
      slug: carrier.slug,
      logo: carrier.logo,
      website: carrier.website || '',
      apiKey: '',
      apiSecret: '',
      apiEndpoint: '',
      supportedServices: carrier.supportedServices.map(s => ({ ...s, description: s.description || '' })),
      pricing: {
        ...carrier.pricing,
        pricePerKg: carrier.pricing.pricePerKg || 0
      },
      settings: carrier.settings
    });
    setShowEditModal(true);
  };

  const handleUpdateCarrier = async () => {
    if (!selectedCarrier) return;
    
    try {
      const response = await fetch(`/api/admin/logistics/carriers/${selectedCarrier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          logo: formData.logo,
          website: formData.website,
          apiKey: formData.apiKey || undefined,
          apiSecret: formData.apiSecret || undefined,
          apiEndpoint: formData.apiEndpoint || undefined,
          supportedServices: formData.supportedServices,
          pricing: formData.pricing,
          settings: formData.settings
        })
      });

      if (response.ok) {
        alert('Kargo firması başarıyla güncellendi!');
        setShowEditModal(false);
        loadCarriers();
        resetForm();
        setSelectedCarrier(null);
      } else {
        const data = await response.json();
        alert('Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Kargo firması güncelleme hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleOpenSettings = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowSettingsModal(true);
  };

  const handleToggleActive = async (carrierId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/logistics/carriers/${carrierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        alert(`Kargo firması ${!isActive ? 'aktif' : 'pasif'} edildi!`);
        loadCarriers();
      }
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  const handleDeleteCarrier = async (carrierId: string, carrierName: string) => {
    if (!confirm(`${carrierName} kargo firmasını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/logistics/carriers/${carrierId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Kargo firması başarıyla silindi!');
        loadCarriers();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Bir hata oluştu');
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
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all shadow-sm"
            >
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
                  <button 
                    onClick={() => handleEditCarrier(carrier)}
                    className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Edit className="h-4 w-4 mr-1 inline" />
                    Düzenle
                  </button>
                  <button 
                    onClick={() => handleOpenSettings(carrier)}
                    className="flex-1 px-3 py-2 text-sm border text-black border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-1 inline" />
                    Ayarlar
                  </button>
                  <button 
                    onClick={() => handleDeleteCarrier(carrier.id, carrier.name)}
                    className="px-3 py-2 text-sm border text-red-600 border-red-300 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Edit Carrier Modal */}
        {showEditModal && selectedCarrier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Kargo Firması Düzenle</h2>
                    <p className="text-indigo-100 text-sm mt-1">{selectedCarrier.name} bilgilerini güncelleyin</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCarrier(null);
                      resetForm();
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firma Adı <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* API Configuration */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                    API Entegrasyon Ayarları (Opsiyonel - Boş bırakırsanız mevcut değerler korunur)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        type="text"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Güncellemek için girin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                      <input
                        type="password"
                        value={formData.apiSecret}
                        onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Güncellemek için girin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                      <input
                        type="url"
                        value={formData.apiEndpoint}
                        onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Güncellemek için girin"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Fiyatlandırma
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Taban Fiyat (₺)</label>
                      <input
                        type="number"
                        value={formData.pricing.basePrice}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, basePrice: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kg Başına (₺)</label>
                      <input
                        type="number"
                        value={formData.pricing.pricePerKg}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, pricePerKg: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Fiyat (₺)</label>
                      <input
                        type="number"
                        value={formData.pricing.minimumPrice}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing, minimumPrice: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Özellikler</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.allowCod}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowCod: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Kapıda Ödeme</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.allowInsurance}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowInsurance: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Sigorta</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.allowPickup}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, allowPickup: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Kargo Toplama</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.settings.autoTracking}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, autoTracking: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Otomatik Takip</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCarrier(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleUpdateCarrier}
                    disabled={!formData.name || !formData.slug || !formData.logo}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Güncelle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettingsModal && selectedCarrier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Kargo Ayarları</h2>
                    <p className="text-blue-100 text-sm mt-1">{selectedCarrier.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setSelectedCarrier(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedCarrier.logo}
                        alt={selectedCarrier.name}
                        className="h-12 w-12 rounded-lg object-contain"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{selectedCarrier.name}</h3>
                        <p className="text-sm text-gray-600">{selectedCarrier.slug}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCarrier.integrationStatus)}`}>
                      {selectedCarrier.integrationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Durum:</span>
                      <span className={`ml-2 font-medium ${selectedCarrier.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedCarrier.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Website:</span>
                      <a href={selectedCarrier.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                        Ziyaret Et
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleToggleActive(selectedCarrier.id, selectedCarrier.isActive)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      selectedCarrier.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedCarrier.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      handleEditCarrier(selectedCarrier);
                    }}
                    className="px-4 py-3 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Düzenle
                  </button>
                </div>

                {/* Pricing Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Fiyatlandırma Bilgileri</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Taban Fiyat</p>
                      <p className="text-lg font-bold text-gray-900">₺{selectedCarrier.pricing.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Kg Başına</p>
                      <p className="text-lg font-bold text-gray-900">₺{selectedCarrier.pricing.pricePerKg}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Minimum</p>
                      <p className="text-lg font-bold text-gray-900">₺{selectedCarrier.pricing.minimumPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Desteklenen Özellikler</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCarrier.settings.allowCod && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✓ Kapıda Ödeme</span>
                    )}
                    {selectedCarrier.settings.allowInsurance && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">✓ Sigorta</span>
                    )}
                    {selectedCarrier.settings.allowPickup && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">✓ Kargo Toplama</span>
                    )}
                    {selectedCarrier.settings.autoTracking && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">✓ Otomatik Takip</span>
                    )}
                  </div>
                </div>

                {/* Supported Services */}
                {selectedCarrier.supportedServices.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Desteklenen Servisler</h4>
                    <div className="space-y-2">
                      {selectedCarrier.supportedServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            {service.description && (
                              <p className="text-sm text-gray-600">{service.description}</p>
                            )}
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-200 rounded">{service.code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Tehlikeli Bölge</h4>
                  <p className="text-sm text-red-700 mb-3">Bu işlem geri alınamaz. Tüm kargo kayıtları silinecektir.</p>
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      handleDeleteCarrier(selectedCarrier.id, selectedCarrier.name);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Kargo Firmasını Sil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Carrier Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Yeni Kargo Firması Ekle</h2>
                    <p className="text-indigo-100 text-sm mt-1">Türkiye'deki popüler kargo firmalarından seçim yapın veya manuel olarak ekleyin</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => setAddMode('quick')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      addMode === 'quick'
                        ? 'bg-white text-indigo-600'
                        : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
                    }`}
                  >
                    🚀 Hızlı Ekleme
                  </button>
                  <button
                    onClick={() => setAddMode('manual')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      addMode === 'manual'
                        ? 'bg-white text-indigo-600'
                        : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
                    }`}
                  >
                    ✏️ Manuel Ekleme
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {addMode === 'quick' ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Kargo Firmaları</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {carrierTemplates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className={`p-4 border-2 rounded-lg hover:border-indigo-500 transition-all ${
                              selectedTemplate === template.id
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="text-center">
                              <div className="h-12 w-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Truck className="h-6 w-6 text-indigo-600" />
                              </div>
                              <p className="font-medium text-sm text-gray-900">{template.name}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedTemplate && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <p className="text-sm text-indigo-800 mb-2">
                          ✓ <strong>{formData.name}</strong> seçildi. API bilgilerini girin ve kaydedin.
                        </p>
                        <p className="text-xs text-indigo-600">
                          💡 Slug otomatik olarak benzersiz hale getirildi: <code className="bg-indigo-100 px-1 rounded">{formData.slug}</code>
                        </p>
                      </div>
                    )}
                  </>
                ) : null}

                {/* Form Fields */}
                {(addMode === 'manual' || selectedTemplate) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firma Adı <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setFormData({ 
                              ...formData, 
                              name: newName,
                              // Auto-generate slug in manual mode
                              slug: addMode === 'manual' ? generateSlug(newName) : formData.slug
                            });
                          }}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Örn: Yurtiçi Kargo"
                          disabled={addMode === 'quick' && selectedTemplate !== ''}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug <span className="text-red-500">*</span>
                          <span className="text-gray-500 text-xs ml-2">(Otomatik oluşturuldu - değiştirebilirsiniz)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="yurtici-kargo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={formData.logo}
                          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://..."
                          disabled={addMode === 'quick' && selectedTemplate !== ''}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://..."
                          disabled={addMode === 'quick' && selectedTemplate !== ''}
                        />
                      </div>
                    </div>

                    {/* API Configuration */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Settings className="h-5 w-5 mr-2 text-indigo-600" />
                        API Entegrasyon Ayarları
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                          <input
                            type="text"
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="API anahtarınız"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                          <input
                            type="password"
                            value={formData.apiSecret}
                            onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="API secret"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                          <input
                            type="url"
                            value={formData.apiEndpoint}
                            onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            placeholder="https://api..."
                            disabled={addMode === 'quick' && selectedTemplate !== ''}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        Fiyatlandırma
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Taban Fiyat (₺)</label>
                          <input
                            type="number"
                            value={formData.pricing.basePrice}
                            onChange={(e) => setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, basePrice: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Kg Başına (₺)</label>
                          <input
                            type="number"
                            value={formData.pricing.pricePerKg}
                            onChange={(e) => setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, pricePerKg: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Fiyat (₺)</label>
                          <input
                            type="number"
                            value={formData.pricing.minimumPrice}
                            onChange={(e) => setFormData({
                              ...formData,
                              pricing: { ...formData.pricing, minimumPrice: parseFloat(e.target.value) || 0 }
                            })}
                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Özellikler</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.settings.allowCod}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, allowCod: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Kapıda Ödeme</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.settings.allowInsurance}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, allowInsurance: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Sigorta</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.settings.allowPickup}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, allowPickup: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Kargo Toplama</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.settings.autoTracking}
                            onChange={(e) => setFormData({
                              ...formData,
                              settings: { ...formData.settings, autoTracking: e.target.checked }
                            })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Otomatik Takip</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddCarrier}
                    disabled={!formData.name || !formData.slug || !formData.logo}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kargo Firması Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

