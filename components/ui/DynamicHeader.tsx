'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/src/i18n/navigation';

const routeNamesTr: Record<string, string> = {
  'hakkimizda': 'Hakkımızda',
  'hikayemiz': 'Hikayemiz',
  'biz-kimiz': 'Biz Kimiz',
  'ekibimiz': 'Ekibimiz',
  'kurumsal-kimlik': 'Kurumsal Kimlik',
  'basin-odasi': 'Basın Odası',
  'sss': 'S.S.S.',
  'markalarimiz': 'Markalarımız',
  'cezeri-robot-ligi': 'Cezeri Robot Ligi',
  'robonex-robot-ligi': 'Robonex Robot Ligi',
  'tech-chill-fest': 'Tech & Chill Fest',
  'intechne-akademi': 'Intechne Akademi',
  'drone-cup': 'Drone Cup',
  'intechne-girisim-kulubu': 'Intechne Girişim Kulübü',
  'intechne-gaming-hub': 'Intechne Gaming Hub',
  'hack-the-future-marathons': 'Hack the Future',
  'haberler': 'Haberler',
  'iletisim': 'İletişim'
};

const routeNamesEn: Record<string, string> = {
  'hakkimizda': 'About Us',
  'hikayemiz': 'Our Story',
  'biz-kimiz': 'Who We Are',
  'ekibimiz': 'Our Team',
  'kurumsal-kimlik': 'Corporate Identity',
  'basin-odasi': 'Press Room',
  'sss': 'F.A.Q.',
  'markalarimiz': 'Our Brands',
  'cezeri-robot-ligi': 'Cezeri Robot League',
  'robonex-robot-ligi': 'Robonex Robot League',
  'tech-chill-fest': 'Tech & Chill Fest',
  'intechne-akademi': 'Intechne Academy',
  'drone-cup': 'Drone Cup',
  'intechne-girisim-kulubu': 'Intechne Entrepreneurship Club',
  'intechne-gaming-hub': 'Intechne Gaming Hub',
  'hack-the-future-marathons': 'Hack the Future',
  'haberler': 'News',
  'iletisim': 'Contact'
};

export function DynamicHeader({ locale, defaultTitle, defaultTitleEn }: { locale: string, defaultTitle: string, defaultTitleEn: string }) {
  const pathname = usePathname();
  const isEn = locale === 'en';
  
  // Get path parts and remove locale (first part if it's tr or en)
  let parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'tr' || parts[0] === 'en') {
    parts = parts.slice(1);
  }
  
  const names = isEn ? routeNamesEn : routeNamesTr;
  const homeText = isEn ? 'Home' : 'Anasayfa';
  
  const currentPageSlug = parts[parts.length - 1];
  let pageTitle = names[currentPageSlug];
  if (!pageTitle) {
      pageTitle = isEn ? defaultTitleEn : defaultTitle;
  }

  return (
    <div className="bg-[#15a3b0] text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            {homeText}
          </Link>
          
          {parts.map((segment, idx) => {
            const isLast = idx === parts.length - 1;
            const name = names[segment] || segment;
            
            // Build the URL for this segment
            const path = '/' + parts.slice(0, idx + 1).join('/');
            const isUnclickable = path === '/hakkimizda' || path === '/markalarimiz';
            
            return (
              <div key={segment} className="flex items-center gap-2">
                <span>/</span>
                {(isLast || isUnclickable) ? (
                  <span className={isLast ? "text-white" : "text-white/80"}>{name}</span>
                ) : (
                  <Link href={path as any} className="hover:text-white transition-colors whitespace-nowrap">
                    {name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        <h1 className="text-3xl md:text-5xl font-black">
          {pageTitle}
        </h1>
      </div>
    </div>
  );
}
