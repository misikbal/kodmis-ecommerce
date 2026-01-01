'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  DollarSign,
  Calendar,
  User,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  orderNumber?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  type: 'SALES' | 'PURCHASE' | 'REFUND';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  billingAddress: {
    name: string;
    company?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    taxId?: string;
  };
  notes?: string;
  paymentMethod?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    orderId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'SALES' as 'SALES' | 'PURCHASE' | 'REFUND',
    items: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 18 }],
    billingAddress: {
      name: '',
      company: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Türkiye',
      taxId: ''
    },
    notes: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/admin/unauthorized');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadInvoices();
      loadOrders();
      loadCustomers();
    }
  }, [status, filterStatus, filterType]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);
      
      const response = await fetch(`/api/admin/finance/invoices?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Fatura yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders?limit=100');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Sipariş yükleme hatası:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await fetch('/api/admin/users?role=USER&limit=100');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.users || []);
      }
    } catch (error) {
      console.error('Müşteri yükleme hatası:', error);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleOrderChange = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setFormData({
        ...formData,
        orderId,
        customerId: order.userId || '',
        items: order.items?.map((item: any) => ({
          description: item.productName || item.name || 'Ürün',
          quantity: item.quantity || 1,
          unitPrice: item.price || 0,
          taxRate: 18
        })) || [{ description: '', quantity: 1, unitPrice: 0, taxRate: 18 }],
        billingAddress: {
          name: order.shippingAddress?.name || order.customerName || '',
          company: '',
          address: order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          postalCode: order.shippingAddress?.postalCode || '',
          country: order.shippingAddress?.country || 'Türkiye',
          taxId: ''
        }
      });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, taxRate: 18 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const taxAmount = formData.items.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0
    );
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  };

  const handleCreateInvoice = async () => {
    try {
      const { subtotal, taxAmount, totalAmount } = calculateTotals();
      
      const response = await fetch('/api/admin/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: formData.items.map(item => ({
            ...item,
            total: item.quantity * item.unitPrice * (1 + (item.taxRate / 100))
          })),
          subtotal,
          taxAmount,
          totalAmount
        })
      });

      if (response.ok) {
        alert('✅ Fatura başarıyla oluşturuldu!');
        setShowAddModal(false);
        loadInvoices();
        // Reset form
        setFormData({
          customerId: '',
          orderId: '',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'SALES',
          items: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 18 }],
          billingAddress: {
            name: '',
            company: '',
            address: '',
            city: '',
            postalCode: '',
            country: 'Türkiye',
            taxId: ''
          },
          notes: ''
        });
      } else {
        const data = await response.json();
        alert('❌ Hata: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Fatura oluşturma hatası:', error);
      alert('❌ Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    // PDF download logic will be implemented
    alert('PDF indirme özelliği yakında eklenecek');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return CheckCircle;
      case 'SENT': return Send;
      case 'DRAFT': return FileText;
      case 'OVERDUE': return AlertTriangle;
      case 'CANCELLED': return XCircle;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'bg-green-100 text-green-800';
      case 'PURCHASE': return 'bg-blue-100 text-blue-800';
      case 'REFUND': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center border-2 border-purple-200">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Faturalar</h1>
              <p className="text-sm text-gray-500 mt-0.5">Fatura yönetimi ve takibi</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadInvoices}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-700 rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Fatura
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Toplam Fatura</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalInvoices || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Ödendi</p>
                <p className="text-3xl font-bold text-green-900">{stats.paid || 0}</p>
                <p className="text-xs text-green-600 mt-1">₺{(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Gönderildi</p>
                <p className="text-3xl font-bold text-blue-900">{stats.sent || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Gecikmiş</p>
                <p className="text-3xl font-bold text-red-900">{stats.overdue || 0}</p>
                <p className="text-xs text-red-600 mt-1">₺{(stats.pendingAmount || 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-red-200 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tümü</option>
                  <option value="DRAFT">Taslak</option>
                  <option value="SENT">Gönderildi</option>
                  <option value="PAID">Ödendi</option>
                  <option value="OVERDUE">Gecikmiş</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tür</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Tümü</option>
                  <option value="SALES">Satış</option>
                  <option value="PURCHASE">Alış</option>
                  <option value="REFUND">İade</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Fatura no, müşteri adı, e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Fatura bulunamadı</h3>
                <p className="text-gray-600">Henüz herhangi bir fatura kaydı bulunmuyor</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatura No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{invoice.customerName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.issueDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                            {invoice.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₺{invoice.totalAmount.toLocaleString()}
                          </div>
                          {invoice.paidAmount > 0 && (
                            <div className="text-xs text-green-600">
                              Ödenen: ₺{invoice.paidAmount.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleViewInvoice(invoice)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDownloadPDF(invoice)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Fatura Detayı</h2>
                    <p className="text-purple-100 text-sm mt-1">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedInvoice(null);
                    }}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Invoice Header Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Fatura Bilgileri</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fatura No:</span>
                        <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tarih:</span>
                        <span className="font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vade:</span>
                        <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                          {selectedInvoice.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h3>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{selectedInvoice.billingAddress.name}</p>
                      {selectedInvoice.billingAddress.company && (
                        <p className="text-gray-600">{selectedInvoice.billingAddress.company}</p>
                      )}
                      <p className="text-gray-600">{selectedInvoice.billingAddress.address}</p>
                      <p className="text-gray-600">{selectedInvoice.billingAddress.city}, {selectedInvoice.billingAddress.postalCode}</p>
                      <p className="text-gray-600">{selectedInvoice.billingAddress.country}</p>
                      {selectedInvoice.billingAddress.taxId && (
                        <p className="text-gray-600">Vergi No: {selectedInvoice.billingAddress.taxId}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Fatura Kalemleri</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Açıklama</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">Miktar</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">Birim Fiyat</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">KDV %</th>
                        <th className="text-right py-2 text-sm font-medium text-gray-700">Toplam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 text-sm">{item.description}</td>
                          <td className="text-right py-2 text-sm">{item.quantity}</td>
                          <td className="text-right py-2 text-sm">₺{item.unitPrice.toLocaleString()}</td>
                          <td className="text-right py-2 text-sm">{item.taxRate}%</td>
                          <td className="text-right py-2 text-sm font-medium">₺{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ara Toplam:</span>
                      <span className="font-medium">₺{selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">KDV:</span>
                      <span className="font-medium">₺{selectedInvoice.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Genel Toplam:</span>
                      <span className="text-green-600">₺{selectedInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                    {selectedInvoice.paidAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Ödenen:</span>
                        <span className="font-medium">₺{selectedInvoice.paidAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Notlar</h3>
                    <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    PDF İndir
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedInvoice(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Invoice Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Yeni Fatura Oluştur</h2>
                    <p className="text-purple-100 text-sm mt-1">Sipariş seçerek otomatik veya manuel fatura oluşturun</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Selection */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Sipariş Seç (Otomatik Fatura)
                  </h3>
                  <select
                    value={formData.orderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sipariş seçin veya manuel oluşturun</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #{order.orderNumber} - {order.customerName} - ₺{order.totalAmount?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-blue-600 mt-2">💡 Sipariş seçtiğinizde bilgiler otomatik doldurulur</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müşteri <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Müşteri seçin</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Düzenleme Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vade Tarihi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Fatura Adresi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
                      <input
                        type="text"
                        value={formData.billingAddress.name}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, name: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şirket</label>
                      <input
                        type="text"
                        value={formData.billingAddress.company}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, company: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adres *</label>
                      <input
                        type="text"
                        value={formData.billingAddress.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, address: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Şehir *</label>
                      <input
                        type="text"
                        value={formData.billingAddress.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, city: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posta Kodu *</label>
                      <input
                        type="text"
                        value={formData.billingAddress.postalCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, postalCode: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vergi No</label>
                      <input
                        type="text"
                        value={formData.billingAddress.taxId}
                        onChange={(e) => setFormData({
                          ...formData,
                          billingAddress: { ...formData.billingAddress, taxId: e.target.value }
                        })}
                        className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Fatura Kalemleri</h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Kalem Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Açıklama</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full text-black px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            placeholder="Ürün/Hizmet açıklaması"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Miktar</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full text-black px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Birim Fiyat</label>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full text-black px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">KDV %</label>
                          <input
                            type="number"
                            value={item.taxRate}
                            onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                            className="w-full text-black px-3 py-2 text-sm border border-gray-300 rounded-lg"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Toplam</label>
                          <div className="text-sm font-medium text-gray-900 py-2">
                            ₺{(item.quantity * item.unitPrice * (1 + item.taxRate / 100)).toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-1">
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals Summary */}
                  <div className="mt-4 pt-4 border-t border-green-300">
                    <div className="flex justify-end space-x-8 text-sm">
                      <div className="text-right">
                        <p className="text-gray-600">Ara Toplam:</p>
                        <p className="text-gray-600">KDV:</p>
                        <p className="font-bold text-lg">Genel Toplam:</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₺{calculateTotals().subtotal.toLocaleString()}</p>
                        <p className="font-medium">₺{calculateTotals().taxAmount.toLocaleString()}</p>
                        <p className="font-bold text-lg text-green-600">₺{calculateTotals().totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Fatura notları..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleCreateInvoice}
                    disabled={!formData.customerId || formData.items.length === 0}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Fatura Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

