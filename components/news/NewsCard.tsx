'use client';

import { Link } from '@/src/i18n/navigation';
import { ArrowRight, Clock } from 'lucide-react';
import type { NewsItem } from '@/src/types/common.types';

export function NewsCard({ news }: { news: NewsItem }) {
  const imageUrl = (news as any).image_url || (news as any).imageUrl;
  const hasImage = !!imageUrl;

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group overflow-hidden">
      <figure className="w-full h-[200px] overflow-hidden relative">
        <Link href={news.href as any} className="block w-full h-full">
          <div className="absolute inset-0 bg-[#15a3b0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt={news.imageAlt || news.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
              {news.tag || 'HABER'}
            </div>
          )}
        </Link>
      </figure>
      <div className="flex flex-col flex-1 p-6">
        <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-3 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {news.date}
        </div>
        <Link href={news.href as any} className="flex-1 mb-4">
          <h5 className="font-bold text-[17px] leading-snug text-slate-800 line-clamp-2 group-hover:text-[#15a3b0] transition-colors">
            {news.title}
          </h5>
        </Link>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
          {news.excerpt}
        </p>
        <Link href={news.href as any} className="flex items-center gap-2 mt-auto text-[#15a3b0] font-bold text-sm w-max">
          <span className="relative overflow-hidden">
            Devamını Gör
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#15a3b0] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </article>
  );
}
