import { getBrandPages } from '@/src/actions/brands';
import { BrandManager } from './BrandManager';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { forbidden } from 'next/navigation';

export const revalidate = 0; // Disable caching for admin

export default async function AdminBrandsPage() {
  const { role } = await getServerUserAndRole();
  if (role !== 'super_admin' && role !== 'admin') {
    forbidden();
  }

  const brands = await getBrandPages();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Markalarımız Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Markalarımız Altındaki Sayfaların Metin, Video ve Galeri İçerikleri
        </p>
      </div>

      <BrandManager initialBrands={brands} />
    </div>
  );
}
