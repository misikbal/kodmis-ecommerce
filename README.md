# 🛍️ Kodmis E-Commerce Platform

Modern, ölçeklenebilir ve kapsamlı bir e-ticaret platformu. Next.js 15, React 19, TypeScript ve MongoDB ile geliştirilmiştir.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Kurulum](#-kurulum)
- [Yapılandırma](#-yapılandırma)
- [Kullanım](#-kullanım)
- [Proje Yapısı](#-proje-yapısı)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Yapılması Gerekenler](#-yapılması-gerekenler)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## ✨ Özellikler

### 🎯 Temel Özellikler

- ✅ **Ürün Yönetimi**: Kapsamlı ürün kataloğu, varyantlar, stok takibi
- ✅ **Kategori Yönetimi**: Hiyerarşik kategori yapısı, SEO optimizasyonu
- ✅ **Marka Yönetimi**: Marka bilgileri, logolar, web siteleri
- ✅ **Sipariş Yönetimi**: Sipariş takibi, durum yönetimi, fatura oluşturma
- ✅ **Müşteri Yönetimi**: Müşteri profilleri, segmentasyon, sadakat puanları
- ✅ **Stok Yönetimi**: Stok takibi, düşük stok uyarıları, hareket kayıtları
- ✅ **Kargo Yönetimi**: Kargo firmaları, gönderi takibi, teslimat yönetimi
- ✅ **Ödeme Yönetimi**: İşlem kayıtları, ödeme çıkışları, finansal raporlar
- ✅ **Marketplace Entegrasyonları**: Çoklu pazar yeri desteği, senkronizasyon
- ✅ **Tema Sistemi**: 10 farklı profesyonel tema, AI destekli öneriler
- ✅ **Admin Paneli**: Kapsamlı yönetim arayüzü, dashboard, analitikler
- ✅ **Erişilebilirlik**: WCAG uyumlu, klavye kısayolları, ekran okuyucu desteği
- ✅ **Performans Optimizasyonu**: Lazy loading, virtual scrolling, cache yönetimi
- ✅ **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu

### 🎨 Tema Sistemi

10 farklı profesyonel tema desteği:
1. **Teknoloji** - Modern teknoloji ürünleri için
2. **Moda & Tekstil** - Zarif ve şık tasarım
3. **Kozmetik & Kişisel Bakım** - Yumuşak renkler
4. **Mobilya & Ev Dekorasyon** - Doğal tonlar
5. **Elektronik & Bilgisayar** - Sade tasarım
6. **Takı & Aksesuar** - Altın tonları
7. **Spor & Outdoor** - Dinamik renkler
8. **Oyuncak & Çocuk Ürünleri** - Renkli tasarım
9. **Otomotiv & Sanayi** - Güçlü tasarım
10. **Kitap & Hobi** - Klasik tasarım

### 🔐 Güvenlik Özellikleri

- NextAuth.js ile kimlik doğrulama
- Bcrypt ile şifre hashleme
- Role-based access control (ADMIN, VENDOR, CUSTOMER)
- JWT token yönetimi
- Güvenli API endpoint'leri

### 📊 Analitik ve Raporlama

- Dashboard istatistikleri
- Satış raporları
- Müşteri analitikleri
- Ürün performans metrikleri
- Finansal raporlar
- Stok raporları

## 🛠️ Teknolojiler

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI kütüphanesi
- **TypeScript 5** - Tip güvenliği
- **Tailwind CSS 4** - Styling
- **Radix UI** - UI bileşenleri
- **Lucide React** - İkonlar

### Backend
- **Next.js API Routes** - API endpoint'leri
- **MongoDB** - Veritabanı
- **Mongoose** - ODM
- **NextAuth.js** - Kimlik doğrulama
- **Bcrypt.js** - Şifre hashleme

### Diğer
- **Cloudinary** - Görsel yönetimi
- **dotenv** - Ortam değişkenleri
- **tsx** - TypeScript execution

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- MongoDB Atlas hesabı (veya yerel MongoDB)
- Cloudinary hesabı (görsel yükleme için)

### Adım 1: Projeyi Klonlayın

```bash
git clone <repository-url>
cd kodmis-ecommerce
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Ortam Değişkenlerini Yapılandırın

`.env` dosyası oluşturun:

```env
# MongoDB
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="your-upload-preset"

# Hugging Face (AI özellikleri için - opsiyonel)
HF_TOKEN="your-hugging-face-token"
```

### Adım 4: Veritabanını Seed Edin

```bash
npm run seed
```

Bu komut:
- Kullanıcıları oluşturur (admin, manager, customer)
- Kategorileri ekler
- Markaları ekler
- Örnek ürünleri ekler
- Örnek siparişleri ekler

**Demo Giriş Bilgileri:**
- Admin: `admin@kodmis.com` / `admin123`
- Manager: `manager@kodmis.com` / `manager123`
- Customer: `customer1@kodmis.com` / `customer123`

### Adım 5: Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## ⚙️ Yapılandırma

### MongoDB Atlas Yapılandırması

1. MongoDB Atlas'ta bir cluster oluşturun
2. Network Access'te IP whitelist ekleyin (0.0.0.0/0 tüm IP'ler için)
3. Database Access'te bir kullanıcı oluşturun
4. Connection string'i `.env` dosyasına ekleyin

### Cloudinary Yapılandırması

1. Cloudinary hesabı oluşturun
2. Dashboard'dan API bilgilerini alın
3. Upload preset oluşturun
4. Bilgileri `.env` dosyasına ekleyin

## 📖 Kullanım

### Geliştirme

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucu
npm start

# Linting
npm run lint

# Veritabanı seed
npm run seed
```

### Admin Paneli

Admin paneline erişim: `/admin`

**Özellikler:**
- Dashboard ve istatistikler
- Ürün yönetimi
- Kategori yönetimi
- Marka yönetimi
- Sipariş yönetimi
- Müşteri yönetimi
- Stok yönetimi
- Finansal raporlar
- Marketplace entegrasyonları
- Tema ayarları

### API Kullanımı

API endpoint'leri `/api` altında bulunur:

- `/api/admin/*` - Admin API'leri
- `/api/auth/*` - Kimlik doğrulama
- `/api/themes/*` - Tema yönetimi
- `/api/upload` - Dosya yükleme
- `/api/cloudinary/*` - Cloudinary entegrasyonu

## 📁 Proje Yapısı

```
kodmis-ecommerce/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin panel sayfaları
│   │   │   ├── products/       # Ürün yönetimi
│   │   │   ├── categories/    # Kategori yönetimi
│   │   │   ├── orders/         # Sipariş yönetimi
│   │   │   ├── customers/      # Müşteri yönetimi
│   │   │   ├── inventory/      # Stok yönetimi
│   │   │   ├── finance/        # Finansal raporlar
│   │   │   ├── marketplaces/   # Marketplace entegrasyonları
│   │   │   └── settings/       # Ayarlar
│   │   ├── api/                # API routes
│   │   │   ├── admin/          # Admin API'leri
│   │   │   ├── auth/           # Kimlik doğrulama
│   │   │   └── themes/         # Tema API'leri
│   │   ├── auth/               # Kimlik doğrulama sayfaları
│   │   ├── profile/            # Kullanıcı profili
│   │   └── products/           # Ürün listeleme
│   ├── components/             # React bileşenleri
│   │   ├── admin/              # Admin bileşenleri
│   │   ├── layout/             # Layout bileşenleri
│   │   ├── ui/                 # UI bileşenleri
│   │   ├── accessibility/      # Erişilebilirlik
│   │   └── performance/        # Performans optimizasyonları
│   ├── lib/                    # Yardımcı fonksiyonlar
│   │   ├── models/             # Mongoose modelleri
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   ├── Category.ts
│   │   │   ├── Brand.ts
│   │   │   └── ...
│   │   ├── mongodb.ts          # MongoDB bağlantısı
│   │   ├── auth.ts             # NextAuth yapılandırması
│   │   ├── seed.ts             # Veritabanı seed script'i
│   │   └── themes/             # Tema tanımları
│   ├── test-data/              # Test verileri
│   └── types/                  # TypeScript tipleri
├── public/                     # Statik dosyalar
├── .env                        # Ortam değişkenleri
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 API Dokümantasyonu

### Admin API'leri

#### Ürünler
- `GET /api/admin/products` - Ürün listesi
- `POST /api/admin/products` - Yeni ürün oluştur
- `GET /api/admin/products/[id]` - Ürün detayı
- `PUT /api/admin/products/[id]` - Ürün güncelle
- `DELETE /api/admin/products/[id]` - Ürün sil

#### Kategoriler
- `GET /api/admin/categories` - Kategori listesi
- `POST /api/admin/categories` - Yeni kategori oluştur
- `PUT /api/admin/categories/[id]` - Kategori güncelle
- `DELETE /api/admin/categories/[id]` - Kategori sil

#### Siparişler
- `GET /api/admin/orders` - Sipariş listesi
- `GET /api/admin/orders/[id]` - Sipariş detayı
- `PUT /api/admin/orders/[id]` - Sipariş durumu güncelle

#### Müşteriler
- `GET /api/admin/customers` - Müşteri listesi
- `GET /api/admin/customers/[id]` - Müşteri detayı

Daha fazla API dokümantasyonu için `src/app/api` klasörüne bakın.

## 🔨 Yapılması Gerekenler (TODO)

### 🔴 Yüksek Öncelik

- [ ] **Ödeme Entegrasyonu**
  - [ ] Stripe entegrasyonu
  - [ ] İyzico entegrasyonu
  - [ ] Ödeme geçmişi ve faturalama
  - [ ] Abonelik yönetimi

- [ ] **E-posta Sistemi**
  - [ ] Sipariş onay e-postaları
  - [ ] Kargo takip e-postaları
  - [ ] Pazarlama e-postaları
  - [ ] Şifre sıfırlama e-postaları

- [ ] **Güvenlik İyileştirmeleri**
  - [ ] Rate limiting
  - [ ] CSRF koruması
  - [ ] XSS koruması
  - [ ] SQL injection koruması
  - [ ] Güvenlik audit'i

- [ ] **Test Coverage**
  - [ ] Unit testler
  - [ ] Integration testler
  - [ ] E2E testler
  - [ ] Test coverage raporu

### 🟡 Orta Öncelik

- [ ] **Arama ve Filtreleme**
  - [ ] Gelişmiş arama algoritması
  - [ ] Filtreleme seçenekleri
  - [ ] Sıralama seçenekleri
  - [ ] Arama önerileri

- [ ] **Çoklu Dil Desteği**
  - [ ] i18n entegrasyonu
  - [ ] Dil seçici
  - [ ] Çeviri dosyaları
  - [ ] RTL dil desteği

- [ ] **Bildirim Sistemi**
  - [ ] Push bildirimleri
  - [ ] In-app bildirimleri
  - [ ] E-posta bildirimleri
  - [ ] SMS bildirimleri

- [ ] **Raporlama**
  - [ ] Excel/PDF export
  - [ ] Gelişmiş grafikler
  - [ ] Özel raporlar
  - [ ] Zamanlama raporları

- [ ] **Marketplace Entegrasyonları**
  - [ ] Trendyol API entegrasyonu
  - [ ] Hepsiburada API entegrasyonu
  - [ ] GittiGidiyor API entegrasyonu
  - [ ] Otomatik senkronizasyon

- [ ] **Performans Optimizasyonu**
  - [ ] Redis cache entegrasyonu
  - [ ] CDN yapılandırması
  - [ ] Image optimization
  - [ ] Bundle size optimization

### 🟢 Düşük Öncelik

- [ ] **Sosyal Medya Entegrasyonu**
  - [ ] Facebook entegrasyonu
  - [ ] Instagram entegrasyonu
  - [ ] Twitter entegrasyonu
  - [ ] Sosyal medya paylaşımı

- [ ] **Yorum ve Değerlendirme Sistemi**
  - [ ] Ürün yorumları
  - [ ] Değerlendirme sistemi
  - [ ] Fotoğraf yükleme
  - [ ] Moderatör paneli

- [ ] **Kampanya Yönetimi**
  - [ ] İndirim kuponları
  - [ ] Flash sale'ler
  - [ ] Kampanya yönetimi
  - [ ] Promosyon kodları

- [ ] **Canlı Destek**
  - [ ] Chat widget
  - [ ] Canlı destek paneli
  - [ ] Ticket sistemi
  - [ ] FAQ sistemi

- [ ] **Mobil Uygulama**
  - [ ] React Native uygulaması
  - [ ] Push bildirimleri
  - [ ] Offline mod
  - [ ] App store yayınlama

### 🐛 Bug Fixes

- [ ] MongoDB bağlantı timeout sorunları
- [ ] Duplicate schema index uyarıları
- [ ] Image upload hataları
- [ ] Form validation sorunları
- [ ] Responsive tasarım düzeltmeleri

### 📝 Dokümantasyon

- [ ] API dokümantasyonu (Swagger/OpenAPI)
- [ ] Kullanıcı kılavuzu
- [ ] Geliştirici kılavuzu
- [ ] Deployment kılavuzu
- [ ] Video tutorial'lar

## 🐛 Bilinen Sorunlar

1. **MongoDB Bağlantı Timeout**: Bazı durumlarda MongoDB bağlantısı timeout olabilir. IP whitelist ve network ayarlarını kontrol edin.

2. **Duplicate Schema Index**: Mongoose schema'larında duplicate index uyarıları var. Düzeltilmesi gerekiyor.

3. **Image Upload**: Cloudinary entegrasyonunda bazı edge case'lerde hata oluşabilir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir lisans altındadır. Detaylar için `LICENSE` dosyasına bakın.

## 👥 İletişim

Sorularınız için issue açabilir veya e-posta gönderebilirsiniz.

## 🙏 Teşekkürler

- Next.js ekibine
- React ekibine
- Tüm açık kaynak katkıda bulunanlara

---

**Not**: Bu proje aktif geliştirme aşamasındadır. Production kullanımından önce kapsamlı testler yapılmalıdır.
