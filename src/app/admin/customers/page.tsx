'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  X
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  isVerified: boolean;
  avatar?: string;
  loyaltyPoints: number;
  createdAt: string;
}

export default function Customers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    verifiedCustomers: 0
  });

  useEffect(() => {
    loadCustomers();
  }, [filterRole, filterStatus]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filterRole !== 'all') {
        queryParams.append('role', filterRole);
      }
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.users);
        setStats({
          totalCustomers: data.totalUsers,
          activeCustomers: data.users.filter((c: Customer) => c.status === 'ACTIVE').length,
          newCustomers: data.users.filter((c: Customer) => {
            const createdAt = new Date(c.createdAt);
            const now = new Date();
            const diffTime = now.getTime() - createdAt.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
          }).length,
          verifiedCustomers: data.users.filter((c: Customer) => c.isVerified).length
        });
      }
    } catch (error) {
      console.error('Müşteri yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${customerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadCustomers();
      }
    } catch (error) {
      console.error('Müşteri silme hatası:', error);
      alert('Müşteri silinemedi');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif';
      case 'INACTIVE':
        return 'Pasif';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || customer.role === filterRole;
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (status === 'loading' || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <AdminLayout title="Müşteriler" description="Müşteri yönetimi ve takibi">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 mr-3 text-orange-600" />
              Müşteriler
            </h1>
            <p className="text-gray-600 mt-2">
              Müşteri yönetimi ve takibi
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadCustomers}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Müşteri</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">Kayıtlı müşteri</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Aktif Müşteri</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.activeCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">Aktif durumda</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus className="h-6 w-6 text-purple-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Yeni Müşteri</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.newCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">Son 7 gün</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Doğrulanmış</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.verifiedCustomers}</p>
            <p className="text-xs text-gray-500 mt-1">E-posta doğrulanmış</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Müşteri ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Roller</option>
                <option value="CUSTOMER">Müşteri</option>
                <option value="ADMIN">Admin</option>
                <option value="VENDOR">Satıcı</option>
              </select>
          </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Pasif</option>
              </select>
                            </div>

            {/* Sort */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white">
                <option value="newest">En Yeniler</option>
                <option value="oldest">En Eski</option>
                <option value="name">İsme Göre</option>
              </select>
                          </div>
                  </div>
                </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Müşteri
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puan
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {customer.avatar ? (
                                    <img
                                      src={customer.avatar}
                            alt={customer.name}
                            className="h-12 w-12 rounded-full object-cover mr-3"
                                    />
                                  ) : (
                          <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-lg">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                                    </div>
                                  )}
                                  <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            {customer.isVerified && <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
                            {customer.email}
                          </div>
                                  </div>
                                </div>
                              </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {customer.role}
                                </span>
                              </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(customer.status)}`}>
                        {getStatusLabel(customer.status)}
                      </span>
                              </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {customer.loyaltyPoints}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCustomers(customers.filter(c => c.id !== customer.id))}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setCustomers(customers.map(c => c.id === customer.id ? {...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'} : c))}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>

                {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
              Toplam {filteredCustomers.length} müşteri bulundu
              </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
