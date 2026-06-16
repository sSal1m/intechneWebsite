'use client';

import { ArrowRight, BookOpen, MonitorPlay, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { InteractiveSidebar } from './InteractiveSidebar';

interface InteractiveItem {
  id: string | number;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  description: string;
  descriptionEn: string;
  type: 'report' | 'video' | 'interactive';
  imageUrl?: string;
  fileUrl?: string;
  videoUrl?: string;
  createdAt?: string;
}

interface InteractiveGridProps {
  isEn: boolean;
  initialItems?: any[];
  filterCategory?: string;
  filterSearch?: string;
  filterStartDate?: string;
  filterEndDate?: string;
  filterPage?: string;
}

export function InteractiveGrid({
  isEn,
  initialItems,
  filterCategory,
  filterSearch,
  filterStartDate,
  filterEndDate,
  filterPage,
}: InteractiveGridProps) {
  const ITEMS_PER_PAGE = 6;
  const currentPage = Math.max(1, parseInt(filterPage || '1', 10) || 1);

  // Map database items
  let finalItems: InteractiveItem[] = initialItems && initialItems.length > 0
    ? initialItems.map((item) => {
        const catLower = item.category?.toLowerCase() || '';
        const catEn = catLower === 'projeler'
          ? 'Projects'
          : catLower === 'raporlar'
          ? 'Reports'
          : catLower === 'egitimler'
          ? 'Trainings'
          : catLower === 'interaktif'
          ? 'Interactive'
          : item.category;

        return {
          id: item.id,
          title: item.title_tr,
          titleEn: item.title_en,
          category: catLower,
          categoryEn: catEn,
          description: item.description_tr || '',
          descriptionEn: item.description_en || '',
          type: item.type,
          imageUrl: item.image_url,
          fileUrl: item.file_url,
          videoUrl: item.video_url,
          createdAt: item.created_at ? item.created_at.split('T')[0] : '',
        };
      })
    : [];

  // Apply search filter
  if (filterSearch) {
    const searchLower = filterSearch.toLowerCase();
    finalItems = finalItems.filter((item) =>
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(searchLower)) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(searchLower))
    );
  }

  // Apply date range filter
  if (filterStartDate) {
    finalItems = finalItems.filter((item) =>
      item.createdAt && item.createdAt >= filterStartDate
    );
  }
  if (filterEndDate) {
    finalItems = finalItems.filter((item) =>
      item.createdAt && item.createdAt <= filterEndDate
    );
  }

  const totalPages = Math.ceil(finalItems.length / ITEMS_PER_PAGE);
  const paginatedItems = finalItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (filterCategory) params.set('category', filterCategory);
    if (filterSearch) params.set('search', filterSearch);
    if (filterStartDate) params.set('startDate', filterStartDate);
    if (filterEndDate) params.set('endDate', filterEndDate);
    if (pageNum > 1) params.set('page', pageNum.toString());
    const searchStr = params.toString();
    return `/interaktif${searchStr ? `?${searchStr}` : ''}`;
  };

  return (
    <div className="w-full bg-white min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-[#15a3b0] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              {isEn ? 'Intechne Interactive' : 'Intechne İnteraktif'}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
              {isEn
                ? 'Access educational, entertaining, and informative interactive content regarding our projects ranging from robotics to digital technologies.'
                : 'Robotikten dijital teknolojilere kadar birçok alandaki projelerimize dair eğitici, eğlendirici ve bilgilendirici interaktif içeriklerimize buradan ulaşabilirsiniz.'}
            </p>
          </div>
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-600" />
              <p className="italic text-lg font-medium leading-relaxed mb-4">
                {isEn
                  ? '"Technology is only meaningful when shared and developed with the community. Let\'s build the future together."'
                  : '"Teknoloji ancak toplumla paylaşıldıkça ve birlikte geliştikçe anlam kazanır. Geleceği hep birlikte inşa edelim."'}
              </p>
              <strong className="block text-white font-bold">Ömer Akbulut</strong>
              <span className="text-sm text-white/80">{isEn ? 'General Coordinator' : 'Genel Koordinatör'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar (Filters & Categories) */}
          <div className="w-full lg:w-[25%] lg:flex-shrink-0 mb-8 lg:mb-0">
            <InteractiveSidebar isEn={isEn} />
          </div>

          {/* Right Content */}
          <div className="flex-1 w-full lg:w-[75%]">
            {finalItems.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl mb-8">
                <p className="text-slate-500 font-bold text-base mb-3">
                  {isEn ? 'No interactive content found matching your filters.' : 'Aradığınız kriterlere uygun içerik bulunamadı.'}
                </p>
                <Link
                  href="/interaktif"
                  className="text-[#15a3b0] hover:text-[#128a95] font-bold text-sm underline"
                >
                  {isEn ? 'Clear all filters' : 'Tüm filtreleri temizle'}
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {paginatedItems.map((item) => {
                  return (
                    <Link
                      key={item.id}
                      href={{ pathname: '/interaktif/[id]' as any, params: { id: String(item.id) } }}
                      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
                    >
                      <div className="h-48 md:h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                        {/* Fallback pattern background */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#15a3b0_1px,transparent_1px)] [background-size:16px_16px]" />

                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={isEn ? item.titleEn : item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <>
                            {item.type === 'report' && <FileText className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                            {item.type === 'video' && <MonitorPlay className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                            {item.type === 'interactive' && <BookOpen className="w-20 h-20 text-[#15a3b0]/40 group-hover:scale-110 transition-transform duration-500" />}
                          </>
                        )}

                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#15a3b0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                          {isEn
                            ? (item.categoryEn || item.category)
                            : (item.category === 'projeler'
                              ? 'Projeler'
                              : item.category === 'raporlar'
                              ? 'Raporlar'
                              : item.category === 'egitimler'
                              ? 'Eğitimler'
                              : item.category === 'interaktif'
                              ? 'İnteraktif'
                              : item.category)}
                        </span>
                      </div>

                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-[#15a3b0] transition-colors">
                          {isEn ? item.titleEn : item.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                          {isEn ? item.descriptionEn : item.description}
                        </p>

                        <div className="flex items-center text-[#15a3b0] font-bold mt-auto group/btn">
                          <span>{isEn ? 'Review' : 'İncele'}</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <ul className="flex items-center gap-2">
                  {/* Previous Button */}
                  {currentPage > 1 && (
                    <li>
                      <Link
                        href={getPageUrl(currentPage - 1) as any}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Link>
                    </li>
                  )}

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <li key={pageNum}>
                        <Link
                          href={getPageUrl(pageNum) as any}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 ${
                            isActive
                              ? 'bg-[#15a3b0] text-white shadow-md'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      </li>
                    );
                  })}

                  {/* Next Button */}
                  {currentPage < totalPages && (
                    <li>
                      <Link
                        href={getPageUrl(currentPage + 1) as any}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
