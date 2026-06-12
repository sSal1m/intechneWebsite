'use client';

import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isNavDropdown, type NavigationConfig } from '@/src/types/navigation.types';
import { cn } from '@/src/lib/utils';
import { Link } from '@/src/i18n/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationConfig;
  locale: string;
}

export function MobileMenu({ isOpen, onClose, navigation, locale }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  function toggleDropdown(label: string) {
    setOpenDropdown(openDropdown === label ? null : label);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-80 max-w-full bg-brand-navy z-50 overflow-y-auto"
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-white font-bold text-lg">
                  {locale === 'en' ? 'Menu' : 'Menü'}
                </span>
                <button
                  onClick={onClose}
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Menüyü kapat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1">
                {navigation.main.map((item) => {
                  if (!isNavDropdown(item)) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href as any}
                        onClick={onClose}
                        className="block px-4 py-3 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleDropdown(item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn('w-4 h-4 transition-transform duration-200', openDropdown === item.label && 'rotate-180')}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4"
                          >
                            {item.items.map((sub, idx) => (
                              <Link
                                key={idx}
                                href={sub.href as any}
                                target={sub.external ? '_blank' : undefined}
                                onClick={onClose}
                                className="block px-4 py-2.5 text-white/70 hover:text-primary text-xs font-medium transition-colors border-l border-white/20 ml-2"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* CTA Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                {navigation.ctaButtons.map((btn) => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    target={btn.external ? '_blank' : undefined}
                    rel={btn.external ? 'noopener noreferrer' : undefined}
                    onClick={onClose}
                    className={cn(
                      'block text-center px-4 py-3 rounded-full font-semibold text-sm transition-colors',
                      btn.variant === 'primary' && 'bg-primary text-white hover:bg-primary-dark',
                      btn.variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20',
                    )}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
