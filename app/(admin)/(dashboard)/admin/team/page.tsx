import { getTeam } from '@/src/actions/team';
import { TeamManager } from './TeamManager';

export const revalidate = 0; // Disable caching for the admin list page

export default async function AdminTeamPage() {
  const members = await getTeam();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Ekip Üyeleri Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kurumsal /ekibimiz Sayfasında Listelenen Kadro
        </p>
      </div>

      <TeamManager initialMembers={members} />
    </div>
  );
}
