'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  ArrowLeft,
  Save,
  Layers,
  Image as ImageIcon,
  Upload,
  X,
  Info,
  CheckCircle2,
  Sparkles,
  Tag,
  Eye,
  Trash2,
  Plus,
  AlertCircle,
  FileText,
  Palette
} from 'lucide-react';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  image: string;
  icon: string;
  color: string;
  parentId: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
}

export default function NewCategoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    image: '',
    icon: '',
    color: '#3b82f6',
    parentId: '',
    sortOrder: 0,
    isActive: true,
    isFeatured: false
  });

  // Türkçe karakterleri dönüştüren slug oluşturucu
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Form alanlarını güncelle
  const updateFormData = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // İsim değiştiğinde slug'ı otomatik oluştur
      if (field === 'name' && value) {
        updated.slug = generateSlug(value);
        if (!formData.metaTitle) {
          updated.metaTitle = value;
        }
      }
      
      return updated;
    });
  };

  // Görsel yükleme
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        updateFormData('image', data.url);
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
    } finally {
      setImageUploading(false);
    }
  };

  // Validasyon
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        alert('Kategori oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Üst kategorileri yükle
  useState(() => {
    const loadParentCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setParentCategories(data.filter((cat: ParentCategory) => !cat.parentId));
        }
      } catch (error) {
        console.error('Kategori yükleme hatası:', error);
      }
    };
    
    loadParentCategories();
  });

  if (status === 'loading') {
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
    <AdminLayout title="Yeni Kategori" description="Yeni kategori oluştur" showHeader={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Geri Dön
                </button>
                <div className="border-l border-gray-300 pl-4">
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
                    Yeni Kategori Oluştur
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Ürünleriniz için yeni bir kategori tanımlayın
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Temel Bilgiler Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Temel Bilgiler</h3>
                    <p className="text-sm text-gray-500">Kategori tanımlama bilgileri</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Kategori Adı */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Kategori Adı *
                      {errors.name && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Örn: Elektronik, Giyim, Mobilya, Aksesuarlar"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      URL Slug *
                      <span className="ml-2 text-gray-400" title="Otomatik oluşturulur">
                        <Info className="h-4 w-4" />
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => updateFormData('slug', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 placeholder-gray-400 transition-all ${
                        errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="elektronik"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      URL: /kategori/{formData.slug || 'slug'}
                    </p>
                  </div>

                  {/* Açıklama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Açıklaması
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      placeholder="Bu kategori hakkında detaylı açıklama yazın..."
                      maxLength={500}
                    />
                    <p className="mt-1 text-xs text-gray-500 text-right">
                      {formData.description.length} / 500 karakter
                    </p>
                  </div>
                </div>
              </div>

              {/* Görsel Öğeler Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Görsel Öğeler</h3>
                    <p className="text-sm text-gray-500">Renk, ikon ve kategori görseli</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Kategori Rengi */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Rengi *
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => updateFormData('color', e.target.value)}
                        className="w-20 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => updateFormData('color', e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 font-mono"
                        placeholder="#3b82f6"
                      />
                      <div 
                        className="w-12 h-12 rounded-lg shadow-md"
                        style={{ backgroundColor: formData.color }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Bu renk kategori kartlarında ve badge'lerde kullanılacak
                    </p>
                  </div>

                  {/* Icon (Emoji) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori İkonu (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => updateFormData('icon', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 text-2xl text-center"
                      placeholder="🛍️ 📱 👕 🏠"
                      maxLength={2}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <p className="text-xs text-gray-500 w-full">Popüler ikonlar (tıklayarak ekleyin):</p>
                      {['🛍️', '📱', '💻', '👕', '👗', '🏠', '🎮', '📚', '⚽', '🎨', '🍔', '✈️', '🚗', '💄', '⌚', '🎧'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => updateFormData('icon', emoji)}
                          className="px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded-lg text-xl transition-all border-2 border-transparent hover:border-blue-300"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kategori Görseli */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Görseli (Banner)
                    </label>
                    
                    {formData.image ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 group">
                        <img
                          src={formData.image}
                          alt="Kategori görseli"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                          <button
                            onClick={() => updateFormData('image', '')}
                            className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform scale-95 group-hover:scale-100"
                          >
                            <Trash2 className="h-4 w-4 inline mr-2" />
                            Görseli Kaldır
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        {imageUploading ? (
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        ) : (
                          <button
                            onClick={() => imageInputRef.current?.click()}
                            className="w-full"
                          >
                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 font-medium">Görsel Yükle</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG - Önerilen: 1200x400px</p>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hiyerarşi ve Ayarlar Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Layers className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Hiyerarşi ve Ayarlar</h3>
                    <p className="text-sm text-gray-500">Kategori yapısı ve görünüm ayarları</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Üst Kategori */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Üst Kategori
                      <span className="ml-2 text-gray-400" title="Alt kategori oluşturmak için seçin">
                        <Info className="h-4 w-4" />
                      </span>
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) => updateFormData('parentId', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                    >
                      <option value="">🏠 Ana Kategori (Üst Kategori Yok)</option>
                      {parentCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    {formData.parentId && (
                      <p className="mt-2 text-xs text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Alt kategori olarak oluşturulacak
                      </p>
                    )}
                  </div>

                  {/* Sıralama */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sıralama Numarası
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => updateFormData('sortOrder', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                      placeholder="0"
                      min="0"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Küçük sayılar önce görünür (0 = en önce)
                    </p>
                  </div>

                  {/* Durum */}
                  <div className="flex items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => updateFormData('isActive', e.target.checked)}
                      className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label className="ml-3 text-sm font-semibold text-gray-900">
                      Kategori Aktif
                    </label>
                    {formData.isActive && (
                      <span className="ml-auto px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        ✓ Aktif
                      </span>
                    )}
                  </div>

                  {/* Öne Çıkan */}
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => updateFormData('isFeatured', e.target.checked)}
                      className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label className="ml-3 text-sm font-semibold text-gray-900">
                      Öne Çıkan Kategori
                    </label>
                    {formData.isFeatured && (
                      <span className="ml-auto px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                        ⭐ Öne Çıkan
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SEO Ayarları Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Eye className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">SEO Optimizasyonu</h3>
                    <p className="text-sm text-gray-500">Arama motorları için kategori optimizasyonu</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SEO Başlığı (Meta Title)
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => updateFormData('metaTitle', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="SEO için optimize edilmiş başlık"
                      maxLength={60}
                    />
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className={formData.metaTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}>
                        {formData.metaTitle.length} / 60 karakter
                      </span>
                      {formData.metaTitle.length >= 50 && formData.metaTitle.length <= 60 && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Optimal uzunluk
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SEO Açıklaması (Meta Description)
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => updateFormData('metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Arama motorlarında görünecek kategori açıklaması..."
                      maxLength={160}
                    />
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className={formData.metaDescription.length > 160 ? 'text-red-600' : 'text-gray-500'}>
                        {formData.metaDescription.length} / 160 karakter
                      </span>
                      {formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160 && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Optimal uzunluk
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bilgilendirme */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold mb-2">💡 Kategori Oluşturma İpuçları:</p>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800 text-xs">
                    <li><strong>Açıklayıcı İsimler:</strong> "Elektronik Ürünler" gibi net isimler kullanın</li>
                    <li><strong>Alt Kategoriler:</strong> Organize olmak için hiyerarşi oluşturun (Giyim → Erkek Giyim)</li>
                    <li><strong>Renk Seçimi:</strong> Her ana kategori için farklı renk kullanın</li>
                    <li><strong>İkon Kullanımı:</strong> Kategorileri görsel olarak ayırt edilebilir yapın</li>
                    <li><strong>SEO:</strong> Meta başlık ve açıklama arama motorları için kritiktir</li>
                    <li><strong>Banner Görsel:</strong> Kategori sayfalarında üst banner olarak kullanılır</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  <X className="h-5 w-5 inline mr-2" />
                  İptal
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 inline mr-2" />
                      Kategori Oluştur
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
                  <h3 className="text-white font-bold flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Canlı Önizleme
                  </h3>
                  <p className="text-purple-100 text-xs mt-1">
                    Kategori nasıl görünecek?
                  </p>
                </div>

                {/* Category Preview */}
                <div className="p-4 space-y-4">
                  {/* Kategori Kartı */}
                  <div 
                    className="rounded-xl p-6 shadow-lg border-2 transition-all"
                    style={{ 
                      borderColor: formData.color,
                      background: `linear-gradient(135deg, ${formData.color}15 0%, ${formData.color}05 100%)`
                    }}
                  >
                    {formData.image && (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                        <img src={formData.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                        style={{ backgroundColor: formData.color }}
                      >
                        {formData.icon || '📦'}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {formData.name || 'Kategori Adı'}
                        </h4>
                        {formData.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {formData.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {(formData.isFeatured || formData.parentId) && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        {formData.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            ⭐ Öne Çıkan
                          </span>
                        )}
                        {formData.parentId && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            📂 Alt Kategori
                          </span>
                        )}
                        {!formData.isActive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                            ⏸️ Pasif
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hiyerarşi Görünümü */}
                  {formData.parentId && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2">🌳 Kategori Hiyerarşisi:</p>
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700">
                          {parentCategories.find(c => c._id === formData.parentId)?.name || 'Üst Kategori'}
                        </span>
                        <span className="mx-2 text-purple-400">→</span>
                        <span className="font-bold text-purple-700">
                          {formData.name || 'Yeni Kategori'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SEO Önizleme */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">🔍 Arama Motoru Önizlemesi:</p>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">
                        https://yourstore.com/kategori/{formData.slug || 'slug'}
                      </div>
                      <div className="text-base font-medium text-blue-600 mb-1 line-clamp-1">
                        {formData.metaTitle || formData.name || 'Kategori Başlığı'}
                      </div>
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {formData.metaDescription || formData.description || 'Kategori açıklaması burada görünecek...'}
                      </div>
                    </div>
                  </div>

                  {/* İstatistikler */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs font-semibold text-gray-700 mb-3">📊 Form Doluluk Oranı:</p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temel Bilgiler</span>
                        <span className={`font-bold ${formData.name ? 'text-green-600' : 'text-orange-600'}`}>
                          {formData.name ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Görsel Öğeler</span>
                        <span className={`font-bold ${formData.color && formData.icon ? 'text-green-600' : 'text-orange-600'}`}>
                          {formData.color && formData.icon ? '✓' : '○'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">SEO Ayarları</span>
                        <span className={`font-bold ${formData.metaTitle && formData.metaDescription ? 'text-green-600' : 'text-orange-600'}`}>
                          {formData.metaTitle && formData.metaDescription ? '✓' : '○'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700">Toplam Tamamlanma</span>
                        <span className="text-xs font-bold text-blue-600">
                          {Math.round((
                            (formData.name ? 40 : 0) +
                            (formData.color && formData.icon ? 30 : 0) +
                            (formData.metaTitle && formData.metaDescription ? 30 : 0)
                          ))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(
                              (formData.name ? 40 : 0) +
                              (formData.color && formData.icon ? 30 : 0) +
                              (formData.metaTitle && formData.metaDescription ? 30 : 0)
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

