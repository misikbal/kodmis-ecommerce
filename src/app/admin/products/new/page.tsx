'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { 
  Upload, 
  X, 
  Plus, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  Type,
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
  Sparkles,
  GripVertical,
  Trash2,
  RefreshCw,
  Truck,
  ListOrdered,
  HelpCircle,
  Video,
  Shield,
  RotateCcw,
  Link as LinkIcon,
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
    options?: any; // Backend için gerekli
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
  // Teknik Özellikler
  technicalSpecs: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  // Kargo Bilgileri
  shipping?: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery?: string;
    shippingClass?: string;
    shippingNote?: string;
  };
  // SSS
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  // Video URL'leri
  videos: Array<{
    id: string;
    url: string;
    title: string;
    platform: 'youtube' | 'vimeo' | 'other';
  }>;
  // Garanti Bilgileri
  warranty?: {
    hasWarranty: boolean;
    period?: string;
    type?: string;
    details?: string;
  };
  // İade Koşulları
  returnPolicy?: {
    returnable: boolean;
    returnPeriod?: number;
    details?: string;
  };
  // İlgili Ürünler
  relatedProducts: string[];
}

interface CloudinaryImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  created_at: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  parentId?: string;
  level?: number;
  sortOrder?: number;
  productCount?: number;
  children?: Category[];
}

export default function NewProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Category management
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'parent' | 'child'>('all');
  
  // Brand management
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    technicalSpecs: [],
    shipping: {
      freeShipping: false,
      shippingCost: 0,
      estimatedDelivery: '2-3 iş günü',
      shippingClass: 'standard',
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
      returnable: true,
      returnPeriod: 14,
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

  // Quick Templates - Hazır şablonlar
  const quickTemplates: {
    basic: Partial<ProductFormData>;
    physical: Partial<ProductFormData>;
    digital: Partial<ProductFormData>;
  } = {
    basic: {
      name: 'Temel Ürün',
      price: 0,
      quantity: 0,
      status: 'DRAFT',
      images: []
    },
    physical: {
      name: 'Fiziksel Ürün',
      type: 'PHYSICAL',
      price: 100,
      quantity: 10,
      shipping: { freeShipping: false }
    },
    digital: {
      name: 'Dijital Ürün',
      type: 'DIGITAL',
      price: 50,
      quantity: 9999,
      shipping: { freeShipping: true }
    }
  };

  // Quick Actions
  const applyTemplate = (template: string) => {
    if (template === 'basic') {
      // Reset to basic
      setFormData(prev => ({ ...prev, ...quickTemplates.basic } as ProductFormData));
    } else if (template === 'physical') {
      setFormData(prev => ({ ...prev, ...quickTemplates.physical } as ProductFormData));
    } else if (template === 'digital') {
      setFormData(prev => ({ ...prev, ...quickTemplates.digital } as ProductFormData));
    }
  };

  // Duplicate product - Yakında eklenecek
  const duplicateProduct = () => {
    alert('Bu özellik yakında gelecek!');
  };

  // Load categories and brands on mount
  useEffect(() => {
    loadCategories();
    loadBrands();
  }, []);

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

  // Otomatik slug oluşturma
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

  // Otomatik SKU oluşturma
  const generateSKU = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  // Form verilerini güncelle
  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Otomatik slug oluşturma
      if (field === 'name' && value) {
        updated.slug = generateSlug(value);
      }
      
      // Otomatik SKU oluşturma
      if (field === 'name' && value) {
        updated.sku = generateSKU(value);
      }
      
      return updated;
    });
  };

  // Fotoğraf yükleme
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
        loadCloudinaryImages(); // Listeyi yenile
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    }
  };

  // Cloudinary fotoğraflarını yükle
  const loadCloudinaryImages = async () => {
    setIsLoadingImages(true);
    try {
      const response = await fetch('/api/cloudinary/images?max_results=100');
      const data = await response.json();
      
      if (data.success) {
        setCloudinaryImages(data.images);
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  // Fotoğraf seçimi
  const handleImageSelect = (imageUrl: string) => {
    if (selectedImages.includes(imageUrl)) {
      setSelectedImages(prev => prev.filter(url => url !== imageUrl));
    } else {
      setSelectedImages(prev => [...prev, imageUrl]);
    }
  };

  // Seçilen fotoğrafları ekle
  const addSelectedImages = () => {
    const newImages = selectedImages.map((url, index) => ({
      url,
      alt: `Ürün Fotoğrafı ${formData.images.length + index + 1}`,
      sortOrder: formData.images.length + index
    }));
    
    updateFormData('images', [...formData.images, ...newImages]);
    setSelectedImages([]);
    setIsImageModalOpen(false);
  };

  // Fotoğraf silme
  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    updateFormData('images', updatedImages);
  };

  // Drag & Drop Fotoğraf Sıralama
  const handleDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === index) return;
    
    const newImages = [...formData.images];
    const draggedImage = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    // Update sort orders
    const updatedImages = newImages.map((img, i) => ({ ...img, sortOrder: i }));
    updateFormData('images', updatedImages);
    setDraggedImageIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedImageIndex(null);
  };

  // Kategori Yönetimi
  const addCategory = (categoryId: string) => {
    if (!formData.categories.includes(categoryId)) {
      updateFormData('categories', [...formData.categories, categoryId]);
    }
  };

  const removeCategory = (categoryId: string) => {
    updateFormData('categories', formData.categories.filter(c => c !== categoryId));
  };

  const toggleCategory = (categoryId: string) => {
    if (formData.categories.includes(categoryId)) {
      removeCategory(categoryId);
    } else {
      addCategory(categoryId);
    }
  };


  // Etiket Yönetimi
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };

  // Teknik Özellik Yönetimi
  const addTechnicalSpec = () => {
    const newSpec = {
      id: Date.now().toString(),
      label: '',
      value: ''
    };
    updateFormData('technicalSpecs', [...formData.technicalSpecs, newSpec]);
  };

  const updateTechnicalSpec = (id: string, field: 'label' | 'value', value: string) => {
    const updated = formData.technicalSpecs.map(spec =>
      spec.id === id ? { ...spec, [field]: value } : spec
    );
    updateFormData('technicalSpecs', updated);
  };

  const removeTechnicalSpec = (id: string) => {
    updateFormData('technicalSpecs', formData.technicalSpecs.filter(spec => spec.id !== id));
  };

  // SSS Yönetimi
  const addFAQ = () => {
    const newFAQ = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    updateFormData('faqs', [...formData.faqs, newFAQ]);
  };

  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    const updated = formData.faqs.map(faq =>
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    updateFormData('faqs', updated);
  };

  const removeFAQ = (id: string) => {
    updateFormData('faqs', formData.faqs.filter(faq => faq.id !== id));
  };

  // Video Yönetimi
  const addVideo = () => {
    const newVideo = {
      id: Date.now().toString(),
      url: '',
      title: '',
      platform: 'youtube' as const
    };
    updateFormData('videos', [...formData.videos, newVideo]);
  };

  const updateVideo = (id: string, field: 'url' | 'title' | 'platform', value: string) => {
    const updated = formData.videos.map(video =>
      video.id === id ? { ...video, [field]: value } : video
    );
    updateFormData('videos', updated);
  };

  const removeVideo = (id: string) => {
    updateFormData('videos', formData.videos.filter(video => video.id !== id));
  };

  // Form Validasyonu
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
    
    if (formData.images.length === 0) {
      newErrors.images = 'En az bir ürün fotoğrafı eklemelisiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Otomatik Kaydetme
  const autoSave = async () => {
    if (!formData.name.trim()) return; // Boş form kaydetme
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/products/draft', {
        method: 'POST',
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

  // Adım geçişleri
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

  // Form gönderimi
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        console.error('Ürün oluşturma hatası');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
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
    <AdminLayout title="Yeni Ürün" description="Yeni ürün ekleyin" showHeader={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Modern Header */}
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
                    <Sparkles className="h-6 w-6 mr-2 text-purple-500" />
                    Yeni Ürün Ekle
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Adım {currentStep} / {steps.length} · {steps[currentStep - 1].description}
                  </p>
            </div>
          </div>
              
              <div className="flex items-center space-x-3">
                {/* Quick Templates */}
                <div className="flex items-center space-x-2 border-r border-gray-300 pr-3">
                  <button
                    onClick={() => applyTemplate('physical')}
                    className="px-3 py-1.5 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
                    title="Fiziksel ürün şablonu"
                  >
                    📦 Fiziksel
                  </button>
                  <button
                    onClick={() => applyTemplate('digital')}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                    title="Dijital ürün şablonu"
                  >
                    💻 Dijital
                  </button>
                </div>

                {/* Auto-save indicator */}
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
                  Taslak Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            {/* Progress percentage */}
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
            
            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => {
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
                    
                    {/* Step number badge */}
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

        {/* Form Content with Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Temel Bilgiler</h3>
                  <p className="text-sm text-gray-500">Ürününüzün temel bilgilerini girin</p>
                </div>
              </div>
              
              {/* Temel Bilgiler Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ürün Adı */}
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
                    placeholder="premium-kablosuz-kulaklik"
                  />
                  {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    SKU *
                    <span className="ml-2 text-gray-400" title="Stok Takip Kodu">
                      <Info className="h-4 w-4" />
                    </span>
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

                {/* Barcode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Barkod (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.barcode || ''}
                    onChange={(e) => updateFormData('barcode', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="8690000000000"
                  />
                </div>

                {/* Ürün Tipi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ürün Tipi *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => updateFormData('type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="PHYSICAL">🎁 Fiziksel Ürün</option>
                    <option value="DIGITAL">💾 Dijital Ürün</option>
                    <option value="SERVICE">⚙️ Hizmet</option>
                  </select>
                </div>

                {/* Durum */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yayın Durumu
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all"
                  >
                    <option value="DRAFT">📝 Taslak</option>
                    <option value="ACTIVE">✅ Aktif</option>
                    <option value="INACTIVE">⏸️ Pasif</option>
                    <option value="ARCHIVED">📦 Arşivlenmiş</option>
                  </select>
                </div>

                {/* Kısa Açıklama */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kısa Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Ürününüzün özelliklerini kısaca açıklayın... (Maksimum 250 karakter)"
                    maxLength={250}
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {formData.description.length} / 250 karakter
                </div>
              </div>
            </div>

              {/* Marka Seçimi - Opsiyonel */}
              {availableBrands.length > 0 && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
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
                  ) : availableBrands.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Store className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium">Henüz marka yok</p>
                      <p className="text-xs mt-1 mb-3">İlk markayı oluşturarak başlayın</p>
                      <button
                        onClick={() => router.push('/admin/brands/new')}
                        className="px-4 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-all"
                      >
                        <Plus className="h-3 w-3 inline mr-1" />
                        İlk Markayı Ekle
                      </button>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Kategori ve Etiketler */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                {/* Kategoriler - Dinamik */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Kategoriler
                    </label>
                    <button
                      onClick={() => router.push('/admin/categories/new')}
                      className="flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Yeni Kategori
                    </button>
                  </div>

                  {/* Kategori Arama ve Filtre */}
                  <div className="space-y-2 mb-3">
                    {/* Arama */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Kategori ara..."
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    {/* Filtre Butonları */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCategoryFilter('all')}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                          categoryFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Tümü
                      </button>
                      <button
                        onClick={() => setCategoryFilter('parent')}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                          categoryFilter === 'parent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Ana Kategoriler
                      </button>
                      <button
                        onClick={() => setCategoryFilter('child')}
                        className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-all ${
                          categoryFilter === 'child'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Alt Kategoriler
                      </button>
                    </div>
                  </div>

                  {/* Kategori Listesi - Hiyerarşik Görünüm */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 max-h-64 overflow-y-auto">
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center py-4">
                        <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                    ) : availableCategories.length > 0 ? (
                      <div className="space-y-1">
                        {/* Filtrelenmiş Kategoriler */}
                        {(() => {
                          // Arama ve filtreleme
                          let filteredCategories = availableCategories.filter(cat => {
                            const matchesSearch = cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase());
                            const matchesFilter = 
                              categoryFilter === 'all' ? true :
                              categoryFilter === 'parent' ? !cat.parentId :
                              categoryFilter === 'child' ? !!cat.parentId : true;
                            return matchesSearch && matchesFilter;
                          });

                          // Eğer arama veya filtre aktifse düz liste göster
                          if (categorySearchTerm || categoryFilter !== 'all') {
                            return filteredCategories.map(category => {
                              const parentCat = category.parentId ? availableCategories.find(c => c._id === category.parentId) : null;
                              
                              return (
                                <label
                                  key={category._id}
                                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-all group ${
                                    category.parentId ? 'hover:bg-purple-50' : 'hover:bg-blue-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.categories.includes(category._id)}
                                    onChange={() => toggleCategory(category._id)}
                                    className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                                      category.parentId 
                                        ? 'text-purple-600 focus:ring-purple-500' 
                                        : 'text-blue-600 focus:ring-blue-500'
                                    }`}
                                  />
                                  
                                  <div 
                                    className="w-6 h-6 rounded ml-3 flex items-center justify-center text-xs"
                                    style={{ backgroundColor: category.color || '#3b82f6' }}
                                  >
                                    {category.icon || <span className="text-white">●</span>}
                                  </div>
                                  
                                  <div className="ml-2 flex-1">
                                    <span className={`text-sm font-medium ${
                                      category.parentId ? 'text-gray-700' : 'text-gray-900 font-semibold'
                                    }`}>
                                      {category.name}
                                    </span>
                                    {parentCat && (
                                      <span className="ml-2 text-xs text-gray-500">
                                        → {parentCat.name}
                                      </span>
                                    )}
                                  </div>
                                  
                                  {category.productCount !== undefined && (
                                    <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                      {category.productCount}
                                    </span>
                                  )}
                                </label>
                              );
                            });
                          }

                          // Hiyerarşik görünüm (default)
                          return filteredCategories.filter(cat => !cat.parentId).map((category) => (
                          <div key={category._id}>
                            {/* Ana Kategori */}
                            <label
                              className="flex items-center p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-all group"
                            >
                              <input
                                type="checkbox"
                                checked={formData.categories.includes(category._id)}
                                onChange={() => toggleCategory(category._id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              
                              {/* Kategori İkonu/Renk */}
                              <div 
                                className="w-6 h-6 rounded ml-3 flex items-center justify-center text-xs"
                                style={{ backgroundColor: category.color || '#3b82f6' }}
                              >
                                {category.icon ? (
                                  <span>{category.icon}</span>
                                ) : (
                                  <span className="text-white">●</span>
                                )}
                              </div>
                              
                              <span className="ml-2 text-sm text-gray-900 font-semibold group-hover:text-blue-700">
                                {category.name}
                              </span>
                              
                              {category.productCount !== undefined && (
                                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  {category.productCount}
                                </span>
                              )}
                            </label>
                            
                            {/* Alt Kategoriler */}
                            {availableCategories.filter(subCat => subCat.parentId === category._id).length > 0 && (
                              <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                                {availableCategories.filter(subCat => subCat.parentId === category._id).map((subCategory) => (
                                  <label
                                    key={subCategory._id}
                                    className="flex items-center p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-all group"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.categories.includes(subCategory._id)}
                                      onChange={() => toggleCategory(subCategory._id)}
                                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                                    />
                                    
                                    <div 
                                      className="w-5 h-5 rounded ml-3 flex items-center justify-center text-xs"
                                      style={{ backgroundColor: subCategory.color || '#a855f7' }}
                                    >
                                      {subCategory.icon ? (
                                        <span className="text-xs">{subCategory.icon}</span>
                                      ) : (
                                        <span className="text-white text-xs">○</span>
                                      )}
                                    </div>
                                    
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-purple-700">
                                      {subCategory.name}
                                    </span>
                                    
                                    {subCategory.productCount !== undefined && (
                                      <span className="ml-auto text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                                        {subCategory.productCount}
                                      </span>
                                    )}
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Layers className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">Henüz kategori yok</p>
                        <p className="text-xs mt-1 mb-3">İlk kategoriyi oluşturarak başlayın</p>
                        <button
                          onClick={() => router.push('/admin/categories/new')}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all"
                        >
                          <Plus className="h-3 w-3 inline mr-1" />
                          İlk Kategoriyi Ekle
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Popüler Kategoriler - Hızlı Seçim */}
                  {availableCategories.length > 0 && formData.categories.length === 0 && !categorySearchTerm && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1 text-blue-600" />
                        Hızlı Seçim (Popüler)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {availableCategories
                          .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
                          .slice(0, 5)
                          .map(cat => (
                            <button
                              key={cat._id}
                              onClick={() => addCategory(cat._id)}
                              className="flex items-center px-2.5 py-1 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                            >
                              <span 
                                className="w-4 h-4 rounded flex items-center justify-center mr-1.5 text-xs"
                                style={{ backgroundColor: cat.color || '#3b82f6' }}
                              >
                                {cat.icon || <span className="text-white text-xs">●</span>}
                              </span>
                              {cat.name}
                              <Plus className="h-3 w-3 ml-1.5" />
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Seçili Kategoriler - Geliştirilmiş Görünüm */}
                  {formData.categories.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">Seçili Kategoriler ({formData.categories.length}):</p>
                        <button
                          onClick={() => updateFormData('categories', [])}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Tümünü Kaldır
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.categories.map((categoryId) => {
                          const cat = availableCategories.find(c => c._id === categoryId);
                          const parentCat = cat?.parentId ? availableCategories.find(c => c._id === cat.parentId) : null;
                          
                          return cat ? (
                            <span
                              key={categoryId}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white border-2 shadow-sm hover:shadow-md transition-all"
                              style={{ borderColor: cat.color || '#3b82f6' }}
                            >
                              <span 
                                className="w-5 h-5 rounded flex items-center justify-center text-xs mr-2"
                                style={{ backgroundColor: cat.color || '#3b82f6' }}
                              >
                                {cat.icon || <span className="text-white">●</span>}
                              </span>
                              
                              {parentCat && (
                                <>
                                  <span className="text-gray-500 text-xs">{parentCat.name}</span>
                                  <span className="mx-1 text-gray-400">→</span>
                                </>
                              )}
                              
                              <span style={{ color: cat.color || '#3b82f6' }}>
                                {cat.name}
                              </span>
                              
                              <button
                                onClick={() => removeCategory(categoryId)}
                                className="ml-2 hover:bg-red-50 rounded-full p-0.5 transition-all"
                              >
                                <X className="h-3.5 w-3.5 text-red-600" />
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Etiketler - Gelişmiş Chip Sistemi */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Etiketler
                  </label>
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      // Enter veya virgül ile etiket ekle
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const newTagValue = input.value.trim();
                        
                        if (newTagValue && !formData.tags.includes(newTagValue)) {
                          updateFormData('tags', [...formData.tags, newTagValue]);
                          input.value = '';
                        }
                      }
                      
                      // Backspace ile son etiketi sil (input boşsa)
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

                  {/* Etiketler Listesi - Chip/Badge Formatında */}
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

              {/* Ürün Varyantları */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-pink-600" />
                      Ürün Varyantları
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">Renk, beden gibi seçenekler ekleyin</p>
                  </div>
                  <button
                    onClick={() => {
                      const newVariant = {
                        id: Date.now().toString(),
                        name: '',
                        values: [],
                        options: {} // Backend için gerekli
                      };
                      updateFormData('variants', [...formData.variants, newVariant]);
                    }}
                    className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Varyant Ekle
                  </button>
                </div>

                {formData.variants.length > 0 ? (
                  <div className="space-y-4">
                    {formData.variants.map((variant, vIndex) => (
                      <div key={variant.id} className="bg-white p-5 rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded-full">
                              Varyant {vIndex + 1}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              updateFormData('variants', formData.variants.filter(v => v.id !== variant.id));
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Varyant Adı */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Varyant Adı (Örn: Renk, Beden, Boyut)
                            </label>
                            <input
                              type="text"
                              value={variant.name}
                              onChange={(e) => {
                                const updated = formData.variants.map(v =>
                                  v.id === variant.id ? { ...v, name: e.target.value } : v
                                );
                                updateFormData('variants', updated);
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-400 font-semibold"
                              placeholder="Örn: Renk, Beden, Materyal"
                            />
                          </div>

                          {/* Varyant Değerleri - Gelişmiş Chip Sistemi */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Değerler (Enter veya virgül ile ekleyin)
                            </label>
                            
                            {/* Input Field */}
                            <input
                              type="text"
                              onKeyDown={(e) => {
                                // Enter veya virgül ile değer ekle
                                if (e.key === 'Enter' || e.key === ',') {
                                  e.preventDefault();
                                  const input = e.currentTarget;
                                  const newValue = input.value.trim();
                                  
                                  if (newValue && !variant.values.includes(newValue)) {
                                    const updated = formData.variants.map(v =>
                                      v.id === variant.id 
                                        ? { ...v, values: [...v.values, newValue] }
                                        : v
                                    );
                                    updateFormData('variants', updated);
                                    input.value = '';
                                  }
                                }
                                
                                // Backspace ile son değeri sil (input boşsa)
                                if (e.key === 'Backspace' && e.currentTarget.value === '' && variant.values.length > 0) {
                                  const updated = formData.variants.map(v =>
                                    v.id === variant.id 
                                      ? { ...v, values: v.values.slice(0, -1) }
                                      : v
                                  );
                                  updateFormData('variants', updated);
                                }
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 placeholder-gray-400"
                              placeholder="Değer yazıp Enter veya virgül ile ekleyin..."
                            />
                            <p className="mt-1 text-xs text-gray-500 flex items-center">
                              <Info className="h-3 w-3 mr-1" />
                              Enter veya virgül (,) ile yeni değer ekleyin • Backspace ile son değeri silin
                            </p>

                            {/* Değerler Listesi - Chip/Badge Formatında */}
                            {variant.values.length > 0 && (
                              <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border-2 border-pink-200">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-gray-700">
                                    Eklenen Değerler ({variant.values.length})
                                  </p>
                                  <button
                                    onClick={() => {
                                      const updated = formData.variants.map(v =>
                                        v.id === variant.id ? { ...v, values: [] } : v
                                      );
                                      updateFormData('variants', updated);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Tümünü Sil
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {variant.values.map((val, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white border-2 border-pink-300 text-pink-800 hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm"
                                    >
                                      <span className="mr-2">{val}</span>
                                      <button
                                        onClick={() => {
                                          const updated = formData.variants.map(v =>
                                            v.id === variant.id 
                                              ? { ...v, values: v.values.filter((_, i) => i !== idx) }
                                              : v
                                          );
                                          updateFormData('variants', updated);
                                        }}
                                        className="hover:bg-pink-200 rounded-full p-0.5 transition-all"
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Layers className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">Henüz varyant eklenmedi</p>
                    <p className="text-xs mt-1">Ürününüzün farklı seçeneklerini ekleyin</p>
                    <p className="text-xs text-gray-400 mt-2">Örn: Renk (Kırmızı, Mavi), Beden (S, M, L, XL)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Fiyat & Stok Yönetimi</h3>
                  <p className="text-sm text-gray-500">Fiyatlandırma ve envanter bilgilerinizi girin</p>
                </div>
              </div>
              
              {/* Fiyatlandırma Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  💰 Fiyatlandırma
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Satış Fiyatı * (₺)
                      {errors.price && <AlertCircle className="h-4 w-4 ml-2 text-red-500" />}
                  </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₺</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all font-semibold text-lg ${
                          errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Karşılaştırma Fiyatı (₺)
                      <span className="ml-2 text-gray-400" title="İndirim öncesi fiyat">
                        <Info className="h-4 w-4" />
                      </span>
                  </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₺</span>
                  <input
                    type="number"
                    value={formData.comparePrice || ''}
                    onChange={(e) => updateFormData('comparePrice', parseFloat(e.target.value) || undefined)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                    </div>
                    {formData.comparePrice && formData.comparePrice > formData.price && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        %{Math.round(((formData.comparePrice - formData.price) / formData.comparePrice) * 100)} indirim
                      </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maliyet Fiyatı (₺)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₺</span>
                      <input
                        type="number"
                        value={formData.costPrice || ''}
                        onChange={(e) => updateFormData('costPrice', parseFloat(e.target.value) || undefined)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {formData.costPrice && formData.price > formData.costPrice && (
                      <p className="mt-1 text-sm text-green-600 flex items-center">
                        Kar Marjı: ₺{(formData.price - formData.costPrice).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stok Yönetimi Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  📦 Stok Yönetimi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stok Miktarı *
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => updateFormData('quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all font-semibold text-lg"
                    placeholder="0"
                    min="0"
                  />
                    <div className="mt-2 flex items-center">
                      {formData.quantity > 50 ? (
                        <span className="text-sm text-green-600 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Stok Durumu: Bol
                        </span>
                      ) : formData.quantity > 10 ? (
                        <span className="text-sm text-yellow-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Stok Durumu: Orta
                        </span>
                      ) : formData.quantity > 0 ? (
                        <span className="text-sm text-orange-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Stok Durumu: Az
                        </span>
                      ) : (
                        <span className="text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Stok Durumu: Tükendi
                        </span>
                      )}
                </div>
              </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      Düşük Stok Uyarı Eşiği
                      <span className="ml-2 text-gray-400" title="Bu miktarın altında uyarı alırsınız">
                        <Info className="h-4 w-4" />
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold || ''}
                      onChange={(e) => updateFormData('lowStockThreshold', parseInt(e.target.value) || undefined)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="10"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Fiziksel Ürün Özellikleri */}
              {formData.type === 'PHYSICAL' && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    📏 Fiziksel Özellikler
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ağırlık (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || undefined)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Uzunluk (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.dimensions?.length || ''}
                        onChange={(e) => updateFormData('dimensions', { 
                          ...formData.dimensions, 
                          length: parseFloat(e.target.value) || undefined 
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.0"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Genişlik (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.dimensions?.width || ''}
                        onChange={(e) => updateFormData('dimensions', { 
                          ...formData.dimensions, 
                          width: parseFloat(e.target.value) || undefined 
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.0"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Yükseklik (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.dimensions?.height || ''}
                        onChange={(e) => updateFormData('dimensions', { 
                          ...formData.dimensions, 
                          height: parseFloat(e.target.value) || undefined 
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                        placeholder="0.0"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Kargo Bilgileri */}
              {formData.type === 'PHYSICAL' && (
                <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 border-2 border-cyan-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-cyan-600" />
                    Kargo Bilgileri
                  </h4>
                  <div className="space-y-4">
                    {/* Ücretsiz Kargo */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-cyan-200">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.shipping?.freeShipping}
                          onChange={(e) => updateFormData('shipping', {
                            ...formData.shipping,
                            freeShipping: e.target.checked
                          })}
                          className="w-5 h-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <label className="ml-3 text-sm font-semibold text-gray-900">
                          Ücretsiz Kargo
                        </label>
                      </div>
                      {formData.shipping?.freeShipping && (
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-medium rounded-full">
                          ✓ Aktif
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Kargo Ücreti */}
                      {!formData.shipping?.freeShipping && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Kargo Ücreti (₺)
                          </label>
                          <input
                            type="number"
                            value={formData.shipping?.shippingCost || ''}
                            onChange={(e) => updateFormData('shipping', {
                              ...formData.shipping,
                              shippingCost: parseFloat(e.target.value) || 0
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      )}

                      {/* Tahmini Teslimat */}
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                          placeholder="Örn: 2-3 iş günü"
                        />
                      </div>

                      {/* Kargo Sınıfı */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Kargo Sınıfı
                        </label>
                        <select
                          value={formData.shipping?.shippingClass || 'standard'}
                          onChange={(e) => updateFormData('shipping', {
                            ...formData.shipping,
                            shippingClass: e.target.value
                          })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 transition-all"
                        >
                          <option value="standard">🚚 Standart Kargo</option>
                          <option value="express">⚡ Hızlı Kargo</option>
                          <option value="cargo">📦 Kargo</option>
                          <option value="hand">👋 Elden Teslim</option>
                        </select>
                      </div>

                      {/* Kargo Notu */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Kargo Notu (Opsiyonel)
                        </label>
                        <textarea
                          value={formData.shipping?.shippingNote || ''}
                          onChange={(e) => updateFormData('shipping', {
                            ...formData.shipping,
                            shippingNote: e.target.value
                          })}
                          rows={2}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                          placeholder="Özel kargo talimatları veya bilgileri..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Ürün Fotoğrafları</h3>
                    <p className="text-sm text-gray-500">Sürükleyerek sıralayabilirsiniz</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Yeni Yükle
                  </button>
                  <button
                    onClick={() => {
                      loadCloudinaryImages();
                      setIsImageModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Galeriden Seç
                  </button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {errors.images && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <p className="text-red-700 font-medium">{errors.images}</p>
                </div>
              )}

              {/* Mevcut Fotoğraflar - Drag & Drop */}
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-move bg-white rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                        draggedImageIndex === index 
                          ? 'border-blue-500 shadow-2xl scale-105 opacity-50' 
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-lg'
                      }`}
                    >
                      {/* Drag Handle */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <GripVertical className="h-4 w-4 text-white" />
                      </div>

                      {/* Image */}
                      <div className="aspect-square relative">
                    <img
                      src={image.url}
                      alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Primary Badge */}
                        {index === 0 && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-lg shadow-lg">
                            <span className="text-xs font-bold text-white flex items-center">
                              ⭐ Ana Görsel
                            </span>
                          </div>
                        )}

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {/* Delete Button */}
                    <button
                      onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transform hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                            <Trash2 className="h-4 w-4" />
                    </button>

                          {/* Image Alt Text */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-xs font-medium truncate">
                      {image.alt}
                            </p>
                            <p className="text-white text-xs opacity-75">
                              Sıra: {index + 1}
                            </p>
                          </div>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="h-10 w-10 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Henüz Fotoğraf Eklenmedi
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Ürününüzün fotoğraflarını yükleyerek başlayın
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Fotoğraf Yükle
                      </button>
                      <button
                        onClick={() => {
                          loadCloudinaryImages();
                          setIsImageModalOpen(true);
                        }}
                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Galeriden Seç
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">💡 İpuçları:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>İlk fotoğraf ana görsel olarak kullanılacaktır</li>
                    <li>Fotoğrafları sürükleyerek sıralayabilirsiniz</li>
                    <li>Yüksek kaliteli görseller kullanın (en az 800x800px)</li>
                    <li>Ürününüzü farklı açılardan gösterin</li>
                  </ul>
                </div>
              </div>

              {/* Video URL'leri */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Video className="h-5 w-5 mr-2 text-red-600" />
                    Ürün Videoları
                  </h4>
                  <button
                    onClick={addVideo}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Video Ekle
                  </button>
                </div>

                {formData.videos.length > 0 ? (
                  <div className="space-y-4">
                    {formData.videos.map((video, index) => (
                      <div key={video.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Video {index + 1}
                          </span>
                          <button
                            onClick={() => removeVideo(video.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Video URL
                            </label>
                            <input
                              type="url"
                              value={video.url}
                              onChange={(e) => updateVideo(video.id, 'url', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400"
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Platform
                            </label>
                            <select
                              value={video.platform}
                              onChange={(e) => updateVideo(video.id, 'platform', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                            >
                              <option value="youtube">📺 YouTube</option>
                              <option value="vimeo">🎬 Vimeo</option>
                              <option value="other">🔗 Diğer</option>
                            </select>
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Video Başlığı
                            </label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400"
                              placeholder="Örn: Ürün Tanıtım Videosu"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <Video className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Henüz video eklenmedi</p>
                    <p className="text-xs mt-1">YouTube, Vimeo veya diğer platformlardan video ekleyebilirsiniz</p>
                </div>
              )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Type className="h-6 w-6 text-orange-600" />
                </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900">Detaylı Açıklama</h3>
                  <p className="text-sm text-gray-500">Ürününüzü detaylı bir şekilde tanıtın</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => updateFormData('content', value)}
                  placeholder="Ürününüzün detaylarını, özelliklerini ve kullanım talimatlarını yazın..."
                  className="min-h-96"
                />
              </div>

              {/* Tips */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start">
                <Info className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-900">
                  <p className="font-semibold mb-1">✍️ İyi bir açıklama için:</p>
                  <ul className="list-disc list-inside space-y-1 text-orange-800">
                    <li>Ürünün tüm özelliklerini detaylıca açıklayın</li>
                    <li>Kullanım alanlarını ve faydalarını belirtin</li>
                    <li>Teknik özellik ve boyutları ekleyin</li>
                    <li>Görseller ve başlıklar kullanarak okunabilirliği artırın</li>
                  </ul>
                </div>
              </div>

              {/* Teknik Özellikler Tablosu */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Wrench className="h-5 w-5 mr-2 text-teal-600" />
                    Teknik Özellikler Tablosu
                  </h4>
                  <button
                    onClick={addTechnicalSpec}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Özellik Ekle
                  </button>
                </div>

                {formData.technicalSpecs.length > 0 ? (
                  <div className="space-y-3">
                    {formData.technicalSpecs.map((spec, index) => (
                      <div key={spec.id} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-teal-300 transition-all">
                        <div className="flex items-center space-x-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={spec.label}
                              onChange={(e) => updateTechnicalSpec(spec.id, 'label', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400 font-semibold"
                              placeholder="Örn: İşlemci"
                            />
                            
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateTechnicalSpec(spec.id, 'value', e.target.value)}
                              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-gray-900 placeholder-gray-400"
                              placeholder="Örn: Intel Core i7"
                            />
                          </div>

                          <button
                            onClick={() => removeTechnicalSpec(spec.id)}
                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <ListOrdered className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium">Henüz teknik özellik eklenmedi</p>
                    <p className="text-xs mt-1">Ürününüzün teknik özelliklerini tablo formatında ekleyin</p>
                    <p className="text-xs text-gray-400 mt-2">Örn: İşlemci, RAM, Ekran Boyutu, Ağırlık</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Garanti & SSS</h3>
                  <p className="text-sm text-gray-500">Garanti, iade politikası ve sıkça sorulan sorular</p>
                </div>
              </div>
              
            <div className="space-y-6">
                {/* Garanti Bilgileri */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Garanti Bilgileri
                  </h4>
              
              <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-lg border border-green-200">
                      <input
                        type="checkbox"
                        checked={formData.warranty?.hasWarranty}
                        onChange={(e) => updateFormData('warranty', {
                          ...formData.warranty,
                          hasWarranty: e.target.checked
                        })}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label className="ml-3 text-sm font-semibold text-gray-900">
                        Bu ürünün garantisi var
                      </label>
                    </div>

                    {formData.warranty?.hasWarranty && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Garanti Süresi
                          </label>
                          <input
                            type="text"
                            value={formData.warranty?.period || ''}
                            onChange={(e) => updateFormData('warranty', {
                              ...formData.warranty,
                              period: e.target.value
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400"
                            placeholder="Örn: 2 yıl"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Garanti Tipi
                          </label>
                          <select
                            value={formData.warranty?.type || ''}
                            onChange={(e) => updateFormData('warranty', {
                              ...formData.warranty,
                              type: e.target.value
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                          >
                            <option value="">Seçiniz</option>
                            <option value="manufacturer">🏭 Üretici Garantisi</option>
                            <option value="seller">🏪 Satıcı Garantisi</option>
                            <option value="both">🤝 Her İkisi</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Garanti Detayları
                          </label>
                          <textarea
                            value={formData.warranty?.details || ''}
                            onChange={(e) => updateFormData('warranty', {
                              ...formData.warranty,
                              details: e.target.value
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                            placeholder="Garanti kapsamı, koşullar ve diğer detaylar..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* İade Politikası */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <RotateCcw className="h-5 w-5 mr-2 text-amber-600" />
                    İade Politikası
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-white rounded-lg border border-amber-200">
                      <input
                        type="checkbox"
                        checked={formData.returnPolicy?.returnable}
                        onChange={(e) => updateFormData('returnPolicy', {
                          ...formData.returnPolicy,
                          returnable: e.target.checked
                        })}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <label className="ml-3 text-sm font-semibold text-gray-900">
                        Bu ürün iade edilebilir
                      </label>
                    </div>

                    {formData.returnPolicy?.returnable && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            İade Süresi (Gün)
                          </label>
                          <input
                            type="number"
                            value={formData.returnPolicy?.returnPeriod || 14}
                            onChange={(e) => updateFormData('returnPolicy', {
                              ...formData.returnPolicy,
                              returnPeriod: parseInt(e.target.value) || 14
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
                            placeholder="14"
                            min="0"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Müşteriler ürünü kaç gün içinde iade edebilir?
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            İade Koşulları
                          </label>
                          <textarea
                            value={formData.returnPolicy?.details || ''}
                            onChange={(e) => updateFormData('returnPolicy', {
                              ...formData.returnPolicy,
                              details: e.target.value
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                            placeholder="İade koşulları, kargo ücreti ve diğer detaylar..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SSS (Sıkça Sorulan Sorular) */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-violet-600" />
                      Sıkça Sorulan Sorular (SSS)
                    </h4>
                    <button
                      onClick={addFAQ}
                      className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Soru Ekle
                    </button>
                  </div>

                  {formData.faqs.length > 0 ? (
                    <div className="space-y-4">
                      {formData.faqs.map((faq, index) => (
                        <div key={faq.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <span className="px-3 py-1 bg-violet-100 text-violet-800 text-xs font-medium rounded-full">
                              Soru {index + 1}
                            </span>
                            <button
                              onClick={() => removeFAQ(faq.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Soru
                              </label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white text-gray-900 placeholder-gray-400 font-semibold"
                                placeholder="Örn: Bu ürün hangi cihazlarla uyumlu?"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cevap
                              </label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-white text-gray-900 placeholder-gray-400 resize-none"
                                placeholder="Sorunun detaylı cevabı..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium">Henüz soru eklenmedi</p>
                      <p className="text-xs mt-1">Müşterilerinizin sıkça sorduğu soruları ekleyin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Eye className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">SEO Optimizasyonu</h3>
                  <p className="text-sm text-gray-500">Arama motorlarında daha görünür olun</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* SEO Başlığı */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    SEO Başlığı
                    <span className="ml-2 text-gray-400" title="Arama sonuçlarında görünecek başlık">
                      <Info className="h-4 w-4" />
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => updateFormData('seoTitle', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="SEO için optimize edilmiş başlık"
                    maxLength={60}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className={formData.seoTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}>
                      {formData.seoTitle.length} / 60 karakter
                    </span>
                    {formData.seoTitle.length >= 50 && formData.seoTitle.length <= 60 && (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Optimal uzunluk
                      </span>
                    )}
                  </div>
                </div>

                {/* SEO Açıklaması */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    SEO Açıklaması (Meta Description)
                    <span className="ml-2 text-gray-400" title="Arama sonuçlarında görünecek açıklama">
                      <Info className="h-4 w-4" />
                    </span>
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => updateFormData('seoDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Arama motorlarında görünecek kısa açıklama yazın..."
                    maxLength={160}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className={formData.seoDescription.length > 160 ? 'text-red-600' : 'text-gray-500'}>
                      {formData.seoDescription.length} / 160 karakter
                    </span>
                    {formData.seoDescription.length >= 120 && formData.seoDescription.length <= 160 && (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Optimal uzunluk
                      </span>
                    )}
                  </div>
                </div>

                {/* SEO Anahtar Kelimeler */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    SEO Anahtar Kelimeler
                    <span className="ml-2 text-gray-400" title="Virgülle ayırarak ekleyin">
                      <Info className="h-4 w-4" />
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => updateFormData('seoKeywords', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="kablosuz kulaklık, bluetooth, ses kalitesi"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Virgülle ayırarak birden fazla anahtar kelime ekleyin
                  </p>
                </div>

                {/* URL Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    🔍 Arama Motoru Önizlemesi
                  </h4>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">
                      https://yourstore.com/products/{formData.slug || 'urun-adi'}
                    </div>
                    <div className="text-lg font-medium text-blue-600 mb-1 line-clamp-1">
                      {formData.seoTitle || formData.name || 'Ürün Başlığı'}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {formData.seoDescription || formData.description || 'Ürün açıklaması burada görünecek...'}
                    </div>
                  </div>
                </div>

                {/* SEO Tips */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                  <Info className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-900">
                    <p className="font-semibold mb-1">🎯 SEO İpuçları:</p>
                    <ul className="list-disc list-inside space-y-1 text-red-800">
                      <li>Başlıkta ana anahtar kelimenizi kullanın (50-60 karakter)</li>
                      <li>Açıklama ilgi çekici ve bilgilendirici olmalı (120-160 karakter)</li>
                      <li>Anahtar kelimeleri doğal bir şekilde kullanın</li>
                      <li>Her ürün için benzersiz başlık ve açıklama yazın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200 mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Önceki Adım
            </button>

            <div className="flex items-center space-x-3">
            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                  Sonraki Adım
                  <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                {isSubmitting ? (
                  <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                      <Save className="h-5 w-5 mr-2" />
                      Ürünü Yayınla
                  </>
                )}
              </button>
            )}
            </div>
            </div>
          </div>

          {/* Live Preview Panel - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
                <h3 className="text-white font-bold flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Canlı Önizleme
                </h3>
                <p className="text-purple-100 text-xs mt-1">
                  Ürününüz müşterilere nasıl görünecek?
                </p>
              </div>

              {/* Product Preview Card */}
              <div className="p-4 bg-gray-50">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {formData.images.length > 0 ? (
                      <img
                        src={formData.images[0].url}
                        alt={formData.images[0].alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col space-y-1">
                      {formData.shipping?.freeShipping && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-lg">
                          ÜCRETSİZ KARGO
                        </span>
                      )}
                      {formData.comparePrice && formData.comparePrice > formData.price && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded shadow-lg">
                          %{Math.round(((formData.comparePrice - formData.price) / formData.comparePrice) * 100)} İNDİRİM
                        </span>
                      )}
                    </div>

                    {/* Image Count */}
                    {formData.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                        +{formData.images.length - 1} fotoğraf
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    {/* Product Name */}
                    <h4 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {formData.name || 'Ürün Adı'}
                    </h4>

                    {/* Description */}
                    {formData.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {formData.description}
                      </p>
                    )}

                    {/* Categories & Tags */}
                    <div className="flex flex-wrap gap-1">
                      {formData.categories.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {cat}
                        </span>
                      ))}
                      {formData.tags.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₺{formData.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </span>
                      {formData.comparePrice && formData.comparePrice > formData.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₺{formData.comparePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${
                        formData.quantity > 10 ? 'text-green-600' : 
                        formData.quantity > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {formData.quantity > 0 ? `${formData.quantity} adet stokta` : 'Stokta yok'}
                      </span>
                      {formData.sku && (
                        <span className="text-gray-500 text-xs">
                          SKU: {formData.sku}
                        </span>
                      )}
                    </div>

                    {/* Variants Preview */}
                    {formData.variants.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        {formData.variants.map((variant, idx) => (
                          <div key={idx}>
                            <p className="text-xs font-semibold text-gray-700 mb-1">{variant.name}:</p>
                            <div className="flex flex-wrap gap-1 text-black">
                              
                              {variant.values.slice(0, 5).map((val, vIdx) => (
                                <button
                                  key={vIdx}
                                  className="px-2 py-1 border border-gray-300 text-xs rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                >
                                  {val}
                                </button>
                              ))}
                              {variant.values.length > 5 && (
                                <span className="px-2 py-1 text-xs text-gray-500">
                                  +{variant.values.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Warranty & Return */}
                    {(formData.warranty?.hasWarranty || formData.returnPolicy?.returnable) && (
                      <div className="flex items-center gap-3 pt-2 border-t text-xs">
                        {formData.warranty?.hasWarranty && (
                          <span className="flex items-center text-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            {formData.warranty.period || 'Garantili'}
                          </span>
                        )}
                        {formData.returnPolicy?.returnable && (
                          <span className="flex items-center text-blue-600">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            {formData.returnPolicy.returnPeriod} gün iade
                          </span>
                        )}
                      </div>
                    )}

                    {/* Add to Cart Button (Preview) */}
                    <button className="w-full mt-3 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
                      Sepete Ekle
                    </button>
                  </div>
                </div>

                {/* Preview Stats */}
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm space-y-2">
                  <h5 className="text-xs font-bold text-gray-700 uppercase mb-3">Doluluk Oranı</h5>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Temel Bilgiler</span>
                      <span className={`font-bold ${formData.name && formData.sku ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.name && formData.sku ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fiyat & Stok</span>
                      <span className={`font-bold ${formData.price > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.price > 0 ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Fotoğraflar</span>
                      <span className={`font-bold ${formData.images.length > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.images.length > 0 ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Açıklama</span>
                      <span className={`font-bold ${formData.content ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.content ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">SEO</span>
                      <span className={`font-bold ${formData.seoTitle && formData.seoDescription ? 'text-green-600' : 'text-orange-600'}`}>
                        {formData.seoTitle && formData.seoDescription ? '✓' : '○'}
                      </span>
                    </div>
                  </div>

                  {/* Overall Completion */}
                  <div className="pt-3 border-t mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700">Toplam Tamamlanma</span>
                      <span className="text-xs font-bold text-blue-600">
                        {Math.round((
                          (formData.name && formData.sku ? 20 : 0) +
                          (formData.price > 0 ? 20 : 0) +
                          (formData.images.length > 0 ? 20 : 0) +
                          (formData.content ? 20 : 0) +
                          (formData.seoTitle && formData.seoDescription ? 20 : 0)
                        ))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(
                            (formData.name && formData.sku ? 20 : 0) +
                            (formData.price > 0 ? 20 : 0) +
                            (formData.images.length > 0 ? 20 : 0) +
                            (formData.content ? 20 : 0) +
                            (formData.seoTitle && formData.seoDescription ? 20 : 0)
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

        {/* Image Selection Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Fotoğraf Seç</h3>
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Fotoğraf ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Images Grid */}
              <div className="max-h-96 overflow-y-auto mb-4">
                {isLoadingImages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {cloudinaryImages
                      .filter(image => 
                        image.alt.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((image) => (
                        <div
                          key={image.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImages.includes(image.url)
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleImageSelect(image.url)}
                        >
                          <img
                            src={image.thumbnail}
                            alt={image.alt}
                            className="w-full h-24 object-cover"
                          />
                          {selectedImages.includes(image.url) && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                            {image.alt}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={addSelectedImages}
                  disabled={selectedImages.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Seçilenleri Ekle ({selectedImages.length})
                </button>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
}
                       