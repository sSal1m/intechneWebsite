'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from '@/src/i18n/navigation';
import { heroSlides } from '@/src/data/brands';
import { useLocale } from 'next-intl';

interface HeroSliderProps {
  locale: string;
}

const statLabelTranslations: Record<string, string> = {
  'Paydaş Kurum': 'Partner Institution',
  'Yarışma': 'Competition',
  'Parametre': 'Parameter',
  'Kuruluş': 'Foundation',
  'Yerli': 'Local',
  'Atölye': 'Workshop',
  'İl': 'Province',
  'Öğrenci': 'Student',
  'Merkez': 'Center',
  'Ziyaretçi': 'Visitor',
  'Girişim': 'Startup',
  'Mentor': 'Mentor',
  'Yıl': 'Year',
  'Makale': 'Article',
  'Editör': 'Editor',
  'Başlangıç': 'Start',
  'Dağıtılan Kart': 'Distributed Cards',
  'Piyasaya Çıkış': 'Release Year',
  'Yerli Üretim': 'Local Production',
  'Okuyucu': 'Reader',
  'Kuruluş Yılı': 'Foundation Year',
  'Burslu Öğrenci': 'Scholarship Student',
  'Üniversite': 'University',
  'Desteklenen Takım': 'Supported Team',
  'Destek Miktarı': 'Support Amount',
  'şehir': 'Cities',
  'Yarışmacı': 'Competitors',
};

const statValueTranslations: Record<string, string> = {
  '9. Yıl': '9th Year',
  '3. Yıl': '3rd Year',
  '1. Yıl': '1st Year',
};

const slideTranslationsEn: Record<string, { title: string; description: string }> = {
  '1': {
    title: 'Cezeri Robot League',
    description: 'It is a massive robotics league organized to turn engineering into a fierce sport and prepare young talents in Turkey for global competition.',
  },
  '2': {
    title: 'Intechne Academy',
    description: 'It is an applied technology academy established to take young talents beyond the limits of theoretical education, connect them with real-world projects, and provide well-equipped engineers to the industry.',
  },
  '3': {
    title: '2026 Vex Robotics Turkey Championship',
    description: 'A national robotics championship that tests the mechanical design and teamwork skills of young talents at global standards by bringing one of the most prestigious STEM programs to Turkey.',
  },
  '4': {
    title: 'Robonex Robot League',
    description: 'A dynamic arena of competition organized to prepare young engineers for the technologies of the future, where next-generation autonomous systems and robotic technologies compete fiercely.',
  },
};

export function HeroSlider({ locale }: HeroSliderProps) {
  const isEn = locale === 'en';
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 7000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  function scrollTo(index: number) {
    emblaApi?.scrollTo(index);
  }

  return (
    <section className="bg-slate-50 overflow-hidden">
      <div ref={emblaRef} className="embla">
        <div className="embla__container">
          {heroSlides.map((slide, idx) => {
            const displayTitle = isEn ? (slideTranslationsEn[slide.id]?.title || slide.title) : slide.title;
            const displayDescription = isEn ? (slideTranslationsEn[slide.id]?.description || slide.description) : slide.description;

            return (
              <div key={slide.id} className="embla__slide">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center min-h-[420px]">
                    {/* Left: Text */}
                    <div className="flex flex-col gap-5">
                      <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight">
                        {displayTitle}
                      </h2>
                      <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-lg">
                        {displayDescription}
                      </p>
                      <Link
                        href={slide.href as any}
                        className="inline-flex items-center gap-2 border-2 border-brand-dark text-brand-dark rounded-full px-6 py-3 font-bold text-sm hover:bg-brand-dark hover:text-white transition-all duration-200 w-fit"
                      >
                        {isEn ? 'Learn More' : slide.buttonLabel}
                      </Link>
                    </div>

                    {/* Right: Image Blob + Stats */}
                    <div className="relative flex justify-center items-center">
                      {/* Teal blob */}
                      <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px]">
                        <div className="w-full h-full bg-gradient-to-br from-brand-teal to-blue-700 rounded-[40%_60%_60%_40%/60%_40%_60%_40%] overflow-hidden flex items-center justify-center">
                          <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                            <span className="text-white/50 font-bold text-center text-sm px-4">
                              {displayTitle} {isEn ? 'Image' : 'Görseli'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stat pills */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                        {slide.stats.map((stat: { value: string; label: string }, sIdx: number) => {
                          const displayLabel = isEn ? (statLabelTranslations[stat.label] || stat.label) : stat.label;
                          return (
                            <div
                              key={sIdx}
                              className="bg-white rounded-xl shadow-md px-4 py-2 text-right min-w-[90px]"
                            >
                              <p className="text-brand-dark font-black text-lg leading-none">
                                {isEn ? (statValueTranslations[stat.value] || stat.value) : stat.value}
                              </p>
                              {stat.label && <p className="text-slate-500 text-xs mt-0.5">{displayLabel}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-6">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'bg-primary w-6' : 'bg-slate-300'
              }`}
            aria-label={isEn ? `Slide ${idx + 1}` : `Slayt ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
