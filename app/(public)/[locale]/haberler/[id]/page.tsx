import { Link } from '@/src/i18n/navigation';
import { getNewsById } from '@/src/actions/news';

import { Clock, ArrowLeft, Calendar } from 'lucide-react';
import { ShareButtons } from '@/components/news/ShareButtons';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}



export default async function HaberDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isEn = locale === 'en';

  // 1. Try to fetch from DB first (if ID is UUID format)
  let newsItem: any = null;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUuid) {
    newsItem = await getNewsById(id);
  }



  if (!newsItem) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          {isEn ? 'News Not Found' : 'Haber Bulunamadı'}
        </h1>
        <Link href="/haberler" className="bg-[#15a3b0] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#128a95]">
          {isEn ? 'Back to News' : 'Haberlere Geri Dön'}
        </Link>
      </div>
    );
  }

  const title = isEn ? newsItem.title_en : newsItem.title_tr;
  const excerpt = isEn ? newsItem.excerpt_en : newsItem.excerpt_tr;
  const content = isEn ? newsItem.content_en : newsItem.content_tr;
  const dateStr = newsItem.published_at
    ? new Date(newsItem.published_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // Calculate read time (approx. 200 words per minute)
  const wordCount = content ? content.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Navigation & Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        <Link
          href="/haberler"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#15a3b0] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          {isEn ? 'Back to News' : 'Haberlere Geri Dön'}
        </Link>

        {/* Article Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            {newsItem.tag && (
              <span className="bg-[#15a3b0]/10 text-[#15a3b0] px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                {newsItem.tag}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {readTime} {isEn ? 'min read' : 'dk okuma'}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
            {title}
          </h1>

          <div className="flex items-center justify-between border-y border-slate-100 py-4 mt-2">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <Calendar className="w-4 h-4 text-slate-400" />
              {dateStr}
            </div>
            <ShareButtons title={title} />
          </div>
        </div>

        {/* Main Cover Image */}
        {newsItem.image_url && (
          <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-lg mb-12">
            <img src={newsItem.image_url} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-slate max-w-none">
          {excerpt && (
            <p className="text-xl font-bold text-slate-700 leading-relaxed mb-8 border-l-4 border-[#15a3b0] pl-4 italic">
              {excerpt}
            </p>
          )}
          {content && content.split('\n\n').map((paragraph: string, idx: number) => {
            const trimmed = paragraph.trim();
            
            // Match markdown image: ![alt](url)
            const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (imgMatch) {
              const alt = imgMatch[1];
              const src = imgMatch[2];
              return (
                <div key={idx} className="my-8 rounded-3xl overflow-hidden shadow-lg border border-slate-100 max-w-full">
                  <img src={src} alt={alt} className="w-full h-auto object-cover max-h-[500px]" />
                  {alt && (
                    <div className="bg-slate-50 px-6 py-3 text-slate-500 text-sm font-semibold border-t border-slate-100 text-center">
                      {alt}
                    </div>
                  )}
                </div>
              );
            }

            // Match markdown video: [video](url)
            const videoMatch = trimmed.match(/^\[video\]\((.*?)\)$/);
            if (videoMatch) {
              const src = videoMatch[1];
              return (
                <div key={idx} className="my-8 rounded-3xl overflow-hidden shadow-lg border border-slate-100 max-w-full bg-black">
                  <video src={src} controls className="w-full h-auto max-h-[500px]" />
                </div>
              );
            }

            // Match YouTube URL: youtube.com or youtu.be
            const ytMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/);
            if (ytMatch) {
              const videoId = ytMatch[1];
              return (
                <div key={idx} className="my-8 aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            }

            // Default text rendering
            return (
              <p key={idx} className="text-slate-600 leading-relaxed text-lg font-medium mb-6 whitespace-pre-line">
                {paragraph}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
