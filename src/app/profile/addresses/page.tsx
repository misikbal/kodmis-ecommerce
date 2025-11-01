'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  Home,
  Building
} from 'lucide-react';

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      title: 'Ev Adresi',
      name: 'Ahmet Yılmaz',
      address: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123',
      city: 'İstanbul',
      district: 'Kadıköy',
      zipCode: '34710',
      phone: '+90 555 123 45 67',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      title: 'İş Adresi',
      name: 'Ahmet Yılmaz',
      address: 'Levent Mahallesi, Büyükdere Caddesi No: 456',
      city: 'İstanbul',
      district: 'Beşiktaş',
      zipCode: '34330',
      phone: '+90 555 987 65 43',
      isDefault: false,
    },
  ]);

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

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return Home;
      case 'work':
        return Building;
      default:
        return MapPin;
    }
  };

  const getAddressTypeText = (type: string) => {
    switch (type) {
      case 'home':
        return 'Ev';
      case 'work':
        return 'İş';
      default:
        return 'Diğer';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
              <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Yeni Adres Ekle
            </button>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => {
              const TypeIcon = getAddressTypeIcon(address.type);
              
              return (
                <div key={address.id} className="bg-white rounded-lg shadow p-6 relative">
                  {address.isDefault && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Varsayılan
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{address.title}</h3>
                      <p className="text-sm text-gray-500">{getAddressTypeText(address.type)}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-900 font-medium">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">
                      {address.district}, {address.city} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>

                  <div className="flex space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Varsayılan Yap
                      </button>
                    )}
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Address Card */}
            <div className="bg-white rounded-lg shadow border-2 border-dashed border-gray-300 p-6 flex items-center justify-center hover:border-blue-400 transition-colors cursor-pointer">
              <div className="text-center">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Yeni Adres Ekle</h3>
                <p className="text-sm text-gray-500">Teslimat adresinizi ekleyin</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {addresses.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz adres eklenmemiş</h3>
              <p className="text-gray-500 mb-6">İlk adresinizi ekleyerek alışverişe başlayın</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Adres Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
