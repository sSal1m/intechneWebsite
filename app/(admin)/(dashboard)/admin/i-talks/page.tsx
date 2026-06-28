import { getITalksItems } from '@/src/actions/i-talks';
import { ITalksManager } from './ITalksManager';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { forbidden } from 'next/navigation';

export const revalidate = 0; // Disable cache for interactive items

export default async function AdminITalksPage() {
  const { role } = await getServerUserAndRole();
  if (role !== 'super_admin' && role !== 'admin') {
    forbidden();
  }

  const items = await getITalksItems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">I-Talks Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kamu /i-talks Sayfasındaki Raporlar, Videolar ve Belgeler
        </p>
      </div>

      <ITalksManager initialItems={items as any} />
    </div>
  );
}
