'use client';

import { Link } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { newsCategories } from '@/src/data/news-categories';
import { cn } from '@/src/lib/utils';
import { Suspense } from 'react';

function NewsSidebarContent() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams?.get('category') || 'all';

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 lg:sticky lg:top-24 border border-slate-100">
      <h3 className="font-bold text-lg text-slate-800 mb-4 px-2">Kategoriler</h3>
      <div className="flex flex-col gap-2">
        {newsCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Link 
              key={cat.id} 
              href={cat.id === 'all' ? '/haberler' : (`/haberler?category=${cat.id}` as any)}
              className={cn(
                "block px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-l-4",
                isActive
                  ? "bg-[#15a3b0] text-white shadow-md border-transparent"
                  : "text-slate-600 hover:bg-[#15a3b0]/10 hover:text-[#15a3b0] border-transparent lg:hover:border-[#15a3b0]"
              )}
              style={isActive ? undefined : { borderLeftColor: isActive ? 'transparent' : 'transparent' }}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function NewsSidebar() {
  return (
    <Suspense fallback={<div className="bg-[#f8f9fa] rounded-2xl p-6 text-slate-500">Yükleniyor...</div>}>
      <NewsSidebarContent />
    </Suspense>
  );
}
