'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { NavDropdown } from '@/components/navigation/NavDropdown';
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher';
import { MobileMenu } from '@/components/layout/MobileMenu';
import type { NavItem } from '@/src/types/navigation.types';
import { trNavigation, enNavigation } from '@/src/data/navigation';
import { Link } from '@/src/i18n/navigation';

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = locale === 'tr' ? trNavigation : enNavigation;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 bg-[#111111] transition-shadow duration-300',
          scrolled ? 'shadow-md shadow-black/20' : 'shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <img
                src="/logo.avif"
                alt="Intechne Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navigation.main.map((item: NavItem, idx: number) => (
                <NavDropdown key={idx} item={item} locale={locale} />
              ))}
            </nav>

            {/* CTA Buttons + Language */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {navigation.ctaButtons.map((btn) => (
                <a
                  key={btn.label}
                  href={btn.href}
                  target={btn.external ? '_blank' : undefined}
                  rel={btn.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'px-4 py-2 rounded-full font-semibold text-xs transition-all duration-200 whitespace-nowrap',
                    btn.variant === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
                    btn.variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20',
                  )}
                >
                  {btn.label}
                </a>
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navigation={navigation}
        locale={locale}
      />
    </>
  );
}
