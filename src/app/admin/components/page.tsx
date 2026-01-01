'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout';
import { 
  Table, 
  TableActions, 
  BulkActions,
  Modal, 
  ConfirmModal, 
  FormModal,
  Drawer, 
  SlideOver, 
  DetailDrawer,
  Toast,
  ToastContainer,
  useToast,
  Input, 
  PasswordInput, 
  Textarea, 
  Select, 
  Checkbox, 
  Radio, 
  FileUpload
} from '@/components/ui';
import { 
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  User,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-12-01'
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-12-01'
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2024-11-30'
  }
];

const columns = [
  {
    key: 'name',
    label: 'Ad',
    sortable: true,
    render: (value: string, item: any) => (
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      </div>
    )
  },
  {
    key: 'role',
    label: 'Rol',
    sortable: true,
    render: (value: string) => (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {value}
      </span>
    )
  },
  {
    key: 'status',
    label: 'Durum',
    sortable: true,
    render: (value: string) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value === 'Active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )
  },
  {
    key: 'lastLogin',
    label: 'Son Giriş',
    sortable: true
  }
];

export default function ComponentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  
  const [activeTab, setActiveTab] = useState<'table' | 'modal' | 'drawer' | 'toast' | 'forms'>('table');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  
  // Drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [showSlideOver, setShowSlideOver] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    description: '',
    terms: false,
    newsletter: false,
    gender: '',
    files: [] as File[]
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if ((session.user as { role?: string })?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleBulkAction = (action: string, items: string[]) => {
    console.log(`Bulk action: ${action} on items:`, items);
    toast.success(`${items.length} öğe üzerinde ${action} işlemi başarılı`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Form başarıyla gönderildi');
    setShowFormModal(false);
  };

  const handleFileSelect = (files: File[]) => {
    setFormData(prev => ({ ...prev, files }));
  };

  if (status === 'loading') {
    return (
      <AdminLayout title="UI Komponentleri" description="Table, Modal, Drawer, Toast ve Form elementleri">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="UI Komponentleri" description="Table, Modal, Drawer, Toast ve Form elementleri">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">UI Komponentleri</h1>
            <p className="text-gray-600">Table, Modal, Drawer, Toast ve Form elementleri</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'table', label: 'Table', icon: Settings },
                { id: 'modal', label: 'Modal', icon: Settings },
                { id: 'drawer', label: 'Drawer', icon: Settings },
                { id: 'toast', label: 'Toast', icon: Settings },
                { id: 'forms', label: 'Form Elements', icon: Settings }
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
            {/* Table Tab */}
            {activeTab === 'table' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Table Komponenti</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Ekle
                    </button>
                  </div>
                </div>

                <Table
                  data={mockUsers}
                  columns={columns}
                  selectable
                  selectedItems={selectedItems}
                  onSelectionChange={setSelectedItems}
                  onSort={handleSort}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  actions={[
                    {
                      label: 'Görüntüle',
                      icon: <Eye className="h-4 w-4" />,
                      onClick: (item) => {
                        console.log('View item:', item);
                        setShowDetailDrawer(true);
                      }
                    },
                    {
                      label: 'Düzenle',
                      icon: <Edit className="h-4 w-4" />,
                      onClick: (item) => {
                        console.log('Edit item:', item);
                        setShowFormModal(true);
                      }
                    },
                    {
                      label: 'Sil',
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: (item) => {
                        console.log('Delete item:', item);
                        setShowConfirmModal(true);
                      },
                      variant: 'destructive'
                    }
                  ]}
                  bulkActions={[
                    {
                      label: 'Dışa Aktar',
                      icon: <Download className="h-4 w-4" />,
                      onClick: (items) => handleBulkAction('export', items)
                    },
                    {
                      label: 'Sil',
                      icon: <Trash2 className="h-4 w-4" />,
                      onClick: (items) => handleBulkAction('delete', items),
                      variant: 'destructive'
                    }
                  ]}
                />
              </div>
            )}

            {/* Modal Tab */}
            {activeTab === 'modal' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Modal Komponentleri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Basic Modal</h4>
                    <p className="text-sm text-gray-600 mt-1">Temel modal komponenti</p>
                  </button>

                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Confirm Modal</h4>
                    <p className="text-sm text-gray-600 mt-1">Onay modal komponenti</p>
                  </button>

                  <button
                    onClick={() => setShowFormModal(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Form Modal</h4>
                    <p className="text-sm text-gray-600 mt-1">Form modal komponenti</p>
                  </button>
                </div>
              </div>
            )}

            {/* Drawer Tab */}
            {activeTab === 'drawer' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Drawer Komponentleri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowDrawer(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Basic Drawer</h4>
                    <p className="text-sm text-gray-600 mt-1">Temel drawer komponenti</p>
                  </button>

                  <button
                    onClick={() => setShowSlideOver(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Slide Over</h4>
                    <p className="text-sm text-gray-600 mt-1">Sağdan açılan drawer</p>
                  </button>

                  <button
                    onClick={() => setShowDetailDrawer(true)}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Detail Drawer</h4>
                    <p className="text-sm text-gray-600 mt-1">Detay görünüm drawer</p>
                  </button>
                </div>
              </div>
            )}

            {/* Toast Tab */}
            {activeTab === 'toast' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Toast Komponentleri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => toast.success('Başarılı işlem!')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Success Toast</h4>
                    <p className="text-sm text-gray-600 mt-1">Başarı mesajı</p>
                  </button>

                  <button
                    onClick={() => toast.error('Hata oluştu!')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Error Toast</h4>
                    <p className="text-sm text-gray-600 mt-1">Hata mesajı</p>
                  </button>

                  <button
                    onClick={() => toast.warning('Dikkat!')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Warning Toast</h4>
                    <p className="text-sm text-gray-600 mt-1">Uyarı mesajı</p>
                  </button>

                  <button
                    onClick={() => toast.info('Bilgi mesajı')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <h4 className="font-medium text-gray-900">Info Toast</h4>
                    <p className="text-sm text-gray-600 mt-1">Bilgi mesajı</p>
                  </button>
                </div>
              </div>
            )}

            {/* Forms Tab */}
            {activeTab === 'forms' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Form Elementleri</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      label="Ad"
                      placeholder="Adınızı girin"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />

                    <Input
                      label="E-posta"
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      leftIcon={<Mail className="h-4 w-4" />}
                    />

                    <PasswordInput
                      label="Şifre"
                      placeholder="Şifrenizi girin"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    />

                    <Select
                      label="Rol"
                      placeholder="Rol seçin"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      options={[
                        { value: 'admin', label: 'Admin' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'user', label: 'User' }
                      ]}
                    />
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      label="Açıklama"
                      placeholder="Açıklama girin"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />

                    <div className="space-y-3">
                      <Checkbox
                        label="Şartları kabul ediyorum"
                        checked={formData.terms}
                        onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                      />

                      <Checkbox
                        label="E-posta bildirimleri almak istiyorum"
                        checked={formData.newsletter}
                        onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Cinsiyet</label>
                      <div className="space-y-2">
                        <Radio
                          label="Erkek"
                          name="gender"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        />
                        <Radio
                          label="Kadın"
                          name="gender"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                        />
                      </div>
                    </div>

                    <FileUpload
                      label="Dosya Yükle"
                      accept=".pdf,.doc,.docx"
                      maxSize={5}
                      onFileSelect={handleFileSelect}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Basic Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu bir temel modal komponenti örneğidir. İçerik burada görüntülenir.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kapat
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          console.log('Confirmed');
          setShowConfirmModal(false);
          toast.success('İşlem onaylandı');
        }}
        title="Onay Gerekli"
        message="Bu işlemi gerçekleştirmek istediğinizden emin misiniz?"
        confirmText="Onayla"
        cancelText="İptal"
        variant="danger"
      />

      <FormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        title="Form Modal"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Ad"
            placeholder="Adınızı girin"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            label="E-posta"
            type="email"
            placeholder="E-posta adresinizi girin"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </FormModal>

      {/* Drawers */}
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Basic Drawer"
        position="left"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu bir temel drawer komponenti örneğidir. Sol taraftan açılır.
          </p>
        </div>
      </Drawer>

      <SlideOver
        isOpen={showSlideOver}
        onClose={() => setShowSlideOver(false)}
        title="Slide Over"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bu bir slide over komponenti örneğidir. Sağ taraftan açılır.
          </p>
        </div>
      </SlideOver>

      <DetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        title="Detay Görünümü"
        loading={false}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Kullanıcı Bilgileri</h4>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Ad:</span>
                <span className="text-sm font-medium">Ahmet Yılmaz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">E-posta:</span>
                <span className="text-sm font-medium">ahmet@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rol:</span>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </DetailDrawer>

      {/* Toast Container */}
      <ToastContainer
        toasts={toast.toasts}
        onClose={toast.dismiss}
        position="top-right"
      />
    </AdminLayout>
  );
}
