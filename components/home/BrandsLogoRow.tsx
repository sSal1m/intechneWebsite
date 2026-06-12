import { BrandLogoCard } from '@/components/ui/BrandLogoCard';
import { brands } from '@/src/data/brands';

interface BrandsLogoRowProps {
  locale: string;
}

const displayBrands = [
  { name: 'Cezeri Robot Ligi', nameEn: 'Cezeri Robot League', slug: 'cezeri-robot-ligi' },
  { name: 'Robonex Robot Ligi', nameEn: 'Robonex Robot League', slug: 'robonex-robot-ligi' },
  { name: 'Intechne Akademi', nameEn: 'Intechne Academy', slug: 'intechne-akademi' },
  { name: 'Tech & Chill Fest', nameEn: 'Tech & Chill Fest', slug: 'tech-chill-fest' },
  { name: 'Hack the Future', nameEn: 'Hack the Future', slug: 'hack-the-future-marathons' },
  { name: 'Intechne Gaming Hub', nameEn: 'Intechne Gaming Hub', slug: 'intechne-gaming-hub' },
  { name: 'Drone Cup', nameEn: 'Drone Cup', slug: 'drone-cup' },
  { name: 'Intechne Girişim Kulübü', nameEn: 'Intechne Venture Club', slug: 'intechne-girisim-kulubu' },
];

export function BrandsLogoRow({ locale }: BrandsLogoRowProps) {
  return (
    <section className="bg-[#DDF8FB] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {displayBrands.map((brand) => (
            <BrandLogoCard
              key={brand.slug}
              name={locale === 'en' ? brand.nameEn : brand.name}
              slug={brand.slug}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
