import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosyayı ArrayBuffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary'ye yükle
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'image',
        folder: 'ecommerce_products',
        public_id: `${Date.now()}_${file.name.split('.')[0]}`,
      };

      // Upload preset varsa ekle
      if (process.env.CLOUDINARY_UPLOAD_PRESET) {
        uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      public_id: (result as any).public_id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Yükleme hatası' },
      { status: 500 }
    );
  }
}
