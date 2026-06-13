import { Link } from '@/src/i18n/navigation';
import { cn } from '@/src/lib/utils';
import { brands } from '@/src/data/brands';

interface BrandLogoCardProps {
  name: string;
  slug: string;
  locale: string;
  className?: string;
}

export function BrandLogoCard({ name, slug, locale, className }: BrandLogoCardProps) {
  const brand = brands.find((b) => b.slug === slug);
  const logoUrl = brand?.logoUrl;

  return (
    <Link
      href={`/markalarimiz/${slug}` as any}
      className={cn(
        'flex flex-col items-center justify-center bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-200 hover:scale-105 w-[140px] h-[95px] cursor-pointer border border-slate-100 shadow-sm',
        className
      )}
    >
      <div className="w-full flex-1 flex items-center justify-center min-h-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400 text-xs font-bold">{name.slice(0, 2)}</span>
          </div>
        )}
      </div>
      <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight max-w-full line-clamp-1 mt-1.5">
        {name}
      </span>
    </Link>
  );
}
