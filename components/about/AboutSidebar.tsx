'use client';

import { usePathname, Link } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';
import { trNavigation, enNavigation } from '@/src/data/navigation';

export function AboutSidebar() {
  const pathname = usePathname();
  const locale = useLocale();

  const navigationConfig = locale === 'en' ? enNavigation : trNavigation;
  const aboutMenu = navigationConfig.main.find(
    (item) => item.label === 'HAKKIMIZDA' || item.label === 'ABOUT US'
  );

  const links = aboutMenu && 'items' in aboutMenu ? aboutMenu.items : [];

  return (
    <aside className="lg:w-1/4 flex-shrink-0 w-full">
      <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 lg:sticky lg:top-24 border border-slate-100">
        <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="flex-shrink-0 lg:flex-shrink">
                <Link
                  href={link.href as any}
                  className={cn(
                    "block px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap lg:whitespace-normal border-l-4",
                    isActive
                      ? "bg-[#15a3b0] text-white shadow-md border-transparent"
                      : "text-slate-600 hover:bg-[#15a3b0]/10 hover:text-[#15a3b0] border-transparent lg:border-transparent lg:hover:border-[#15a3b0]"
                  )}
                  style={isActive ? undefined : { borderLeftColor: isActive ? 'transparent' : 'transparent' }}
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
