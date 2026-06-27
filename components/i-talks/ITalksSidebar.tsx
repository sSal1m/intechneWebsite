'use client';

import { Link } from '@/src/i18n/navigation';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { cn } from '@/src/lib/utils';
import { Search, X } from 'lucide-react';

const italksCategories = [
  { id: 'all', name: 'Tümü', nameEn: 'All' },
  { id: 'projeler', name: 'Projeler', nameEn: 'Projects' },
  { id: 'raporlar', name: 'Raporlar', nameEn: 'Reports' },
  { id: 'egitimler', name: 'Eğitimler', nameEn: 'Trainings' },
  { id: 'interaktif', name: 'İnteraktif', nameEn: 'Interactive' },
];

function ITalksSidebarContent({ isEn }: { isEn: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams?.get('category') || 'all';

  const [searchVal, setSearchVal] = useState(searchParams?.get('search') || '');
  const [startDateVal, setStartDateVal] = useState(searchParams?.get('startDate') || '');
  const [endDateVal, setEndDateVal] = useState(searchParams?.get('endDate') || '');

  useEffect(() => {
    setSearchVal(searchParams?.get('search') || '');
    setStartDateVal(searchParams?.get('startDate') || '');
    setEndDateVal(searchParams?.get('endDate') || '');
  }, [searchParams]);

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleFilterChange('search', searchVal);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (val && val !== 'all') {
      params.set('category', val);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="lg:sticky lg:top-24 flex flex-col gap-6">
      {/* Categories block */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 border border-slate-100">
        <h3 className="font-bold text-lg text-slate-800 mb-4 px-2 hidden lg:block">
          {isEn ? 'Categories' : 'Kategoriler'}
        </h3>

        {/* Mobile Category Select */}
        <div className="lg:hidden bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center shadow-sm">
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            className="bg-transparent border-none outline-none text-slate-700 text-sm font-semibold w-full cursor-pointer focus:ring-0"
          >
            {italksCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{isEn ? cat.nameEn : cat.name}</option>
            ))}
          </select>
        </div>

        {/* Desktop Category List */}
        <div className="hidden lg:flex flex-col gap-2">
          {italksCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/i-talks' : (`/i-talks?category=${cat.id}` as any)}
                className={cn(
                  "block px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 border-l-4",
                  isActive
                    ? "bg-[#15a3b0] text-white shadow-md border-transparent"
                    : "text-slate-600 hover:bg-[#15a3b0]/10 hover:text-[#15a3b0] border-transparent lg:hover:border-[#15a3b0]"
                )}
              >
                {isEn ? cat.nameEn : cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Date Filter block */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="font-bold text-sm text-slate-800">
            {isEn ? 'Date Range' : 'Tarih Aralığı'}
          </h3>
          {(startDateVal || endDateVal) && (
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams?.toString() || '');
                params.delete('startDate');
                params.delete('endDate');
                params.delete('page');
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="text-slate-400 hover:text-slate-600"
              title={isEn ? 'Clear date filter' : 'Tarih filtresini temizle'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-3 flex flex-col gap-3 focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold px-1">
              {isEn ? 'Start Date' : 'Başlangıç Tarihi'}
            </span>
            <input
              type="date"
              value={startDateVal}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 text-sm w-full cursor-pointer focus:ring-0 font-medium px-1"
            />
          </div>
          <div className="w-full h-[1px] bg-slate-100"></div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-semibold px-1">
              {isEn ? 'End Date' : 'Bitiş Tarihi'}
            </span>
            <input
              type="date"
              value={endDateVal}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="bg-transparent border-none outline-none text-slate-700 text-sm w-full cursor-pointer focus:ring-0 font-medium px-1"
            />
          </div>
        </div>
      </div>

      {/* Search Filter block */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 lg:p-6 border border-slate-100">
        <h3 className="font-bold text-sm text-slate-800 mb-3 px-2">
          {isEn ? 'Search' : 'İçeriklerde Ara'}
        </h3>
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white border border-slate-200 shadow-sm rounded-xl pl-3 pr-1 py-1 flex items-center justify-between focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all relative"
        >
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={isEn ? 'Search...' : 'Ara...'}
            className="bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400 w-full focus:ring-0 font-medium"
          />
          {searchVal && (
            <button
              type="button"
              onClick={() => {
                setSearchVal('');
                handleFilterChange('search', '');
              }}
              className="absolute right-12 text-slate-400 hover:text-slate-600 flex-shrink-0"
              title={isEn ? 'Clear search' : 'Aramayı temizle'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="bg-[#15a3b0] text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#128a95] transition-colors flex-shrink-0 shadow-sm ml-1"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function ITalksSidebar({ isEn }: { isEn: boolean }) {
  return (
    <Suspense fallback={<div className="bg-[#f8f9fa] rounded-2xl p-6 text-slate-500">{isEn ? 'Loading...' : 'Yükleniyor...'}</div>}>
      <ITalksSidebarContent isEn={isEn} />
    </Suspense>
  );
}
