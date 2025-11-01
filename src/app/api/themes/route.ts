import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Tema dosyalarının yolu
const themesDir = path.join(process.cwd(), 'src/lib/themes');

// Tüm temaları getir
export async function GET() {
  try {
    const themes = [];
    
    // Tema dosyalarını oku
    const themeFiles = fs.readdirSync(themesDir);
    
    for (const file of themeFiles) {
      if (file.endsWith('.json')) {
        const themePath = path.join(themesDir, file);
        const themeData = JSON.parse(fs.readFileSync(themePath, 'utf8'));
        themes.push(themeData);
      }
    }
    
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Temalar yüklenemedi:', error);
    return NextResponse.json(
      { error: 'Temalar yüklenemedi' },
      { status: 500 }
    );
  }
}

// Yeni tema oluştur
export async function POST(request: NextRequest) {
  try {
    const themeData = await request.json();
    
    // Tema ID'sini oluştur
    const themeId = themeData.id || `custom-${Date.now()}`;
    const fileName = `${themeId}.json`;
    const filePath = path.join(themesDir, fileName);
    
    // Tema verisini dosyaya kaydet
    fs.writeFileSync(filePath, JSON.stringify(themeData, null, 2));
    
    return NextResponse.json({
      success: true,
      themeId,
      message: 'Tema başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('Tema oluşturulamadı:', error);
    return NextResponse.json(
      { error: 'Tema oluşturulamadı' },
      { status: 500 }
    );
  }
}
