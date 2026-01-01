'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/layout';
import { useAlertContext } from '@/components/ui/alert';
import { Alert } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Loader2,
  Sparkles,
  Zap,
  Shield
} from 'lucide-react';

export default function AlertsDemoPage() {
  const alert = useAlertContext();
  const [showInlineAlert, setShowInlineAlert] = useState(true);

  return (
    <AdminLayout title="Alert Sistemi Demo" description="Modern alert bileşenleri ve kullanım örnekleri">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alert Sistemi</h1>
            <p className="mt-2 text-sm text-gray-600">
              Modern ve kullanıcı dostu alert bileşenleri
            </p>
          </div>

          {/* Inline Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Inline Alert Örnekleri</h2>
            <div className="space-y-4">
              <Alert
                type="success"
                title="Başarılı İşlem"
                message="Ürün başarıyla kaydedildi."
                closable
                onClose={() => setShowInlineAlert(false)}
              />
              
              <Alert
                type="error"
                title="Hata Oluştu"
                message="Ürün kaydedilirken bir hata oluştu. Lütfen tekrar deneyin."
                closable
                actions={[
                  { label: 'Tekrar Dene', onClick: () => alert.info('Tekrar deneniyor...'), variant: 'primary' },
                  { label: 'İptal', onClick: () => {}, variant: 'ghost' }
                ]}
              />
              
              <Alert
                type="warning"
                title="Uyarı"
                message="Stok seviyesi düşük. Lütfen stok takibini yapın."
                closable
                actions={[
                  { label: 'Stok Ekle', onClick: () => alert.success('Stok eklendi'), variant: 'primary' }
                ]}
              />
              
              <Alert
                type="info"
                title="Bilgi"
                message="Yeni özellikler eklendi. Detaylar için tıklayın."
                closable
                actions={[
                  { label: 'Detaylar', onClick: () => alert.info('Detaylar gösteriliyor...'), variant: 'primary' }
                ]}
              />
              
              <Alert
                type="loading"
                title="Yükleniyor"
                message="Veriler yükleniyor, lütfen bekleyin..."
                dismissible={false}
              />
            </div>
          </div>

          {/* Variant Examples */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Varyant Örnekleri</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Default Variant</h3>
                <Alert
                  type="success"
                  message="Varsayılan varyant - sol kenarda renkli çizgi"
                  variant="default"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filled Variant</h3>
                <Alert
                  type="success"
                  message="Dolu varyant - arka plan renkli"
                  variant="filled"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Outlined Variant</h3>
                <Alert
                  type="success"
                  message="Çerçeveli varyant - sadece kenarlık"
                  variant="outlined"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Minimal Variant</h3>
                <Alert
                  type="success"
                  message="Minimal varyant - açık arka plan"
                  variant="minimal"
                />
              </div>
            </div>
          </div>

          {/* Size Examples */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Boyut Örnekleri</h2>
            <div className="space-y-4">
              <Alert
                type="info"
                message="Küçük boyut (sm)"
                size="sm"
              />
              <Alert
                type="info"
                message="Orta boyut (md) - varsayılan"
                size="md"
              />
              <Alert
                type="info"
                message="Büyük boyut (lg)"
                size="lg"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Alert Göster Butonları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => alert.success('İşlem başarıyla tamamlandı!', {
                  title: 'Başarılı',
                  duration: 5000
                })}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Success Alert
              </button>

              <button
                onClick={() => alert.error('Bir hata oluştu!', {
                  title: 'Hata',
                  duration: 5000,
                  actions: [
                    { label: 'Tekrar Dene', onClick: () => alert.info('Tekrar deneniyor...'), variant: 'primary' }
                  ]
                })}
                className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Error Alert
              </button>

              <button
                onClick={() => alert.danger('Kritik hata!', {
                  title: 'Tehlike',
                  duration: 5000
                })}
                className="flex items-center justify-center px-4 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
              >
                <Shield className="h-5 w-5 mr-2" />
                Danger Alert
              </button>

              <button
                onClick={() => alert.warning('Dikkat! Stok seviyesi düşük.', {
                  title: 'Uyarı',
                  duration: 5000,
                  actions: [
                    { label: 'Stok Ekle', onClick: () => alert.success('Stok eklendi'), variant: 'primary' }
                  ]
                })}
                className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                Warning Alert
              </button>

              <button
                onClick={() => alert.info('Yeni özellikler mevcut!', {
                  title: 'Bilgi',
                  duration: 5000,
                  actions: [
                    { label: 'Detaylar', onClick: () => alert.info('Detaylar gösteriliyor...'), variant: 'primary' }
                  ]
                })}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Info className="h-5 w-5 mr-2" />
                Info Alert
              </button>

              <button
                onClick={() => {
                  const id = alert.loading('Veriler yükleniyor...', {
                    title: 'Yükleniyor'
                  });
                  setTimeout(() => {
                    alert.dismiss(id);
                    alert.success('Veriler başarıyla yüklendi!', {
                      title: 'Tamamlandı',
                      duration: 3000
                    });
                  }, 3000);
                }}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Loader2 className="h-5 w-5 mr-2" />
                Loading Alert
              </button>
            </div>
          </div>

          {/* Advanced Examples */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gelişmiş Örnekler</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  alert.success('Ürün başarıyla eklendi!', {
                    title: 'Başarılı',
                    duration: 5000,
                    actions: [
                      { label: 'Ürünü Görüntüle', onClick: () => alert.info('Ürün sayfasına yönlendiriliyor...'), variant: 'primary' },
                      { label: 'Yeni Ürün Ekle', onClick: () => alert.info('Yeni ürün formu açılıyor...'), variant: 'secondary' }
                    ]
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Çoklu Aksiyonlu Alert
              </button>

              <button
                onClick={() => {
                  alert.error('Ödeme işlemi başarısız oldu!', {
                    title: 'Ödeme Hatası',
                    duration: 0, // Otomatik kapanmaz
                    closable: true,
                    actions: [
                      { label: 'Tekrar Dene', onClick: () => alert.info('Ödeme tekrar deneniyor...'), variant: 'primary' },
                      { label: 'Destek Al', onClick: () => alert.info('Destek ekibine yönlendiriliyorsunuz...'), variant: 'secondary' }
                    ]
                  });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-4"
              >
                Kalıcı Alert (Otomatik Kapanmaz)
              </button>

              <button
                onClick={() => {
                  alert.dismissAll();
                  alert.success('Tüm alertler temizlendi!', {
                    duration: 2000
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 ml-4"
              >
                Tümünü Temizle
              </button>
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-gray-50 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Kullanım Örnekleri</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Basit Kullanım</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`import { useAlertContext } from '@/components/ui/alert';

const alert = useAlertContext();

// Başarı mesajı
alert.success('İşlem başarılı!');

// Hata mesajı
alert.error('Bir hata oluştu!');

// Uyarı mesajı
alert.warning('Dikkat!');

// Bilgi mesajı
alert.info('Bilgilendirme');

// Yükleme mesajı
const id = alert.loading('Yükleniyor...');
// İşlem tamamlandığında
alert.dismiss(id);
alert.success('Tamamlandı!');`}
                </pre>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Gelişmiş Kullanım</h3>
                <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// Başlık ve aksiyonlarla
alert.success('Ürün kaydedildi', {
  title: 'Başarılı',
  duration: 5000,
  actions: [
    { 
      label: 'Görüntüle', 
      onClick: () => router.push('/products'),
      variant: 'primary' 
    }
  ]
});

// Inline Alert kullanımı
<Alert
  type="warning"
  title="Uyarı"
  message="Stok seviyesi düşük"
  closable
  actions={[
    { label: 'Stok Ekle', onClick: handleAddStock }
  ]}
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
