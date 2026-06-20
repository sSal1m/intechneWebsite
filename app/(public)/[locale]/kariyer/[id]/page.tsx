import { notFound } from 'next/navigation';
import { Link } from '@/src/i18n/navigation';
import { getJobPositionById } from '@/src/actions/careers';
import { JobApplyForm } from '@/components/career/JobApplyForm';
import { Building2, MapPin, Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const isEn = locale === 'en';
  const position = await getJobPositionById(id);

  if (!position) {
    return {
      title: isEn ? 'Position Not Found' : 'Pozisyon Bulunamadı',
    };
  }

  const title = isEn ? position.title_en : position.title_tr;
  return {
    title: `${title} - Intechne`,
  };
}

export default async function JobPositionPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isEn = locale === 'en';
  const position = await getJobPositionById(id);

  if (!position || !position.is_active) {
    notFound();
  }

  const title = isEn ? position.title_en : position.title_tr;
  const department = isEn ? position.department_en : position.department_tr;
  const location = isEn ? position.location_en : position.location_tr;
  const type = isEn ? position.type_en : position.type_tr;
  const description = isEn ? position.description_en : position.description_tr;
  const requirements = isEn ? position.requirements_en : position.requirements_tr;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Area */}
      <div className="bg-[#15a3b0] text-white py-12 md:py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Anasayfa'}
            </Link>
            <span>/</span>
            <Link href="/kariyer" className="hover:text-white transition-colors">
              {isEn ? 'Careers' : 'Kariyer'}
            </Link>
            <span>/</span>
            <span className="truncate max-w-[200px] md:max-w-xs">{title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black">
            {title}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-sm flex flex-col gap-10">
          
          {/* Meta Badges */}
          <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
              <Building2 className="w-4 h-4 text-[#01c1d3]" />
              {department}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
              <MapPin className="w-4 h-4 text-[#01c1d3]" />
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#01c1d3]/10 text-[#01c1d3] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
              <Briefcase className="w-4 h-4" />
              {type}
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#111111] text-base uppercase tracking-wider border-l-4 border-[#01c1d3] pl-3">
              {isEn ? 'Job Description' : 'İş Tanımı'}
            </h4>
            <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed font-medium">
              {description}
            </div>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#111111] text-base uppercase tracking-wider border-l-4 border-[#01c1d3] pl-3">
              {isEn ? 'Requirements' : 'Genel Nitelikler ve Gereksinimler'}
            </h4>
            <div className="text-slate-600 text-sm whitespace-pre-line leading-relaxed font-medium">
              {requirements}
            </div>
          </div>

          {/* Reusable Form */}
          <JobApplyForm isEn={isEn} positionId={id} positionTitle={title} />

        </div>
      </div>
    </div>
  );
}
