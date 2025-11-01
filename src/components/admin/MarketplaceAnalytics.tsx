'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
  salesByMarketplace: Array<{
    marketplace: string;
    sales: number;
    orders: number;
    percentage: number;
  }>;
  salesTrend: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  topProducts: Array<{
    name: string;
    sku: string;
    sales: number;
    orders: number;
    revenue: number;
    marketplace: string;
  }>;
  monthlyStats: Array<{
    month: string;
    sales: number;
    orders: number;
    products: number;
  }>;
}

interface MarketplaceAnalyticsProps {
  marketplaceId?: string;
  marketplaceName?: string;
  dateRange?: '7d' | '30d' | '90d' | '1y';
}

export default function MarketplaceAnalytics({
  marketplaceId,
  marketplaceName,
  dateRange = '30d'
}: MarketplaceAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedDateRange, marketplaceId]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockData: AnalyticsData = {
        totalSales: 1250000,
        totalOrders: 2847,
        totalProducts: 1250,
        totalCustomers: 1847,
        salesGrowth: 12.5,
        ordersGrowth: 8.3,
        productsGrowth: 15.2,
        customersGrowth: 22.1,
        salesByMarketplace: [
          { marketplace: 'Hepsiburada', sales: 450000, orders: 1024, percentage: 36 },
          { marketplace: 'Trendyol', sales: 380000, orders: 856, percentage: 30.4 },
          { marketplace: 'n11', sales: 250000, orders: 567, percentage: 20 },
          { marketplace: 'GittiGidiyor', sales: 170000, orders: 400, percentage: 13.6 }
        ],
        salesTrend: [
          { date: '2024-01-01', sales: 25000, orders: 45 },
          { date: '2024-01-02', sales: 32000, orders: 58 },
          { date: '2024-01-03', sales: 28000, orders: 52 },
          { date: '2024-01-04', sales: 35000, orders: 67 },
          { date: '2024-01-05', sales: 42000, orders: 78 },
          { date: '2024-01-06', sales: 38000, orders: 71 },
          { date: '2024-01-07', sales: 45000, orders: 83 }
        ],
        topProducts: [
          { name: 'iPhone 15 Pro Max', sku: 'IPH15PM-256', sales: 45, orders: 45, revenue: 2069955, marketplace: 'Hepsiburada' },
          { name: 'Samsung Galaxy S24 Ultra', sku: 'SGS24U-512', sales: 38, orders: 38, revenue: 1481962, marketplace: 'Trendyol' },
          { name: 'MacBook Pro M3', sku: 'MBPM3-14', sales: 25, orders: 25, revenue: 1324975, marketplace: 'n11' },
          { name: 'Nike Air Max 270', sku: 'NAM270-BLK', sales: 120, orders: 95, revenue: 395880, marketplace: 'Hepsiburada' },
          { name: 'Adidas Ultraboost 22', sku: 'AUB22-WHT', sales: 85, orders: 78, revenue: 246415, marketplace: 'Trendyol' }
        ],
        monthlyStats: [
          { month: 'Ocak', sales: 125000, orders: 284, products: 125 },
          { month: 'Şubat', sales: 142000, orders: 324, products: 142 },
          { month: 'Mart', sales: 138000, orders: 298, products: 138 },
          { month: 'Nisan', sales: 156000, orders: 356, products: 156 },
          { month: 'Mayıs', sales: 167000, orders: 378, products: 167 },
          { month: 'Haziran', sales: 175000, orders: 392, products: 175 }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getMarketplaceColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Analitik veriler yüklenirken bir hata oluştu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Pazar Yeri Analitikleri
            {marketplaceName && ` - ${marketplaceName}`}
          </h3>
          <p className="text-sm text-gray-600">
            Satış performansınızı ve trendleri analiz edin
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
          
          <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Satış</p>
              <p className="text-2xl font-bold text-gray-900">₺{analyticsData.totalSales.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.salesGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.salesGrowth)}`}>
                  %{Math.abs(analyticsData.salesGrowth)}
                </span>
                <span className="text-xs text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.ordersGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.ordersGrowth)}`}>
                  %{Math.abs(analyticsData.ordersGrowth)}
                </span>
                <span className="text-xs text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalProducts.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.productsGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.productsGrowth)}`}>
                  %{Math.abs(analyticsData.productsGrowth)}
                </span>
                <span className="text-xs text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalCustomers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.customersGrowth)}
                <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.customersGrowth)}`}>
                  %{Math.abs(analyticsData.customersGrowth)}
                </span>
                <span className="text-xs text-gray-500 ml-1">önceki döneme göre</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Marketplace */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Pazar Yerine Göre Satış</h4>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.salesByMarketplace.map((item, index) => (
              <div key={item.marketplace} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-4 w-4 rounded-full ${getMarketplaceColor(index)}`}></div>
                  <span className="text-sm font-medium text-gray-900">{item.marketplace}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">₺{item.sales.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.orders} sipariş • %{item.percentage}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
              {analyticsData.salesByMarketplace.map((item, index) => (
                <div
                  key={item.marketplace}
                  className={`${getMarketplaceColor(index)}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Satış Trendi</h4>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.salesTrend.slice(0, 7).map((item, index) => (
              <div key={item.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₺{item.sales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{item.orders} sipariş</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.sales / Math.max(...analyticsData.salesTrend.map(t => t.sales))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">En Çok Satan Ürünler</h4>
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetailedView ? 'Basit Görünüm' : 'Detaylı Görünüm'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satış
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pazar Yeri
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.topProducts.map((product, index) => (
                <tr key={product.sku} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{product.sales}</span>
                      <ArrowUpRight className="h-3 w-3 text-green-600 ml-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₺{product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {product.marketplace}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Aylık Performans</h4>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.monthlyStats.slice(0, 3).map((stat, index) => (
            <div key={stat.month} className="text-center">
              <div className="text-2xl font-bold text-gray-900">₺{stat.sales.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{stat.month} Satış</div>
              <div className="text-xs text-gray-500">{stat.orders} sipariş • {stat.products} ürün</div>
            </div>
          ))}
        </div>
        
        {/* Monthly Chart */}
        <div className="mt-6">
          <div className="flex items-end space-x-2 h-32">
            {analyticsData.monthlyStats.map((stat, index) => {
              const maxSales = Math.max(...analyticsData.monthlyStats.map(s => s.sales));
              const height = (stat.sales / maxSales) * 100;
              return (
                <div key={stat.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{stat.month}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
