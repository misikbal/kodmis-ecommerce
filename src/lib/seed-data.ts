import { getDatabase } from './mongodb';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    const db = await getDatabase();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('brands').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});

    // Create users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const users = await db.collection('users').insertMany([
      {
        email: 'admin@kodmis.com',
        name: 'Admin User',
        password: hashedPassword,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'user@kodmis.com',
        name: 'Test User',
        password: userPassword,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create categories
    const categories = await db.collection('categories').insertMany([
      {
        name: 'Elektronik',
        slug: 'elektronik',
        description: 'Elektronik ürünler ve aksesuarlar',
        image: 'https://images.unsplash.com/photo-1498049794561-7780c7234a63?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Giyim',
        slug: 'giyim',
        description: 'Kadın, erkek ve çocuk giyim',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ev & Yaşam',
        slug: 'ev-yasam',
        description: 'Ev dekorasyonu ve yaşam ürünleri',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Spor',
        slug: 'spor',
        description: 'Spor malzemeleri ve aksesuarlar',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kitap',
        slug: 'kitap',
        description: 'Kitaplar ve dergiler',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Oyuncak',
        slug: 'oyuncak',
        description: 'Çocuk oyuncakları ve oyunlar',
        image: 'https://images.unsplash.com/photo-1558060370-5397c4d1d2a1?w=300&h=200&fit=crop',
        parentId: null,
        isActive: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create brands
    const brands = await db.collection('brands').insertMany([
      {
        name: 'Apple',
        slug: 'apple',
        description: 'Apple teknoloji ürünleri',
        logo: 'https://logo.clearbit.com/apple.com',
        website: 'https://apple.com',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung',
        slug: 'samsung',
        description: 'Samsung elektronik ürünleri',
        logo: 'https://logo.clearbit.com/samsung.com',
        website: 'https://samsung.com',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nike',
        slug: 'nike',
        description: 'Nike spor ürünleri',
        logo: 'https://logo.clearbit.com/nike.com',
        website: 'https://nike.com',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Adidas spor ürünleri',
        logo: 'https://logo.clearbit.com/adidas.com',
        website: 'https://adidas.com',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sony',
        slug: 'sony',
        description: 'Sony elektronik ürünleri',
        logo: 'https://logo.clearbit.com/sony.com',
        website: 'https://sony.com',
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'LG',
        slug: 'lg',
        description: 'LG elektronik ürünleri',
        logo: 'https://logo.clearbit.com/lg.com',
        website: 'https://lg.com',
        isActive: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Get inserted IDs
    const categoryIds = Object.values(categories.insertedIds);
    const brandIds = Object.values(brands.insertedIds);

    // Create products
    const products = await db.collection('products').insertMany([
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'En yeni iPhone 15 Pro modeli. A17 Pro çip ile güçlendirilmiş, titanium gövde ile dayanıklı.',
        shortDescription: 'A17 Pro çip, titanium gövde, 48MP kamera',
        price: 45000,
        comparePrice: 50000,
        costPrice: 40000,
        sku: 'IPH15PRO-256',
        barcode: '1234567890123',
        categoryId: categoryIds[0].toString(),
        brandId: brandIds[0].toString(),
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        ],
        variants: [],
        attributes: [
          { name: 'Renk', value: 'Titanium' },
          { name: 'Depolama', value: '256GB' },
          { name: 'Ekran', value: '6.1 inç' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 50,
          allowBackorder: false,
          minQuantity: 5,
        },
        shipping: {
          weight: 0.187,
          dimensions: { length: 14.67, width: 7.15, height: 0.83 },
          freeShipping: true,
        },
        seo: {
          title: 'iPhone 15 Pro - En Yeni Apple Telefon',
          description: 'iPhone 15 Pro satın al. A17 Pro çip, titanium gövde ve 48MP kamera.',
          keywords: ['iphone', 'apple', 'telefon', 'akıllı telefon'],
        },
        status: 'active',
        featured: true,
        tags: ['yeni', 'popüler', 'premium'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Samsung\'un en güçlü telefonu. S Pen desteği, 200MP kamera ve AI özellikleri.',
        shortDescription: 'S Pen, 200MP kamera, AI özellikleri',
        price: 42000,
        comparePrice: 45000,
        costPrice: 38000,
        sku: 'SGS24U-512',
        barcode: '1234567890124',
        categoryId: categoryIds[0].toString(),
        brandId: brandIds[1].toString(),
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        ],
        variants: [],
        attributes: [
          { name: 'Renk', value: 'Titanium Black' },
          { name: 'Depolama', value: '512GB' },
          { name: 'Ekran', value: '6.8 inç' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 30,
          allowBackorder: true,
          minQuantity: 3,
        },
        shipping: {
          weight: 0.232,
          dimensions: { length: 16.24, width: 7.9, height: 0.88 },
          freeShipping: true,
        },
        seo: {
          title: 'Samsung Galaxy S24 Ultra - S Pen Desteği',
          description: 'Samsung Galaxy S24 Ultra satın al. S Pen, 200MP kamera ve AI özellikleri.',
          keywords: ['samsung', 'galaxy', 's24', 'ultra', 's pen'],
        },
        status: 'active',
        featured: true,
        tags: ['yeni', 'premium', 's pen'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MacBook Pro M3',
        slug: 'macbook-pro-m3',
        description: 'Apple M3 çip ile güçlendirilmiş MacBook Pro. 14 inç Liquid Retina XDR ekran.',
        shortDescription: 'M3 çip, 14 inç ekran, 18 saat pil',
        price: 65000,
        comparePrice: 70000,
        costPrice: 60000,
        sku: 'MBP14-M3-512',
        barcode: '1234567890125',
        categoryId: categoryIds[0].toString(),
        brandId: brandIds[0].toString(),
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
        ],
        variants: [],
        attributes: [
          { name: 'Renk', value: 'Space Gray' },
          { name: 'Depolama', value: '512GB SSD' },
          { name: 'RAM', value: '8GB' },
          { name: 'Ekran', value: '14 inç' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 25,
          allowBackorder: false,
          minQuantity: 2,
        },
        shipping: {
          weight: 1.6,
          dimensions: { length: 31.26, width: 22.12, height: 1.55 },
          freeShipping: true,
        },
        seo: {
          title: 'MacBook Pro M3 - Apple Laptop',
          description: 'MacBook Pro M3 satın al. Apple M3 çip, 14 inç ekran ve 18 saat pil.',
          keywords: ['macbook', 'pro', 'm3', 'apple', 'laptop'],
        },
        status: 'active',
        featured: true,
        tags: ['yeni', 'premium', 'laptop'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'AirPods Pro 2',
        slug: 'airpods-pro-2',
        description: 'Apple AirPods Pro 2. Aktif gürültü engelleme, uzamsal ses ve H2 çip.',
        shortDescription: 'Aktif gürültü engelleme, uzamsal ses, H2 çip',
        price: 8500,
        comparePrice: 9500,
        costPrice: 7500,
        sku: 'APP2-USB-C',
        barcode: '1234567890126',
        categoryId: categoryIds[0].toString(),
        brandId: brandIds[0].toString(),
        images: [
          'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop',
        ],
        variants: [],
        attributes: [
          { name: 'Renk', value: 'White' },
          { name: 'Bağlantı', value: 'USB-C' },
          { name: 'Pil', value: '6 saat' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 100,
          allowBackorder: true,
          minQuantity: 10,
        },
        shipping: {
          weight: 0.056,
          dimensions: { length: 6.0, width: 4.5, height: 2.1 },
          freeShipping: false,
        },
        seo: {
          title: 'AirPods Pro 2 - Apple Kulaklık',
          description: 'AirPods Pro 2 satın al. Aktif gürültü engelleme ve uzamsal ses.',
          keywords: ['airpods', 'pro', 'apple', 'kulaklık', 'bluetooth'],
        },
        status: 'active',
        featured: false,
        tags: ['popüler', 'kulaklık'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Nike Air Max 270 erkek spor ayakkabı. Günlük kullanım için konforlu.',
        shortDescription: 'Erkek spor ayakkabı, günlük kullanım',
        price: 2500,
        comparePrice: 3000,
        costPrice: 2000,
        sku: 'NAM270-42',
        barcode: '1234567890127',
        categoryId: categoryIds[3].toString(),
        brandId: brandIds[2].toString(),
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        ],
        variants: [
          {
            name: 'Beden',
            options: [
              { name: '40', value: '40' },
              { name: '41', value: '41' },
              { name: '42', value: '42' },
              { name: '43', value: '43' },
              { name: '44', value: '44' },
            ],
          },
        ],
        attributes: [
          { name: 'Cinsiyet', value: 'Erkek' },
          { name: 'Materyal', value: 'Mesh' },
          { name: 'Renk', value: 'Siyah/Beyaz' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 75,
          allowBackorder: true,
          minQuantity: 5,
        },
        shipping: {
          weight: 0.8,
          dimensions: { length: 35, width: 25, height: 12 },
          freeShipping: false,
        },
        seo: {
          title: 'Nike Air Max 270 - Erkek Spor Ayakkabı',
          description: 'Nike Air Max 270 satın al. Erkek spor ayakkabı, günlük kullanım için.',
          keywords: ['nike', 'air max', '270', 'spor ayakkabı', 'erkek'],
        },
        status: 'active',
        featured: false,
        tags: ['spor', 'ayakkabı', 'nike'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Adidas Ultraboost 22 koşu ayakkabısı. Boost teknolojisi ile maksimum konfor.',
        shortDescription: 'Koşu ayakkabısı, Boost teknolojisi',
        price: 2800,
        comparePrice: 3200,
        costPrice: 2200,
        sku: 'AUB22-42',
        barcode: '1234567890128',
        categoryId: categoryIds[3].toString(),
        brandId: brandIds[3].toString(),
        images: [
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
        ],
        variants: [
          {
            name: 'Beden',
            options: [
              { name: '40', value: '40' },
              { name: '41', value: '41' },
              { name: '42', value: '42' },
              { name: '43', value: '43' },
              { name: '44', value: '44' },
            ],
          },
        ],
        attributes: [
          { name: 'Cinsiyet', value: 'Unisex' },
          { name: 'Materyal', value: 'Primeknit' },
          { name: 'Renk', value: 'Beyaz/Siyah' },
        ],
        inventory: {
          trackQuantity: true,
          quantity: 0,
          allowBackorder: true,
          minQuantity: 5,
        },
        shipping: {
          weight: 0.7,
          dimensions: { length: 34, width: 24, height: 11 },
          freeShipping: false,
        },
        seo: {
          title: 'Adidas Ultraboost 22 - Koşu Ayakkabısı',
          description: 'Adidas Ultraboost 22 satın al. Koşu ayakkabısı, Boost teknolojisi.',
          keywords: ['adidas', 'ultraboost', '22', 'koşu', 'ayakkabı'],
        },
        status: 'active',
        featured: false,
        tags: ['koşu', 'ayakkabı', 'adidas'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Create sample orders
    const orders = await db.collection('orders').insertMany([
      {
        orderNumber: 'ORD-2024-001',
        userId: Object.values(users.insertedIds)[1].toString(),
        items: [
          {
            productId: Object.values(products.insertedIds)[0].toString(),
            productName: 'iPhone 15 Pro',
            productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
            quantity: 1,
            price: 45000,
            total: 45000,
          },
        ],
        subtotal: 45000,
        tax: 8100,
        shipping: 0,
        discount: 0,
        total: 53100,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          address1: 'Test Mahallesi No: 2',
          city: 'Ankara',
          state: 'Ankara',
          zipCode: '06000',
          country: 'Türkiye',
          phone: '+90 555 000 0002',
        },
        notes: 'Hızlı teslimat istiyorum',
        trackingNumber: 'TRK123456789',
        shippedAt: new Date('2024-01-10'),
        deliveredAt: new Date('2024-01-12'),
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        orderNumber: 'ORD-2024-002',
        userId: Object.values(users.insertedIds)[1].toString(),
        items: [
          {
            productId: Object.values(products.insertedIds)[2].toString(),
            productName: 'MacBook Pro M3',
            productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop',
            quantity: 1,
            price: 65000,
            total: 65000,
          },
        ],
        subtotal: 65000,
        tax: 11700,
        shipping: 0,
        discount: 5000,
        total: 71700,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          address1: 'Test Mahallesi No: 2',
          city: 'Ankara',
          state: 'Ankara',
          zipCode: '06000',
          country: 'Türkiye',
          phone: '+90 555 000 0002',
        },
        trackingNumber: 'TRK987654321',
        shippedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-15'),
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.insertedCount} users`);
    console.log(`Created ${categories.insertedCount} categories`);
    console.log(`Created ${brands.insertedCount} brands`);
    console.log(`Created ${products.insertedCount} products`);
    console.log(`Created ${orders.insertedCount} orders`);

    return {
      users: users.insertedCount,
      categories: categories.insertedCount,
      brands: brands.insertedCount,
      products: products.insertedCount,
      orders: orders.insertedCount,
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

