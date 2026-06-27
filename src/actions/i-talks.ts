'use server';

import { createClient as createServerClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { notFound } from 'next/navigation';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    return new Proxy({}, {
      get(target, prop): any {
        if (prop === 'from') {
          return () => ({
            select: () => ({
              order: () => Promise.resolve({ data: [], error: null }),
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: null })
              })
            })
          });
        }
        return () => {};
      }
    }) as any;
  }
  return createSupabaseClient(url, key);
}

export async function getITalksItems(category?: string) {
  try {
    const supabase = createPublicClient();
    let query = supabase.from('interactive').select('*').order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  } catch (error: any) {
    console.error('getITalksItems error:', error);
    return [];
  }
}

export async function getITalksItemById(id: string) {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('interactive')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      notFound();
    }
    return data;
  } catch (error: any) {
    if (error?.message === 'NEXT_NOT_FOUND' || error?.digest === 'NEXT_NOT_FOUND') {
      throw error;
    }
    console.error('getITalksItemById error:', error);
    notFound();
  }
}

export async function createITalksItem(formData: {
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category: string;
  type: 'report' | 'video' | 'interactive';
  file_url?: string;
  video_url?: string;
  image_url?: string;
}) {
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('interactive')
      .insert([
        {
          title_tr: formData.title_tr,
          title_en: formData.title_en,
          description_tr: formData.description_tr,
          description_en: formData.description_en,
          category: formData.category,
          type: formData.type,
          file_url: formData.file_url || '',
          video_url: formData.video_url || '',
          image_url: formData.image_url || '',
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/[locale]/i-talks', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('createITalksItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateITalksItem(
  id: string,
  formData: {
    title_tr: string;
    title_en: string;
    description_tr: string;
    description_en: string;
    category: string;
    type: 'report' | 'video' | 'interactive';
    file_url?: string;
    video_url?: string;
    image_url?: string;
  }
) {
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('interactive')
      .update({
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        description_tr: formData.description_tr,
        description_en: formData.description_en,
        category: formData.category,
        type: formData.type,
        file_url: formData.file_url || '',
        video_url: formData.video_url || '',
        image_url: formData.image_url || '',
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/');
    revalidatePath('/[locale]/i-talks', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateITalksItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteITalksItem(id: string, imageUrl?: string, fileUrl?: string) {
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch original interactive item data
    const { data: item, error: fetchError } = await supabase
      .from('interactive')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) throw new Error(fetchError?.message || 'Interactive item not found');

    // Collect file paths to delete later
    const filePaths: string[] = [];
    const pathImage = extractStoragePath(item.image_url);
    if (pathImage) filePaths.push(pathImage);
    const pathFile = extractStoragePath(item.file_url);
    if (pathFile) filePaths.push(pathFile);

    // Move to trash
    const trashResult = await moveToTrash('interactive', id, item, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase.from('interactive').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    revalidatePath('/[locale]/i-talks', 'page');
    revalidatePath(`/[locale]/i-talks/${id}`);
    revalidatePath('/[locale]/i-talks/[id]', 'page');
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteITalksItem error:', error);
    return { success: false, error: error.message };
  }
}
