'use client';

import { Link } from '@/src/i18n/navigation';
import { Clock, ArrowRightCircle } from 'lucide-react';
import type { NewsItem } from '@/src/types/common.types';

export function HeadlineCard({ news }: { news: NewsItem }) {
  const imageUrl = (news as any).image_url || (news as any).imageUrl;
  const hasImage = !!imageUrl;

  return (
    <div 
      className="w-full h-[320px] md:h-[380px] rounded-3xl mb-8 relative overflow-hidden group shadow-lg bg-gradient-to-br from-[#15a3b0] to-slate-900"
      style={hasImage ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
    >
      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent group-hover:via-slate-900/50 transition-all duration-500" />
      
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
        {/* Categories / Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {news.tag && (
            <div className="bg-[#15a3b0] rounded-full px-4 py-1.5 shadow-sm backdrop-blur-sm bg-opacity-90">
              <p className="font-bold text-xs md:text-sm leading-none text-center text-white tracking-wide">{news.tag.toUpperCase()}</p>
            </div>
          )}
        </div>

        {/* Title row */}
        <div className="flex justify-between items-end md:items-center w-full gap-4">
          <Link href={news.href as any} className="flex-1">
            <h6 className="font-black text-[22px] md:text-[32px] leading-snug md:leading-tight text-white group-hover:text-[#15a3b0] transition-colors duration-300">
              {news.title}
            </h6>
          </Link>
          <Link href={news.href as any} className="text-[#15a3b0] hover:text-white transition-colors flex-shrink-0 mt-2 md:mt-0 bg-white hover:bg-[#15a3b0] rounded-full p-1 shadow-md">
            <ArrowRightCircle className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" />
          </Link>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 mt-4 text-slate-300">
          <Clock className="w-4 h-4" />
          <p className="font-medium text-xs md:text-sm tracking-wide">
            {news.date}
          </p>
        </div>
      </div>
    </div>
  );
}
