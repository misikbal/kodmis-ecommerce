'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout';
import { 
  ArrowLeft,
  Package,
  Settings,
  Eye,
  Search,
  Check,
  Tag,
  Layers,
  Info,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Truck,
  Plus,
  X,
  Image as ImageIcon,
  Type,
  HelpCircle,
  Upload,
  Video,
  Shield,
  RotateCcw,
  FileText,
  Wrench,
  Store
} from 'lucide-react';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  lowStockThreshold?: number;
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  type: 'PHYSICAL' | 'DIGITAL' | 'SERVICE';
  brandId?: string;
  images: Array<{
    url: string;
    alt: string;
    sortOrder: number;
  }>;
  categories: string[];
  tags: string[];
  variants: Array<{
    id: string;
    name: string;
    values: string[];
    options?: any;
  }>;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  technicalSpecs: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  shipping?: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery?: string;
    shippingNote?: string;
  };
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  videos: Array<{
    id: string;
    url: string;
    title: string;
    platform: 'youtube' | 'vimeo' | 'other';
  }>;
  warranty?: {
    hasWarranty: boolean;
    period?: string;
    type?: string;
    details?: string;
  };
  returnPolicy?: {
    returnable: boolean;
    returnPeriod?: number;
    details?: string;
  };
  relatedProducts: string[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  isActive: boolean;
  parentId?: string;
  productCount?: number;
}

export default function EditProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  
  // Brand management
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    content: '',
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    sku: '',
    barcode: '',
    quantity: 0,
    lowStockThreshold: 10,
    status: 'DRAFT',
    type: 'PHYSICAL',
    images: [],
    categories: [],
    tags: [],
    variants: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    weight: 0,
    dimensions: {},
    technicalSpecs: [],
    shipping: {
      freeShipping: false,
      shippingCost: 0,
      estimatedDelivery: '2-3 iş günü',
      shippingNote: ''
    },
    faqs: [],
    videos: [],
    warranty: {
      hasWarranty: false,
      period: '',
      type: '',
      details: ''
    },
    returnPolicy: {
      returnable: false,
      returnPeriod: 0,
      details: ''
    },
    relatedProducts: []
  });

  const steps = [
    { id: 1, title: 'Temel Bilgiler', icon: Package, description: 'Ürün adı, SKU ve temel özellikler' },
    { id: 2, title: 'Fiyat & Stok & Kargo', icon: Settings, description: 'Fiyatlandırma, envanter ve kargo yönetimi' },
    { id: 3, title: 'Fotoğraflar & Videolar', icon: ImageIcon, description: 'Ürün görselleri ve video medya' },
    { id: 4, title: 'Açıklama & Teknik', icon: Type, description: 'Detaylı açıklama ve teknik özellikler' },
    { id: 5, title: 'Garanti & SSS', icon: HelpCircle, description: 'Garanti, iade ve sıkça sorulan sorular' },
    { id: 6, title: 'SEO', icon: Eye, description: 'Arama motoru optimizasyonu' }
  ];

  useEffect(() => {
    loadCategories();
    loadBrands();
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          content: product.content || '',
          price: product.price || 0,
          comparePrice: product.comparePrice || 0,
          costPrice: product.costPrice || 0,
          sku: product.sku || '',
          barcode: product.barcode || '',
          quantity: product.quantity || 0,
          lowStockThreshold: product.lowStockAlert || 10,
          status: product.status || 'DRAFT',
          type: product.type || 'PHYSICAL',
          brandId: product.brandId?._id || product.brandId || '',
          images: product.images || [],
          categories: product.categoryId ? [product.categoryId._id || product.categoryId] : [],
          tags: product.tags || [],
          variants: product.variants || [],
          seoTitle: product.seoTitle || '',
          seoDescription: product.seoDescription || '',
          seoKeywords: product.seoKeywords || '',
          weight: product.weight || 0,
          dimensions: product.dimensions || {},
          technicalSpecs: product.technicalSpecs || [],
          shipping: product.shipping || {
            freeShipping: false,
            shippingCost: 0,
            estimatedDelivery: '2-3 iş günü',
            shippingNote: ''
          },
          faqs: product.faqs || [],
          videos: product.videos || [],
          warranty: product.warranty || {
            hasWarranty: false,
            period: '',
            type: '',
            details: ''
          },
          returnPolicy: product.returnPolicy || {
            returnable: false,
            returnPeriod: 0,
            details: ''
          },
          relatedProducts: product.relatedProducts || []
        });
      } else {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Ürün yükleme hatası:', error);
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setAvailableCategories(data.filter((cat: Category) => cat.isActive));
      }
    } catch (error) {
      console.error('Kategori yükleme hatası:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadBrands = async () => {
    setIsLoadingBrands(true);
    try {
      const response = await fetch('/api/admin/brands');
      if (response.ok) {
        const data = await response.json();
        setAvailableBrands(data.filter((brand: any) => brand.isActive));
      }
    } catch (error) {
      console.error('Marka yükleme hatası:', error);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    if (formData.categories.includes(categoryId)) {
      updateFormData('categories', formData.categories.filter(c => c !== categoryId));
    } else {
      updateFormData('categories', [...formData.categories, categoryId]);
    }
  };

  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug gereklidir';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const autoSave = async () => {
    if (!formData.name.trim()) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Otomatik kaydetme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Prepare complete data with all fields
      const submitData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        price: formData.price,
        comparePrice: formData.comparePrice,
        costPrice: formData.costPrice,
        sku: formData.sku,
        barcode: formData.barcode,
        quantity: formData.quantity,
        lowStockThreshold: formData.lowStockThreshold,
        status: formData.status,
        type: formData.type,
        brandId: formData.brandId || null,
        images: formData.images,
        categories: formData.categories || [],
        tags: formData.tags,
        variants: formData.variants,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        weight: formData.weight,
        dimensions: formData.dimensions,
        technicalSpecs: formData.technicalSpecs,
        shipping: formData.shipping,
        faqs: formData.faqs,
        videos: formData.videos,
        warranty: formData.warranty,
        returnPolicy: formData.returnPolicy,
        relatedProducts: formData.relatedProducts
      };

      // Debug: Log the data being sent
      console.log('Sending data to API:', JSON.stringify(submitData, null, 2));

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        console.error('Ürün güncelleme hatası');
        alert('Ürün güncellenemedi');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <AdminLayout title="Ürün Düzenle" description="Ürün bilgilerini güncelleyin" showHeader={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                    <Settings className="h-6 w-6 mr-2 text-blue-500" />
                    Ürün Düzenle
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Adım {currentStep} / {steps.length} · {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isSaving ? (
                  <div className="flex items-center text-sm text-blue-600">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Kaydediliyor...
                  </div>
                ) : lastSaved ? (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Kaydedildi: {lastSaved.toLocaleTimeString('tr-TR')}
                  </div>
                ) : null}
                
                <button
                  onClick={autoSave}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">İlerleme Durumu</span>
                <span className="text-sm font-bold text-blue-600">{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : isCompleted
                        ? 'border-green-500 bg-green-50 hover:shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold transition-colors ${
                          isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.id}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Temel Bilgiler</h3>
                    <p className="text-sm text-gray-500">Ürününüzün temel bilgilerini güncelleyin</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Ürün Adı *
                      {errors.name && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Örn: Premium Kablosuz Kulaklık"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

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
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                        errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="premium-kablosuz-kulaklik"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      SKU *
                      {errors.sku && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => updateFormData('sku', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                        errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="PRE-123456"
                    />
                    {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Barkod
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => updateFormData('barcode', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="1234567890123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ürün Tipi
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateFormData('type', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="PHYSICAL">Fiziksel Ürün</option>
                      <option value="DIGITAL">Dijital Ürün</option>
                      <option value="SERVICE">Hizmet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormData('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="DRAFT">Taslak</option>
                      <option value="ACTIVE">Aktif</option>
                      <option value="INACTIVE">Pasif</option>
                      <option value="ARCHIVED">Arşivlenmiş</option>
                    </select>
                  </div>
                </div>

                {/* Marka Seçimi - Opsiyonel */}
                {availableBrands.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Store className="h-4 w-4 mr-2" />
                        Marka
                      </label>
                      <button
                        onClick={() => router.push('/admin/brands/new')}
                        className="flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-sm"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Yeni Marka
                      </button>
                    </div>

                    {/* Marka Arama */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Marka ara..."
                        value={brandSearchTerm}
                        onChange={(e) => setBrandSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      />
                    </div>

                    {/* Marka Listesi */}
                    <div className="bg-white border-2 border-orange-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                      {isLoadingBrands ? (
                        <div className="flex items-center justify-center py-4">
                          <RefreshCw className="h-5 w-5 animate-spin text-orange-600" />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {availableBrands
                            .filter(brand => brand.name.toLowerCase().includes(brandSearchTerm.toLowerCase()))
                            .map((brand) => (
                              <label
                                key={brand._id}
                                className="flex items-center p-2 hover:bg-orange-50 rounded-lg cursor-pointer transition-all group"
                              >
                                <input
                                  type="radio"
                                  name="brand"
                                  checked={formData.brandId === brand._id}
                                  onChange={() => updateFormData('brandId', brand._id)}
                                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 focus:ring-2"
                                />
                                <div className="ml-3 flex items-center space-x-3 flex-1">
                                  {brand.logo ? (
                                    <img
                                      src={brand.logo}
                                      alt={brand.name}
                                      className="h-8 w-8 rounded object-cover"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded bg-orange-100 flex items-center justify-center">
                                      <Store className="h-4 w-4 text-orange-600" />
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-sm font-medium text-gray-900 group-hover:text-orange-700">
                                      {brand.name}
                                    </span>
                                    {brand.country && (
                                      <p className="text-xs text-gray-500">{brand.country}</p>
                                    )}
                                  </div>
                                </div>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kategori Seçimi */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Kategori Seçimi</h4>
                  </div>
                  
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Kategori ara..."
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      </div>
                    ) : (
                      availableCategories
                        .filter(cat => cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                        .map(category => (
                          <div
                            key={category._id}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              formData.categories.includes(category._id)
                                ? 'border-purple-500 bg-purple-100 shadow-md'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                            }`}
                            onClick={() => toggleCategory(category._id)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                formData.categories.includes(category._id)
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-300'
                              }`}>
                                {formData.categories.includes(category._id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {category.icon && (
                                  <span className="text-lg">{category.icon}</span>
                                )}
                                <span className="font-medium text-gray-900">{category.name}</span>
                                {category.parentId && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Alt Kategori
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {category.productCount || 0} ürün
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <Link href="/admin/categories/new" className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Kategori Ekle
                    </Link>
                  </div>
                </div>

                {/* Etiketler */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Etiketler
                  </label>
                  
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const newTagValue = input.value.trim();
                        
                        if (newTagValue && !formData.tags.includes(newTagValue)) {
                          updateFormData('tags', [...formData.tags, newTagValue]);
                          input.value = '';
                        }
                      }
                      
                      if (e.key === 'Backspace' && e.currentTarget.value === '' && formData.tags.length > 0) {
                        updateFormData('tags', formData.tags.slice(0, -1));
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Etiket yazıp Enter veya virgül ile ekleyin..."
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Enter veya virgül (,) ile yeni etiket ekleyin • Backspace ile son etiketi silin
                  </p>

                  {formData.tags.length > 0 && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Eklenen Etiketler ({formData.tags.length})
                        </p>
                        <button
                          onClick={() => updateFormData('tags', [])}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Tümünü Sil
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white border-2 border-purple-300 text-purple-800 hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm"
                          >
                            <span className="mr-2">#{tag}</span>
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:bg-purple-200 rounded-full p-0.5 transition-all"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Adım 3: Fotoğraflar & Videolar */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Fotoğraflar & Videolar</h3>
                    <p className="text-sm text-gray-500">Ürün görselleri ve video medya yönetimi</p>
                  </div>
                </div>

                {/* Fotoğraf Yükleme */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-purple-600" />
                    Fotoğraf Yönetimi
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Fotoğraf Yükleme Butonu */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const uploadFormData = new FormData();
                              uploadFormData.append('file', file);
                              
                              try {
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: uploadFormData,
                                });
                                const data = await response.json();
                                
                                if (data.success) {
                                  const newImage = {
                                    url: data.url,
                                    alt: file.name.split('.')[0],
                                    sortOrder: formData.images.length
                                  };
                                  updateFormData('images', [...formData.images, newImage]);
                                }
                              } catch (error) {
                                console.error('Fotoğraf yükleme hatası:', error);
                              }
                            }
                          };
                          input.click();
                        }}
                        className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fotoğraf Yükle
                      </button>
                      
                      <span className="text-sm text-gray-500">
                        {formData.images.length} fotoğraf yüklendi
                      </span>
                    </div>

                    {/* Fotoğraf Listesi */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              onClick={() => {
                                const updatedImages = formData.images.filter((_, i) => i !== index);
                                updateFormData('images', updatedImages);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                              {image.alt}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Yönetimi */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Video className="h-5 w-5 mr-2 text-blue-600" />
                    Video Yönetimi
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Video URL'leri ekleyerek ürününüzü daha etkili tanıtabilirsiniz.
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="YouTube, Vimeo veya diğer video URL'si"
                          className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                        />
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Fiyat & Stok</h3>
                    <p className="text-sm text-gray-500">Fiyatlandırma ve envanter bilgileri</p>
                  </div>
                </div>

                {/* Fiyat Bilgileri */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-green-600" />
                    Fiyat Bilgileri
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        Satış Fiyatı (TL) *
                        {errors.price && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                          errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="0.00"
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Karşılaştırma Fiyatı (TL)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.comparePrice}
                        onChange={(e) => updateFormData('comparePrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.00"
                      />
                      <p className="mt-1 text-xs text-gray-500">İndirimli fiyat gösterimi için</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maliyet Fiyatı (TL)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={(e) => updateFormData('costPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.00"
                      />
                      <p className="mt-1 text-xs text-gray-500">Kar marjı hesaplaması için</p>
                    </div>
                  </div>
                </div>

                {/* Stok Bilgileri */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-blue-600" />
                    Stok Bilgileri
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stok Miktarı
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Düşük Stok Uyarısı
                      </label>
                      <input
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => updateFormData('lowStockThreshold', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="10"
                      />
                      <p className="mt-1 text-xs text-gray-500">Bu miktarın altına düştüğünde uyarı verilir</p>
                    </div>
                  </div>
                </div>

                {/* Kargo Bilgileri */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-orange-600" />
                    Kargo Bilgileri
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="freeShipping"
                        checked={formData.shipping?.freeShipping || false}
                        onChange={(e) => updateFormData('shipping', {
                          ...formData.shipping,
                          freeShipping: e.target.checked
                        })}
                        className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="freeShipping" className="text-sm font-medium text-gray-700">
                        Ücretsiz Kargo
                      </label>
                    </div>

                    {!formData.shipping?.freeShipping && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Kargo Ücreti (TL)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.shipping?.shippingCost || 0}
                          onChange={(e) => updateFormData('shipping', {
                            ...formData.shipping,
                            shippingCost: parseFloat(e.target.value) || 0
                          })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                          placeholder="0.00"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tahmini Teslimat Süresi
                      </label>
                      <input
                        type="text"
                        value={formData.shipping?.estimatedDelivery || ''}
                        onChange={(e) => updateFormData('shipping', {
                          ...formData.shipping,
                          estimatedDelivery: e.target.value
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="2-3 iş günü"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kargo Notu
                      </label>
                      <textarea
                        value={formData.shipping?.shippingNote || ''}
                        onChange={(e) => updateFormData('shipping', {
                          ...formData.shipping,
                          shippingNote: e.target.value
                        })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                        placeholder="Kargo ile ilgili özel notlar..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adım 4: Açıklama & Teknik */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Type className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Açıklama & Teknik</h3>
                    <p className="text-sm text-gray-500">Detaylı açıklama ve teknik özellikler</p>
                  </div>
                </div>

                {/* Ürün Açıklaması */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Ürün Açıklaması
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kısa Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                        placeholder="Ürününüzün kısa ve öz açıklaması..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {formData.description.length}/500 karakter
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Detaylı Açıklama
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={8}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                        placeholder="Ürününüzün detaylı açıklaması, özellikleri ve avantajları..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Rich text editor ile daha gelişmiş formatlama yapabilirsiniz
                      </p>
                    </div>
                  </div>
                </div>

                {/* Teknik Özellikler */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-green-600" />
                    Teknik Özellikler
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Ürününüzün teknik özelliklerini tablo formatında ekleyebilirsiniz.
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Özellik Adı
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Boyut, Ağırlık, Renk"
                            className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Değer
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: 15x10x5 cm, 500g, Siyah"
                            className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                      </div>
                      
                      <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        Teknik Özellik Ekle
                      </button>
                    </div>

                    {/* Örnek Teknik Özellikler */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                      <h5 className="font-semibold text-gray-900 mb-2">Mevcut Teknik Özellikler</h5>
                      <div className="text-sm text-gray-500">
                        Henüz teknik özellik eklenmemiş. Yukarıdaki formu kullanarak ekleyebilirsiniz.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Boyut ve Ağırlık */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-orange-600" />
                    Boyut ve Ağırlık Bilgileri
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ağırlık (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Uzunluk (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Genişlik (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Yükseklik (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        className="w-full px-4 py-2 border-2 border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adım 5: Garanti & SSS */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Garanti & SSS</h3>
                    <p className="text-sm text-gray-500">Garanti, iade ve sıkça sorulan sorular</p>
                  </div>
                </div>

                {/* Garanti Bilgileri */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Garanti Bilgileri
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="hasWarranty"
                        className="w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="hasWarranty" className="text-sm font-medium text-gray-700">
                        Bu ürün garanti kapsamındadır
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Garanti Süresi
                        </label>
                        <input
                          type="text"
                          placeholder="Örn: 2 yıl, 24 ay"
                          className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Garanti Türü
                        </label>
                        <select className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                          <option value="">Garanti türü seçin</option>
                          <option value="manufacturer">Üretici Garantisi</option>
                          <option value="seller">Satıcı Garantisi</option>
                          <option value="extended">Uzatılmış Garanti</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Garanti Detayları
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Garanti kapsamı, koşulları ve istisnaları..."
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* İade Koşulları */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <RotateCcw className="h-5 w-5 mr-2 text-blue-600" />
                    İade Koşulları
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="returnable"
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="returnable" className="text-sm font-medium text-gray-700">
                        Bu ürün iade edilebilir
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          İade Süresi (gün)
                        </label>
                        <input
                          type="number"
                          placeholder="14"
                          className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          İade Şekli
                        </label>
                        <select className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900">
                          <option value="">İade şekli seçin</option>
                          <option value="exchange">Değişim</option>
                          <option value="refund">Para iadesi</option>
                          <option value="credit">Kredi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        İade Koşulları
                      </label>
                      <textarea
                        rows={3}
                        placeholder="İade koşulları ve gereksinimleri..."
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sıkça Sorulan Sorular */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                    Sıkça Sorulan Sorular
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Müşterilerinizin sıkça sorduğu soruları ve cevaplarını ekleyebilirsiniz.
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Soru
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Bu ürün hangi renklerde mevcut?"
                            className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cevap
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Sorunun detaylı cevabı..."
                            className="w-full px-4 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                          />
                        </div>
                      </div>
                      
                      <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        SSS Ekle
                      </button>
                    </div>

                    {/* Örnek SSS */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                      <h5 className="font-semibold text-gray-900 mb-2">Mevcut SSS</h5>
                      <div className="text-sm text-gray-500">
                        Henüz SSS eklenmemiş. Yukarıdaki formu kullanarak ekleyebilirsiniz.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Adım 6: SEO */}
            {currentStep === 6 && (
              <div className="space-y-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">SEO Ayarları</h3>
                    <p className="text-sm text-gray-500">Arama motoru optimizasyonu</p>
                  </div>
                </div>

                {/* SEO Temel Bilgileri */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-purple-600" />
                    SEO Temel Bilgileri
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SEO Başlığı
                      </label>
                      <input
                        type="text"
                        placeholder="Arama motorları için optimize edilmiş başlık"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Önerilen uzunluk: 50-60 karakter
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Meta Açıklama
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Arama sonuçlarında görünecek açıklama"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Önerilen uzunluk: 150-160 karakter
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        SEO Anahtar Kelimeler
                      </label>
                      <input
                        type="text"
                        placeholder="Anahtar kelimeleri virgülle ayırın"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Örnek: kulaklık, kablosuz, bluetooth, ses kalitesi
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL ve Yapılandırılmış Veri */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    URL ve Yapılandırılmış Veri
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ürün URL'si
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">https://siteniz.com/urun/</span>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => updateFormData('slug', e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                          placeholder="urun-slug"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        URL SEO dostu olmalı ve anahtar kelimeler içermelidir
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="structuredData"
                        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="structuredData" className="text-sm font-medium text-gray-700">
                        Yapılandırılmış veri (Schema.org) ekle
                      </label>
                    </div>

                    <div className="text-sm text-gray-600">
                      Yapılandırılmış veri, arama motorlarının ürününüzü daha iyi anlamasını sağlar ve 
                      zengin sonuçlar (rich snippets) görüntülenmesine yardımcı olur.
                    </div>
                  </div>
                </div>

                {/* Sosyal Medya */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-green-600" />
                    Sosyal Medya Paylaşımı
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sosyal Medya Başlığı
                      </label>
                      <input
                        type="text"
                        placeholder="Facebook, Twitter vb. için özel başlık"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sosyal Medya Açıklaması
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Sosyal medyada paylaşılacak açıklama"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Sosyal Medya Görseli
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                            Görsel Seç
                          </button>
                          <p className="text-xs text-gray-500 mt-1">
                            Önerilen boyut: 1200x630px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Önerileri */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-yellow-600" />
                    SEO Önerileri
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="text-sm text-gray-700">
                        <strong>Başlık:</strong> Anahtar kelimeleri başlığın başında kullanın
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="text-sm text-gray-700">
                        <strong>Açıklama:</strong> Ürünün faydalarını ve özelliklerini vurgulayın
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="text-sm text-gray-700">
                        <strong>Anahtar Kelimeler:</strong> Uzun kuyruk anahtar kelimeleri kullanın
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="text-sm text-gray-700">
                        <strong>URL:</strong> Kısa ve açıklayıcı URL'ler oluşturun
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600" />
                Canlı Önizleme
              </h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images[0].url}
                      alt={formData.images[0].alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {formData.name || 'Ürün Adı'}
                  </h4>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-green-600">
                      ₺{formData.price.toFixed(2)}
                    </span>
                    {formData.comparePrice && formData.comparePrice > formData.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₺{formData.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">
                    SKU: {formData.sku || 'SKU-123456'}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Stok: {formData.quantity} adet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Önceki Adım
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={autoSave}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
                >
                  Taslak Kaydet
                </button>
                
                {currentStep === steps.length ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <Settings className="h-5 w-5 mr-2" />
                        Ürünü Güncelle
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
                  >
                    Sonraki Adım
                    <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
