import { Link } from '@/src/i18n/navigation';
import { cn } from '@/src/lib/utils';

interface BrandLogoCardProps {
  name: string;
  slug: string;
  locale: string;
  className?: string;
}

export function BrandLogoCard({ name, slug, locale, className }: BrandLogoCardProps) {
  return (
    <Link
      href={`/markalarimiz/${slug}` as any}
      className={cn(
        'flex items-center justify-center bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 min-w-[120px] h-[90px] cursor-pointer',
        className
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
          <span className="text-slate-400 text-xs font-bold">{name.slice(0,2)}</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-600 text-center leading-tight max-w-[80px] line-clamp-2">
          {name}
        </span>
      </div>
    </Link>
  );
}
