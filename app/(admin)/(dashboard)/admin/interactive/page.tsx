import { getInteractiveItems } from '@/src/actions/interactive';
import { InteractiveManager } from './InteractiveManager';

export const revalidate = 0; // Disable cache for interactive items

export default async function AdminInteractivePage() {
  const items = await getInteractiveItems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">İnteraktif Yayınlar Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kamu /interaktif Sayfasındaki Raporlar, Videolar ve Belgeler
        </p>
      </div>

      <InteractiveManager initialItems={items as any} />
    </div>
  );
}
