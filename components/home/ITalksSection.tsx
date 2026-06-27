'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaCard } from '@/components/ui/MediaCard';
import type { MediaItem } from '@/src/types/common.types';
import { useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';

const categories = ['Tümü', 'Projeler', 'Raporlar', 'Eğitimler', 'Podcast', 'Teknoloji', 'İnsan', 'Robotik'] as const;
type Category = (typeof categories)[number];

const categoryTranslations: Record<Category, string> = {
  'Tümü': 'All',
  'Projeler': 'Projects',
  'Raporlar': 'Reports',
  'Eğitimler': 'Trainings',
  'Podcast': 'Podcast',
  'Teknoloji': 'Technology',
  'İnsan': 'People',
  'Robotik': 'Robotics',
};

interface ITalksSectionProps {
  initialItems?: any[];
}

export function ITalksSection({ initialItems }: ITalksSectionProps) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [activeCategory, setActiveCategory] = useState<Category>('Tümü');
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Map database items and pad/merge with mock items
  let finalItems: MediaItem[] = initialItems && initialItems.length > 0
    ? initialItems.map((item) => {
        const catLower = item.category?.toLowerCase();
        let mappedCat = item.category || '';
        if (catLower === 'projeler') mappedCat = 'Projeler';
        else if (catLower === 'raporlar') mappedCat = 'Raporlar';
        else if (catLower === 'egitimler') mappedCat = 'Eğitimler';
        else if (catLower === 'podcast') mappedCat = 'Podcast';
        else if (catLower === 'teknoloji') mappedCat = 'Teknoloji';
        else if (catLower === 'insan') mappedCat = 'İnsan';
        else if (catLower === 'robotik') mappedCat = 'Robotik';
        else if (item.category) {
          mappedCat = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        }

        return {
          id: item.id,
          date: new Date(item.created_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          category: mappedCat,
          title: isEn ? item.title_en : item.title_tr,
          subtitle: isEn ? item.description_en : item.description_tr,
          type: item.type,
          href: `/i-talks/${item.id}`,
          imageAlt: isEn ? item.title_en : item.title_tr,
          imageUrl: item.image_url,
        };
      })
    : [];

  const filtered: MediaItem[] =
    activeCategory === 'Tümü'
      ? finalItems
      : finalItems.filter((item) => item.category === activeCategory);

  return (
    <section>
      {/* Header bar */}
      <div className="bg-brand-navy py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-white font-black text-3xl md:text-4xl whitespace-nowrap">
              I-Talks
            </h2>
            {/* Tab filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    cat === activeCategory
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {isEn ? categoryTranslations[cat] : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards carousel */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <>
              <div ref={emblaRef} className="embla overflow-hidden">
                <div className="embla__container flex gap-4">
                  {filtered.map((item) => (
                    <div key={item.id} className="embla__slide !flex-none w-full sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-32px)/3)]">
                      <MediaCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-3">
                  <button
                    onClick={scrollPrev}
                    className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center hover:bg-slate-700 transition-colors"
                    aria-label={isEn ? 'Previous' : 'Önceki'}
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center hover:bg-slate-700 transition-colors"
                    aria-label={isEn ? 'Next' : 'Sonraki'}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
                <Link
                  href="/i-talks"
                  className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-full hover:bg-primary-dark transition-colors"
                >
                  {isEn ? 'View All' : 'Tümünü Gör'}
                </Link>
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-center py-8">
              {isEn ? 'No content found in this category.' : 'Bu kategoride içerik bulunamadı.'}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
