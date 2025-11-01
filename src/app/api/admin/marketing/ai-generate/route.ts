import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { type, input, tone, length } = body;
    
    if (!type || !input) {
      return NextResponse.json({ error: 'Type and input are required' }, { status: 400 });
    }

    // Mock AI generation - In real implementation, this would call an AI service
    const generateContent = (type: string, input: string, tone: string, length: string) => {
      const outputs = [];
      
      switch (type) {
        case 'PRODUCT_DESCRIPTION':
          outputs.push(
            `${input} - Premium kalite ve güvenilir performans ile donatılmış. Modern tasarım ve kullanıcı dostu arayüz.`,
            `${input} için mükemmel seçim. Yüksek kalite standartları ve dayanıklı yapısı ile uzun süreli kullanım garantisi.`,
            `${input} - Teknoloji ve estetiğin buluştuğu nokta. Gelişmiş özellikler ve şık tasarım bir arada.`
          );
          break;
          
        case 'AD_TEXT':
          outputs.push(
            `🔥 ${input} - Şimdi sipariş ver, fırsatı kaçırma! Hızlı teslimat ve güvenli alışveriş.`,
            `⚡ ${input} - Sınırlı süre için özel fiyat! Kalite ve güvenin adresi.`,
            `🎉 ${input} - En uygun fiyat garantisi! Hemen sahip ol, farkı yaşa.`
          );
          break;
          
        case 'EMAIL_SUBJECT':
          outputs.push(
            `🔥 ${input} - Kaçırma!`,
            `⚡ ${input} - Sınırlı Süre`,
            `🎉 ${input} - Özel Fırsat`
          );
          break;
          
        case 'SOCIAL_MEDIA':
          outputs.push(
            `🚀 ${input} - Teknoloji dünyasında devrim! #Teknoloji #İnovasyon`,
            `✨ ${input} - Yaratıcılığınızı sınır tanımadan ifade edin! #Yaratıcılık #İlham`,
            `💻 ${input} - Performans ve portabilite mükemmel uyumu! #Performans #Kalite`
          );
          break;
          
        case 'SEO_TITLE':
          outputs.push(
            `${input} - En Uygun Fiyat | Hızlı Teslimat`,
            `${input} Satın Al | Güvenli Alışveriş | Resmi Satış`,
            `${input} - Premium Kalite | Uygun Fiyat Garantisi`
          );
          break;
          
        case 'SEO_DESCRIPTION':
          outputs.push(
            `${input} hakkında detaylı bilgi. En uygun fiyat, hızlı teslimat ve güvenli alışveriş. Premium kalite garantisi.`,
            `${input} için en iyi seçenekler. Kaliteli ürünler, uygun fiyatlar ve müşteri memnuniyeti odaklı hizmet.`,
            `${input} - Güvenilir marka, kaliteli ürünler. Hızlı teslimat ve 7/24 müşteri desteği ile hizmetinizdeyiz.`
          );
          break;
          
        default:
          outputs.push(
            `${input} - Kaliteli ve güvenilir seçenek.`,
            `${input} - En iyi fiyat ve hizmet garantisi.`,
            `${input} - Müşteri memnuniyeti odaklı çözüm.`
          );
      }
      
      // Adjust length based on parameter
      if (length === 'SHORT') {
        return outputs.map(output => output.split(' ').slice(0, 10).join(' '));
      } else if (length === 'LONG') {
        return outputs.map(output => output + ' Detaylı bilgi için iletişime geçin. Kalite ve güvenin adresi.');
      }
      
      return outputs;
    };

    const generatedContent = generateContent(type, input, tone, length);
    
    // In real implementation, save to database
    const aiContent = {
      id: Date.now().toString(),
      type,
      input,
      output: generatedContent,
      language: 'tr',
      tone,
      length,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: aiContent,
      message: 'AI content generated successfully'
    });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
