import { Link } from '@/src/i18n/navigation';
import { trNavigation, enNavigation } from '@/src/data/navigation';

interface FooterProps {
  locale: string;
}

const socialLinks = [
  {
    href: 'https://instagram.com/intechne/',
    label: 'Instagram',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@intechnetech',
    label: 'YouTube',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/intechne-tech/',
    label: 'LinkedIn',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
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
          <div className="lg:col-span-4">
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

                {/* Sosyal Medya İkonları */}
                <div className="mt-4">
                  <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-white">
                    {isEn ? 'Social Media' : 'Sosyal Medya'}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map(({ href, label, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 hover:text-primary transition-all duration-200 flex items-center justify-center text-white"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

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
