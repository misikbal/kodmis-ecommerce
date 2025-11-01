'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Info, 
  X, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  BookOpen, 
  MessageSquare, 
  Clock,
  Zap,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SyncError {
  id: string;
  marketplaceId: string;
  marketplaceName: string;
  type: 'API_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'AUTHENTICATION_ERROR' | 'RATE_LIMIT_ERROR';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details: string;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
  suggestions: string[];
  documentation?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'IGNORED';
}

interface ErrorHandlingComponentsProps {
  errors?: SyncError[];
  onRetry: (errorId: string) => void;
  onIgnore: (errorId: string) => void;
  onResolve: (errorId: string) => void;
}

export function SyncErrorAlert({ error, onRetry, onIgnore, onResolve }: {
  error: SyncError;
  onRetry: (errorId: string) => void;
  onIgnore: (errorId: string) => void;
  onResolve: (errorId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const getErrorIcon = (type: string) => {
    switch (type) {
      case 'API_ERROR': return <XCircle className="h-5 w-5" />;
      case 'VALIDATION_ERROR': return <AlertTriangle className="h-5 w-5" />;
      case 'NETWORK_ERROR': return <RefreshCw className="h-5 w-5" />;
      case 'AUTHENTICATION_ERROR': return <Shield className="h-5 w-5" />;
      case 'RATE_LIMIT_ERROR': return <Clock className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-50 border-red-200 text-red-800';
      case 'HIGH': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'LOW': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'Kritik';
      case 'HIGH': return 'Yüksek';
      case 'MEDIUM': return 'Orta';
      case 'LOW': return 'Düşük';
      default: return severity;
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry(error.id);
    setIsRetrying(false);
  };

  const handleCopyError = () => {
    const errorText = `Hata: ${error.message}\nDetay: ${error.details}\nPazar Yeri: ${error.marketplaceName}\nTarih: ${new Date(error.timestamp).toLocaleString('tr-TR')}`;
    navigator.clipboard.writeText(errorText);
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor(error.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getErrorIcon(error.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium">{error.message}</h4>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                error.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                error.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                error.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {getSeverityText(error.severity)}
              </span>
            </div>
            
            <div className="text-sm opacity-90 mb-3">
              <p><strong>Pazar Yeri:</strong> {error.marketplaceName}</p>
              <p><strong>Tarih:</strong> {new Date(error.timestamp).toLocaleString('tr-TR')}</p>
              <p><strong>Tekrar Deneme:</strong> {error.retryCount}/{error.maxRetries}</p>
            </div>

            {error.suggestions.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center text-sm font-medium hover:underline"
                >
                  Çözüm Önerileri
                  {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                </button>
                
                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {error.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying || error.retryCount >= error.maxRetries}
                className="flex items-center px-3 py-1 text-sm border border-current rounded hover:bg-white hover:bg-opacity-20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                ) : (
                  <RefreshCw className="h-3 w-3 mr-2" />
                )}
                Tekrar Dene
              </button>
              
              <button
                onClick={handleCopyError}
                className="flex items-center px-3 py-1 text-sm border border-current rounded hover:bg-white hover:bg-opacity-20"
              >
                <Copy className="h-3 w-3 mr-2" />
                Kopyala
              </button>
              
              {error.documentation && (
                <a
                  href={error.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-1 text-sm border border-current rounded hover:bg-white hover:bg-opacity-20"
                >
                  <BookOpen className="h-3 w-3 mr-2" />
                  Dokümantasyon
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onIgnore(error.id)}
            className="text-current hover:bg-white hover:bg-opacity-20 p-1 rounded"
            title="Yoksay"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={() => onResolve(error.id)}
            className="text-current hover:bg-white hover:bg-opacity-20 p-1 rounded"
            title="Çözüldü Olarak İşaretle"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ErrorSummary({ errors }: { errors: SyncError[] }) {
  const errorStats = {
    total: errors.length,
    critical: errors.filter(e => e.severity === 'CRITICAL').length,
    high: errors.filter(e => e.severity === 'HIGH').length,
    medium: errors.filter(e => e.severity === 'MEDIUM').length,
    low: errors.filter(e => e.severity === 'LOW').length,
    resolved: errors.filter(e => e.status === 'RESOLVED').length,
    active: errors.filter(e => e.status === 'ACTIVE').length
  };

  const errorTypes = errors.reduce((acc, error) => {
    acc[error.type] = (acc[error.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hata Özeti</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{errorStats.total}</div>
          <div className="text-sm text-gray-600">Toplam Hata</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{errorStats.critical}</div>
          <div className="text-sm text-gray-600">Kritik</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{errorStats.high}</div>
          <div className="text-sm text-gray-600">Yüksek</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{errorStats.resolved}</div>
          <div className="text-sm text-gray-600">Çözüldü</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hata Türleri</h4>
          <div className="space-y-2">
            {Object.entries(errorTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorResolutionGuide() {
  const [selectedErrorType, setSelectedErrorType] = useState<string>('');

  const resolutionGuides = {
    API_ERROR: {
      title: 'API Hatası',
      description: 'Pazar yeri API\'sinde bir hata oluştu',
      steps: [
        'API anahtarlarınızı kontrol edin',
        'API limitlerinizi kontrol edin',
        'Pazar yeri API durumunu kontrol edin',
        'Destek ekibiyle iletişime geçin'
      ]
    },
    VALIDATION_ERROR: {
      title: 'Doğrulama Hatası',
      description: 'Gönderilen veri formatında hata var',
      steps: [
        'Ürün verilerini kontrol edin',
        'Gerekli alanların doldurulduğundan emin olun',
        'Veri formatını kontrol edin',
        'Kategori eşlemesini kontrol edin'
      ]
    },
    NETWORK_ERROR: {
      title: 'Ağ Hatası',
      description: 'İnternet bağlantısında sorun var',
      steps: [
        'İnternet bağlantınızı kontrol edin',
        'Firewall ayarlarını kontrol edin',
        'Proxy ayarlarını kontrol edin',
        'Tekrar deneyin'
      ]
    },
    AUTHENTICATION_ERROR: {
      title: 'Kimlik Doğrulama Hatası',
      description: 'API kimlik bilgileri geçersiz',
      steps: [
        'API anahtarınızı yenileyin',
        'API secret\'ınızı kontrol edin',
        'Hesap durumunuzu kontrol edin',
        'Pazar yeri hesabınızı aktifleştirin'
      ]
    },
    RATE_LIMIT_ERROR: {
      title: 'Rate Limit Hatası',
      description: 'API çağrı limiti aşıldı',
      steps: [
        'İsteklerinizi azaltın',
        'Bekleme süresi ekleyin',
        'Senkronizasyon aralığını artırın',
        'Toplu işlemleri bölün'
      ]
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hata Çözüm Rehberi</h3>
      
      <div className="mb-4">
        <select
          value={selectedErrorType}
          onChange={(e) => setSelectedErrorType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Hata türü seçin</option>
          {Object.entries(resolutionGuides).map(([type, guide]) => (
            <option key={type} value={type}>{guide.title}</option>
          ))}
        </select>
      </div>

      {selectedErrorType && resolutionGuides[selectedErrorType as keyof typeof resolutionGuides] && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">
            {resolutionGuides[selectedErrorType as keyof typeof resolutionGuides].title}
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            {resolutionGuides[selectedErrorType as keyof typeof resolutionGuides].description}
          </p>
          
          <div className="space-y-2">
            {resolutionGuides[selectedErrorType as keyof typeof resolutionGuides].steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Yardıma mı ihtiyacınız var?</h4>
            <p className="text-sm text-blue-700 mt-1">
              Sorununuz devam ederse, destek ekibimizle iletişime geçin.
            </p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Destek Talebi Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorHandlingComponents({
  errors = [],
  onRetry,
  onIgnore,
  onResolve
}: ErrorHandlingComponentsProps) {
  const [activeErrors, setActiveErrors] = useState<SyncError[]>(errors.filter(e => e.status === 'ACTIVE'));
  const [showResolved, setShowResolved] = useState(false);

  // Mock data for demonstration
  const mockErrors: SyncError[] = [
    {
      id: '1',
      marketplaceId: '1',
      marketplaceName: 'Hepsiburada',
      type: 'API_ERROR',
      severity: 'HIGH',
      message: 'API bağlantısı kurulamadı',
      details: 'HTTP 500 hatası alındı. Sunucu yanıt vermiyor.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      retryCount: 2,
      maxRetries: 3,
      suggestions: [
        'API anahtarlarınızı kontrol edin',
        'Hepsiburada API durumunu kontrol edin',
        'Tekrar deneyin'
      ],
      documentation: 'https://docs.hepsiburada.com/api',
      status: 'ACTIVE'
    },
    {
      id: '2',
      marketplaceId: '2',
      marketplaceName: 'Trendyol',
      type: 'VALIDATION_ERROR',
      severity: 'MEDIUM',
      message: 'Ürün kategorisi eşlemesi bulunamadı',
      details: 'iPhone 15 Pro Max ürünü için Trendyol kategorisi eşlemesi eksik.',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      retryCount: 1,
      maxRetries: 3,
      suggestions: [
        'Kategori eşlemesini kontrol edin',
        'Trendyol kategori listesini güncelleyin',
        'Ürün kategorisini manuel olarak ayarlayın'
      ],
      documentation: 'https://docs.trendyol.com/categories',
      status: 'ACTIVE'
    },
    {
      id: '3',
      marketplaceId: '3',
      marketplaceName: 'n11',
      type: 'RATE_LIMIT_ERROR',
      severity: 'LOW',
      message: 'API çağrı limiti aşıldı',
      details: 'Dakikada 100 istek limiti aşıldı. 60 saniye bekleyin.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      retryCount: 0,
      maxRetries: 3,
      suggestions: [
        'Senkronizasyon aralığını artırın',
        'Toplu işlemleri bölün',
        'Otomatik retry özelliğini kullanın'
      ],
      documentation: 'https://docs.n11.com/rate-limits',
      status: 'ACTIVE'
    }
  ];

  const allErrors = [...activeErrors, ...mockErrors];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Hata Yönetimi</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {showResolved ? 'Çözülenleri Gizle' : 'Çözülenleri Göster'}
          </button>
          <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Toplu Çöz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {allErrors.map((error) => (
            <SyncErrorAlert
              key={error.id}
              error={error}
              onRetry={onRetry}
              onIgnore={onIgnore}
              onResolve={onResolve}
            />
          ))}
          
          {allErrors.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tüm Hatalar Çözüldü!</h3>
              <p className="text-gray-600">Şu anda aktif bir hata bulunmuyor.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ErrorSummary errors={allErrors} />
          <ErrorResolutionGuide />
        </div>
      </div>
    </div>
  );
}
