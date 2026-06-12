import { AboutSidebar } from '@/components/about/AboutSidebar';
import { Link } from '@/src/i18n/navigation';

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-white">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <span>{isEn ? 'About Us' : 'Hakkımızda'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {isEn ? 'About Us' : 'Hakkımızda'}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <AboutSidebar />
          <main className="flex-1 w-full min-h-[400px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
