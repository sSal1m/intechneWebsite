'use client';

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsCard } from '@/components/ui/NewsCard';

import { useLocale } from 'next-intl';
import type { NewsItem } from '@/src/types/common.types';

export function NewsSection({ initialNews }: { initialNews?: any[] }) {
  const locale = useLocale();
  const isEn = locale === 'en';
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Map database news and merge with fallback if needed
  let finalNews: NewsItem[] = initialNews && initialNews.length > 0
    ? initialNews.map((item) => ({
        id: item.id,
        title: isEn ? item.title_en : item.title_tr,
        excerpt: isEn ? item.excerpt_en : item.excerpt_tr,
        href: `/haberler/${item.id}`,
        tag: item.tag,
        date: new Date(item.published_at).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        image_url: item.image_url,
        imageAlt: isEn ? item.title_en : item.title_tr,
      }))
    : [];

  if (finalNews.length === 0) return null;

  const featured = finalNews[0];
  const secondary = finalNews.slice(1);

  return (
    <section className="bg-[#C0222A] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-white font-black text-4xl md:text-5xl text-center mb-10">
          {isEn ? 'News' : 'Haberler'}
        </h2>

        {/* Carousel wrapper */}
        <div className="relative">
          <div ref={emblaRef} className="embla overflow-hidden">
            <div className="embla__container flex">
              {/* Slide 1: featured + 4 secondary */}
              <div className="embla__slide flex-shrink-0 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
                  {/* Featured left */}
                  <NewsCard item={featured} variant="featured" />
                  {/* 2x2 right */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    {secondary.slice(0, 4).map((item) => (
                      <NewsCard key={item.id} item={item} variant="secondary" />
                    ))}
                  </div>
                </div>
              </div>
              {/* Slide 2 (if more news) */}
              {finalNews.length > 5 && (
                <div className="embla__slide flex-shrink-0 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-4">
                    <NewsCard item={secondary[3]} variant="featured" />
                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                      {secondary.slice(4).concat(secondary.slice(0, 2)).slice(0, 4).map((item, i) => (
                        <NewsCard key={i} item={item} variant="secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center hover:bg-slate-700 transition-colors"
              aria-label={isEn ? 'Previous news' : 'Önceki haberler'}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center hover:bg-slate-700 transition-colors"
              aria-label={isEn ? 'Next news' : 'Sonraki haberler'}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
