'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Eye,
  Target,
  BarChart3,
  Info,
  Sparkles,
  Star,
  Heart,
  Package,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CustomerSegment {
  _id: string;
  name: string;
  description: string;
  criteria: string;
  color: string;
  icon: string;
  customerCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerSegments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: '',
    color: '#3B82F6',
    icon: 'Users'
  });

  const [criteriaType, setCriteriaType] = useState('spending');
  const [criteriaParams, setCriteriaParams] = useState({
    amount: '',
    period: '6',
    orders: '',
    category: ''
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
      loadSegments();
    }
  }, [status]);

  const loadSegments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/customers/segments');
      if (response.ok) {
        const data = await response.json();
        setSegments(data);
      }
    } catch (error) {
      console.error('Segment yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCriteria = () => {
    switch (criteriaType) {
      case 'spending':
        if (criteriaParams.amount) {
          return `Toplam harcaması ${criteriaParams.amount}₺ üzeri olan müşteriler`;
        }
        break;
      case 'orders':
        if (criteriaParams.orders && criteriaParams.period) {
          return `Son ${criteriaParams.period} ayda en az ${criteriaParams.orders} sipariş vermiş müşteriler`;
        }
        break;
      case 'registration':
        if (criteriaParams.period) {
          return `Son ${criteriaParams.period} gün içinde kayıt olmuş müşteriler`;
        }
        break;
      case 'no_orders':
        if (criteriaParams.period) {
          return `Son ${criteriaParams.period} ayda sipariş vermeyen müşteriler`;
        }
        break;
      case 'category':
        if (criteriaParams.category) {
          return `${criteriaParams.category} kategorisinden ürün satın alan müşteriler`;
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleCriteriaChange = () => {
    const generated = generateCriteria();
    setFormData({ ...formData, criteria: generated });
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      criteria: '',
      color: '#3B82F6',
      icon: 'Users'
    });
    setCriteriaType('spending');
    setCriteriaParams({
      amount: '',
      period: '6',
      orders: '',
      category: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (segment: CustomerSegment) => {
    setFormData({
      name: segment.name,
      description: segment.description,
      criteria: segment.criteria,
      color: segment.color,
      icon: segment.icon
    });
    setSelectedSegment(segment);
    setShowEditModal(true);
  };

  const handleView = (segment: CustomerSegment) => {
    setSelectedSegment(segment);
    setShowViewModal(true);
  };

  const handleDelete = async (segmentId: string) => {
    if (!confirm('Bu segmenti silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/customers/segments/${segmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadSegments();
      } else {
        alert('Segment silinemedi');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Segment silinemedi');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.criteria) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const url = showEditModal && selectedSegment
        ? `/api/admin/customers/segments/${selectedSegment._id}`
        : '/api/admin/customers/segments';
      
      const method = showEditModal && selectedSegment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        loadSegments();
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedSegment(null);
      } else {
        alert('Segment kaydedilemedi');
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      alert('Segment kaydedilemedi');
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: any = {
      Users, Star, Heart, Package, AlertTriangle, TrendingUp, Target, BarChart3
    };
    return iconMap[iconName] || Users;
  };

  const quickTemplates = [
    // Değerli Müşteriler
    {
      name: 'VIP Müşteriler',
      description: 'En yüksek harcama yapan, en değerli müşterilerimiz.',
      criteria: 'Toplam harcaması 100.000₺ ü第一批eri olan müşteriler',
      color: '#F59E0B',
      icon: 'Star',
      category: 'value'
    },
    {
      name: 'Yüksek Değerli Müşteriler',
      description: 'Yüksek harcama yapan, sadık müşteriler.',
      criteria: 'Toplam harcaması 50.000₺ üzeri olan müşteriler',
      color: '#FBBF24',
      icon: 'Star',
      category: 'value'
    },
    {
      name: 'Orta Değerli Müşteriler',
      description: 'Orta seviye harcama yapan aktif müşteriler.',
      criteria: 'Toplam harcaması 20.000-50.000₺ arası olan müşteriler',
      color: '#FCD34D',
      icon: 'Star',
      category: ' CPUsvalue'
    },
    
    // Davranış Bazlı
    {
      name: 'Sık Alışveriş Yapanlar',
      description: 'Düzenli olarak alışveriş yapan sadık müşteriler.',
      criteria: 'Son 6 ayda 10+ sipariş vermiş müşteriler',
      color: '#10B981',
      icon: 'TrendingUp',
      category: 'behavior'
    },
    {
      name: 'Aktif Alıcılar',
      description: 'Son zamanlarda aktif alışveriş yapan müşteriler.',
      criteria: 'Son 3 ayda en az 5 sipariş vermiş müşteriler',
      color: '#34D399',
      icon: 'TrendingUp',
      category: 'behavior'
    },
    {
      name: 'Sezonluk Alıcılar',
      description: 'Belli dönemlerde yoğun alışveriş yapan müşteriler.',
      criteria: 'Son 6 ayda 3-5 sipariş arası veren müşteriler',
      color: '#6EE7B7',
      icon: 'Clock',
      category: 'behavior consistently'
    },
    
    // Yeni Müşteriler
    {
      name: 'Yeni Kayıtlar (7 Gün)',
      description: 'Geçen hafta kayıt olan yeni müşteriler.',
      criteria: 'Son 7 gün içinde kayıt olmuş müşteriler',
      color: '#3B82F6',
      icon: 'Users',
      category: 'new'
    },
    {
      name: 'Yeni Kayıtlar (30 Gün)',
      description: 'Geçen ay kayıt olan müşteriler.',
      criteria: 'Son 30 gün içinde kayıt olmuş müşteriler',
      color: '#60A5FA',
      icon: 'Users',
      category: 'new'
    },
    {
      name: 'İlk Alışveriş Yapanlar',
      description: 'Yeni kayıt olup ilk alışverişini yapan müşteriler.',
      criteria: 'Son 30 günde kayıt olup 1 sipariş vermiş müşteriler',
      color: '#93C5FD',
      icon: 'Users',
      category: 'new'
    },
    
    // Risk Segmentleri
    {
      name: 'Risk Altındaki Müşteriler',
      description: 'Uzun süredir alışveriş yapmayan müşteriler.',
      criteria: 'Son 6 ayda sipariş vermemiş müşteriler',
      color: '#EF4444',
      icon: 'AlertTriangle',
      category: 'risk'
    },
    {
      name: 'Kaybolan Müşteriler',
      description: 'Çok uzun süredir hiç alışveriş yapmayan müşteriler.',
      criteria: 'Son 12 ayda sipariş vermemiş müşteriler',
      color: '#F87171',
      icon: 'AlertTriangle',
      category: 'risk'
    },
    {
      name: 'Tek Seferlik Müşteriler',
      description: 'Sadece bir kez alışveriş yapan müşteriler.',
      criteria: 'Toplamda sadece 1 sipariş vermiş müşteriler',
      color: '#FCA5A5',
      icon: 'XCircle',
      category: 'risk'
    },
    
    // Kategori Bazlı
    {
      name: 'Elektronik Tutkunları',
      description: 'Elektronik ürünlere ilgi duyan müşteriler.',
      criteria: 'Elektronik kategorisinden ürün satın alan müşteriler',
      color: '#8B5CF6',
      icon: 'Package',
      category: 'category'
    },
    {
      name: 'Moda & Stil Severler',
      description: 'Giyim ve aksesuar kategorisinde aktif müşteriler.',
      criteria: 'Moda kategorisinden ürün satın alan müşteriler',
      color: '#EC4899',
      icon: 'Heart',
      category: 'category'
    },
    {
      name: 'Ev & Yaşam Müşterileri',
      description: 'Ev eşyası ve dekorasyon ürünleri alan müşteriler.',
      criteria: 'Ev & Yaşam kategorisinden ürün satın alan müşteriler',
      color: '#14B8A6',
      icon: 'Package',
      category: 'category'
    },
    {
      name: 'Spor & Aktivitе Müşterileri',
      description: 'Spor ürünleri ve aktivite gereçleri alan müşteriler.',
      criteria: 'Spor & Aktivite kategorisinden ürün satın alan müşteriler',
      color: '#06B6D4',
      icon: 'Target',
      category: 'category'
    },
    
    // Özel Durumlar
    {
      name: 'Özel Gün Müşterileri',
      description: 'Doğum günü, yıldönümü gibi özel günlerde alışveriş yapan.',
      criteria: 'Özel gün kategorilerinden ürün satın alan müşteriler',
      color: '#F472B6',
      icon: 'Heart',
      category: 'special'
    },
    {
      name: 'Hediye Alıcıları',
      description: 'Başkası için hediye satın alan müşteriler.',
      criteria: 'Hediye kategorisinden ürün satın alan müşteriler',
      color: '#A78BFA',
      icon: 'Sparkles',
      category: 'special'
    }
  ];

  const handleQuickAdd = (template: any) => {
    setFormData(template);
    setShowAddModal(true);
  };

  const filteredSegments = segments.filter(segment => {
    const matchesSearch = segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         segment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && segment.isActive) ||
                         (filterActive === 'inactive' && !segment.isActive);

    return matchesSearch && matchesFilter;
  });

  const totalCustomers = segments.reduce((sum, s) => sum + s.customerCount, 0);
  const activeSegments = segments.filter(s => s.isActive).length;
  const avgCustomersPerSegment = segments.length > 0 ? totalCustomers / segments.length : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to렬k-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Müşteri Segmentleri</h1>
              <p className="text-sm text-gray-500 mt-0.5">Segment Yönetimi ve Analiz Merkezi</p>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
            <div className="flex items-start space-x-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Müşteri Segmenti Nedir?</h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  Müşteri segmentleri, benzer özelliklere sahip müşterileri gruplandırarak hedefli pazarlama yapmanızı sağlar. 
                  Örneğin: <strong>VIP müşteriler</strong>, <strong>sık alışveriş yapanlar</strong>, <strong>risk altındakiler</strong> gibi segmentler oluşturarak 
                  daha etkili kampanyalar yapabilir, müşteri memnuniyetini artırabilir ve satışlarınızı optimize edebilirsiniz.
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-700">
                  <span className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Hedefli Pazarlama
                  </span>
                  <span className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Otomatik Kategorilendirme
                  </span>
                  <span className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Detaylı Analiz
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadSegments}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Segment
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Toplam Segment</p>
                <p className="text-3xl font-bold text-blue-900">{segments.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Aktif Segmentler</p>
                <p className="text-3xl font-bold text-green-900">{activeSegments}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Toplam Müşteri</p>
                <p className="text-3xl font-bold text-purple-900">{totalCustomers.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center justify-between w-full mb-4 hover:bg-gray-50 -m-6 p-6 rounded-xl transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center border-2 border-purple-200">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  Hızlı Şablonlar
                </h3>
                <p className="text-sm text-gray-600">17 farklı şablon ile müşterilerinizi kategorize edin</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              {showTemplates ? (
                <>
                  <span className="text-sm font-medium">Daha Az Göster</span>
                  <ChevronUp className="h-5 w-5" />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">Daha Fazla Göster</span>
                  <ChevronDown className="h-5 w-5" />
                </>
              )}
            </div>
          </button>

          {showTemplates && (
            <div>

          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setTemplateFilter('all')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Tüm Şablonlar"
            >
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">Tümü</span>
            </button>
            <button
              onClick={() => setTemplateFilter('value')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'value'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Değerli Müşteriler"
            >
              <Star className="h-4 w-4" />
              <span className="text-sm font-medium">Değerli</span>
            </button>
            <button
              onClick={() => setTemplateFilter('behavior')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'behavior'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Davranış Bazlı"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Davranış</span>
            </button>
            <button
              onClick={() => setTemplateFilter('new')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'new'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Yeni Müşteriler"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Yeni</span>
            </button>
            <button
              onClick={() => setTemplateFilter('risk')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'risk'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Risk Altında"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Risk</span>
            </button>
            <button
              onClick={() => setTemplateFilter('category')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'category'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Kategori Bazlı"
            >
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">Kategori</span>
            </button>
            <button
              onClick={() => setTemplateFilter('special')}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 ${
                templateFilter === 'special'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Özel Durumlar"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Özel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTemplates
              .filter(template => templateFilter === 'all' || template.category === templateFilter)
              .map((template, index) => {
                const IconComponent = getIconComponent(template.icon);
                return (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(template)}
                  className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border-2 border-gray-200 hover:border-gray-300 transition-all text-left group hover:shadow-md"
                >
                  <div 
                    className="h-1 w-full absolute top-0 left-0"
                    style={{ backgroundColor: template.color }}
                  />
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color: template.color }} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <div className="mt-3 flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="h-3 w-3 mr-1" />
                    Kullan
                  </div>
                </button>
              );
            })}
          </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Segment ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Segments Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredSegments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz segment yok</h3>
            <p className="text-gray-600 mb-6">Müşterilerinizi organize etmek için ilk segmentinizi oluşturun</p>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Segment Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSegments.map((segment) => (
              <div
                key={segment._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${segment.color}20` }}
                      >
                        <Users className="h-5 w-5" style={{ color: segment.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{segment.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{segment.customerCount} müşteri</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleView(segment)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEdit(segment)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(segment._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{segment.description}</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Target className="h-3 w-3 mr-1" />
                      Kriter
                    </div>
                    <p className="text-sm font-medium text-gray-900">{segment.criteria}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {segment.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Pasif
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(segment.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {showEditModal ? 'Segment Düzenle' : 'Yeni Segment Oluştur'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segment Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Örn: VIP Müşteriler"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Bu segmentin açıklaması..."
                  />
                </div>

                {/* Kriter Seçimi */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
                  <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-blue-600" />
                    Kriter Belirleme *
                  </label>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kriter Tipi</label>
                    <select
                      value={criteriaType}
                      onChange={(e) => {
                        setCriteriaType(e.target.value);
                        setTimeout(handleCriteriaChange, 100);
                      }}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="spending">Harcama Miktarı</option>
                      <option value="orders">Sipariş Sayısı</option>
                      <option value="registration">Kayıt Tarihi</option>
                      <option value="no_orders">Sipariş Vermeme</option>
                      <option value="category">Kategori Bazlı</option>
                      <option value="custom">Özel Kriter</option>
                    </select>
                  </div>

                  {criteriaType === 'spending' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Harcama (₺)</label>
                      <input
                        type="number"
                        value={criteriaParams.amount}
                        onChange={(e) => {
                          setCriteriaParams({ ...criteriaParams, amount: e.target.value });
                          setTimeout(handleCriteriaChange, 100);
                        }}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Örn: 10000"
                      />
                    </div>
                  )}

                  {criteriaType === 'orders' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Sipariş</label>
                        <input
                          type="number"
                          value={criteriaParams.orders}
                          onChange={(e) => {
                            setCriteriaParams({ ...criteriaParams, orders: e.target.value });
                            setTimeout(handleCriteriaChange, 100);
                          }}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Örn: 5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Süre (Ay)</label>
                        <input
                          type="number"
                          value={criteriaParams.period}
                          onChange={(e) => {
                            setCriteriaParams({ ...criteriaParams, period: e.target.value });
                            setTimeout(handleCriteriaChange, 100);
                          }}
                          className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Örn: 6"
                        />
                      </div>
                    </div>
                  )}

                  {criteriaType === 'registration' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Son Kaç Gün</label>
                      <input
                        type="number"
                        value={criteriaParams.period}
                        onChange={(e) => {
                          setCriteriaParams({ ...criteriaParams, period: e.target.value });
                          setTimeout(handleCriteriaChange, 100);
                        }}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Örn: 30"
                      />
                    </div>
                  )}

                  {criteriaType === 'no_orders' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Süre (Ay)</label>
                      <input
                        type="number"
                        value={criteriaParams.period}
                        onChange={(e) => {
                          setCriteriaParams({ ...criteriaParams, period: e.target.value });
                          setTimeout(handleCriteriaChange, 100);
                        }}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Örn: 6"
                      />
                    </div>
                  )}

                  {criteriaType === 'category' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                      <input
                        type="text"
                        value={criteriaParams.category}
                        onChange={(e) => {
                          setCriteriaParams({ ...criteriaParams, category: e.target.value });
                          setTimeout(handleCriteriaChange, 100);
                        }}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Örn: Elektronik"
                      />
                    </div>
                  )}

                  {criteriaType === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Özel Kriter</label>
                      <textarea
                        value={formData.criteria}
                        onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                        rows={2}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Özel kriterinizi yazın..."
                      />
                    </div>
                  )}

                  {criteriaType !== 'custom' && (
                    <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <strong>Oluşturulan Kriter:</strong>
                          <p className="mt-1 font-medium">{generateCriteria() || 'Lütfen parametreleri doldurun'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renk
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İkon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Users">Users</option>
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="Target">Target</option>
                      <option value="BarChart3">BarChart3</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedSegment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  {showEditModal ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedSegment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{selectedSegment.name}</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Açıklama</label>
                  <p className="text-gray-900">{selectedSegment.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Kriter</label>
                  <p className="text-gray-900">{selectedSegment.criteria}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Müşteri Sayısı</label>
                    <p className="text-gray-900 font-semibold">{selectedSegment.customerCount}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Durum</label>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSegment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedSegment.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Oluşturulma</label>
                    <p className="text-gray-900">{new Date(selectedSegment.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Son Güncelleme</label>
                    <p className="text-gray-900">{new Date(selectedSegment.updatedAt).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedSegment(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


