import { cn } from '@/src/lib/utils';
import type { TestimonialItem } from '@/src/types/common.types';
import { useLocale } from 'next-intl';

interface TestimonialCardProps {
  item: TestimonialItem;
  className?: string;
}

const testimonialTranslationsEn: Record<string, { quote: string; role: string }> = {
  '1': {
    quote: 'Thanks to the opportunities offered by this foundation, I both developed myself and took part in projects that will contribute to my country. This experience has been one of the most valuable assets of my life and prepared me for the future.',
    role: 'DENEYAP Graduate',
  },
  '2': {
    quote: 'It is a great honor and responsibility to be part of the generation that will shape the future of our country. Joining this program has made it easier for me to achieve my career goals.',
    role: 'Scholar',
  },
  '3': {
    quote: 'Thanks to the projects carried out by the foundation and the social impact it creates, our youth are truly inspired. Hope for the future increases day by day.',
    role: 'Volunteer',
  },
};

export function TestimonialCard({ item, className }: TestimonialCardProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const trans = testimonialTranslationsEn[item.id];
  const displayQuote = isEn && trans ? trans.quote : item.quote;
  const displayRole = isEn && trans ? trans.role : item.role;

  if (item.variant === 'featured') {
    return (
      <div className={cn('bg-brand-red rounded-2xl p-6 flex flex-col gap-4', className)}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{item.name[0]}</span>
            </div>
          </div>
          <div className="text-4xl text-white/40 font-serif leading-none">&ldquo;&rdquo;</div>
        </div>
        <p className="text-white text-sm leading-relaxed flex-1">{displayQuote}</p>
        <p className="text-white font-bold text-sm">{item.name}</p>
        {displayRole && <p className="text-white/70 text-xs">{displayRole}</p>}
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{item.name[0]}</span>
          </div>
        </div>
        <div>
          <p className="text-brand-dark font-bold text-sm uppercase tracking-wide">{item.name}</p>
          {displayRole && <p className="text-slate-400 text-[10px] mt-0.5">{displayRole}</p>}
        </div>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{displayQuote}</p>
    </div>
  );
}
