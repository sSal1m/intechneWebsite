import { TeamGrid } from '@/components/about/TeamGrid';
import { getTeam } from '@/src/actions/team';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return { title: 'Ekibimiz' };
}

export default async function EkibimizPage({ params }: PageProps) {
  const { locale } = await params;
  const isEn = locale === 'en';
  const members = await getTeam();
  
  return <TeamGrid isEn={isEn} initialMembers={members} />;
}
