'use client';

import { PlaceholderPage } from '@/components/ui/PlaceholderPage';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const locale = (params?.locale as string) || 'tr';
  return <PlaceholderPage title="TECH & CHILL FEST" locale={locale} />;
}
