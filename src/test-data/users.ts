// Test kullanıcı verileri
export const testUsers = [
  {
    email: 'admin@kodmis.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin',
    avatar: '',
    phone: '+90 555 000 0001',
    address: {
      street: 'Admin Caddesi No: 1',
      city: 'İstanbul',
      state: 'İstanbul',
      zipCode: '34000',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'user@kodmis.com',
    name: 'Test User',
    password: 'user123',
    role: 'user',
    avatar: '',
    phone: '+90 555 000 0002',
    address: {
      street: 'Test Mahallesi No: 2',
      city: 'Ankara',
      state: 'Ankara',
      zipCode: '06000',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'customer1@kodmis.com',
    name: 'Ahmet Yılmaz',
    password: 'customer123',
    role: 'user',
    avatar: '',
    phone: '+90 555 111 1111',
    address: {
      street: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123',
      city: 'İstanbul',
      state: 'İstanbul',
      zipCode: '34710',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'customer2@kodmis.com',
    name: 'Ayşe Demir',
    password: 'customer123',
    role: 'user',
    avatar: '',
    phone: '+90 555 222 2222',
    address: {
      street: 'Levent Mahallesi, Büyükdere Caddesi No: 456',
      city: 'İstanbul',
      state: 'İstanbul',
      zipCode: '34330',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'customer3@kodmis.com',
    name: 'Mehmet Kaya',
    password: 'customer123',
    role: 'user',
    avatar: '',
    phone: '+90 555 333 3333',
    address: {
      street: 'Çankaya Mahallesi, Tunalı Hilmi Caddesi No: 789',
      city: 'Ankara',
      state: 'Ankara',
      zipCode: '06680',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'manager@kodmis.com',
    name: 'Fatma Özkan',
    password: 'manager123',
    role: 'admin',
    avatar: '',
    phone: '+90 555 444 4444',
    address: {
      street: 'Kadıköy Mahallesi, Moda Caddesi No: 321',
      city: 'İstanbul',
      state: 'İstanbul',
      zipCode: '34710',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'support@kodmis.com',
    name: 'Ali Veli',
    password: 'support123',
    role: 'user',
    avatar: '',
    phone: '+90 555 555 5555',
    address: {
      street: 'Bornova Mahallesi, Erzene Caddesi No: 654',
      city: 'İzmir',
      state: 'İzmir',
      zipCode: '35050',
      country: 'Türkiye',
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'test@kodmis.com',
    name: 'Test Customer',
    password: 'test123',
    role: 'user',
    avatar: '',
    phone: '+90 555 666 6666',
    address: {
      street: 'Test Mahallesi, Test Caddesi No: 999',
      city: 'Bursa',
      state: 'Bursa',
      zipCode: '16000',
      country: 'Türkiye',
    },
    isActive: false, // Pasif kullanıcı
    lastLogin: new Date('2024-01-01'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

// Kullanıcı istatistikleri
export const userStats = {
  totalUsers: 8,
  activeUsers: 7,
  inactiveUsers: 1,
  adminUsers: 2,
  regularUsers: 6,
  usersByCity: {
    'İstanbul': 4,
    'Ankara': 2,
    'İzmir': 1,
    'Bursa': 1
  },
  usersByRole: {
    'admin': 2,
    'user': 6
  }
};

// Kullanıcı aktivite logları
export const userActivityLogs = [
  {
    userId: 'user@kodmis.com',
    action: 'login',
    timestamp: new Date('2024-01-15T10:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    userId: 'admin@kodmis.com',
    action: 'admin_login',
    timestamp: new Date('2024-01-15T09:15:00'),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  },
  {
    userId: 'customer1@kodmis.com',
    action: 'order_placed',
    timestamp: new Date('2024-01-14T14:20:00'),
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    userId: 'customer2@kodmis.com',
    action: 'profile_updated',
    timestamp: new Date('2024-01-14T16:45:00'),
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/109.0 Firefox/109.0'
  },
  {
    userId: 'manager@kodmis.com',
    action: 'product_created',
    timestamp: new Date('2024-01-13T11:30:00'),
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

// Kullanıcı tercihleri
export const userPreferences = [
  {
    userId: 'user@kodmis.com',
    language: 'tr',
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    theme: 'light',
    newsletter: false
  },
  {
    userId: 'admin@kodmis.com',
    language: 'tr',
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: true
    },
    theme: 'dark',
    newsletter: true
  },
  {
    userId: 'customer1@kodmis.com',
    language: 'tr',
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    notifications: {
      email: true,
      sms: false,
      push: false,
      marketing: true
    },
    theme: 'light',
    newsletter: true
  }
];

// Kullanıcı adresleri (ek adresler)
export const userAddresses = [
  {
    userId: 'customer1@kodmis.com',
    addresses: [
      {
        type: 'home',
        title: 'Ev Adresi',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        company: '',
        address1: 'Atatürk Mahallesi, Cumhuriyet Caddesi No: 123',
        address2: 'Daire: 5',
        city: 'İstanbul',
        state: 'İstanbul',
        zipCode: '34710',
        country: 'Türkiye',
        phone: '+90 555 111 1111',
        isDefault: true
      },
      {
        type: 'work',
        title: 'İş Adresi',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        company: 'ABC Teknoloji',
        address1: 'Levent Mahallesi, Büyükdere Caddesi No: 456',
        address2: 'Kat: 15',
        city: 'İstanbul',
        state: 'İstanbul',
        zipCode: '34330',
        country: 'Türkiye',
        phone: '+90 555 111 1112',
        isDefault: false
      }
    ]
  },
  {
    userId: 'customer2@kodmis.com',
    addresses: [
      {
        type: 'home',
        title: 'Ev Adresi',
        firstName: 'Ayşe',
        lastName: 'Demir',
        company: '',
        address1: 'Levent Mahallesi, Büyükdere Caddesi No: 456',
        address2: '',
        city: 'İstanbul',
        state: 'İstanbul',
        zipCode: '34330',
        country: 'Türkiye',
        phone: '+90 555 222 2222',
        isDefault: true
      }
    ]
  }
];
