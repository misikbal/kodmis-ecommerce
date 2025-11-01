'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { LazyImage, LazyComponent, VirtualizedList, InfiniteScroll, PerformanceMonitor } from '@/components/performance';
import { 
  Zap,
  Database,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  User,
  Bell,
  Sun,
  Moon,
  Maximize,
  Minimize,
  RotateCcw,
  Home,
  ShoppingBag,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  PiggyBank,
  Target,
  Sparkles,
  Wand2,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge,
  Tag,
  Ticket,
  Gift,
  Box,
  Truck,
  Car,
  Shirt,
  Watch,
  Camera,
  Gamepad2,
  Music,
  Book,
  Video,
  Headphones,
  Laptop,
  Gamepad,
  MousePointer,
  Hand,
  Focus,
  Crosshair,
  X,
  Loader,
  Loader2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

// Mock data for performance metrics
const mockPerformanceMetrics = {
  server: {
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 12
  },
  database: {
    queries: 1250,
    slowQueries: 23,
    connections: 45,
    cacheHitRate: 89
  },
  frontend: {
    pageLoadTime: 1.2,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 1.5,
    cumulativeLayoutShift: 0.05
  },
  api: {
    responseTime: 150,
    requestsPerSecond: 45,
    errorRate: 0.2,
    uptime: 99.9
  }
};

const mockOptimizationSuggestions = [
  {
    id: '1',
    title: 'Database Query Optimization',
    description: 'Optimize slow queries in products table',
    impact: 'high',
    effort: 'medium',
    estimatedImprovement: '40% faster queries',
    category: 'database'
  },
  {
    id: '2',
    title: 'Image Lazy Loading',
    description: 'Implement lazy loading for product images',
    impact: 'high',
    effort: 'low',
    estimatedImprovement: '60% faster page load',
    category: 'frontend'
  },
  {
    id: '3',
    title: 'API Response Caching',
    description: 'Add Redis caching for frequently accessed data',
    impact: 'medium',
    effort: 'high',
    estimatedImprovement: '80% faster API responses',
    category: 'backend'
  },
  {
    id: '4',
    title: 'CDN Implementation',
    description: 'Use CDN for static assets',
    impact: 'high',
    effort: 'medium',
    estimatedImprovement: '50% faster asset loading',
    category: 'infrastructure'
  }
];

const mockPaginationData = {
  products: {
    total: 10000,
    page: 1,
    limit: 20,
    totalPages: 500,
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 100),
      category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
      status: ['active', 'inactive', 'draft'][Math.floor(Math.random() * 3)]
    }))
  },
  orders: {
    total: 5000,
    page: 1,
    limit: 20,
    totalPages: 250,
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      customer: `Customer ${i + 1}`,
      total: Math.floor(Math.random() * 500) + 50,
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }))
  }
};

export default function PerformancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'optimization' | 'pagination' | 'lazy'>('overview');
  const [selectedDataType, setSelectedDataType] = useState<'products' | 'orders'>('products');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(mockPaginationData.products);
  const [realTimeMetrics, setRealTimeMetrics] = useState(mockPerformanceMetrics);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        server: {
          cpu: Math.max(0, Math.min(100, prev.server.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, prev.server.memory + (Math.random() - 0.5) * 5)),
          disk: Math.max(0, Math.min(100, prev.server.disk + (Math.random() - 0.5) * 2)),
          network: Math.max(0, Math.min(100, prev.server.network + (Math.random() - 0.5) * 8))
        },
        database: {
          queries: prev.database.queries + Math.floor(Math.random() * 10),
          slowQueries: Math.max(0, prev.database.slowQueries + (Math.random() - 0.7) * 2),
          connections: Math.max(0, Math.min(100, prev.database.connections + (Math.random() - 0.5) * 5)),
          cacheHitRate: Math.max(0, Math.min(100, prev.database.cacheHitRate + (Math.random() - 0.5) * 3))
        },
        frontend: {
          pageLoadTime: Math.max(0.5, prev.frontend.pageLoadTime + (Math.random() - 0.5) * 0.2),
          firstContentfulPaint: Math.max(0.3, prev.frontend.firstContentfulPaint + (Math.random() - 0.5) * 0.1),
          largestContentfulPaint: Math.max(0.8, prev.frontend.largestContentfulPaint + (Math.random() - 0.5) * 0.3),
          cumulativeLayoutShift: Math.max(0, Math.min(0.5, prev.frontend.cumulativeLayoutShift + (Math.random() - 0.5) * 0.02))
        },
        api: {
          responseTime: Math.max(50, prev.api.responseTime + (Math.random() - 0.5) * 20),
          requestsPerSecond: Math.max(0, prev.api.requestsPerSecond + (Math.random() - 0.5) * 5),
          errorRate: Math.max(0, Math.min(5, prev.api.errorRate + (Math.random() - 0.8) * 0.1)),
          uptime: Math.max(95, Math.min(100, prev.api.uptime + (Math.random() - 0.5) * 0.1))
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate pagination data loading
  const loadData = useCallback(async (page: number, size: number, type: 'products' | 'orders') => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockData = type === 'products' ? mockPaginationData.products : mockPaginationData.orders;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    const newData = {
      ...mockData,
      page,
      limit: size,
      items: Array.from({ length: size }, (_, i) => ({
        ...mockData.items[0],
        id: startIndex + i + 1,
        name: type === 'products' ? `Product ${startIndex + i + 1}` : `Customer ${startIndex + i + 1}`,
        price: type === 'products' ? Math.floor(Math.random() * 1000) + 100 : undefined,
        customer: type === 'orders' ? `Customer ${startIndex + i + 1}` : undefined,
        total: type === 'orders' ? Math.floor(Math.random() * 500) + 50 : undefined
      }))
    };
    
    setData(newData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(currentPage, pageSize, selectedDataType);
  }, [currentPage, pageSize, selectedDataType, loadData]);

  const getMetricColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network' | 'error' | 'uptime') => {
    switch (type) {
      case 'cpu':
      case 'memory':
      case 'disk':
      case 'network':
        if (value < 50) return 'text-green-600';
        if (value < 80) return 'text-yellow-600';
        return 'text-red-600';
      case 'error':
        if (value < 1) return 'text-green-600';
        if (value < 3) return 'text-yellow-600';
        return 'text-red-600';
      case 'uptime':
        if (value > 99) return 'text-green-600';
        if (value > 95) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading') {
    return (
      <AdminLayout title="Performans" description="Server-side pagination, lazy loading, performans optimizasyonu">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Performans" description="Server-side pagination, lazy loading, performans optimizasyonu">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performans Optimizasyonu</h1>
            <p className="text-gray-600">Server-side pagination, lazy loading ve performans metrikleri</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Yenile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
                { id: 'metrics', label: 'Metrikler', icon: Activity },
                { id: 'optimization', label: 'Optimizasyon', icon: Zap },
                { id: 'pagination', label: 'Pagination', icon: Database },
                { id: 'lazy', label: 'Lazy Loading', icon: Loader2 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Performance Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Server CPU</h3>
                        <p className="text-2xl font-bold text-blue-600">{realTimeMetrics.server.cpu.toFixed(1)}%</p>
                      </div>
                      <Cpu className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${realTimeMetrics.server.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-900">Memory Usage</h3>
                        <p className="text-2xl font-bold text-green-600">{realTimeMetrics.server.memory.toFixed(1)}%</p>
                      </div>
                      <MemoryStick className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${realTimeMetrics.server.memory}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">API Response</h3>
                        <p className="text-2xl font-bold text-purple-600">{realTimeMetrics.api.responseTime.toFixed(0)}ms</p>
                      </div>
                      <Network className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (realTimeMetrics.api.responseTime / 500) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900">Page Load</h3>
                        <p className="text-2xl font-bold text-orange-600">{realTimeMetrics.frontend.pageLoadTime.toFixed(1)}s</p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (realTimeMetrics.frontend.pageLoadTime / 3) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Database className="h-5 w-5 text-blue-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Database Optimize</div>
                        <div className="text-sm text-gray-600">Query performance</div>
                      </div>
                    </button>
                    
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Zap className="h-5 w-5 text-yellow-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Cache Clear</div>
                        <div className="text-sm text-gray-600">Clear all caches</div>
                      </div>
                    </button>
                    
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RefreshCw className="h-5 w-5 text-green-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Restart Services</div>
                        <div className="text-sm text-gray-600">Restart all services</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div className="space-y-6">
                {/* Server Metrics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Server Metrikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.server.cpu.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">CPU Usage</div>
                      <div className={`text-xs ${getMetricColor(realTimeMetrics.server.cpu, 'cpu')}`}>
                        {realTimeMetrics.server.cpu > 80 ? 'High' : realTimeMetrics.server.cpu > 50 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.server.memory.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Memory Usage</div>
                      <div className={`text-xs ${getMetricColor(realTimeMetrics.server.memory, 'memory')}`}>
                        {realTimeMetrics.server.memory > 80 ? 'High' : realTimeMetrics.server.memory > 50 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.server.disk.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Disk Usage</div>
                      <div className={`text-xs ${getMetricColor(realTimeMetrics.server.disk, 'disk')}`}>
                        {realTimeMetrics.server.disk > 80 ? 'High' : realTimeMetrics.server.disk > 50 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.server.network.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Network Usage</div>
                      <div className={`text-xs ${getMetricColor(realTimeMetrics.server.network, 'network')}`}>
                        {realTimeMetrics.server.network > 80 ? 'High' : realTimeMetrics.server.network > 50 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Metrics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Metrikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.database.queries}</div>
                      <div className="text-sm text-gray-600">Queries/min</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.database.slowQueries}</div>
                      <div className="text-sm text-gray-600">Slow Queries</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.database.connections}</div>
                      <div className="text-sm text-gray-600">Connections</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.database.cacheHitRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Cache Hit Rate</div>
                    </div>
                  </div>
                </div>

                {/* Frontend Metrics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend Metrikleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.frontend.pageLoadTime.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">Page Load Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.frontend.firstContentfulPaint.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">First Contentful Paint</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.frontend.largestContentfulPaint.toFixed(1)}s</div>
                      <div className="text-sm text-gray-600">Largest Contentful Paint</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{realTimeMetrics.frontend.cumulativeLayoutShift.toFixed(3)}</div>
                      <div className="text-sm text-gray-600">Cumulative Layout Shift</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optimization Tab */}
            {activeTab === 'optimization' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimizasyon Önerileri</h3>
                  
                  <div className="space-y-4">
                    {mockOptimizationSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900">{suggestion.title}</h4>
                            <p className="text-gray-600 mt-1">{suggestion.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(suggestion.impact)}`}>
                              {suggestion.impact} impact
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEffortColor(suggestion.effort)}`}>
                              {suggestion.effort} effort
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Kategori</h5>
                            <p className="text-sm text-gray-600 capitalize">{suggestion.category}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">Tahmini İyileştirme</h5>
                            <p className="text-sm text-gray-600">{suggestion.estimatedImprovement}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-900 mb-2">İşlemler</h5>
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200">
                                Uygula
                              </button>
                              <button className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded hover:bg-gray-200">
                                Detay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pagination Tab */}
            {activeTab === 'pagination' && (
              <div className="space-y-6">
                {/* Data Type Selector */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Veri Tipi:</label>
                  <select
                    value={selectedDataType}
                    onChange={(e) => setSelectedDataType(e.target.value as 'products' | 'orders')}
                    className="px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="products">Ürünler</option>
                    <option value="orders">Siparişler</option>
                  </select>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Sayfa Boyutu:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-3 py-2 border  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDataType === 'products' ? 'Ürünler' : 'Siparişler'} 
                      {loading && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {selectedDataType === 'products' ? (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            </>
                          ) : (
                            <>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.items.map((item: any) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                            {selectedDataType === 'products' ? (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺{item.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                                    item.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₺{item.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    item.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    item.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(item.date).toLocaleDateString('tr-TR')}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Toplam {data.total} kayıt, sayfa {data.page} / {data.totalPages}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1 || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      İlk
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Önceki
                    </button>
                    
                    <span className="px-3 py-2 text-sm text-gray-700">
                      {currentPage} / {data.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === data.totalPages || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Sonraki
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(data.totalPages)}
                      disabled={currentPage === data.totalPages || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Son
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Lazy Loading Tab */}
            {activeTab === 'lazy' && (
              <div className="space-y-6">
                {/* Lazy Image Demo */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lazy Image Loading</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }, (_, i) => (
                      <LazyImage
                        key={i}
                        src={`https://picsum.photos/300/200?random=${i}`}
                        alt={`Lazy loaded image ${i + 1}`}
                        className="h-48 rounded-lg"
                      />
                    ))}
                  </div>
                </div>

                {/* Lazy Component Demo */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lazy Component Loading</h3>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <LazyComponent
                        key={i}
                        className="h-32"
                        fallback={
                          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                            <div className="text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">Component {i + 1} yükleniyor...</p>
                            </div>
                          </div>
                        }
                      >
                        <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900">Component {i + 1}</h4>
                            <p className="text-sm text-gray-600">Bu component lazy loading ile yüklendi</p>
                          </div>
                        </div>
                      </LazyComponent>
                    ))}
                  </div>
                </div>

                {/* Virtualized List Demo */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Virtualized List (10,000 items)</h3>
                  <VirtualizedList
                    items={Array.from({ length: 10000 }, (_, i) => ({
                      id: i + 1,
                      name: `Item ${i + 1}`,
                      description: `This is item number ${i + 1} in the virtualized list`
                    }))}
                    itemHeight={60}
                    containerHeight={400}
                    renderItem={(item, index) => (
                      <div className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-sm font-medium text-blue-600">{item.id}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    )}
                    className="border border-gray-200 rounded-lg"
                  />
                </div>

                {/* Infinite Scroll Demo */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Infinite Scroll</h3>
                  <InfiniteScroll
                    hasMore={true}
                    loadMore={() => {
                      console.log('Loading more items...');
                    }}
                    loading={false}
                  >
                    <div className="space-y-4">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium text-gray-900">Item {i + 1}</h4>
                          <p className="text-sm text-gray-600">
                            This is item {i + 1} in the infinite scroll list. 
                            Scroll down to load more items automatically.
                          </p>
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <PerformanceMonitor showDetails={true} />
    </AdminLayout>
  );
}
