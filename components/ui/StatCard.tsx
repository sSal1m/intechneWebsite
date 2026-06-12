import { cn } from '@/src/lib/utils';
import type { StatItem } from '@/src/types/common.types';

interface StatCardProps {
  item: StatItem;
  className?: string;
}

export function StatCard({ item, className }: StatCardProps) {
  const bgColorMap: Record<string, string> = {
    'bg-brand-teal': 'bg-[#00AEEF]',
    'bg-brand-orange': 'bg-[#0ac8da]',
    'bg-brand-yellow': 'bg-[#09aab9]',
    'bg-brand-navy': 'bg-[#1B2A4A]',
  };

  const circleBgMap: Record<string, string> = {
    'bg-brand-teal-dark': 'bg-[#0284C7]',
    'bg-orange-700': 'bg-[#079fb0]',
    'bg-yellow-600': 'bg-[#067a85]',
    'bg-slate-700': 'bg-[#334155]',
  };

  const bg = bgColorMap[item.bgColor] || item.bgColor;
  const circleBg = circleBgMap[item.circleBg] || item.circleBg;
  const isLight = item.bgColor === 'bg-brand-yellow';

  return (
    <div className={cn('rounded-2xl p-6 flex flex-col gap-4', bg, className)}>
      <div className="flex items-start gap-4">
        <div className={cn('w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0', circleBg)}>
          <span className={cn('font-bold text-sm text-center leading-tight px-1', isLight ? 'text-brand-dark' : 'text-white')}>
            {item.value}
          </span>
        </div>
        <div>
          <h4 className={cn('font-bold text-lg leading-snug', isLight ? 'text-brand-dark' : 'text-white')}>
            {item.title}
          </h4>
        </div>
      </div>
      <p className={cn('text-sm leading-relaxed', isLight ? 'text-brand-dark/80' : 'text-white/80')}>
        {item.description}
      </p>
    </div>
  );
}
