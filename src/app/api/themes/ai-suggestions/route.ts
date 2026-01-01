import { NextRequest, NextResponse } from 'next/server';

// AI tema önerisi fonksiyonu
export async function POST(request: NextRequest) {
  try {
    const { productCategories, brandColors, preferences } = await request.json();
    
    // Bu fonksiyon gerçek AI entegrasyonu ile değiştirilecek
    // Şimdilik basit kurallar tabanlı öneriler yapıyoruz
    
    const suggestions = generateThemeSuggestions(productCategories, brandColors, preferences);
    
    return NextResponse.json({
      success: true,
      suggestions,
      message: 'AI tema önerileri başarıyla oluşturuldu'
    });
  } catch (error) {
    console.error('AI tema önerileri oluşturulamadı:', error);
    return NextResponse.json(
      { error: 'AI tema önerileri oluşturulamadı' },
      { status: 500 }
    );
  }
}

// Basit kurallar tabanlı tema önerisi algoritması
function generateThemeSuggestions(categories: string[], brandColors: string[], preferences: any) {
  const suggestions = [];
  
  // Kategori bazlı öneriler
  const categoryThemeMap = {
    'electronics': 'technology',
    'technology': 'technology',
    'computer': 'technology',
    'phone': 'technology',
    'fashion': 'fashion',
    'clothing': 'fashion',
    'textile': 'fashion',
    'beauty': 'cosmetics',
    'cosmetics': 'cosmetics',
    'skincare': 'cosmetics',
    'furniture': 'furniture',
    'home': 'furniture',
    'decor': 'furniture',
    'jewelry': 'jewelry',
    'accessories': 'jewelry',
    'luxury': 'jewelry',
    'sports': 'sports',
    'outdoor': 'sports',
    'fitness': 'sports',
    'toys': 'toys',
    'children': 'toys',
    'kids': 'toys',
    'automotive': 'automotive',
    'car': 'automotive',
    'industrial': 'automotive',
    'books': 'books',
    'education': 'books',
    'hobby': 'books'
  };
  
  // En çok geçen kategoriyi bul
  const categoryCounts: Record<string, number> = {};
  categories.forEach(category => {
    const normalizedCategory = category.toLowerCase();
    categoryCounts[normalizedCategory] = (categoryCounts[normalizedCategory] || 0) + 1;
  });
  
  const topCategory = Object.keys(categoryCounts).reduce((a, b) => 
    categoryCounts[a] > categoryCounts[b] ? a : b
  );
  
  const suggestedThemeId = (categoryThemeMap as Record<string, string>)[topCategory] || 'default';
  
  // Tema önerisi oluştur
  suggestions.push({
    id: `ai-${suggestedThemeId}-${Date.now()}`,
    name: `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} Teması`,
    description: `${topCategory} kategorisi için optimize edilmiş tema`,
    category: topCategory,
    themeId: suggestedThemeId,
    confidence: 0.9,
    reasoning: `Ürün kategorilerinizde "${topCategory}" en çok geçen kategori olduğu için bu tema öneriliyor.`
  });
  
  // Marka renkleri bazlı öneri
  if (brandColors && brandColors.length > 0) {
    const dominantColor = brandColors[0]; // İlk rengi dominant olarak al
    
    suggestions.push({
      id: `ai-brand-${Date.now()}`,
      name: 'Marka Renkli Tema',
      description: `Marka renklerinize uygun özel tema`,
      category: 'custom',
      themeId: 'custom',
      confidence: 0.8,
      reasoning: `Marka renklerinizden "${dominantColor}" rengi kullanılarak özel tema oluşturuldu.`,
      customColors: {
        primary: dominantColor,
        secondary: generateComplementaryColor(dominantColor),
        accent: generateAccentColor(dominantColor)
      }
    });
  }
  
  // Tercihler bazlı öneri
  if (preferences && preferences.style) {
    const styleThemeMap = {
      'modern': 'technology',
      'minimalist': 'cosmetics',
      'elegant': 'fashion',
      'luxury': 'jewelry',
      'playful': 'toys',
      'professional': 'electronics',
      'classic': 'books',
      'industrial': 'automotive'
    };
    
    const styleThemeId = (styleThemeMap as Record<string, string>)[preferences.style] || 'default';
    
    suggestions.push({
      id: `ai-style-${Date.now()}`,
      name: `${preferences.style.charAt(0).toUpperCase() + preferences.style.slice(1)} Stil Tema`,
      description: `${preferences.style} stil tercihinize uygun tema`,
      category: preferences.style,
      themeId: styleThemeId,
      confidence: 0.85,
      reasoning: `"${preferences.style}" stil tercihinize göre bu tema öneriliyor.`
    });
  }
  
  return suggestions;
}

// Renk yardımcı fonksiyonları
function generateComplementaryColor(hex: string): string {
  // Basit tamamlayıcı renk algoritması
  const colorMap: Record<string, string> = {
    '#FF0000': '#00FFFF', // Kırmızı -> Cyan
    '#00FF00': '#FF00FF', // Yeşil -> Magenta
    '#0000FF': '#FFFF00', // Mavi -> Sarı
    '#FFFF00': '#0000FF', // Sarı -> Mavi
    '#FF00FF': '#00FF00', // Magenta -> Yeşil
    '#00FFFF': '#FF0000'  // Cyan -> Kırmızı
  };
  
  return colorMap[hex.toUpperCase()] || '#666666';
}

function generateAccentColor(hex: string): string {
  // Basit vurgu rengi algoritması
  const colorMap: Record<string, string> = {
    '#FF0000': '#FF6B6B', // Kırmızı -> Açık kırmızı
    '#00FF00': '#6BFF6B', // Yeşil -> Açık yeşil
    '#0000FF': '#6B6BFF', // Mavi -> Açık mavi
    '#FFFF00': '#FFFF6B', // Sarı -> Açık sarı
    '#FF00FF': '#FF6BFF', // Magenta -> Açık magenta
    '#00FFFF': '#6BFFFF'  // Cyan -> Açık cyan
  };
  
  return colorMap[hex.toUpperCase()] || '#FFD700';
}
