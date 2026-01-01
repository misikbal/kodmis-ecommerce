'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout';
import CRUDModal from '@/components/admin/CRUDModal';
import BulkActions from '@/components/admin/BulkActions';
import { useAlertContext } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Download, 
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  X,
  Check,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Calendar,
  Tag,
  Star,
  TrendingUp,
  BarChart3,
  Globe,
  Copy,
  Archive,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Settings,
  Image as ImageIcon,
  Award,
  CheckSquare,
  Square
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  quantity: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  type: 'PHYSICAL' | 'DIGITAL' | 'SERVICE';
  images: Array<{
    url: string;
    alt: string;
    sortOrder: number;
  }>;
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  viewCount: number;
  salesCount: number;
  hasVariants: boolean;
  variants: Array<{
    id: string;
    name: string;
    sku?: string;
    price?: number;
    quantity: number;
    options: Record<string, any>;
  }>;
  marketplaceSync: {
    hepsiburada: boolean;
    trendyol: boolean;
    n11: boolean;
    amazon: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  status: string;
  type: string;
  category: string;
  brand: string;
  priceRange: string;
  stockStatus: string;
  featured: string;
  search: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  children?: Category[];
  productCount: number;
  createdAt: string;
}

interface Feature {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'COLOR' | 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  isRequired: boolean;
  isFilterable: boolean;
  options?: Array<{ label: string; value: string; color?: string }>;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

type ActiveTab = 'products' | 'categories' | 'features' | 'brands';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const alert = useAlertContext();
  
  // Tab management
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    type: '',
    category: '',
    brand: '',
    priceRange: '',
    stockStatus: '',
    featured: '',
    search: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if ((session.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }

    // Filtreler değiştiğinde sayfa numarasını sıfırla
    if (activeTab === 'products') {
      setCurrentPage(1);
    }

    fetchData();
  }, [session, status, router, activeTab, filters]);

  // Sayfa değiştiğinde verileri çek
  useEffect(() => {
    if (activeTab === 'products' && session && (session.user as { role?: string })?.role === 'ADMIN') {
      fetchData();
    }
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '20',
          ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value))
        });
        
        const response = await fetch(`/api/admin/products?${queryParams}`);
        if (response.ok) {
          const data = await response.json();
          // API'den gelen verileri formatla
          const formattedProducts = (data.products || []).map((product: any) => ({
            ...product,
            id: product.id || product._id || product.id,
          }));
          setProducts(formattedProducts);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.total || 0);
        } else {
          console.error('Failed to fetch products:', response.statusText);
          setProducts([]);
          alert.error('Ürünler yüklenirken bir hata oluştu', {
            title: 'Hata',
            duration: 5000
          });
        }
      } else {
        const response = await fetch(`/api/admin/${activeTab}`);
        if (response.ok) {
          const data = await response.json();
          switch (activeTab) {
            case 'categories':
              setCategories(data);
              break;
            case 'features':
              setFeatures(data);
              break;
            case 'brands':
              setBrands(data);
              break;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setProducts([]);
      alert.error('Veriler yüklenirken bir hata oluştu', {
        title: 'Bağlantı Hatası',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentData = getCurrentData();
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map((item: any) => item._id || item.id));
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'products': return products;
      case 'categories': return categories;
      case 'features': return features;
      case 'brands': return brands;
      default: return [];
    }
  };

  const handleAddNew = () => {
    // Ürünler için modal yerine yeni sayfaya yönlendir
    if (activeTab === 'products') {
      router.push('/admin/products/new');
      return;
    }
    
    // Diğer tab'lar için modal aç
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    if (activeTab === 'products') {
      // Ürünler için edit sayfasına yönlendir
      router.push(`/admin/products/${item._id || item.id}/edit`);
    } else {
      // Diğer tab'lar için modal aç
      setEditingItem(item);
      setShowModal(true);
    }
  };

  const handleSave = async (data: any) => {
    try {
      const url = editingItem 
        ? `/api/admin/${activeTab}/${editingItem._id || editingItem.id}`
        : `/api/admin/${activeTab}`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchData();
        setShowModal(false);
        setEditingItem(null);
        alert.success(editingItem ? 'Başarıyla güncellendi' : 'Başarıyla oluşturuldu', {
          title: 'Başarılı',
          duration: 3000
        });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert.error('Kaydetme işlemi başarısız oldu', {
        title: 'Hata',
        duration: 5000
      });
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchData();
        alert.success('Öğe başarıyla silindi', {
          title: 'Başarılı',
          duration: 3000
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert.error('Silme işlemi başarısız oldu', {
        title: 'Hata',
        duration: 5000
      });
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`${selectedItems.length} öğeyi silmek istediğinizden emin misiniz?`)) return;

    const loadingId = alert.loading('Siliniyor...', {
      title: 'İşlem Devam Ediyor'
    });

    try {
      for (const id of selectedItems) {
        await fetch(`/api/admin/${activeTab}/${id}`, {
          method: 'DELETE',
        });
      }
      setSelectedItems([]);
      await fetchData();
      alert.dismiss(loadingId);
      alert.success(`${selectedItems.length} öğe başarıyla silindi`, {
        title: 'Başarılı',
        duration: 3000
      });
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert.dismiss(loadingId);
      alert.error('Toplu silme işlemi başarısız oldu', {
        title: 'Hata',
        duration: 5000
      });
    }
  };

  const handleBulkUpdate = async (action: string) => {
    const loadingId = alert.loading('Güncelleniyor...', {
      title: 'İşlem Devam Ediyor'
    });

    try {
      for (const id of selectedItems) {
        const updateData: any = {};
        
        switch (action) {
          case 'activate':
            updateData.isActive = true;
            break;
          case 'deactivate':
            updateData.isActive = false;
            break;
          case 'featured':
            updateData.isFeatured = true;
            break;
          case 'unfeatured':
            updateData.isFeatured = false;
            break;
        }

        await fetch(`/api/admin/${activeTab}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
      }
      setSelectedItems([]);
      await fetchData();
      alert.dismiss(loadingId);
      alert.success(`${selectedItems.length} öğe başarıyla güncellendi`, {
        title: 'Başarılı',
        duration: 3000
      });
    } catch (error) {
      console.error('Error bulk updating:', error);
      alert.dismiss(loadingId);
      alert.error('Toplu güncelleme işlemi başarısız oldu', {
        title: 'Hata',
        duration: 5000
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Taslak';
      case 'ACTIVE': return 'Aktif';
      case 'INACTIVE': return 'Pasif';
      case 'ARCHIVED': return 'Arşivlenmiş';
      default: return status;
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'bg-red-100 text-red-800', text: 'Stokta Yok' };
    if (quantity <= 5) return { color: 'bg-yellow-100 text-yellow-800', text: 'Düşük Stok' };
    return { color: 'bg-green-100 text-green-800', text: 'Stokta' };
  };

  const getFeatureTypeText = (type: string) => {
    switch (type) {
      case 'TEXT': return 'Metin';
      case 'NUMBER': return 'Sayı';
      case 'COLOR': return 'Renk';
      case 'DROPDOWN': return 'Açılır Liste';
      case 'CHECKBOX': return 'Onay Kutusu';
      case 'RADIO': return 'Seçenek';
      default: return type;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    const data = getCurrentData();
    
    if (data.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            {activeTab === 'products' && <Package className="h-12 w-12" />}
            {activeTab === 'categories' && <Tag className="h-12 w-12" />}
            {activeTab === 'features' && <Settings className="h-12 w-12" />}
            {activeTab === 'brands' && <Award className="h-12 w-12" />}
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {activeTab === 'products' && 'Henüz ürün bulunmuyor'}
            {activeTab === 'categories' && 'Henüz kategori bulunmuyor'}
            {activeTab === 'features' && 'Henüz özellik bulunmuyor'}
            {activeTab === 'brands' && 'Henüz marka bulunmuyor'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'products' && 'İlk ürününüzü ekleyerek başlayın.'}
            {activeTab === 'categories' && 'İlk kategorinizi ekleyerek başlayın.'}
            {activeTab === 'features' && 'İlk özelliğinizi ekleyerek başlayın.'}
            {activeTab === 'brands' && 'İlk markanızı ekleyerek başlayın.'}
          </p>
          <div className="mt-6">
            {activeTab === 'products' ? (
              <Link 
                href="/admin/products/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ürün Ekle
              </Link>
            ) : (
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === 'categories' && 'Kategori Ekle'}
                {activeTab === 'features' && 'Özellik Ekle'}
                {activeTab === 'brands' && 'Marka Ekle'}
              </button>
            )}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'products':
        return renderProductsTable();
      case 'categories':
        return renderCategoriesTable();
      case 'features':
        return renderFeaturesTable();
      case 'brands':
        return renderBrandsTable();
      default:
        return null;
    }
  };

  const renderProductsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={handleSelectAll}
                className="flex items-center"
              >
                {selectedItems.length === products.length ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fiyat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marka
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
          {(products as Product[]).map((product: Product) => {
            const productId = product.id || (product as any)._id || '';
            return (
            <tr key={productId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleSelectItem(productId)}
                  className="flex items-center"
                >
                  {selectedItems.includes(productId) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    {product.images?.[0] ? (
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.sku || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.quantity < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {product.quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  <div className="font-medium">₺{product.price.toLocaleString()}</div>
                  {product.comparePrice && (
                    <div className="text-xs text-gray-500 line-through">
                      ₺{product.comparePrice.toLocaleString()}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(product as any).category?.name || product.category?.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(product as any).brand?.name || product.brand?.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {getStatusText(product.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(productId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderCategoriesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={handleSelectAll}
                className="flex items-center"
              >
                {selectedItems.length === categories.length ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün Sayısı
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
          {(categories as Category[]).map((category: Category) => (
            <tr key={category._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleSelectItem(category._id)}
                  className="flex items-center"
                >
                  {selectedItems.includes(category._id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {category.image ? (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={category.image}
                        alt={category.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {category.productCount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(category.createdAt).toLocaleDateString('tr-TR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(category)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category._id)}
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

  const renderFeaturesTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={handleSelectAll}
                className="flex items-center"
              >
                {selectedItems.length === features.length ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Özellik
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tür
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Zorunlu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filtrelenebilir
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün Sayısı
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
          {(features as Feature[]).map((feature: Feature) => (
            <tr key={feature._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleSelectItem(feature._id)}
                  className="flex items-center"
                >
                  {selectedItems.includes(feature._id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{feature.name}</div>
                  <div className="text-sm text-gray-500">{feature.slug}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {getFeatureTypeText(feature.type)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {feature.isRequired ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {feature.isFilterable ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {feature.productCount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  feature.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {feature.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(feature)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(feature._id)}
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

  const renderBrandsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <button
                onClick={handleSelectAll}
                className="flex items-center"
              >
                {selectedItems.length === brands.length ? (
                  <CheckSquare className="h-4 w-4 text-blue-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marka
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ürün Sayısı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Website
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
          {(brands as Brand[]).map((brand: Brand) => (
            <tr key={brand._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleSelectItem(brand._id)}
                  className="flex items-center"
                >
                  {selectedItems.includes(brand._id) ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {brand.logo ? (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={brand.logo}
                        alt={brand.name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Award className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                    <div className="text-sm text-gray-500">{brand.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {brand.productCount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {brand.website ? (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {brand.website}
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  brand.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {brand.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(brand.createdAt).toLocaleDateString('tr-TR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEdit(brand)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(brand._id)}
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

  if (loading) {
    return (
      <AdminLayout title="Ürünler" description="Ürün yönetimi ve katalog">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ürünler" description="Ürün yönetimi ve katalog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Katalog Yönetimi</h1>
              <p className="mt-1 text-sm text-gray-500">
                Ürün, kategori, özellik ve marka yönetimi
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                İçe Aktar
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Dışa Aktar
              </button>
              {activeTab === 'products' ? (
                <Link 
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ürün Ekle
                </Link>
              ) : (
                <button 
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {activeTab === 'categories' && 'Kategori Ekle'}
                  {activeTab === 'features' && 'Özellik Ekle'}
                  {activeTab === 'brands' && 'Marka Ekle'}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'products', label: 'Ürünler', icon: Package, count: products.length },
                { id: 'categories', label: 'Kategoriler', icon: Tag, count: categories.length },
                { id: 'features', label: 'Özellikler', icon: Settings, count: features.length },
                { id: 'brands', label: 'Markalar', icon: Award, count: brands.length },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ara..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtreler
              </button>
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {selectedItems.length} öğe seçildi
                  </span>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Seçilenleri Sil
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {renderContent()}
          </div>

          {/* Pagination */}
          {activeTab === 'products' && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Toplam <span className="font-medium">{totalProducts}</span> ürün bulundu
                    {totalProducts > 0 && (
                      <span className="ml-2">
                        (Sayfa {currentPage} / {totalPages})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Önceki</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Sonraki</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* CRUD Modal */}
          <CRUDModal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            title={editingItem ? 'Düzenle' : 'Yeni Ekle'}
            type={activeTab.slice(0, -1) as any}
            data={editingItem}
            onSave={handleSave}
            categories={categories}
            brands={brands}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedItems={selectedItems}
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
            type={activeTab}
          />
        </div>
      </div>
    </AdminLayout>
  );
}