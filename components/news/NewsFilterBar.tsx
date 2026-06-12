'use client';

import { Search, Calendar } from 'lucide-react';
import { newsCategories } from '@/src/data/news-categories';

export function NewsFilterBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-end gap-3 mb-6 w-full">
      {/* Mobile Category Select */}
      <div className="w-full md:w-auto lg:hidden bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center shadow-sm">
        <select className="bg-transparent border-none outline-none text-slate-700 text-sm font-semibold w-full cursor-pointer focus:ring-0">
          {newsCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Date Filter */}
      <div className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 flex items-center justify-between min-w-[12rem] focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all">
        <input 
          type="text" 
          placeholder="Tarihe göre filtrele" 
          readOnly
          className="bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400 w-full cursor-pointer focus:ring-0 font-medium"
        />
        <Calendar className="w-4 h-4 text-slate-400" />
      </div>

      {/* Search Filter */}
      <div className="w-full md:w-auto bg-white border border-slate-200 shadow-sm rounded-xl pl-4 pr-1 py-1 flex items-center justify-between min-w-[14rem] focus-within:border-[#15a3b0] focus-within:ring-1 focus-within:ring-[#15a3b0] transition-all">
        <input 
          type="text" 
          placeholder="Haberlerde ara..." 
          className="bg-transparent border-none outline-none text-slate-700 text-sm placeholder:text-slate-400 w-full focus:ring-0 font-medium"
        />
        <button className="bg-[#15a3b0] text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#128a95] transition-colors flex-shrink-0 shadow-sm">
          <Search className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
