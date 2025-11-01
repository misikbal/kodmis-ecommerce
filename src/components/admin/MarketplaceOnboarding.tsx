'use client';

import { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Target,
  Award,
  Sparkles,
  Play,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface MarketplaceOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  features: string[];
  actionText: string;
  isCompleted: boolean;
}

const availableMarketplaces = [
  {
    id: 'hepsiburada',
    name: 'Hepsiburada',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
    description: 'Türkiye\'nin en büyük e-ticaret platformu',
    features: ['12.5% komisyon', 'Hızlı onay', 'Geniş müşteri kitlesi'],
    isPopular: true,
    setupTime: '5 dakika'
  },
  {
    id: 'trendyol',
    name: 'Trendyol',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    description: 'Moda ve yaşam ürünlerinde lider',
    features: ['15% komisyon', 'Trend analizi', 'Kampanya desteği'],
    isPopular: true,
    setupTime: '10 dakika'
  },
  {
    id: 'n11',
    name: 'n11',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
    description: 'Güvenilir alışveriş deneyimi',
    features: ['10% komisyon', 'Kolay entegrasyon', '7/24 destek'],
    isPopular: false,
    setupTime: '5 dakika'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
    description: 'Global e-ticaret devi',
    features: ['8% komisyon', 'Uluslararası satış', 'FBA desteği'],
    isPopular: false,
    setupTime: '15 dakika'
  }
];

export default function MarketplaceOnboarding({ onComplete, onSkip }: MarketplaceOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Hoşgeldiniz! Pazar Yerlerinizi Bağlayın',
      description: 'Ürünlerinizi en popüler pazar yerlerine kolayca yükleyin ve satışlarınızı artırın.',
      icon: Sparkles,
      features: [
        'Tek tıkla ürün yükleme',
        'Otomatik stok senkronizasyonu',
        'Merkezi sipariş yönetimi',
        'Detaylı analitik raporlar'
      ],
      actionText: 'Başlayalım',
      isCompleted: false
    },
    {
      id: 'select',
      title: 'Pazar Yerlerinizi Seçin',
      description: 'Hangi pazar yerlerinde satış yapmak istediğinizi belirleyin.',
      icon: Target,
      features: [
        'En popüler platformlar',
        'Kolay kurulum süreci',
        'Ücretsiz deneme',
        'Uzman desteği'
      ],
      actionText: 'Devam Et',
      isCompleted: selectedMarketplaces.length > 0
    },
    {
      id: 'connect',
      title: 'Hesabınızı Bağlayın',
      description: 'Seçtiğiniz pazar yerlerinde hesabınızı bağlayın ve API anahtarlarınızı girin.',
      icon: Shield,
      features: [
        'Güvenli API bağlantısı',
        'Test bağlantısı',
        'Otomatik senkronizasyon',
        'Hata yönetimi'
      ],
      actionText: 'Bağlantıları Kur',
      isCompleted: false
    },
    {
      id: 'complete',
      title: 'Tebrikler! Kurulum Tamamlandı',
      description: 'Pazar yeri entegrasyonlarınız hazır. Artık ürünlerinizi yüklemeye başlayabilirsiniz.',
      icon: Award,
      features: [
        'Ürün yükleme rehberi',
        'Satış optimizasyonu ipuçları',
        '7/24 teknik destek',
        'Ücretsiz eğitim videoları'
      ],
      actionText: 'Dashboard\'a Git',
      isCompleted: false
    }
  ];

  const handleMarketplaceSelect = (marketplaceId: string) => {
    setSelectedMarketplaces(prev => {
      if (prev.includes(marketplaceId)) {
        return prev.filter(id => id !== marketplaceId);
      } else {
        return [...prev, marketplaceId];
      }
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsConnecting(false);
    handleNext();
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Kodmis E-ticaret</span>
          </div>
          
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Şimdi Değil
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`text-xs font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {step.title.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <StepIcon className="h-10 w-10 text-blue-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {currentStepData.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {currentStepData.description}
              </p>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {currentStep === 0 && (
                <div className="text-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {currentStepData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <div className="flex items-center justify-center space-x-6 text-sm text-blue-700">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>1M+ Mağaza</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>%300 Artış</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>%99.9 Uptime</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {availableMarketplaces.map((marketplace) => (
                      <div
                        key={marketplace.id}
                        className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedMarketplaces.includes(marketplace.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleMarketplaceSelect(marketplace.id)}
                      >
                        {marketplace.isPopular && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Popüler
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <img
                            src={marketplace.logo}
                            alt={marketplace.name}
                            className="h-12 w-12 object-contain rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {marketplace.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {marketplace.description}
                            </p>
                            
                            <div className="space-y-2">
                              {marketplace.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-gray-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {marketplace.setupTime} kurulum
                              </span>
                              
                              {selectedMarketplaces.includes(marketplace.id) && (
                                <CheckCircle className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedMarketplaces.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {selectedMarketplaces.length} pazar yeri seçildi
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Bağlantı Süreci
                    </h3>
                    <p className="text-gray-600">
                      Seçtiğiniz pazar yerlerinde hesabınızı bağlayacağız
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {selectedMarketplaces.map((marketplaceId) => {
                      const marketplace = availableMarketplaces.find(m => m.id === marketplaceId);
                      return (
                        <div key={marketplaceId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={marketplace?.logo}
                              alt={marketplace?.name}
                              className="h-8 w-8 object-contain"
                            />
                            <span className="font-medium text-gray-900">{marketplace?.name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            API bağlantısı kurulacak
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <Award className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {currentStepData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Sonraki Adımlar
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Ürünlerinizi yüklemeye başlamak için hazırsınız!
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2 text-blue-600">
                        <BookOpen className="h-4 w-4" />
                        <span>Rehberi Oku</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Play className="h-4 w-4" />
                        <span>Video İzle</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <HelpCircle className="h-4 w-4" />
                        <span>Destek Al</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Geri
                </button>
                
                <div className="flex items-center space-x-3">
                  {currentStep === 2 ? (
                    <button
                      onClick={handleConnect}
                      disabled={isConnecting || selectedMarketplaces.length === 0}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Bağlanıyor...
                        </>
                      ) : (
                        <>
                          {currentStepData.actionText}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === 1 && selectedMarketplaces.length === 0}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentStepData.actionText}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
