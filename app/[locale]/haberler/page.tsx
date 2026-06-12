import { Link } from '@/src/i18n/navigation';
import { NewsSidebar } from '@/components/news/NewsSidebar';
import { NewsFilterBar } from '@/components/news/NewsFilterBar';
import { HeadlineCard } from '@/components/news/HeadlineCard';
import { NewsCard } from '@/components/news/NewsCard';
import { newsItems } from '@/src/data/news';

export default async function HaberlerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  const headlineItem = newsItems.find(item => item.tag === 'Öne Çıkan') || newsItems[0];
  const otherItems = newsItems.filter(item => item.id !== headlineItem?.id);

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
              {otherItems.map(item => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center mt-12 mb-8">
              <ul className="flex items-center gap-2">
                <li>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#15a3b0] text-white font-bold text-sm shadow-md">
                    1
                  </button>
                </li>
                <li>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold">
                    2
                  </button>
                </li>
                <li>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold">
                    3
                  </button>
                </li>
                <li className="text-slate-400 px-2 font-bold">...</li>
                <li>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-[#15a3b0] hover:text-white hover:border-[#15a3b0] hover:shadow-md transition-all duration-300 text-sm font-bold">
                    53
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
