import { Link } from '@/src/i18n/navigation';
import { NewsSidebar } from '@/components/news/NewsSidebar';
import { NewsFilterBar } from '@/components/news/NewsFilterBar';
import { HeadlineCard } from '@/components/news/HeadlineCard';
import { NewsCard } from '@/components/news/NewsCard';
import { newsItems } from '@/src/data/news';
import { getNews } from '@/src/actions/news';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function HaberlerPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { category, page: pageParam } = await searchParams;
  const isEn = locale === 'en';
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const allNews = await getNews();
  const dbNews = category ? await getNews(category) : allNews;
  const hasDbContent = allNews && allNews.length > 0;

  const displayNews = hasDbContent
    ? dbNews.map((item: any) => ({
        id: item.id,
        date: item.published_at
          ? new Date(item.published_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : '',
        title: isEn ? item.title_en : item.title_tr,
        excerpt: isEn ? item.excerpt_en : item.excerpt_tr,
        href: `/haberler/${item.id}`,
        tag: item.tag || undefined,
        imageAlt: isEn ? item.title_en : item.title_tr,
        image_url: item.image_url,
      }))
    : newsItems;

  const headlineItem = displayNews.find((item: any) => item.tag === 'Öne Çıkan') || displayNews[0];
  const otherItems = displayNews.filter((item: any) => item.id !== headlineItem?.id);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(otherItems.length / ITEMS_PER_PAGE);
  const paginatedOtherItems = otherItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const getPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (pageNum > 1) params.set('page', pageNum.toString());
    const searchStr = params.toString();
    return `/haberler${searchStr ? `?${searchStr}` : ''}`;
  };

  // Fallback banner image
  const bannerBg = 'https://cdnv2.t3vakfi.org/media/project/T3_banner-03.png';

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <span>{isEn ? 'News' : 'Haberler'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {isEn ? 'News' : 'Haberler'}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-[22%] lg:flex-shrink-0">
            <NewsSidebar />
          </div>

          {/* Right Content */}
          <div className="flex-1 w-full lg:w-[78%]">
            <NewsFilterBar />
            
            {headlineItem && (
              <HeadlineCard news={headlineItem} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedOtherItems.map((item: any) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>

            {/* Dynamic Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-8">
                <ul className="flex items-center gap-2">
                  {/* Previous Button */}
                  {page > 1 && (
                    <li>
                      <Link
                        href={getPageUrl(page - 1) as any}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Link>
                    </li>
                  )}
                  
                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === page;
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
                  {page < totalPages && (
                    <li>
                      <Link
                        href={getPageUrl(page + 1) as any}
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
