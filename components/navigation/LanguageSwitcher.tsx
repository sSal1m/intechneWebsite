'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';


export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const otherLocale = locale === 'tr' ? 'en' : 'tr';

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    if (segments[1] === 'tr' || segments[1] === 'en') {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';
    router.push(newPath);
    setIsOpen(false);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
          isOpen
            ? 'border-primary text-primary'
            : 'border-white/25 text-white hover:border-primary hover:text-primary'
        }`}
        aria-label="Language selector"
      >
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 bg-brand-navy rounded-lg shadow-xl z-50 overflow-hidden before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
          >
            {['tr', 'en'].map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`flex items-center justify-center w-full px-5 py-2 text-sm font-semibold text-left transition-colors ${
                  loc === locale
                    ? 'text-primary bg-white/10'
                    : 'text-white hover:bg-white/10 hover:text-primary'
                }`}
              >
                <span>{loc.toUpperCase()}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
