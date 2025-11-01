import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'minimal';
  showSocial?: boolean;
  showContact?: boolean;
}

const footerLinks = {
  categories: [
    { name: 'Elektronik', href: '/categories/electronics' },
    { name: 'Giyim', href: '/categories/clothing' },
    { name: 'Ev & Yaşam', href: '/categories/home' },
    { name: 'Spor', href: '/categories/sports' },
    { name: 'Kitap', href: '/categories/books' },
  ],
  customerService: [
    { name: 'Sipariş Takibi', href: '/track-order' },
    { name: 'İade & Değişim', href: '/returns' },
    { name: 'Kargo Bilgileri', href: '/shipping' },
    { name: 'SSS', href: '/faq' },
    { name: 'Müşteri Hizmetleri', href: '/contact' },
  ],
  corporate: [
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Kariyer', href: '/careers' },
    { name: 'Basın', href: '/press' },
    { name: 'Gizlilik Politikası', href: '/privacy' },
    { name: 'Kullanım Şartları', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
];

export default function Footer({ 
  variant = 'default', 
  showSocial = true, 
  showContact = true 
}: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            © 2024 Kodmis. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="ml-2 text-xl font-bold">Kodmis</span>
            </div>
            <p className="text-gray-300 text-sm">
              Türkiye'nin en güvenilir e-ticaret platformu. Kaliteli ürünler, hızlı kargo ve müşteri memnuniyeti odaklı hizmet.
            </p>
            {showSocial && (
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Müşteri Hizmetleri</h3>
            <ul className="space-y-2">
              {footerLinks.customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          {showContact && (
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-300 text-sm">
                    İstanbul, Türkiye
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-300 text-sm">
                    +90 (212) 555-0123
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-300 text-sm">
                    info@kodmis.com
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 Kodmis. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {footerLinks.corporate.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
