import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Tema dosyalarının yolu
const themesDir = path.join(process.cwd(), 'src/lib/themes');

// Belirli bir temayı getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const themeId = params.id;
    const fileName = `${themeId}.json`;
    const filePath = path.join(themesDir, fileName);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Tema bulunamadı' },
        { status: 404 }
      );
    }
    
    // Tema verisini oku
    const themeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    return NextResponse.json(themeData);
  } catch (error) {
    console.error('Tema yüklenemedi:', error);
    return NextResponse.json(
      { error: 'Tema yüklenemedi' },
      { status: 500 }
    );
  }
}

// Temayı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const themeId = params.id;
    const themeData = await request.json();
    const fileName = `${themeId}.json`;
    const filePath = path.join(themesDir, fileName);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Tema bulunamadı' },
        { status: 404 }
      );
    }
    
    // Tema verisini güncelle
    fs.writeFileSync(filePath, JSON.stringify(themeData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Tema başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Tema güncellenemedi:', error);
    return NextResponse.json(
      { error: 'Tema güncellenemedi' },
      { status: 500 }
    );
  }
}

// Temayı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const themeId = params.id;
    const fileName = `${themeId}.json`;
    const filePath = path.join(themesDir, fileName);
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Tema bulunamadı' },
        { status: 404 }
      );
    }
    
    // Dosyayı sil
    fs.unlinkSync(filePath);
    
    return NextResponse.json({
      success: true,
      message: 'Tema başarıyla silindi'
    });
  } catch (error) {
    console.error('Tema silinemedi:', error);
    return NextResponse.json(
      { error: 'Tema silinemedi' },
      { status: 500 }
    );
  }
}
