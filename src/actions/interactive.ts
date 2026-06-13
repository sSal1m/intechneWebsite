'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';

export async function getInteractiveItems(category?: string) {
  try {
    const supabase = await createClient();
    let query = supabase.from('interactive').select('*').order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getInteractiveItems error:', error);
    return [];
  }
}

export async function createInteractiveItem(formData: {
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
    const supabase = await createClient();

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

    revalidatePath('/[locale]/interaktif', 'page');
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: any) {
    console.error('createInteractiveItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateInteractiveItem(
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
    const supabase = await createClient();

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

    revalidatePath('/[locale]/interaktif', 'page');
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateInteractiveItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteInteractiveItem(id: string, imageUrl?: string, fileUrl?: string) {
  try {
    const supabase = await createClient();

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

    revalidatePath('/[locale]/interaktif', 'page');
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteInteractiveItem error:', error);
    return { success: false, error: error.message };
  }
}
