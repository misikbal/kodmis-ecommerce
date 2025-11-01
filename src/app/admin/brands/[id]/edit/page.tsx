'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout';
import {
  Store,
  ArrowLeft,
  Plus,
  Upload,
  Save,
  X,
  Globe,
  MapPin,
  Calendar,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logo: string;
  bannerImage: string;
  website: string;
  isActive: boolean;
  country: string;
  foundedYear: number | '';
  sortOrder: number | '';
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export default function EditBrand() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    description: '',
    logo: '',
    bannerImage: '',
    website: '',
    isActive: true,
    country: '',
    foundedYear: '',
    sortOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/brands/${brandId}`);
      if (response.ok) {
        const brand = await response.json();
        
        setFormData({
          name: brand.name || '',
          slug: brand.slug || '',
          description: brand.description || '',
          logo: brand.logo || '',
          bannerImage: brand.bannerImage || '',
          website: brand.website || '',
          isActive: brand.isActive !== undefined ? brand.isActive : true,
          country: brand.country || '',
          foundedYear: brand.foundedYear || '',
          sortOrder: brand.sortOrder || 0,
          seoTitle: brand.seoTitle || '',
          seoDescription: brand.seoDescription || '',
          seoKeywords: brand.seoKeywords || '',
          socialLinks: brand.socialLinks || {
            facebook: '',
            instagram: '',
            twitter: ''
          }
        });
      } else {
        router.push('/admin/brands');
      }
    } catch (error) {
      console.error('Marka yükleme hatası:', error);
      router.push('/admin/brands');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSocialLink = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Marka adı gereklidir';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug gereklidir';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/brands');
      } else {
        const error = await response.json();
        alert(error.error || 'Marka güncellenemedi');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (field: 'logo' | 'bannerImage', event: React.ChangeEvent<HTMLInputElement>) => {
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
        updateFormData(field, data.url);
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
    }
  };

  if (status === 'loading' || isLoading) {
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
    <AdminLayout title="Marka Düzenle" description="Marka bilgilerini güncelleyin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href="/admin/brands"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Store className="h-6 w-6 mr-3 text-orange-600" />
                Marka Düzenle
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Marka bilgilerini güncelleyin
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Temel Bilgiler */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Marka Adı */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marka Adı *
                    {errors.name && <AlertCircle className="h-4 w-4 ml-2 text-red-500 inline" />}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="Örn: Apple, Samsung"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Slug */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Slug *
                    {errors.slug && <AlertCircle className="h-4 w-4 ml-2 text-red-500 inline" />}
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => updateFormData('slug', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all ${
                      errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="brand-slug"
                    required
                  />
                  {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                </div>

                {/* Açıklama */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="Marka hakkında bilgi..."
                  />
                </div>

                {/* Ülke */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Ülke
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="Örn: Türkiye"
                  />
                </div>

                {/* Kuruluş Yılı */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Kuruluş Yılı
                  </label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => updateFormData('foundedYear', e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="2020"
                  />
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://www.example.com"
                  />
                </div>

                {/* Durum */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.isActive.toString()}
                    onChange={(e) => updateFormData('isActive', e.target.value === 'true')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>

                {/* Sıralama */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => updateFormData('sortOrder', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Görseller */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Görseller</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marka Logosu
                  </label>
                  <div className="space-y-3">
                    {formData.logo ? (
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Store className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.logo ? 'Logo Değiştir' : 'Logo Yükle'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('logo', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Banner */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Görseli
                  </label>
                  <div className="space-y-3">
                    {formData.bannerImage ? (
                      <img
                        src={formData.bannerImage}
                        alt="Banner"
                        className="w-full h-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {formData.bannerImage ? 'Banner Değiştir' : 'Banner Yükle'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('bannerImage', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Facebook className="h-4 w-4 inline mr-2 text-blue-600" />
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://facebook.com/brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Instagram className="h-4 w-4 inline mr-2 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://instagram.com/brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Twitter className="h-4 w-4 inline mr-2 text-blue-400" />
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="https://twitter.com/brand"
                  />
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SEO Başlığı
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => updateFormData('seoTitle', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="SEO optimized title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meta Açıklama
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => updateFormData('seoDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all resize-none"
                    placeholder="SEO description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anahtar Kelimeler
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => updateFormData('seoKeywords', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/admin/brands"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Markayı Güncelle
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
