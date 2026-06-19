'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';

export async function getNews(categorySlug?: string) {
  try {
    const supabase = await createClient();
    let query = supabase.from('news').select('*').order('order_index', { ascending: false }).order('published_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('category_slug', categorySlug);
    }

    const { data, error } = await query;
    if (error) {
      // Fallback if order_index column doesn't exist in DB yet
      if (error.code === '42703' || error.message.includes('order_index')) {
        let fallbackQuery = supabase.from('news').select('*').order('published_at', { ascending: false });
        if (categorySlug && categorySlug !== 'all') {
          fallbackQuery = fallbackQuery.eq('category_slug', categorySlug);
        }
        const fallbackResult = await fallbackQuery;
        if (fallbackResult.error) throw new Error(fallbackResult.error.message);
        return fallbackResult.data || [];
      }
      throw new Error(error.message);
    }
    return data || [];
  } catch (error: any) {
    console.error('getNews error:', error);
    return [];
  }
}

export async function getNewsById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error('getNewsById error:', error);
    return null;
  }
}

export async function getNewsCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('slug', { ascending: true });

    if (error) throw new Error(error.message);

    const targetCategories = [
      { slug: 'duyurular-kurumsal', name_tr: 'Duyurular & Kurumsal', name_en: 'Announcements & Corporate' },
      { slug: 'robotik-yarismalar', name_tr: 'Robotik & Yarışmalar', name_en: 'Robotics & Competitions' },
      { slug: 'egitim-akademi', name_tr: 'Eğitim & Akademi', name_en: 'Education & Academy' },
      { slug: 'yazilim-hackathon', name_tr: 'Yazılım & Hackathon', name_en: 'Software & Hackathons' },
      { slug: 'girisimcilik-yatirim', name_tr: 'Girişimcilik & Yatırım', name_en: 'Entrepreneurship & Innovation' },
      { slug: 'oyun-espor', name_tr: 'Oyun & E-Spor', name_en: 'Gaming & E-Sports' }
    ];

    const needsSync = !data || data.length === 0 || !data.some((c: any) => c.slug === 'duyurular-kurumsal');

    if (needsSync) {
      console.log('Syncing categories in database...');
      // 1. Unlink existing categories from news articles to avoid foreign key violations
      await supabase
        .from('news')
        .update({ category_slug: null })
        .not('category_slug', 'is', null);

      // 2. Delete old categories
      await supabase
        .from('news_categories')
        .delete()
        .neq('slug', 'all-keep');

      // 3. Insert new categories
      const { error: insertError } = await supabase
        .from('news_categories')
        .insert(targetCategories);

      if (insertError) {
        console.error('Error inserting categories during sync:', insertError.message);
      } else {
        console.log('Categories synced successfully!');
        return targetCategories.map(c => ({
          slug: c.slug,
          name_tr: c.name_tr,
          name_en: c.name_en
        }));
      }
    }

    return data || [];
  } catch (error: any) {
    console.error('getNewsCategories error:', error);
    return [];
  }
}

export async function createNews(formData: {
  title_tr: string;
  title_en: string;
  excerpt_tr: string;
  excerpt_en: string;
  content_tr: string;
  content_en: string;
  tag?: string;
  category_slug?: string;
  image_url?: string;
  published_at?: string;
  order_index?: number;
}) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title_tr: formData.title_tr,
          title_en: formData.title_en,
          excerpt_tr: formData.excerpt_tr,
          excerpt_en: formData.excerpt_en,
          content_tr: formData.content_tr,
          content_en: formData.content_en,
          tag: formData.tag || '',
          category_slug: formData.category_slug || null,
          image_url: formData.image_url || '',
          published_at: formData.published_at || new Date().toISOString(),
          order_index: formData.order_index || 0,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/[locale]/haberler/[id]', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('createNews error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateNews(
  id: string,
  formData: {
    title_tr: string;
    title_en: string;
    excerpt_tr: string;
    excerpt_en: string;
    content_tr: string;
    content_en: string;
    tag?: string;
    category_slug?: string;
    image_url?: string;
    published_at?: string;
    order_index?: number;
  }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('news')
      .update({
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        excerpt_tr: formData.excerpt_tr,
        excerpt_en: formData.excerpt_en,
        content_tr: formData.content_tr,
        content_en: formData.content_en,
        tag: formData.tag || '',
        category_slug: formData.category_slug || null,
        image_url: formData.image_url || '',
        published_at: formData.published_at || new Date().toISOString(),
        order_index: formData.order_index || 0,
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/[locale]/haberler/[id]', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateNews error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteNews(id: string, imageUrl?: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch original news data
    const { data: newsItem, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !newsItem) throw new Error(fetchError?.message || 'News not found');

    // Collect file paths to delete later
    const filePaths: string[] = [];
    const path = extractStoragePath(newsItem.image_url);
    if (path) filePaths.push(path);

    // Move to trash
    const trashResult = await moveToTrash('news', id, newsItem, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase.from('news').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('deleteNews error:', error);
    return { success: false, error: error.message };
  }
}
