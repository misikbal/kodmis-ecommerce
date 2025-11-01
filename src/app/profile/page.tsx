'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  CreditCard,
  Heart,
  Bell,
  Shield
} from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null;
  }

  const profileSections = [
    {
      title: 'Hesap Bilgileri',
      description: 'Kişisel bilgilerinizi yönetin',
      icon: User,
      href: '/profile/account',
      color: 'bg-blue-500',
    },
    {
      title: 'Siparişlerim',
      description: 'Sipariş geçmişinizi görüntüleyin',
      icon: Package,
      href: '/profile/orders',
      color: 'bg-green-500',
    },
    {
      title: 'Adreslerim',
      description: 'Teslimat adreslerinizi yönetin',
      icon: MapPin,
      href: '/profile/addresses',
      color: 'bg-purple-500',
    },
    {
      title: 'Ödeme Yöntemleri',
      description: 'Kart ve ödeme bilgileriniz',
      icon: CreditCard,
      href: '/profile/payment',
      color: 'bg-yellow-500',
    },
    {
      title: 'Favorilerim',
      description: 'Beğendiğiniz ürünler',
      icon: Heart,
      href: '/profile/wishlist',
      color: 'bg-red-500',
    },
    {
      title: 'Bildirimler',
      description: 'Bildirim tercihleriniz',
      icon: Bell,
      href: '/profile/notifications',
      color: 'bg-indigo-500',
    },
    {
      title: 'Güvenlik',
      description: 'Şifre ve güvenlik ayarları',
      icon: Shield,
      href: '/profile/security',
      color: 'bg-gray-500',
    },
    {
      title: 'Ayarlar',
      description: 'Genel hesap ayarları',
      icon: Settings,
      href: '/profile/settings',
      color: 'bg-orange-500',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.user?.name}</h1>
                <p className="text-gray-600">{session.user?.email}</p>
                <div className="flex items-center mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {session.user?.role === 'admin' ? 'Admin' : 'Müşteri'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profileSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <a
                  key={index}
                  href={section.href}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${section.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hesap Özeti</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Toplam Sipariş</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₺0</div>
                <div className="text-sm text-gray-600">Toplam Harcama</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-600">Favori Ürün</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Kupon Kullanımı</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
