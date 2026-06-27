import type { Metadata } from 'next';
import { HeroSlider } from '@/components/home/HeroSlider';
import { BrandsTabSection } from '@/components/home/BrandsTabSection';
import { BrandsLogoRow } from '@/components/home/BrandsLogoRow';
import { NewsSection } from '@/components/home/NewsSection';
import { ITalksSection } from '@/components/home/ITalksSection';
import { ContactCTA } from '@/components/home/ContactCTA';
import { StatsSection } from '@/components/home/StatsSection';

import { getSliders, getStats } from '@/src/actions/sliders';
import { getNews } from '@/src/actions/news';
import { getITalksItems } from '@/src/actions/i-talks';

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
  const newsData = await getNews();
  const interactiveData = await getITalksItems();

  return (
    <>
      <HeroSlider locale={locale} initialSliders={sliders} />
      <BrandsTabSection locale={locale} />
      <BrandsLogoRow locale={locale} />
      <NewsSection initialNews={newsData} />
      <ITalksSection initialItems={interactiveData} />
      <ContactCTA />
      <StatsSection initialStats={statsData} />
    </>
  );
}
