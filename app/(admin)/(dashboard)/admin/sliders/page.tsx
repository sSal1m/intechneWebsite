import { getSliders } from '@/src/actions/sliders';
import { SliderManager } from './SliderManager';

export const revalidate = 0; // Disable cache for admin sliders

export default async function AdminSlidersPage() {
  const sliders = await getSliders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Slayt Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Ana Sayfa Karşılama Ekranı Slaytları
        </p>
      </div>

      <SliderManager initialSliders={sliders} />
    </div>
  );
}
