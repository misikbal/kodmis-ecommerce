# Kodmis E-commerce Tema Sistemi

Bu proje, e-ticaret platformları için kapsamlı bir tema sistemi içerir. Satıcılar, ürün kategorilerine göre 10 farklı profesyonel tema arasından seçim yapabilir ve AI destekli öneriler alabilir.

## 🎨 Özellikler

### 10 Profesyonel Tema
1. **Teknoloji** - Modern teknoloji ürünleri için keskin kenarlar ve neon efektler
2. **Moda & Tekstil** - Zarif ve şık moda ürünleri için pastel renkler
3. **Kozmetik & Kişisel Bakım** - Yumuşak renkler ve minimal tasarım
4. **Mobilya & Ev Dekorasyon** - Doğal ahşap tonları ve sıcak atmosfer
5. **Elektronik & Bilgisayar** - Sade tasarım ve güçlü kontrastlar
6. **Takı & Aksesuar** - Altın tonları ve yüksek kontrast
7. **Spor & Outdoor** - Dinamik renkler ve enerjik tasarım
8. **Oyuncak & Çocuk Ürünleri** - Renkli ve eğlenceli tasarım
9. **Otomotiv & Sanayi** - Güçlü ve köşeli tasarım
10. **Kitap & Hobi** - Klasik ve tipografi odaklı tasarım

### Tema Sistemi Özellikleri
- ✅ **Dinamik Tema Değiştirme** - Anında tema uygulama
- ✅ **Dark/Light Mode** - Otomatik ve manuel mod değiştirme
- ✅ **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ✅ **AI Destekli Öneriler** - Ürün kategorisine göre tema önerileri
- ✅ **Özelleştirilebilir** - Renk, tipografi ve bileşen özelleştirme
- ✅ **Animasyonlar** - Yumuşak geçişler ve hover efektleri
- ✅ **Tema İçe/Dışa Aktarma** - JSON formatında tema paylaşımı

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Next.js 15+
- React 19+
- TypeScript 5+

### Başlangıç
```bash
# Projeyi klonlayın
git clone <repository-url>
cd kodmis-ecommerce

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── admin/settings/theme/     # Tema ayarları sayfası
│   ├── api/themes/              # Tema API endpoint'leri
│   └── theme-demo/              # Tema demo sayfası
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx     # Güncellenmiş admin sidebar
│   │   └── ThemeSelector.tsx    # Tema seçici modal
│   ├── providers/
│   │   └── ThemeProvider.tsx    # Tema context provider
│   └── ui/
│       ├── ProductCard.tsx      # Tema uyumlu ürün kartı
│       ├── ThemeButton.tsx     # Tema uyumlu buton
│       └── ThemeInput.tsx       # Tema uyumlu input
└── lib/
    └── themes/                  # Tema konfigürasyon dosyaları
        ├── technology.json
        ├── fashion.json
        ├── cosmetics.json
        ├── furniture.json
        ├── electronics.json
        ├── jewelry.json
        ├── sports.json
        ├── toys.json
        ├── automotive.json
        └── books.json
```

## 🎯 Kullanım

### Temel Tema Kullanımı

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

function MyComponent() {
  const { currentTheme, setTheme, toggleDarkMode } = useTheme();
  
  return (
    <div style={{ backgroundColor: currentTheme?.colors.background }}>
      <h1 style={{ color: currentTheme?.colors.text }}>
        {currentTheme?.name}
      </h1>
      <button onClick={() => setTheme('technology')}>
        Teknoloji Teması
      </button>
    </div>
  );
}
```

### Tema Bileşenleri

```tsx
import ThemeButton from '@/components/ui/ThemeButton';
import ThemeInput from '@/components/ui/ThemeInput';
import ProductCard from '@/components/ui/ProductCard';

function ProductPage() {
  return (
    <div>
      <ThemeButton variant="primary" size="lg">
        Sepete Ekle
      </ThemeButton>
      
      <ThemeInput 
        label="Ürün Ara"
        placeholder="Arama yapın..."
        variant="search"
      />
      
      <ProductCard 
        product={productData}
        layout="grid"
        showActions={true}
      />
    </div>
  );
}
```

### Tema Seçici Modal

```tsx
import ThemeSelector from '@/components/admin/ThemeSelector';

function AdminPage() {
  const [showSelector, setShowSelector] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowSelector(true)}>
        Tema Seç
      </button>
      
      {showSelector && (
        <ThemeSelector onClose={() => setShowSelector(false)} />
      )}
    </div>
  );
}
```

## 🎨 Tema Konfigürasyonu

Her tema JSON dosyası şu yapıya sahiptir:

```json
{
  "id": "technology",
  "name": "Teknoloji",
  "description": "Modern teknoloji ürünleri için tema",
  "category": "electronics",
  "colors": {
    "primary": "#00D4FF",
    "secondary": "#1A1A1A",
    "accent": "#FF6B35",
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#1A1A1A"
  },
  "typography": {
    "fontFamily": {
      "primary": "Inter, system-ui, sans-serif",
      "display": "Poppins, sans-serif"
    }
  },
  "components": {
    "button": {
      "primary": {
        "background": "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
        "borderRadius": "0.5rem",
        "padding": "0.75rem 1.5rem"
      }
    }
  }
}
```

## 🤖 AI Destekli Öneriler

Sistem, ürün kategorilerine göre otomatik tema önerileri sunar:

```tsx
// AI önerileri al
const response = await fetch('/api/themes/ai-suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productCategories: ['electronics', 'technology'],
    brandColors: ['#2563eb', '#1d4ed8'],
    preferences: {
      style: 'modern',
      layout: 'grid'
    }
  })
});
```

## 📱 Responsive Tasarım

Tüm temalar responsive olarak tasarlanmıştır:

- **Mobil (640px altı)**: Kompakt düzen, küçük butonlar
- **Tablet (768px altı)**: Orta boyutlu bileşenler
- **Desktop (1024px+)**: Tam özellikli düzen

## 🎭 Dark Mode

Dark mode otomatik olarak sistem tercihlerine göre aktif olur:

```tsx
const { isDarkMode, toggleDarkMode } = useTheme();

// Manuel toggle
<button onClick={toggleDarkMode}>
  {isDarkMode ? 'Açık Mod' : 'Karanlık Mod'}
</button>
```

## 🔧 Özelleştirme

### CSS Değişkenleri

Tema sistemi CSS değişkenleri kullanır:

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-background: #ffffff;
  --color-text: #111827;
  --font-primary: 'Inter', sans-serif;
  --spacing-md: 1rem;
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Tema Sınıfları

```css
.theme-button-primary { /* Tema uyumlu buton */ }
.theme-card { /* Tema uyumlu kart */ }
.theme-input { /* Tema uyumlu input */ }
.theme-text-primary { /* Ana metin rengi */ }
.theme-bg-surface { /* Yüzey arka planı */ }
```

## 🚀 API Endpoints

### Tema Yönetimi
- `GET /api/themes` - Tüm temaları listele
- `GET /api/themes/[id]` - Belirli temayı getir
- `POST /api/themes` - Yeni tema oluştur
- `PUT /api/themes/[id]` - Temayı güncelle
- `DELETE /api/themes/[id]` - Temayı sil

### AI Önerileri
- `POST /api/themes/ai-suggestions` - AI tema önerileri

## 🧪 Test

```bash
# Tema demo sayfasını ziyaret edin
http://localhost:3000/theme-demo

# Admin tema ayarları
http://localhost:3000/admin/settings/theme
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: support@kodmis.com
- Dokümantasyon: [docs.kodmis.com](https://docs.kodmis.com)

---

**Kodmis E-commerce Tema Sistemi** - Modern e-ticaret platformları için profesyonel tema çözümü.
