import type { Metadata } from 'next';
import { HikayemizClient } from '@/components/about/HikayemizClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Our Story' : 'Hikayemiz',
  };
}

export default async function HikayemizPage({ params }: PageProps) {
  const { locale } = await params;
  return <HikayemizClient locale={locale} />;
}
