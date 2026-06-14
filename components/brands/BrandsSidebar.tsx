'use client';

import { usePathname, Link } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';
import { trNavigation, enNavigation } from '@/src/data/navigation';
import { brands } from '@/src/data/brands';

export function BrandsSidebar() {
  const pathname = usePathname();
  const locale = useLocale();

  const navigationConfig = locale === 'en' ? enNavigation : trNavigation;
  const brandsMenu = navigationConfig.main.find(
    (item) => item.label === 'MARKALARIMIZ' || item.label === 'OUR BRANDS'
  );

  const links = brandsMenu && 'items' in brandsMenu ? brandsMenu.items : [];

  return (
    <aside className="lg:w-1/4 flex-shrink-0 w-full">
      <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 lg:sticky lg:top-24 border border-slate-100">
        <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const slug = link.href.split('/').pop() || '';
            const brand = brands.find((b) => b.slug === slug);
            const accentColor = brand?.accentColor || '#15a3b0';

            return (
              <li key={link.href} className="flex-shrink-0 lg:flex-shrink">
                <Link
                  href={link.href as any}
                  className={cn(
                    "block px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap lg:whitespace-normal border-l-4",
                    isActive
                      ? "text-white shadow-md"
                      : ""
                  )}
                  style={{
                    backgroundColor: isActive ? accentColor : `${accentColor}0d`,
                    borderLeftColor: isActive ? accentColor : 'transparent',
                    color: isActive ? 'white' : accentColor,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${accentColor}1a`;
                      e.currentTarget.style.color = accentColor;
                      e.currentTarget.style.borderLeftColor = accentColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = `${accentColor}0d`;
                      e.currentTarget.style.color = accentColor;
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
