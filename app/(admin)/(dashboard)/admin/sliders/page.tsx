import { getSliders, getStats } from '@/src/actions/sliders';
import { SliderManager } from './SliderManager';

export const revalidate = 0; // Disable cache for admin sliders

export default async function AdminSlidersPage() {
  const [sliders, stats] = await Promise.all([
    getSliders(),
    getStats(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Slayt ve İstatistik Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Ana Sayfa Karşılama Ekranı ve Sayılarla Biz İstatistikleri
        </p>
      </div>

      <SliderManager initialSliders={sliders} initialStats={stats} />
    </div>
  );
}
