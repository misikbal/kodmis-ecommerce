'use client';

import { useState, useEffect } from 'react';
import { X, Save, Upload, Plus, Trash2 } from 'lucide-react';

interface CRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'product' | 'category' | 'feature' | 'brand';
  data?: any;
  onSave: (data: any) => Promise<void>;
  categories?: Array<{ _id: string; name: string }>;
  brands?: Array<{ _id: string; name: string }>;
}

export default function CRUDModal({
  isOpen,
  onClose,
  title,
  type,
  data,
  onSave,
  categories = [],
  brands = []
}: CRUDModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [featureOptions, setFeatureOptions] = useState<Array<{ label: string; value: string; color?: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      if (data) {
        setFormData(data);
        if (data.options) {
          setFeatureOptions(data.options);
        }
      } else {
        // Reset form for new item
        setFormData({
          name: '',
          description: '',
          isActive: true,
          ...(type === 'product' && {
            price: 0,
            quantity: 0,
            status: 'DRAFT',
            type: 'PHYSICAL',
            trackQuantity: true,
            lowStockAlert: 5,
            isFeatured: false,
            isBestseller: false,
            isNew: false,
          }),
          ...(type === 'feature' && {
            type: 'TEXT',
            isRequired: false,
            isFilterable: true,
            isSearchable: false,
          }),
        });
        setFeatureOptions([]);
      }
      setImages([]);
    }
  }, [isOpen, data, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        ...(type === 'feature' && { options: featureOptions }),
      };
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeatureOption = () => {
    setFeatureOptions(prev => [...prev, { label: '', value: '', color: '' }]);
  };

  const removeFeatureOption = (index: number) => {
    setFeatureOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeatureOption = (index: number, field: string, value: string) => {
    setFeatureOptions(prev => prev.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Specific Fields */}
          {type === 'product' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Karşılaştırma Fiyatı
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.comparePrice || ''}
                    onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.quantity || 0}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => handleInputChange('categoryId', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka
                  </label>
                  <select
                    value={formData.brandId || ''}
                    onChange={(e) => handleInputChange('brandId', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Marka Seçin</option>
                    {brands.map(brand => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={formData.status || 'DRAFT'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Pasif</option>
                  <option value="ARCHIVED">Arşivlendi</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Öne Çıkan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller || false}
                    onChange={(e) => handleInputChange('isBestseller', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Çok Satan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) => handleInputChange('isNew', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Yeni</span>
                </label>
              </div>
            </>
          )}

          {/* Feature Specific Fields */}
          {type === 'feature' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tür
                </label>
                <select
                  value={formData.type || 'TEXT'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TEXT">Metin</option>
                  <option value="NUMBER">Sayı</option>
                  <option value="COLOR">Renk</option>
                  <option value="DROPDOWN">Açılır Liste</option>
                  <option value="CHECKBOX">Onay Kutusu</option>
                  <option value="RADIO">Seçenek</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isRequired || false}
                    onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Zorunlu</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFilterable !== false}
                    onChange={(e) => handleInputChange('isFilterable', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Filtrelenebilir</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isSearchable || false}
                    onChange={(e) => handleInputChange('isSearchable', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Aranabilir</span>
                </label>
              </div>

              {(formData.type === 'DROPDOWN' || formData.type === 'RADIO' || formData.type === 'COLOR') && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Seçenekler
                    </label>
                    <button
                      type="button"
                      onClick={addFeatureOption}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Seçenek Ekle
                    </button>
                  </div>
                  {featureOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Etiket"
                        value={option.label}
                        onChange={(e) => updateFeatureOption(index, 'label', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Değer"
                        value={option.value}
                        onChange={(e) => updateFeatureOption(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.type === 'COLOR' && (
                        <input
                          type="color"
                          value={option.color || '#000000'}
                          onChange={(e) => updateFeatureOption(index, 'color', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-md"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFeatureOption(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Brand Specific Fields */}
          {type === 'brand' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* Common Fields */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive !== false}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Aktif</span>
            </label>
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Ayarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Başlık
                </label>
                <input
                  type="text"
                  value={formData.seoTitle || ''}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  value={formData.seoDescription || ''}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Anahtar Kelimeler
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords || ''}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="kelime1, kelime2, kelime3"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
