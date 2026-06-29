'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

export async function getNews(categorySlug?: string) {
  try {
    const supabase = await createClient();
    let query = supabase.from('news').select('*').order('published_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('category_slug', categorySlug);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error('getNewsById error:', error);
    return null;
  }
}

interface NewsCategory {
  slug: string;
  name_tr: string;
  name_en: string;
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
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

    const needsSync = !data || data.length === 0 || !data.some((c: Record<string, unknown>) => c.slug === 'duyurular-kurumsal');

    if (needsSync) {
      const syncStartTime = performance.now();
      try {
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

        if (insertError) throw new Error(insertError.message);

        await writeAuditLog({
          action: AuditAction.SYNC_NEWS_CATEGORIES,
          status: 'SUCCESS',
          startTime: syncStartTime,
          details: { count: targetCategories.length }
        });

        console.log('Categories synced successfully!');
        return targetCategories.map(c => ({
          slug: c.slug,
          name_tr: c.name_tr,
          name_en: c.name_en
        }));
      } catch (syncError: unknown) {
        console.error('Error inserting categories during sync:', syncError);
        await writeAuditLog({
          action: AuditAction.SYNC_NEWS_CATEGORIES,
          status: 'FAILED',
          startTime: syncStartTime,
          error: syncError
        });
      }
    }

    return (data || []) as NewsCategory[];
  } catch (error: unknown) {
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
  const startTime = performance.now();
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    const insertPayload = {
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
    };

    const { data, error } = await supabase
      .from('news')
      .insert([insertPayload])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_NEWS,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues: null,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/[locale]/haberler/[id]', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createNews error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_NEWS,
      status: 'FAILED',
      startTime,
      details: { title: formData.title_tr },
      oldValues: null,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
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
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch old values
    const { data: oldData } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

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

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_NEWS,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/[locale]/haberler/[id]', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateNews error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_NEWS,
      status: 'FAILED',
      startTime,
      details: { title: formData.title_tr },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function deleteNews(id: string, imageUrl?: string) {
  (void imageUrl);
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch original news data
    const { data: newsItem, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !newsItem) throw new Error(fetchError?.message || 'News not found');
    oldValues = newsItem as Record<string, unknown>;

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

    await writeAuditLog({
      action: AuditAction.DELETE_NEWS,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.title_tr || '') },
      oldValues,
      newValues: null
    });

    revalidatePath('/[locale]/haberler', 'page');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteNews error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_NEWS,
      status: 'FAILED',
      startTime,
      details: {},
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}
