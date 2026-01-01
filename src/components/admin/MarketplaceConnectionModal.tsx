'use client';

import { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  TestTube,
  Link,
  Settings,
  Info
} from 'lucide-react';
interface MarketplaceData {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  isActive: boolean;
  isConnected: boolean;
  lastSyncDate?: string | Date;
  syncStatus: 'SUCCESS' | 'ERROR' | 'PENDING' | 'DISABLED';
  errorCount: number;
  productCount: number;
  orderCount: number;
  totalSales: number;
  commissionRate: number;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  settings: {
    autoSync: boolean;
    syncInterval: number;
    priceMarkup: number;
    stockSync: boolean;
    orderSync: boolean;
    imageSync: boolean;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface MarketplaceConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketplace: MarketplaceData | null;
  onSave: (data: any) => void;
}

interface ConnectionFormData {
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  storeName: string;
  sellerId: string;
  priceMarkup: number;
  autoSync: boolean;
  syncInterval: number;
  stockSync: boolean;
  orderSync: boolean;
  imageSync: boolean;
}

export default function MarketplaceConnectionModal({
  isOpen,
  onClose,
  marketplace,
  onSave
}: MarketplaceConnectionModalProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'SUCCESS' | 'ERROR' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ConnectionFormData>({
    apiKey: marketplace?.apiKey || '',
    apiSecret: marketplace?.apiSecret || '',
    webhookUrl: marketplace?.webhookUrl || '',
    storeName: '',
    sellerId: '',
    priceMarkup: marketplace?.settings.priceMarkup || 15,
    autoSync: marketplace?.settings.autoSync || true,
    syncInterval: marketplace?.settings.syncInterval || 30,
    stockSync: marketplace?.settings.stockSync || true,
    orderSync: marketplace?.settings.orderSync || true,
    imageSync: marketplace?.settings.imageSync || true,
  });

  const handleInputChange = (field: keyof ConnectionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test result
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setTestResult('SUCCESS');
        setTestMessage('Bağlantı başarılı! API anahtarları geçerli.');
      } else {
        setTestResult('ERROR');
        setTestMessage('Bağlantı başarısız! Lütfen API anahtarlarını kontrol edin.');
      }
    } catch (error) {
      setTestResult('ERROR');
      setTestMessage('Test sırasında bir hata oluştu.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        marketplaceId: marketplace?.id
      });
      onClose();
    } catch (error) {
      console.error('Error saving marketplace connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !marketplace) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={marketplace.logo}
                alt={marketplace.name}
                className="h-10 w-10 object-contain"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {marketplace.name} Bağlantısı
                </h2>
                <p className="text-sm text-gray-600">
                  API ayarlarını yapılandırın
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Connection Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      Bağlantı Bilgileri
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      {marketplace.name} API anahtarlarınızı almak için{' '}
                      <a 
                        href={marketplace.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-800"
                      >
                        {marketplace.website}
                      </a>{' '}
                      adresindeki geliştirici panelini ziyaret edin.
                    </p>
                  </div>
                </div>
              </div>

              {/* API Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  API Yapılandırması
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={formData.apiKey}
                        onChange={(e) => handleInputChange('apiKey', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        placeholder="API anahtarınızı girin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Secret *
                    </label>
                    <div className="relative">
                      <input
                        type={showApiSecret ? 'text' : 'password'}
                        value={formData.apiSecret}
                        onChange={(e) => handleInputChange('apiSecret', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                        placeholder="API gizli anahtarınızı girin"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showApiSecret ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={formData.webhookUrl}
                      onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.kodmis.com/webhooks/marketplace"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Adı
                      </label>
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => handleInputChange('storeName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mağaza adınızı girin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Satıcı ID
                      </label>
                      <input
                        type="text"
                        value={formData.sellerId}
                        onChange={(e) => handleInputChange('sellerId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Satıcı ID'nizi girin"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Connection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bağlantı Testi
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleTestConnection}
                    disabled={!formData.apiKey || !formData.apiSecret || isTesting}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isTesting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4 mr-2" />
                    )}
                    {isTesting ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}
                  </button>

                  {testResult && (
                    <div className={`flex items-center space-x-2 ${
                      testResult === 'SUCCESS' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {testResult === 'SUCCESS' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">{testMessage}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sync Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Senkronizasyon Ayarları
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiyat Marjı (%)
                    </label>
                    <input
                      type="number"
                      value={formData.priceMarkup}
                      onChange={(e) => handleInputChange('priceMarkup', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senkronizasyon Aralığı (dakika)
                    </label>
                    <select
                      value={formData.syncInterval}
                      onChange={(e) => handleInputChange('syncInterval', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15">15 dakika</option>
                      <option value="30">30 dakika</option>
                      <option value="60">1 saat</option>
                      <option value="240">4 saat</option>
                      <option value="1440">24 saat</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="autoSync"
                        checked={formData.autoSync}
                        onChange={(e) => handleInputChange('autoSync', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoSync" className="text-sm font-medium text-gray-700">
                        Otomatik senkronizasyon
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="stockSync"
                        checked={formData.stockSync}
                        onChange={(e) => handleInputChange('stockSync', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="stockSync" className="text-sm font-medium text-gray-700">
                        Stok senkronizasyonu
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="orderSync"
                        checked={formData.orderSync}
                        onChange={(e) => handleInputChange('orderSync', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="orderSync" className="text-sm font-medium text-gray-700">
                        Sipariş senkronizasyonu
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="imageSync"
                        checked={formData.imageSync}
                        onChange={(e) => handleInputChange('imageSync', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="imageSync" className="text-sm font-medium text-gray-700">
                        Görsel senkronizasyonu
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.apiKey || !formData.apiSecret || isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Settings className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
