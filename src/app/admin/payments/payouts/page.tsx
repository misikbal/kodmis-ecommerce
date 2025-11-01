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
  RefreshCw,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  CreditCard,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Payout {
  id: string;
  marketplaceId?: string;
  marketplaceName?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'OTHER';
  accountDetails?: {
    accountNumber?: string;
    iban?: string;
    bankName?: string;
    beneficiaryName?: string;
  };
  referenceId?: string;
  description?: string;
  scheduledDate?: string;
  processedDate?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/admin/unauthorized');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadPayouts();
    }
  }, [status, filterStatus, filterMethod]);

  const loadPayouts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await fetch(`/api/admin/payments/payouts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPayouts(data.payouts);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Ödeme çıkışı yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle;
      case 'PROCESSING': return RefreshCw;
      case 'PENDING': return Clock;
      case 'FAILED': return XCircle;
      case 'CANCELLED': return AlertTriangle;
      default: return FileText;
    }
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = searchTerm === '' || 
      payout.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.marketplaceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center border-2 border-orange-200">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ödeme Çıkışları</h1>
              <p className="text-sm text-gray-500 mt-0.5">Pazaryeri çıkışları ve ödemeler</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadPayouts}
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
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Çıkış
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Toplam Çıkış</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalPayouts || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Toplam Tutar</p>
                <p className="text-3xl font-bold text-green-900">₺{(stats.totalAmount || 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Beklemede</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending || 0}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700 mb-1">İşleniyor</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.processing || 0}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-indigo-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Tamamlanan</p>
                <p className="text-3xl font-bold text-purple-900">{stats.completed || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-700" />
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
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="COMPLETED">Tamamlanan</option>
                  <option value="PROCESSING">İşleniyor</option>
                  <option value="PENDING">Beklemede</option>
                  <option value="FAILED">Başarısız</option>
                  <option value="CANCELLED">İptal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                <select
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value)}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tümü</option>
                  <option value="BANK_TRANSFER">Banka Transferi</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="STRIPE">Stripe</option>
                  <option value="OTHER">Diğer</option>
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
              placeholder="Referans ID, pazaryeri, açıklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredPayouts.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Çıkış bulunamadı</h3>
                <p className="text-gray-600">Henüz herhangi bir çıkış kaydı bulunmuyor</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referans</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pazaryeri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yöntem</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayouts.map((payout) => {
                    const StatusIcon = getStatusIcon(payout.status);
                    return (
                      <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payout.referenceId || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payout.marketplaceName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            ₺{payout.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {payout.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <CreditCard className="h-4 w-4 inline mr-1" />
                          {payout.payoutMethod}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{payout.description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payout.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

