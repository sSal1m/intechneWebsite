import { getTrashItems } from '@/src/actions/trash-bin';
import { TrashManager } from './TrashManager';

export const revalidate = 0; // Disable caching for the admin list page

export default async function AdminTrashPage() {
  const items = await getTrashItems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white font-sans">Çöp Kutusu (Son 24 Saat)</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Silinen ögeler burada 24 saat saklanır. Bu süre zarfında kurtarılmayan ögeler kalıcı olarak silinir.
        </p>
      </div>

      <TrashManager initialItems={items} />
    </div>
  );
}
