import { getBrandPages } from '@/src/actions/brands';
import { BrandManager } from './BrandManager';

export const revalidate = 0; // Disable caching for admin

export default async function AdminBrandsPage() {
  const brands = await getBrandPages();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Marka Sayfaları Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Markalarımız Altındaki Sayfaların Metin, Video ve Galeri İçerikleri
        </p>
      </div>

      <BrandManager initialBrands={brands} />
    </div>
  );
}
