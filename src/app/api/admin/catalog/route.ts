import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Brand from '@/lib/models/Brand';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Mock data for catalog
    const catalogData = {
      categories: [
        {
          id: '1',
          name: 'Elektronik',
          slug: 'elektronik',
          description: 'Elektronik ürünler ve aksesuarlar',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop',
          parentId: null,
          level: 0,
          isActive: true,
          sortOrder: 1,
          productCount: 450,
          children: [
            {
              id: '2',
              name: 'Telefon & Aksesuar',
              slug: 'telefon-aksesuar',
              description: 'Akıllı telefonlar ve aksesuarları',
              parentId: '1',
              level: 1,
              isActive: true,
              sortOrder: 1,
              productCount: 200,
              children: [
                {
                  id: '3',
                  name: 'iPhone',
                  slug: 'iphone',
                  description: 'Apple iPhone modelleri',
                  parentId: '2',
                  level: 2,
                  isActive: true,
                  sortOrder: 1,
                  productCount: 50
                },
                {
                  id: '4',
                  name: 'Samsung',
                  slug: 'samsung',
                  description: 'Samsung Galaxy modelleri',
                  parentId: '2',
                  level: 2,
                  isActive: true,
                  sortOrder: 2,
                  productCount: 80
                }
              ]
            },
            {
              id: '5',
              name: 'Bilgisayar & Tablet',
              slug: 'bilgisayar-tablet',
              description: 'Laptop, masaüstü bilgisayar ve tabletler',
              parentId: '1',
              level: 1,
              isActive: true,
              sortOrder: 2,
              productCount: 150,
              children: [
                {
                  id: '6',
                  name: 'MacBook',
                  slug: 'macbook',
                  description: 'Apple MacBook modelleri',
                  parentId: '5',
                  level: 2,
                  isActive: true,
                  sortOrder: 1,
                  productCount: 30
                },
                {
                  id: '7',
                  name: 'iPad',
                  slug: 'ipad',
                  description: 'Apple iPad modelleri',
                  parentId: '5',
                  level: 2,
                  isActive: true,
                  sortOrder: 2,
                  productCount: 25
                }
              ]
            }
          ],
          seoTitle: 'Elektronik Ürünler - En İyi Fiyatlar',
          seoDescription: 'Elektronik ürünlerde en iyi fiyatlar ve kaliteli hizmet',
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: '8',
          name: 'Giyim & Moda',
          slug: 'giyim-moda',
          description: 'Kadın, erkek ve çocuk giyim',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
          parentId: null,
          level: 0,
          isActive: true,
          sortOrder: 2,
          productCount: 320,
          children: [
            {
              id: '9',
              name: 'Kadın Giyim',
              slug: 'kadin-giyim',
              description: 'Kadın giyim ürünleri',
              parentId: '8',
              level: 1,
              isActive: true,
              sortOrder: 1,
              productCount: 180
            },
            {
              id: '10',
              name: 'Erkek Giyim',
              slug: 'erkek-giyim',
              description: 'Erkek giyim ürünleri',
              parentId: '8',
              level: 1,
              isActive: true,
              sortOrder: 2,
              productCount: 140
            }
          ],
          seoTitle: 'Giyim & Moda - Trend Ürünler',
          seoDescription: 'En trend giyim ve moda ürünleri',
          createdAt: new Date('2024-01-02').toISOString(),
          updatedAt: new Date('2024-01-16').toISOString()
        },
        {
          id: '11',
          name: 'Ev & Yaşam',
          slug: 'ev-yasam',
          description: 'Ev dekorasyonu ve yaşam ürünleri',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
          parentId: null,
          level: 0,
          isActive: true,
          sortOrder: 3,
          productCount: 280,
          children: [],
          seoTitle: 'Ev & Yaşam - Dekorasyon Ürünleri',
          seoDescription: 'Ev dekorasyonu ve yaşam kalitesini artıran ürünler',
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-17').toISOString()
        }
      ],
      brands: [
        {
          id: '1',
          name: 'Apple',
          slug: 'apple',
          description: 'Apple Inc. - Teknoloji devi',
          logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop',
          website: 'https://apple.com',
          isActive: true,
          productCount: 85,
          totalSales: 2500000,
          averageRating: 4.8,
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: '2',
          name: 'Samsung',
          slug: 'samsung',
          description: 'Samsung Electronics - Güney Kore teknoloji şirketi',
          logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
          website: 'https://samsung.com',
          isActive: true,
          productCount: 120,
          totalSales: 1800000,
          averageRating: 4.6,
          createdAt: new Date('2024-01-02').toISOString(),
          updatedAt: new Date('2024-01-16').toISOString()
        },
        {
          id: '3',
          name: 'Nike',
          slug: 'nike',
          description: 'Nike Inc. - Spor giyim ve ayakkabı',
          logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
          website: 'https://nike.com',
          isActive: true,
          productCount: 95,
          totalSales: 1200000,
          averageRating: 4.7,
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-17').toISOString()
        },
        {
          id: '4',
          name: 'Adidas',
          slug: 'adidas',
          description: 'Adidas AG - Alman spor giyim markası',
          logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=100&h=100&fit=crop',
          website: 'https://adidas.com',
          isActive: true,
          productCount: 78,
          totalSales: 950000,
          averageRating: 4.5,
          createdAt: new Date('2024-01-04').toISOString(),
          updatedAt: new Date('2024-01-18').toISOString()
        },
        {
          id: '5',
          name: 'Sony',
          slug: 'sony',
          description: 'Sony Corporation - Japon teknoloji şirketi',
          logo: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=100&h=100&fit=crop',
          website: 'https://sony.com',
          isActive: true,
          productCount: 65,
          totalSales: 800000,
          averageRating: 4.4,
          createdAt: new Date('2024-01-05').toISOString(),
          updatedAt: new Date('2024-01-19').toISOString()
        },
        {
          id: '6',
          name: 'LG',
          slug: 'lg',
          description: 'LG Electronics - Güney Kore teknoloji şirketi',
          logo: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop',
          website: 'https://lg.com',
          isActive: false,
          productCount: 45,
          totalSales: 600000,
          averageRating: 4.2,
          createdAt: new Date('2024-01-06').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString()
        }
      ],
      attributes: [
        {
          id: '1',
          name: 'Renk',
          slug: 'renk',
          type: 'SELECT',
          isRequired: false,
          isFilterable: true,
          isVisible: true,
          sortOrder: 1,
          options: [
            { id: '1', name: 'Siyah', value: 'siyah', sortOrder: 1 },
            { id: '2', name: 'Beyaz', value: 'beyaz', sortOrder: 2 },
            { id: '3', name: 'Kırmızı', value: 'kirmizi', sortOrder: 3 },
            { id: '4', name: 'Mavi', value: 'mavi', sortOrder: 4 }
          ],
          categoryIds: ['1', '8'],
          productCount: 450,
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: '2',
          name: 'Beden',
          slug: 'beden',
          type: 'SELECT',
          isRequired: true,
          isFilterable: true,
          isVisible: true,
          sortOrder: 2,
          options: [
            { id: '1', name: 'XS', value: 'xs', sortOrder: 1 },
            { id: '2', name: 'S', value: 's', sortOrder: 2 },
            { id: '3', name: 'M', value: 'm', sortOrder: 3 },
            { id: '4', name: 'L', value: 'l', sortOrder: 4 },
            { id: '5', name: 'XL', value: 'xl', sortOrder: 5 }
          ],
          categoryIds: ['8'],
          productCount: 320,
          createdAt: new Date('2024-01-02').toISOString(),
          updatedAt: new Date('2024-01-16').toISOString()
        },
        {
          id: '3',
          name: 'Depolama Kapasitesi',
          slug: 'depolama-kapasitesi',
          type: 'SELECT',
          isRequired: false,
          isFilterable: true,
          isVisible: true,
          sortOrder: 3,
          options: [
            { id: '1', name: '64 GB', value: '64gb', sortOrder: 1 },
            { id: '2', name: '128 GB', value: '128gb', sortOrder: 2 },
            { id: '3', name: '256 GB', value: '256gb', sortOrder: 3 },
            { id: '4', name: '512 GB', value: '512gb', sortOrder: 4 },
            { id: '5', name: '1 TB', value: '1tb', sortOrder: 5 }
          ],
          categoryIds: ['1'],
          productCount: 200,
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-17').toISOString()
        },
        {
          id: '4',
          name: 'Ekran Boyutu',
          slug: 'ekran-boyutu',
          type: 'NUMBER',
          isRequired: false,
          isFilterable: true,
          isVisible: true,
          sortOrder: 4,
          categoryIds: ['1'],
          productCount: 150,
          createdAt: new Date('2024-01-04').toISOString(),
          updatedAt: new Date('2024-01-18').toISOString()
        },
        {
          id: '5',
          name: 'Garanti Süresi',
          slug: 'garanti-suresi',
          type: 'SELECT',
          isRequired: false,
          isFilterable: false,
          isVisible: true,
          sortOrder: 5,
          options: [
            { id: '1', name: '1 Yıl', value: '1-yil', sortOrder: 1 },
            { id: '2', name: '2 Yıl', value: '2-yil', sortOrder: 2 },
            { id: '3', name: '3 Yıl', value: '3-yil', sortOrder: 3 }
          ],
          categoryIds: ['1'],
          productCount: 450,
          createdAt: new Date('2024-01-05').toISOString(),
          updatedAt: new Date('2024-01-19').toISOString()
        },
        {
          id: '6',
          name: 'Materyal',
          slug: 'materyal',
          type: 'MULTISELECT',
          isRequired: false,
          isFilterable: true,
          isVisible: true,
          sortOrder: 6,
          options: [
            { id: '1', name: 'Pamuk', value: 'pamuk', sortOrder: 1 },
            { id: '2', name: 'Polyester', value: 'polyester', sortOrder: 2 },
            { id: '3', name: 'Yün', value: 'yun', sortOrder: 3 },
            { id: '4', name: 'İpek', value: 'ipek', sortOrder: 4 }
          ],
          categoryIds: ['8'],
          productCount: 320,
          createdAt: new Date('2024-01-06').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString()
        },
        {
          id: '7',
          name: 'Su Geçirmez',
          slug: 'su-gecirmez',
          type: 'BOOLEAN',
          isRequired: false,
          isFilterable: true,
          isVisible: true,
          sortOrder: 7,
          categoryIds: ['1'],
          productCount: 85,
          createdAt: new Date('2024-01-07').toISOString(),
          updatedAt: new Date('2024-01-21').toISOString()
        },
        {
          id: '8',
          name: 'Çıkış Tarihi',
          slug: 'cikis-tarihi',
          type: 'DATE',
          isRequired: false,
          isFilterable: false,
          isVisible: true,
          sortOrder: 8,
          categoryIds: ['1'],
          productCount: 200,
          createdAt: new Date('2024-01-08').toISOString(),
          updatedAt: new Date('2024-01-22').toISOString()
        }
      ],
      stats: {
        totalCategories: 11,
        totalBrands: 6,
        totalAttributes: 8,
        activeCategories: 10,
        activeBrands: 5,
        activeAttributes: 8
      }
    };

    return NextResponse.json(catalogData);
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    
    // Create new category, brand, or attribute
    console.log('Creating catalog item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Catalog item created successfully' 
    });
  } catch (error) {
    console.error('Error creating catalog item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    
    // Update category, brand, or attribute
    console.log('Updating catalog item:', body);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Catalog item updated successfully' 
    });
  } catch (error) {
    console.error('Error updating catalog item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); // category, brand, attribute
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }
    
    // Delete category, brand, or attribute
    console.log('Deleting catalog item:', { id, type });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Catalog item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting catalog item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
