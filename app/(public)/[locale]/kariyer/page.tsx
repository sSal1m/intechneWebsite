import { Link } from '@/src/i18n/navigation';
import { getJobPositions } from '@/src/actions/careers';
import { CareerClient } from './CareerClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Careers' : 'Kariyer',
    description: isEn 
      ? 'Join our team at Intechne Technology and shape the future of technology.' 
      : 'Intechne Teknoloji ekibine katılın ve teknoloji geleceğini bizimle şekillendirin.',
  };
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  // Fetch open positions from Supabase
  const positions = await getJobPositions();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <span>{isEn ? 'Careers' : 'Kariyer'}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {isEn ? 'Careers' : 'Kariyer'}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CareerClient isEn={isEn} positions={positions} />
      </div>
    </div>
  );
}
