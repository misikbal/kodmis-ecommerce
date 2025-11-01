import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('max_results') || '50');

    // Cloudinary'den fotoğrafları listele
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      max_results: maxResults,
      prefix: 'ecommerce_products/'
    });

    console.log('Cloudinary resources result:', {
      total: result.resources.length,
      resources: result.resources.slice(0, 2) // İlk 2 öğeyi log'la
    });

    // Fotoğrafları optimize edilmiş URL'lerle döndür
    const images = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: cloudinary.url(resource.public_id, {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      }),
      thumbnail: cloudinary.url(resource.public_id, {
        width: 200,
        height: 150,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      }),
      alt: resource.public_id.split('/').pop()?.replace(/\.[^/.]+$/, ''),
      created_at: resource.created_at
    }));

    return NextResponse.json({
      success: true,
      images,
      total: result.total_count
    });

  } catch (error) {
    console.error('Cloudinary list error:', error);
    return NextResponse.json(
      { success: false, error: 'Fotoğraflar yüklenemedi' },
      { status: 500 }
    );
  }
}
