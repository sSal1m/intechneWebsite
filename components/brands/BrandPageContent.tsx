'use client';

import { useMemo, useState } from 'react';
import { brands } from '@/src/data/brands';
import { Image as ImageIcon, Cpu, Zap, BookOpen, Rocket, Joystick, X } from 'lucide-react';

interface BrandPageContentProps {
  slug: string;
  locale: string;
  data: {
    slug: string;
    nedir_tr: string;
    nedir_en: string;
    vizyon_tr: string;
    vizyon_en: string;
    kapsam_tr: string;
    kapsam_en: string;
    video_url?: string | null;
    gallery?: string[] | null;
    sections_tr: any;
    sections_en: any;
    stats?: any;
    status_message_tr?: string | null;
    status_message_en?: string | null;
  };
}

const iconMap: Record<string, any> = {
  'cezeri-robot-ligi': Cpu,
  'robonex-robot-ligi': Cpu,
  'tech-chill-fest': Zap,
  'intechne-akademi': BookOpen,
  'drone-cup': Rocket,
  'intechne-girisim-kulubu': Rocket,
  'intechne-gaming-hub': Joystick,
  'hack-the-future-marathons': Zap,
};

function renderContent(text: string): React.ReactNode {
  const lines = text.split('\n');

  const parseInline = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <strong key={index} className="font-extrabold text-slate-900">{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
          const content = trimmed.replace(/^[-•]\s*/, '');
          return (
            <ul key={idx} className="list-disc pl-5 my-1 text-sm md:text-base text-slate-600">
              <li className="leading-relaxed">
                {parseInline(content)}
              </li>
            </ul>
          );
        }

        return (
          <p key={idx} className="text-sm md:text-base leading-relaxed text-justify text-slate-650">
            {parseInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export function BrandPageContent({ slug, locale, data }: BrandPageContentProps) {
  const isEn = locale === 'en';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const brand = useMemo(() => {
    return brands.find((b) => b.slug === slug);
  }, [slug]);

  if (!brand || !data) {
    return (
      <div className="py-12 text-center text-slate-500 font-bold">
        {isEn ? 'Brand content not found.' : 'Marka içeriği bulunamadı.'}
      </div>
    );
  }

  const activeDetails = {
    nedir: isEn ? data.nedir_en : data.nedir_tr,
    vizyon: isEn ? data.vizyon_en : data.vizyon_tr,
    kapsam: isEn ? data.kapsam_en : data.kapsam_tr,
    sections: (isEn ? data.sections_en : data.sections_tr) || [],
    statusMessage: isEn ? data.status_message_en : data.status_message_tr,
  };

  const accentColor = brand.accentColor || '#15a3b0';
  const BrandIcon = iconMap[slug] || Cpu;
  const gallery = data.gallery || [];
  const dbStats = data.stats || [];

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* 1. Main visual banner placeholder / Logo showcase */}
      <div
        className="w-full h-[262px] rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-white px-6 shadow-sm border border-slate-100"
        style={{
          backgroundColor: accentColor
        }}
      >
        {brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="h-full object-contain py-0 relative z-10 transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <>
            <BrandIcon className="w-16 h-16 mb-4 relative z-10 animate-pulse text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full relative z-10 mb-2">
              {isEn ? 'BRAND VISUAL REPRESENTATION' : 'MARKA TEMSİLİ GÖRSELİ'}
            </span>
          </>
        )}
      </div>

      {/* 2. Dynamic statistics bar / Status message */}
      {((dbStats && dbStats.length > 0) || activeDetails.statusMessage) && (
        <div
          className="rounded-2xl py-6 px-4 md:px-8 text-white shadow-md relative overflow-hidden flex items-center justify-center bg-cover bg-no-repeat bg-center min-h-[92px]"
          style={{
            backgroundColor: accentColor
          }}
        >
          {activeDetails.statusMessage ? (
            <div className="text-center font-black text-lg md:text-2xl tracking-wide uppercase select-none">
              {activeDetails.statusMessage}
            </div>
          ) : (
            /* Inner stats columns */
            <div className="grid grid-cols-3 w-full max-w-4xl mx-auto gap-4 divide-x divide-white/20 text-center">
              {dbStats.map((stat: any, idx: number) => {
                const label = isEn ? stat.labelEn || stat.label : stat.label || stat.labelEn;
                const value = isEn ? stat.valueEn || stat.value : stat.value || stat.valueEn;
                return (
                  <div key={idx} className="flex flex-col items-center justify-center">
                    <span className="text-xs md:text-sm font-semibold uppercase text-white/80 block mb-1">
                      {label || (isEn ? 'LEAGUE YEAR' : 'LİG YILI')}
                    </span>
                    <span className="text-xl md:text-3xl font-black tracking-tight block">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Main introduction and custom brand text sections */}
      <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
        {/* Large lead shortDescription */}
        <p className="text-lg md:text-xl font-bold text-slate-800 leading-relaxed border-l-4 pl-4" style={{ borderLeftColor: accentColor }}>
          {brand.shortDescription}
        </p>

        {/* Dynamic subsections */}
        <div className="space-y-6">
          {activeDetails.sections.map((section: any, idx: number) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
                {section.title}
              </h3>
              <div className="text-sm md:text-base leading-relaxed text-slate-600">
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. YouTube Embed Video */}
      {data.video_url && (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
            {isEn ? 'Introduction Video' : 'Tanıtım Videosu'}
          </h3>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 shadow-lg">
            <iframe
              src={data.video_url}
              title={isEn ? 'Introduction Video' : 'Tanıtım Videosu'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 5. Photo Gallery */}
      {gallery && gallery.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800" style={{ color: accentColor }}>
            {isEn ? 'Photo Gallery' : 'Fotoğraf Galerisi'}
          </h3>

          {/* Gallery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.map((imgUrl, val) => (
              <div
                key={val}
                onClick={() => setSelectedImage(imgUrl)}
                className="h-48 rounded-2xl relative overflow-hidden bg-slate-100 border border-slate-200/60 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={imgUrl}
                  alt={isEn ? `Gallery Image ${val + 1}` : `Galeri Görseli ${val + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-slate-300 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors duration-200"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged gallery view"
              className="w-full h-full object-contain max-h-[85vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
