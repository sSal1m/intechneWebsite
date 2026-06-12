import { Link } from '@/src/i18n/navigation';
import { cn } from '@/src/lib/utils';

import { Rocket } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  locale: string;
  className?: string;
}

export function PlaceholderPage({ title, locale, className }: PlaceholderPageProps) {
  const isEn = locale === 'en';

  return (
    <div className={cn('min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4 rounded-2xl', className)}>
      <div className="max-w-md text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-brand-dark mb-3">{title}</h1>
        <p className="text-slate-500 mb-2 text-base font-medium">
          {isEn ? 'This Page Will Be Ready Soon' : 'Bu Sayfa Yakında Hazır Olacak'}
        </p>
        <p className="text-slate-400 mb-8 text-sm">
          {isEn ? 'Content is being prepared...' : 'İçerik hazırlanıyor...'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          {isEn ? '← Return to Homepage' : '← Ana Sayfaya Dön'}
        </Link>
      </div>
    </div>
  );
}
