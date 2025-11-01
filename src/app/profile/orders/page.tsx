'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '@/components/layout';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Eye,
  RefreshCw,
  Star
} from 'lucide-react';

export default function OrdersPage() {
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

  // Mock orders data
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250.00,
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 1200.00 },
        { name: 'Apple Watch Series 9', quantity: 1, price: 50.00 },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 850.00,
      items: [
        { name: 'Samsung Galaxy S24', quantity: 1, price: 800.00 },
        { name: 'Samsung Galaxy Buds', quantity: 1, price: 50.00 },
      ],
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'processing',
      total: 450.00,
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 450.00 },
      ],
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Beklemede',
          color: 'bg-yellow-100 text-yellow-800',
          icon: Package,
        };
      case 'processing':
        return {
          text: 'İşleniyor',
          color: 'bg-blue-100 text-blue-800',
          icon: RefreshCw,
        };
      case 'shipped':
        return {
          text: 'Kargoda',
          color: 'bg-purple-100 text-purple-800',
          icon: Truck,
        };
      case 'delivered':
        return {
          text: 'Teslim Edildi',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          text: 'İptal Edildi',
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
        };
      default:
        return {
          text: status,
          color: 'bg-gray-100 text-gray-800',
          icon: Package,
        };
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
            <p className="text-gray-600">Sipariş geçmişinizi görüntüleyin ve takip edin</p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h3>
                <p className="text-gray-500 mb-6">İlk siparişinizi vermek için ürünleri keşfedin</p>
                <a
                  href="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
                >
                  Alışverişe Başla
                </a>
              </div>
            ) : (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Sipariş #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-4 w-4 mr-2" />
                            {statusInfo.text}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-900">
                                {item.name} x {item.quantity}
                              </span>
                              <span className="text-gray-600">
                                ₺{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="text-lg font-semibold text-gray-900">
                            Toplam: ₺{order.total.toLocaleString()}
                          </div>
                          <div className="flex space-x-3">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              Detayları Gör
                            </button>
                            {order.status === 'delivered' && (
                              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                                <Star className="h-4 w-4 mr-1" />
                                Değerlendir
                              </button>
                            )}
                            {order.status === 'shipped' && (
                              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
                                <Truck className="h-4 w-4 mr-1" />
                                Kargo Takip
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
