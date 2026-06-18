import { Link } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';
import type { NewsItem } from '@/src/types/common.types';

interface NewsCardProps {
  item: NewsItem;
  variant: 'featured' | 'secondary';
  className?: string;
}

export function NewsCard({ item, variant, className }: NewsCardProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const imageUrl = (item as any).image_url || (item as any).imageUrl;

  if (variant === 'featured') {
    return (
      <div className={cn('bg-white rounded-2xl overflow-hidden h-full flex flex-col', className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.tag && (
            <span className="absolute top-4 left-4 z-10 bg-brand-yellow text-brand-dark text-xs font-bold px-3 py-1.5 rounded-md">
              {item.tag}
            </span>
          )}
          {imageUrl ? (
            <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
              <span className="text-white text-sm font-medium opacity-60">{item.imageAlt}</span>
            </div>
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <p className="text-slate-500 text-sm mb-3">{item.date}</p>
          <h3 className="text-brand-dark font-bold text-xl leading-tight mb-4 flex-1">
            {item.title}
          </h3>
          <Link
            href={item.href as any}
            className="inline-flex items-center gap-2 text-brand-dark font-semibold text-sm hover:text-primary transition-colors"
          >
            {isEn ? 'Read More' : 'Devamını Gör'}
            <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs">
              ›
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl overflow-hidden flex flex-col', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
            <span className="text-white text-xs font-medium opacity-60 text-center px-2">{item.imageAlt}</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-slate-500 text-xs mb-2">{item.date}</p>
        <h4 className="text-brand-dark font-semibold text-sm leading-snug mb-3 flex-1 line-clamp-2">
          {item.title}
        </h4>
        <Link
          href={item.href as any}
          className="inline-flex items-center gap-2 text-brand-dark font-semibold text-xs hover:text-primary transition-colors"
        >
          {isEn ? 'Read More' : 'Devamını Gör'}
          <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px]">
            ›
          </span>
        </Link>
      </div>
    </div>
  );
}
