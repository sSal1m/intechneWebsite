'use client';

import { cn } from '@/src/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'yellow' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
      secondary:
        'bg-brand-navy text-white hover:bg-slate-700 focus:ring-brand-navy',
      outline:
        'border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white focus:ring-brand-dark',
      ghost:
        'text-brand-dark hover:bg-gray-100 focus:ring-gray-300',
      yellow:
        'bg-brand-yellow text-brand-dark hover:bg-yellow-400 focus:ring-brand-yellow',
      teal:
        'bg-brand-teal text-white hover:bg-brand-teal-dark focus:ring-brand-teal',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
export type { ButtonProps };
