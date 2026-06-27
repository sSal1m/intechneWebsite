import { Link } from '@/src/i18n/navigation';
import { getITalksItemById } from '@/src/actions/i-talks';
import { notFound } from 'next/navigation';
import {
  Clock,
  ArrowLeft,
  Calendar,
  FileText,
  MonitorPlay,
  BookOpen,
  ExternalLink,
  Download
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

function getYoutubeEmbedUrl(url: string) {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  
  // Parse watch?v= or youtu.be/ formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[2].length === 11) ? match[2] : null;
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

export default async function ITalksDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isEn = locale === 'en';

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) {
    notFound();
  }

  const item = await getITalksItemById(id);
  if (!item) {
    notFound();
  }

  const title = isEn ? item.title_en : item.title_tr;
  const description = isEn ? item.description_en : item.description_tr;
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const catLower = item.category?.toLowerCase() || '';
  const categoryLabel = isEn
    ? (catLower === 'projeler' ? 'Projects' : catLower === 'raporlar' ? 'Reports' : catLower === 'egitimler' ? 'Trainings' : catLower === 'interaktif' ? 'I-Talks' : catLower)
    : (catLower === 'projeler' ? 'Projeler' : catLower === 'raporlar' ? 'Raporlar' : catLower === 'egitimler' ? 'Eğitimler' : catLower === 'interaktif' ? 'I-Talks' : catLower);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Upper Navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-8 md:pt-12">
        <Link
          href="/i-talks"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#15a3b0] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          {isEn ? 'Back to I-Talks' : 'I-Talks İçeriklerine Dön'}
        </Link>

        {/* Content Card container */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-10 mb-12">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="bg-[#15a3b0]/10 text-[#15a3b0] px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase flex items-center gap-1.5">
                {item.type === 'report' && <FileText className="w-3.5 h-3.5" />}
                {item.type === 'video' && <MonitorPlay className="w-3.5 h-3.5" />}
                {item.type === 'interactive' && <BookOpen className="w-3.5 h-3.5" />}
                {categoryLabel}
              </span>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {dateStr}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-brand-navy leading-tight">
              {title}
            </h1>
          </div>

          {/* Media Player Area */}
          <div className="w-full mb-10">
            {item.type === 'video' && item.video_url && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-black">
                <iframe
                  src={getYoutubeEmbedUrl(item.video_url)}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            )}

            {item.type === 'report' && item.file_url && (
              <div className="flex flex-col gap-6">
                <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                  <iframe
                    src={item.file_url}
                    title={title}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
                
                {/* Premium Download Box */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="p-3 bg-[#15a3b0]/10 rounded-xl text-[#15a3b0] hidden sm:block">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {isEn ? 'Document Download' : 'Döküman İndirme'}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {isEn ? 'You can view or download the high-quality PDF document.' : 'Yüksek kaliteli PDF belgesini görüntüleyebilir veya indirebilirsiniz.'}
                      </p>
                    </div>
                  </div>
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#15a3b0] hover:bg-[#128a95] text-white px-6 py-3 rounded-full font-bold shadow-md transition-all duration-300 group"
                  >
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    {isEn ? 'Download Document' : 'Belgeyi İndir'}
                  </a>
                </div>
              </div>
            )}

            {item.type === 'interactive' && item.file_url && (
              <div className="flex flex-col gap-6">
                <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100">
                  <iframe
                    src={item.file_url}
                    title={title}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                </div>
                <div className="flex justify-center">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#15a3b0] hover:bg-[#128a95] text-white px-6 py-3 rounded-full font-bold shadow-md transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {isEn ? 'Open in New Tab' : 'Yeni Sekmede Aç'}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description Content */}
          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {isEn ? 'About the Content' : 'İçerik Hakkında'}
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-line">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
