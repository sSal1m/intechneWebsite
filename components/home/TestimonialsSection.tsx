import { Link } from '@/src/i18n/navigation';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { testimonials } from '@/src/data/testimonials';

interface TestimonialsSectionProps {
  locale: string;
}

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const featured = testimonials.find((t) => t.variant === 'featured')!;
  const secondary = testimonials.filter((t) => t.variant === 'secondary');
  const isEn = locale === 'en';

  return (
    <section className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Title + CTA */}
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-black text-3xl md:text-4xl leading-tight">
              {isEn ? 'What Did You Say About Our Foundation?' : 'Vakfımız için Neler Söylediniz?'}
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md">
              {isEn 
                ? 'Share your thoughts, suggestions, and experiences about our foundation with us.' 
                : 'Vakfımız hakkındaki düşüncelerinizi, önerilerinizi ve deneyimlerinizi bizimle paylaşın.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="inline-flex items-center justify-center bg-brand-red text-white font-bold px-6 py-3 rounded-full hover:bg-brand-red-dark transition-colors text-sm">
                {isEn ? 'Write Yours Too' : 'Sen de Yaz'}
              </button>
              <Link
                href="/yorumlar"
                className="inline-flex items-center justify-center text-white font-bold underline underline-offset-4 text-sm hover:text-white/80 transition-colors"
              >
                {isEn ? 'See All' : 'Tümünü Gör'}
              </Link>
            </div>
          </div>

          {/* Right: Cards */}
          <div className="flex flex-col gap-4">
            {/* Featured */}
            <TestimonialCard item={featured} />
            {/* Secondary row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {secondary.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
