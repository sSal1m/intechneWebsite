'use client';

import { Search, Calendar, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { newsCategories } from '@/src/data/news-categories';

export function NewsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [startDateVal, setStartDateVal] = useState(searchParams.get('startDate') || '');
  const [endDateVal, setEndDateVal] = useState(searchParams.get('endDate') || '');

  // Keep state in sync with URL searchParams
  useEffect(() => {
    setSearchVal(searchParams.get('search') || '');
    setStartDateVal(searchParams.get('startDate') || '');
    setEndDateVal(searchParams.get('endDate') || '');
  }, [searchParams]);

  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter changes
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleFilterChange('search', searchVal);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== 'all') {
      params.set('category', val);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get('category') || 'all';

  return (
    <div className="flex flex-col md:flex-row items-center justify-end gap-3 mb-6 w-full">
      {/* Mobile Category Select */}
      <div className="w-full md:w-auto lg:hidden bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center shadow-sm">
        <select 
          value={activeCategory}
          onChange={handleCategoryChange}
          className="bg-transparent border-none outline-none text-slate-700 text-sm font-semibold w-full cursor-pointer focus:ring-0"
        >
          <option value="all">Tüm Kategoriler</option>
          {newsCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2 flex items-center gap-2 min-w-[18rem] focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all relative">
        <input 
          type="date" 
          value={startDateVal}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="bg-transparent border-none outline-none text-slate-700 text-sm w-full cursor-pointer focus:ring-0 font-medium"
        />
        <span className="text-slate-400 font-bold">-</span>
        <input 
          type="date" 
          value={endDateVal}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="bg-transparent border-none outline-none text-slate-700 text-sm w-full cursor-pointer focus:ring-0 font-medium pr-6"
        />
        {(startDateVal || endDateVal) && (
          <button 
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('startDate');
              params.delete('endDate');
              params.delete('page');
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-600 flex-shrink-0"
            title="Tarih filtresini temizle"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Filter */}
      <form 
        onSubmit={handleSearchSubmit}
        className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-xl pl-4 pr-1 py-1 flex items-center justify-between min-w-[14rem] focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all relative"
      >
        <input 
          type="text" 
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Haberlerde ara..." 
          className="bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400 w-full focus:ring-0 font-medium mr-8"
        />
        {searchVal && (
          <button 
            type="button"
            onClick={() => {
              setSearchVal('');
              handleFilterChange('search', '');
            }}
            className="absolute right-12 text-slate-400 hover:text-slate-600 flex-shrink-0"
            title="Aramayı temizle"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button 
          type="submit"
          className="bg-[#15a3b0] text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#128a95] transition-colors flex-shrink-0 shadow-sm"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
