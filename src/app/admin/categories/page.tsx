'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Layers,
  Grid,
  List as ListIcon,
  RefreshCw,
  ArrowUpDown,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Star,
  Package,
  Image as ImageIcon,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  isFeatured?: boolean;
  parentId?: string;
  level?: number;
  sortOrder?: number;
  productCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>('tree');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'parent' | 'child'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'products' | 'order'>('order');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      } else {
        alert('Kategori silinemedi. Alt kategoriler veya ürünler olabilir.');
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
    }
  };

  // Filtreleme ve sıralama
  const getFilteredAndSortedCategories = () => {
    const filtered = categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterType === 'all' ? true :
        filterType === 'parent' ? !cat.parentId :
        filterType === 'child' ? !!cat.parentId : true;
      return matchesSearch && matchesFilter;
    });

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'products':
          return (b.productCount || 0) - (a.productCount || 0);
        case 'order':
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Tree view için hiyerarşik render
  const renderTreeView = () => {
    const parentCategories = getFilteredAndSortedCategories().filter(cat => !cat.parentId);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {parentCategories.map(category => (
            <div key={category._id}>
              {/* Ana Kategori */}
              <div className="group hover:bg-gray-50 transition-all">
                <div className="flex items-center p-4">
                  {/* Expand/Collapse Button */}
                  {categories.filter(c => c.parentId === category._id).length > 0 && (
                    <button
                      onClick={() => toggleExpanded(category._id)}
                      className="mr-2 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      {expandedCategories.includes(category._id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  )}

                  {/* Category Icon/Color */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mr-4 shadow-sm"
                    style={{ backgroundColor: category.color || '#3b82f6' }}
                  >
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span>{category.icon || '📦'}</span>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                      {category.isFeatured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">/{category.slug}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                        Sıra: {category.sortOrder || 0}
                      </span>
                      {category.productCount !== undefined && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {category.productCount} ürün
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{category.description}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mr-4">
                    <button
                      onClick={() => toggleCategoryStatus(category._id, category.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {category.isActive ? (
                        <><CheckCircle2 className="h-3 w-3 inline mr-1" /> Aktif</>
                      ) : (
                        <><XCircle className="h-3 w-3 inline mr-1" /> Pasif</>
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/categories/${category._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Görüntüle"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Düzenle"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Alt Kategoriler */}
              {expandedCategories.includes(category._id) && (
                <div className="bg-purple-50 border-l-4 ml-8" style={{ borderColor: category.color || '#3b82f6' }}>
                  {categories.filter(c => c.parentId === category._id).map(subCategory => (
                    <div key={subCategory._id} className="group hover:bg-purple-100 transition-all">
                      <div className="flex items-center p-4">
                        {/* Sub Category Icon */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4 shadow-sm ml-4"
                          style={{ backgroundColor: subCategory.color || '#a855f7' }}
                        >
                          {subCategory.image ? (
                            <img src={subCategory.image} alt={subCategory.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span>{subCategory.icon || '○'}</span>
                          )}
                        </div>

                        {/* Sub Category Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{subCategory.name}</h4>
                            {subCategory.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">/{subCategory.slug}</span>
                            {subCategory.productCount !== undefined && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {subCategory.productCount} ürün
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sub Status */}
                        <div className="mr-4">
                          <button
                            onClick={() => toggleCategoryStatus(subCategory._id, subCategory.isActive)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                              subCategory.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {subCategory.isActive ? 'Aktif' : 'Pasif'}
                          </button>
                        </div>

                        {/* Sub Actions */}
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/categories/${subCategory._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/categories/${subCategory._id}/edit`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(subCategory._id, subCategory.name)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Grid view
  const renderGridView = () => {
    const filtered = getFilteredAndSortedCategories();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(category => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow-md border-2 overflow-hidden hover:shadow-xl transition-all group"
            style={{ borderColor: category.color || '#3b82f6' }}
          >
            {/* Category Header */}
            <div 
              className="h-32 flex items-center justify-center relative"
              style={{ 
                background: category.image 
                  ? `url(${category.image})` 
                  : `linear-gradient(135deg, ${category.color}dd 0%, ${category.color}88 100%)`
              }}
            >
              {!category.image && (
                <span className="text-5xl">{category.icon || '📦'}</span>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {category.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded shadow-lg">
                    ⭐ Öne Çıkan
                  </span>
                )}
                {!category.isActive && (
                  <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded shadow-lg">
                    Pasif
                  </span>
                )}
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                {category.name}
              </h3>
              
              {category.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500">/{category.slug}</span>
                {category.productCount !== undefined && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {category.productCount} ürün
                  </span>
                )}
              </div>

              {/* Parent/Child Info */}
              {category.parentId && (
                <div className="mb-3 px-2 py-1 bg-purple-50 border border-purple-200 rounded text-xs">
                  <span className="text-purple-700">
                    Alt Kategori: {categories.find(c => c._id === category.parentId)?.name}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-3 border-t">
                <Link
                  href={`/admin/categories/${category._id}/edit`}
                  className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all text-center"
                >
                  <Edit className="h-4 w-4 inline mr-1" />
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // List view
  const renderListView = () => {
    const filtered = getFilteredAndSortedCategories();
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hiyerarşi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün Sayısı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oluşturulma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(category => (
              <tr key={category._id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-3"
                      style={{ backgroundColor: category.color || '#3b82f6' }}
                    >
                      {category.icon || '📦'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center">
                        {category.name}
                        {category.isFeatured && (
                          <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">/{category.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {category.parentId ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Alt: {categories.find(c => c._id === category.parentId)?.name}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Ana Kategori
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                    {category.productCount || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.sortOrder || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleCategoryStatus(category._id, category.isActive)}
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout title="Kategoriler" description="Kategori yönetimi">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
  const activeCategories = categories.filter(c => c.isActive).length;
  const featuredCategories = categories.filter(c => c.isFeatured).length;

  return (
    <AdminLayout title="Kategoriler" description="Kategori yönetimi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Toplam Kategori</p>
                <p className="text-3xl font-bold mt-2">{categories.length}</p>
              </div>
              <Layers className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Aktif Kategori</p>
                <p className="text-3xl font-bold mt-2">{activeCategories}</p>
              </div>
              <CheckCircle2 className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Toplam Ürün</p>
                <p className="text-3xl font-bold mt-2">{totalProducts}</p>
              </div>
              <Package className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Öne Çıkan</p>
                <p className="text-3xl font-bold mt-2">{featuredCategories}</p>
              </div>
              <Star className="h-12 w-12 text-yellow-200" />
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Layers className="h-8 w-8 mr-3 text-blue-600" />
              Kategori Yönetimi
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Ürün kategorilerinizi organize edin ve yönetin
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button 
              onClick={fetchCategories}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-sm font-bold rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kategori Ekle
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kategori ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="parent">Ana Kategoriler</option>
                <option value="child">Alt Kategoriler</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="order">Sıralama</option>
                <option value="name">İsim (A-Z)</option>
                <option value="date">Tarih (Yeni)</option>
                <option value="products">Ürün Sayısı</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'tree' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                  title="Ağaç Görünümü"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                  title="Kart Görünümü"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                  title="Liste Görünümü"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Layers className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Henüz Kategori Bulunmuyor
            </h3>
            <p className="text-gray-600 mb-6">
              Ürünlerinizi organize etmek için ilk kategorinizi oluşturun
            </p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              İlk Kategoriyi Oluştur
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'tree' && renderTreeView()}
            {viewMode === 'grid' && renderGridView()}
            {viewMode === 'list' && renderListView()}
          </>
        )}

        {/* Results Info */}
        {categories.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {getFilteredAndSortedCategories().length} kategori gösteriliyor
            {searchTerm && ` · "${searchTerm}" araması`}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

