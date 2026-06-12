import { Link } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';
import type { MediaItem } from '@/src/types/common.types';
import { Headphones, Play, FileText } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  className?: string;
}

const categoryColors: Record<string, string> = {
  'Podcast': 'bg-purple-100 text-purple-700',
  'Teknoloji': 'bg-blue-100 text-blue-700',
  'İnsan': 'bg-green-100 text-green-700',
  'Projeler': 'bg-orange-100 text-orange-700',
  'TEKNOFEST': 'bg-red-100 text-red-700',
};

const categoryTranslations: Record<string, string> = {
  'Podcast': 'Podcast',
  'Teknoloji': 'Technology',
  'İnsan': 'People',
  'Projeler': 'Projects',
  'TEKNOFEST': 'TEKNOFEST',
};

const typeIcons = {
  audio: Headphones,
  video: Play,
  article: FileText,
};

export function MediaCard({ item, className }: MediaCardProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const displayCategory = isEn ? (categoryTranslations[item.category] || item.category) : item.category;

  return (
    <Link href={item.href as any} className={cn('block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group', className)}>
      <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {(() => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] || FileText;
            return <Icon className="w-12 h-12 text-slate-400 opacity-60" />;
          })()}
        </div>
        <span className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          {(() => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons] || FileText;
            return <Icon className="w-5 h-5 text-white" />;
          })()}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', categoryColors[item.category] || 'bg-gray-100 text-gray-700')}>
            {displayCategory}
          </span>
          <span className="text-slate-400 text-xs">{item.date}</span>
        </div>
        <h4 className="text-brand-dark font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        {item.subtitle && (
          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{item.subtitle}</p>
        )}
      </div>
    </Link>
  );
}
