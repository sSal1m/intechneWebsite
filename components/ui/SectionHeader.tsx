import { cn } from '@/src/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  titleClassName?: string;
  subtitleClassName?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  titleClassName,
  subtitleClassName,
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <div className={cn('mb-8', alignClass, className)}>
      <h2 className={cn('text-3xl md:text-4xl font-bold text-brand-dark', titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-3 text-slate-600 text-base max-w-2xl', align === 'center' && 'mx-auto', subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
