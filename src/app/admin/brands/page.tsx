'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout';
import {
  Store,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  Globe,
  MapPin,
  Calendar,
  Link as LinkIcon,
  RefreshCw,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  bannerImage?: string;
  website?: string;
  isActive: boolean;
  country?: string;
  foundedYear?: number;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function BrandsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/brands');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Marka yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu markayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/brands?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadBrands();
      }
    } catch (error) {
      console.error('Marka silme hatası:', error);
    }
  };

  const handleView = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowViewModal(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  const handleStatusToggle = async (brand: Brand) => {
    try {
      const response = await fetch('/api/admin/brands', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: brand._id,
          isActive: !brand.isActive
        }),
      });

      if (response.ok) {
        loadBrands();
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brand.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && brand.isActive) ||
                         (filterActive === 'inactive' && !brand.isActive);
    
    return matchesSearch && matchesFilter;
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

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <AdminLayout title="Markalar" description="Marka yönetimi">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Store className="h-8 w-8 mr-3 text-blue-600" />
              Markalar
            </h1>
            <p className="text-gray-600 mt-2">
              Markaları görüntüle, düzenle ve yönet
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadBrands}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link
              href="/admin/brands/new"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Marka
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Marka ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 px-4">
              <div className="text-sm">
                <span className="text-gray-500">Toplam:</span>
                <span className="font-bold text-gray-900 ml-2">{brands.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Aktif:</span>
                <span className="font-bold text-green-600 ml-2">
                  {brands.filter(b => b.isActive).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Banner/Logo */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <Store className="h-16 w-16 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500">@{brand.slug}</p>
                  </div>
                  <button
                    onClick={() => handleStatusToggle(brand)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      brand.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {brand.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </div>

                {brand.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {brand.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {brand.country && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {brand.country}
                    </div>
                  )}
                  {brand.foundedYear && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Kuruluş: {brand.foundedYear}
                    </div>
                  )}
                  {brand.website && (
                    <div className="flex items-center text-sm text-blue-600">
                      <Globe className="h-4 w-4 mr-2" />
                      {brand.website}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleView(brand)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Görüntüle
                  </button>
                  <button
                    onClick={() => router.push(`/admin/brands/${brand._id}/edit`)}
                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Marka bulunamadı' : 'Henüz marka eklenmemiş'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Arama kriterlerinize uygun marka bulunamadı.'
                : 'İlk markanızı oluşturmak için başlayın.'}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/brands/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Markayı Oluştur
              </Link>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
