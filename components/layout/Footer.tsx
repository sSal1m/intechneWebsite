import { Link } from '@/src/i18n/navigation';
import { trNavigation, enNavigation } from '@/src/data/navigation';

interface FooterProps {
  locale: string;
}

const socialLinks = [
  { href: 'https://instagram.com/intechne/', label: 'Instagram', letter: 'IG' },
  { href: 'https://www.youtube.com/@intechnetech', label: 'YouTube', letter: 'YT' },
  { href: 'https://www.linkedin.com/company/intechne-tech/', label: 'LinkedIn', letter: 'in' },
];

export function Footer({ locale }: FooterProps) {
  const isEn = locale === 'en';
  const navigation = isEn ? enNavigation : trNavigation;

  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Column 1: Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.avif"
                alt="Intechne Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-base mb-5 text-white">
              <Link href="/iletisim" className="hover:text-white/80 transition-colors">
                {isEn ? 'Contact' : 'İletişim'}
              </Link>
            </h4>
            <div className="space-y-3">
              <p className="text-white/70 text-sm leading-relaxed">
                <strong className="text-white">{isEn ? 'Address' : 'Adres'}:</strong>{' '}
                İstanbul/Türkiye
              </p>
              <p className="text-white/70 text-sm">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:kurumsal@intechne.com.tr" className="hover:text-white transition-colors break-all">
                  kurumsal@intechne.com.tr
                </a>
              </p>
              <p className="text-white/70 text-sm">
                <strong className="text-white">{isEn ? 'Phone' : 'Telefon'}:</strong>{' '}
                <a href="tel:05346349058" className="hover:text-white transition-colors">
                  0534 634 9058
                </a>
              </p>
            </div>
          </div>

          {/* Column 3: Menus */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              
              {/* Dinamik Menüler (Sadece Alt Menüsü Olanlar) */}
              {navigation.main.map((menu, index) => {
                if ('items' in menu) {
                  return (
                    <div key={index}>
                      <h4 className="font-bold text-base mb-5 text-white tracking-wide">
                        {menu.label}
                      </h4>
                      <ul className="space-y-3">
                        {menu.items.map((item, idx) => (
                          <li key={idx}>
                            <Link href={item.href as any} className="text-white/70 text-sm hover:text-white transition-colors">
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null;
              })}

              {/* Dinamik Menüler (Alt Menüsü Olmayanlar - Haberler vs.) */}
              <div className="flex flex-col gap-6">
                {navigation.main.map((menu, index) => {
                  if (!('items' in menu) && menu.label !== 'İLETİŞİM' && menu.label !== 'CONTACT') {
                    return (
                      <div key={`single-${index}`}>
                        <h4 className="font-bold text-base text-white tracking-wide">
                          <Link href={menu.href as any} className="hover:text-white/80 transition-colors">
                            {menu.label}
                          </Link>
                        </h4>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

            </div>
          </div>

          {/* Column 4: Social Media */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-base mb-5 flex items-center gap-2 text-white">
              {isEn ? 'Social Media' : 'Sosyal Medya'}
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, letter }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 transition-colors flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">{letter}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white/60 text-xs">
            <span>© 2026 {isEn ? 'INTECHNE TECHNOLOGY' : 'INTECHNE TEKNOLOJİ'}</span>
            <span className="hidden sm:block">|</span>
            <a 
              href="https://drive.google.com/file/d/1l9YG0k9t0mWb1G2AzjiO16oY3K6ZdpGe/view?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              {isEn ? 'PRIVACY POLICY' : 'GİZLİLİK POLİTİKASI'}
            </a>
            <span className="hidden sm:block">|</span>
            <a 
              href="https://drive.google.com/file/d/1l9YG0k9t0mWb1G2AzjiO16oY3K6ZdpGe/view?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              {isEn ? 'KVKK AYDINLATMA METNİ' : 'KVKK AYDINLATMA METNİ'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
