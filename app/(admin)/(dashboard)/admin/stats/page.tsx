import { getStats } from '@/src/actions/sliders';
import { StatManager } from './StatManager';

export const revalidate = 0; // Disable cache for admin stats

export default async function AdminStatsPage() {
  const stats = await getStats();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">İstatistik Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Ana Sayfa "Sayılarla Biz" İstatistik Kartları
        </p>
      </div>

      <StatManager initialStats={stats} />
    </div>
  );
}
