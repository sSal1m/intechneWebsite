import { getVolunteers } from '@/src/actions/volunteers';
import { VolunteersManager } from './VolunteersManager';

export const revalidate = 0; // Disable caching

export default async function AdminVolunteersPage() {
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
