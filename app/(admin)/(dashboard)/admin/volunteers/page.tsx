import { getVolunteers } from '@/src/actions/volunteers';
import { VolunteersManager } from './VolunteersManager';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { forbidden } from 'next/navigation';

export const revalidate = 0; // Disable caching

export default async function AdminVolunteersPage() {
  const { role } = await getServerUserAndRole();
  if (role !== 'super_admin' && role !== 'operations_manager') {
    forbidden();
  }

  const volunteers = await getVolunteers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Gönüllü Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Gönüllü Ol Formu Başvurularının Yönetimi
        </p>
      </div>

      <VolunteersManager initialVolunteers={volunteers} />
    </div>
  );
}
