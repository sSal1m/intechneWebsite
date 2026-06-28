import { getNews, getNewsCategories } from '@/src/actions/news';
import { NewsManager } from './NewsManager';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { forbidden } from 'next/navigation';

export const revalidate = 0; // Disable cache for news management list

export default async function AdminNewsPage() {
  const { role } = await getServerUserAndRole();
  if (role !== 'super_admin' && role !== 'admin') {
    forbidden();
  }

  const [news, categories] = await Promise.all([
    getNews(),
    getNewsCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-white">Haber ve Duyuru Yönetimi</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          Kamu /haberler Sayfası İçerikleri ve Filtreleme Kategorileri
        </p>
      </div>

      <NewsManager 
        initialNews={news} 
        categories={categories as any} 
      />
    </div>
  );
}
