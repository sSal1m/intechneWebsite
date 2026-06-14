import type { Metadata } from 'next';
import { IsbirliklerimizClient } from '@/components/isbirliklerimiz/IsbirliklerimizClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'en' ? 'Our Collaborations' : 'İşbirliklerimiz',
  };
}

export default async function IsbirliklerimizPage({ params }: PageProps) {
  const { locale } = await params;
  return <IsbirliklerimizClient locale={locale} />;
}
