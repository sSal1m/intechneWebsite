import { getNews, getNewsCategories, getSiteSetting } from '@/src/actions/news';
import { NewsManager } from './NewsManager';

export const revalidate = 0; // Disable cache for news management list

export default async function AdminNewsPage() {
  const [news, categories, sortOrder] = await Promise.all([
    getNews(),
    getNewsCategories(),
    getSiteSetting('news_sort_order'),
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
        initialSortOrder={sortOrder || 'index'} 
      />
    </div>
  );
}
