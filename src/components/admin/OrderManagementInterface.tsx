'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Truck,
  Receipt,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Printer,
  FileText,
  CreditCard,
  X
} from 'lucide-react';

interface MarketplaceProduct {
  id: string;
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl: string;
}

interface MarketplaceAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface MarketplaceOrder {
  id: string;
  marketplaceId: string;
  marketplaceName: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  products: MarketplaceProduct[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: MarketplaceAddress;
  billingAddress: MarketplaceAddress;
  createdAt: string;
  updatedAt: string;
}

interface OrderManagementInterfaceProps {
  marketplaceId?: string;
  marketplaceName?: string;
}

export default function OrderManagementInterface({
  marketplaceId,
  marketplaceName
}: OrderManagementInterfaceProps) {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [marketplaceId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockOrders: MarketplaceOrder[] = [
        {
          id: '1',
          marketplaceId: '1',
          marketplaceName: 'Hepsiburada',
          orderNumber: 'HB123456789',
          customerName: 'Ahmet Yılmaz',
          customerEmail: 'ahmet@example.com',
          products: [
            {
              id: '1',
              productId: 'prod1',
              name: 'iPhone 15 Pro Max',
              sku: 'IPH15PM-256',
              quantity: 1,
              price: 45999,
              totalPrice: 45999,
              imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop'
            }
          ],
          totalAmount: 45999,
          status: 'CONFIRMED',
          shippingAddress: {
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            address1: 'Atatürk Mahallesi',
            address2: 'No: 15',
            city: 'İstanbul',
            state: 'İstanbul',
            postalCode: '34000',
            country: 'Türkiye',
            phone: '+90 555 123 4567'
          },
          billingAddress: {
            firstName: 'Ahmet',
            lastName: 'Yılmaz',
            address1: 'Atatürk Mahallesi',
            address2: 'No: 15',
            city: 'İstanbul',
            state: 'İstanbul',
            postalCode: '34000',
            country: 'Türkiye',
            phone: '+90 555 123 4567'
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          marketplaceId: '2',
          marketplaceName: 'Trendyol',
          orderNumber: 'TY987654321',
          customerName: 'Ayşe Demir',
          customerEmail: 'ayse@example.com',
          products: [
            {
              id: '2',
              productId: 'prod2',
              name: 'Samsung Galaxy S24 Ultra',
              sku: 'SGS24U-512',
              quantity: 1,
              price: 38999,
              totalPrice: 38999,
              imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop'
            },
            {
              id: '3',
              productId: 'prod3',
              name: 'Nike Air Max 270',
              sku: 'NAM270-BLK',
              quantity: 2,
              price: 3299,
              totalPrice: 6598,
              imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
            }
          ],
          totalAmount: 45597,
          status: 'SHIPPED',
          shippingAddress: {
            firstName: 'Ayşe',
            lastName: 'Demir',
            address1: 'Cumhuriyet Caddesi',
            address2: 'No: 42',
            city: 'Ankara',
            state: 'Ankara',
            postalCode: '06000',
            country: 'Türkiye',
            phone: '+90 555 987 6543'
          },
          billingAddress: {
            firstName: 'Ayşe',
            lastName: 'Demir',
            address1: 'Cumhuriyet Caddesi',
            address2: 'No: 42',
            city: 'Ankara',
            state: 'Ankara',
            postalCode: '06000',
            country: 'Türkiye',
            phone: '+90 555 987 6543'
          },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          marketplaceId: '3',
          marketplaceName: 'n11',
          orderNumber: 'N114567890',
          customerName: 'Mehmet Kaya',
          customerEmail: 'mehmet@example.com',
          products: [
            {
              id: '4',
              productId: 'prod4',
              name: 'MacBook Pro M3',
              sku: 'MBPM3-14',
              quantity: 1,
              price: 52999,
              totalPrice: 52999,
              imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
            }
          ],
          totalAmount: 52999,
          status: 'PENDING',
          shippingAddress: {
            firstName: 'Mehmet',
            lastName: 'Kaya',
            address1: 'İstiklal Caddesi',
            address2: 'No: 78',
            city: 'İzmir',
            state: 'İzmir',
            postalCode: '35000',
            country: 'Türkiye',
            phone: '+90 555 456 7890'
          },
          billingAddress: {
            firstName: 'Mehmet',
            lastName: 'Kaya',
            address1: 'İstiklal Caddesi',
            address2: 'No: 78',
            city: 'İzmir',
            state: 'İzmir',
            postalCode: '35000',
            country: 'Türkiye',
            phone: '+90 555 456 7890'
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          marketplaceId: '1',
          marketplaceName: 'Hepsiburada',
          orderNumber: 'HB555666777',
          customerName: 'Fatma Özkan',
          customerEmail: 'fatma@example.com',
          products: [
            {
              id: '5',
              productId: 'prod5',
              name: 'Adidas Ultraboost 22',
              sku: 'AUB22-WHT',
              quantity: 1,
              price: 2899,
              totalPrice: 2899,
              imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop'
            }
          ],
          totalAmount: 2899,
          status: 'DELIVERED',
          shippingAddress: {
            firstName: 'Fatma',
            lastName: 'Özkan',
            address1: 'Barış Mahallesi',
            address2: 'No: 123',
            city: 'Bursa',
            state: 'Bursa',
            postalCode: '16000',
            country: 'Türkiye',
            phone: '+90 555 321 0987'
          },
          billingAddress: {
            firstName: 'Fatma',
            lastName: 'Özkan',
            address1: 'Barış Mahallesi',
            address2: 'No: 123',
            city: 'Bursa',
            state: 'Bursa',
            postalCode: '16000',
            country: 'Türkiye',
            phone: '+90 555 321 0987'
          },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'SHIPPED': return <Truck className="h-4 w-4 text-purple-600" />;
      case 'DELIVERED': return <Package className="h-4 w-4 text-green-600" />;
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'RETURNED': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Onaylandı';
      case 'SHIPPED': return 'Kargoya Verildi';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'PENDING': return 'Beklemede';
      case 'CANCELLED': return 'İptal Edildi';
      case 'RETURNED': return 'İade Edildi';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RETURNED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order: MarketplaceOrder) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCreateInvoice = (orderId: string) => {
    // Implement invoice creation
    console.log('Creating invoice for order:', orderId);
  };

  const handleShipOrder = (orderId: string) => {
    // Implement shipping
    console.log('Shipping order:', orderId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesMarketplace = marketplaceFilter === 'ALL' || order.marketplaceId === marketplaceFilter;
    
    const matchesDate = (() => {
      if (dateFilter === 'ALL') return true;
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'TODAY': return diffDays === 0;
        case 'WEEK': return diffDays <= 7;
        case 'MONTH': return diffDays <= 30;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesMarketplace && matchesDate;
  });

  const uniqueMarketplaces = Array.from(new Set(orders.map(order => order.marketplaceId)))
    .map(id => orders.find(order => order.marketplaceId === id))
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Sipariş Yönetimi
            {marketplaceName && ` - ${marketplaceName}`}
          </h3>
          <p className="text-sm text-gray-600">
            Pazar yerlerinden gelen siparişleri yönetin
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="SHIPPED">Kargoya Verildi</option>
              <option value="DELIVERED">Teslim Edildi</option>
              <option value="CANCELLED">İptal Edildi</option>
              <option value="RETURNED">İade Edildi</option>
            </select>

            <select
              value={marketplaceFilter}
              onChange={(e) => setMarketplaceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tüm Pazar Yerleri</option>
              {uniqueMarketplaces.map((order) => (
                <option key={order!.marketplaceId} value={order!.marketplaceId}>
                  {order!.marketplaceName}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Tüm Tarihler</option>
              <option value="TODAY">Bugün</option>
              <option value="WEEK">Bu Hafta</option>
              <option value="MONTH">Bu Ay</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pazar Yeri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürünler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {order.marketplaceName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {order.products.slice(0, 2).map((product: MarketplaceProduct, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-8 w-8 object-cover rounded"
                          />
                          <span className="text-sm text-gray-900">
                            {product.name} x{product.quantity}
                          </span>
                        </div>
                      ))}
                      {order.products.length > 2 && (
                        <span className="text-sm text-gray-500">
                          +{order.products.length - 2} daha
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div className="text-xs">{new Date(order.createdAt).toLocaleTimeString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleShipOrder(order.id)}
                          className="text-purple-600 hover:text-purple-700"
                          title="Kargoya Ver"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCreateInvoice(order.id)}
                        className="text-green-600 hover:text-green-700"
                        title="Fatura Oluştur"
                      >
                        <Receipt className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowOrderDetail(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Sipariş Detayı - {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Müşteri Bilgileri</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-900">{selectedOrder.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Sipariş Durumu</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Durum:</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pazar Yeri:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedOrder.marketplaceName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Toplam Tutar:</span>
                    <span className="text-sm font-medium text-gray-900">₺{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sipariş Tarihi:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="lg:col-span-2">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Ürünler</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    {selectedOrder.products.map((product: MarketplaceProduct) => (
                      <div key={product.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Adet: {product.quantity}</p>
                          <p className="font-medium text-gray-900">₺{product.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Teslimat Adresi</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                      <p>{selectedOrder.shippingAddress.address1}</p>
                      {selectedOrder.shippingAddress.address2 && <p>{selectedOrder.shippingAddress.address2}</p>}
                      <p>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
                      <p>{selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Fatura Adresi</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Receipt className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      <p className="font-medium">{selectedOrder.billingAddress.firstName} {selectedOrder.billingAddress.lastName}</p>
                      <p>{selectedOrder.billingAddress.address1}</p>
                      {selectedOrder.billingAddress.address2 && <p>{selectedOrder.billingAddress.address2}</p>}
                      <p>{selectedOrder.billingAddress.postalCode} {selectedOrder.billingAddress.city}</p>
                      <p>{selectedOrder.billingAddress.state}, {selectedOrder.billingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Printer className="h-4 w-4 mr-2" />
                Yazdır
              </button>
              <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FileText className="h-4 w-4 mr-2" />
                Fatura Oluştur
              </button>
              {selectedOrder.status === 'CONFIRMED' && (
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Truck className="h-4 w-4 mr-2" />
                  Kargoya Ver
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
