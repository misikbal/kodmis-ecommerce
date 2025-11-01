import 'dotenv/config';
import connectDB from './mongodb';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';
import Order from './models/Order';
import Brand from './models/Brand';
import { testBrands } from '../test-data/brands';
import { testCategories } from '../test-data/categories';
import { testUsers } from '../test-data/users';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Brand.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create brands from test data
    const brands = await Brand.insertMany(testBrands.map(brand => ({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      logo: brand.logo,
      website: brand.website,
      isActive: brand.isActive,
      sortOrder: brand.sortOrder,
    })));
    console.log(`✅ Created ${brands.length} brands`);

    // Create categories from test data
    const categories = await Category.insertMany(testCategories.map(category => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      parentId: null, // Will be updated after creation
    })));

    // Update parent categories
    for (const category of categories) {
      const testCategory = testCategories.find(c => c.slug === category.slug);
      if (testCategory?.parentId) {
        const parentCategory = categories.find(c => c.slug === testCategory.parentId);
        if (parentCategory) {
          await Category.updateOne(
            { _id: category._id },
            { parentId: parentCategory._id }
          );
        }
      }
    }
    // Create users from test data
    const users = await User.insertMany(await Promise.all(testUsers.map(async user => ({
      email: user.email,
      username: user.email.split('@')[0], // Use email prefix as username
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      phone: user.phone,
      role: user.role === 'admin' ? 'ADMIN' : 'CUSTOMER',
      isActive: user.isActive,
      isVerified: true,
      hashedPassword: await bcrypt.hash(user.password, 10), // Hash the password
      loyaltyPoints: Math.floor(Math.random() * 1000),
      referralCode: `${user.email.split('@')[0].toUpperCase()}${Math.floor(Math.random() * 1000)}`,
    }))));
    console.log(`✅ Created ${users.length} users`);

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'The latest iPhone with advanced features',
        content: 'The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system.',
        type: 'PHYSICAL',
        status: 'ACTIVE',
        price: 999,
        comparePrice: 1099,
        costPrice: 800,
        sku: 'IPHONE15PRO-128',
        trackQuantity: true,
        quantity: 50,
        lowStockAlert: 5,
        weight: 0.187,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
            alt: 'iPhone 15 Pro',
            sortOrder: 0,
          },
        ],
        categoryId: categories.find(c => c.slug === 'telefon')?._id,
        hasVariants: false,
        variants: [],
        seoTitle: 'iPhone 15 Pro - Latest Apple Smartphone',
        seoDescription: 'Buy the latest iPhone 15 Pro with titanium design and A17 Pro chip.',
        tags: ['smartphone', 'apple', 'iphone', 'premium'],
        isFeatured: true,
        isBestseller: true,
        isNew: true,
        viewCount: 0,
        salesCount: 0,
      },
      {
        name: 'MacBook Pro 16"',
        slug: 'macbook-pro-16',
        description: 'Powerful laptop for professionals',
        content: 'The MacBook Pro 16-inch features M3 Pro chip and stunning Liquid Retina XDR display.',
        type: 'PHYSICAL',
        status: 'ACTIVE',
        price: 2499,
        comparePrice: 2699,
        costPrice: 2000,
        sku: 'MBP16-M3PRO-512',
        trackQuantity: true,
        quantity: 25,
        lowStockAlert: 3,
        weight: 2.14,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
            alt: 'MacBook Pro 16-inch',
            sortOrder: 0,
          },
        ],
        categoryId: categories.find(c => c.slug === 'laptop')?._id,
        hasVariants: false,
        variants: [],
        seoTitle: 'MacBook Pro 16-inch - Professional Laptop',
        seoDescription: 'Buy MacBook Pro 16-inch with M3 Pro chip for professional work.',
        tags: ['laptop', 'apple', 'macbook', 'professional'],
        isFeatured: true,
        isBestseller: false,
        isNew: true,
        viewCount: 0,
        salesCount: 0,
      },
      {
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Comfortable running shoes',
        content: 'The Nike Air Max 270 delivers visible cushioning under every step.',
        type: 'PHYSICAL',
        status: 'ACTIVE',
        price: 150,
        comparePrice: 180,
        costPrice: 100,
        sku: 'NIKE-AM270-BLK-10',
        trackQuantity: true,
        quantity: 100,
        lowStockAlert: 10,
        weight: 0.8,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
            alt: 'Nike Air Max 270',
            sortOrder: 0,
          },
        ],
        categoryId: categories.find(c => c.slug === 'spor-ayakkabi')?._id,
        hasVariants: true,
        variants: [
          {
            name: 'Black - Size 10',
            sku: 'NIKE-AM270-BLK-10',
            price: 150,
            quantity: 20,
            options: { color: 'Black', size: '10' },
          },
          {
            name: 'White - Size 10',
            sku: 'NIKE-AM270-WHT-10',
            price: 150,
            quantity: 15,
            options: { color: 'White', size: '10' },
          },
        ],
        seoTitle: 'Nike Air Max 270 - Running Shoes',
        seoDescription: 'Buy Nike Air Max 270 running shoes with visible cushioning.',
        tags: ['shoes', 'nike', 'running', 'sports'],
        isFeatured: false,
        isBestseller: true,
        isNew: false,
        viewCount: 0,
        salesCount: 0,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create sample orders
    const orders = await Order.insertMany([
      {
        orderNumber: 'ORD-001',
        status: 'DELIVERED',
        userId: users.find(u => u.email === 'customer1@kodmis.com')?._id,
        subtotal: 999,
        taxAmount: 99.9,
        shippingCost: 0,
        discountAmount: 0,
        total: 1098.9,
        items: [
          {
            productId: products.find(p => p.slug === 'iphone-15-pro')?._id,
            quantity: 1,
            price: 999,
            total: 999,
          },
        ],
        notes: 'Please deliver during business hours',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        orderNumber: 'ORD-002',
        status: 'SHIPPED',
        userId: users.find(u => u.email === 'customer2@kodmis.com')?._id,
        subtotal: 150,
        taxAmount: 15,
        shippingCost: 10,
        discountAmount: 0,
        total: 175,
        items: [
          {
            productId: products.find(p => p.slug === 'nike-air-max-270')?._id,
            quantity: 1,
            price: 150,
            total: 150,
          },
        ],
        trackingNumber: 'TRK123456789',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        orderNumber: 'ORD-003',
        status: 'PENDING',
        userId: users.find(u => u.email === 'customer3@kodmis.com')?._id,
        subtotal: 2499,
        taxAmount: 249.9,
        shippingCost: 0,
        discountAmount: 100,
        total: 2648.9,
        items: [
          {
            productId: products.find(p => p.slug === 'macbook-pro-16')?._id,
            quantity: 1,
            price: 2499,
            total: 2499,
          },
        ],
        notes: 'Student discount applied',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${brands.length} brands`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${orders.length} orders`);

    console.log('\n🔐 Demo Login Credentials:');
    console.log('   Admin: admin@kodmis.com / admin123');
    console.log('   Manager: manager@kodmis.com / manager123');
    console.log('   Customer: customer1@kodmis.com / customer123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seedDatabase();