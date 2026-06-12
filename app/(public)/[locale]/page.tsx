import type { Metadata } from 'next';
import { HeroSlider } from '@/components/home/HeroSlider';
import { BrandsTabSection } from '@/components/home/BrandsTabSection';
import { BrandsLogoRow } from '@/components/home/BrandsLogoRow';
import { NewsSection } from '@/components/home/NewsSection';
import { InteractiveSection } from '@/components/home/InteractiveSection';
import { ContactCTA } from '@/components/home/ContactCTA';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { StatsSection } from '@/components/home/StatsSection';

import { getSliders, getStats } from '@/src/actions/sliders';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ana Sayfa',
};

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const sliders = await getSliders();
  const statsData = await getStats();

  return (
    <>
      <HeroSlider locale={locale} initialSliders={sliders} />
      <BrandsTabSection locale={locale} />
      <BrandsLogoRow locale={locale} />
      <NewsSection />
      <InteractiveSection />
      <ContactCTA />
      {/* <TestimonialsSection locale={locale} /> */}
      <StatsSection initialStats={statsData} />
    </>
  );
}
