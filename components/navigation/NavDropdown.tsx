'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { isNavDropdown, type NavItem } from '@/src/types/navigation.types';
import { Link } from '@/src/i18n/navigation';

interface NavDropdownProps {
  item: NavItem;
  locale: string;
}

export function NavDropdown({ item, locale }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isNavDropdown(item)) {
    return (
      <Link
        href={item.href as any}
        className="text-white font-semibold text-sm hover:text-primary transition-colors duration-200 whitespace-nowrap"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 font-semibold text-sm transition-colors duration-200 whitespace-nowrap",
          isOpen ? "text-primary" : "text-white hover:text-primary"
        )}
        aria-expanded={isOpen}
      >
        {item.label}
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 bg-brand-navy rounded-xl shadow-2xl z-50 min-w-[260px] py-2 overflow-hidden before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
          >
            {item.items.map((subItem, idx) => (
              <Link
                key={idx}
                href={subItem.href as any}
                target={subItem.external ? '_blank' : undefined}
                rel={subItem.external ? 'noopener noreferrer' : undefined}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 text-white text-sm font-medium hover:bg-white/10 hover:text-primary transition-colors duration-150"
              >
                {subItem.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
