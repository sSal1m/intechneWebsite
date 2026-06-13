import { getCorporateIdentityItems } from '@/src/actions/corporate-identity';
import { IdentityManager } from './IdentityManager';

export const revalidate = 0; // Disable caching for the admin list page

export default async function AdminIdentityPage() {
  const items = await getCorporateIdentityItems();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white font-sans">Kurumsal Kimlik Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kurumsal /kurumsal-kimlik Sayfasında İndirilebilir Dosyalar ve Logolar
        </p>
      </div>

      <IdentityManager initialItems={items} />
    </div>
  );
}
