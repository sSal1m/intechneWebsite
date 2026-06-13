'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';

export async function getCorporateIdentityItems() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('corporate_identity')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getCorporateIdentityItems error:', error);
    return [];
  }
}

export async function createCorporateIdentityItem(formData: {
  title_tr: string;
  title_en: string;
  type: string;
  file_url: string;
  thumbnail_url?: string;
  order_index?: number;
}) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('corporate_identity')
      .insert([
        {
          title_tr: formData.title_tr,
          title_en: formData.title_en,
          type: formData.type,
          file_url: formData.file_url,
          thumbnail_url: formData.thumbnail_url || null,
          order_index: formData.order_index || 0,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('createCorporateIdentityItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCorporateIdentityItem(
  id: string,
  formData: {
    title_tr: string;
    title_en: string;
    type: string;
    file_url: string;
    thumbnail_url?: string;
    order_index?: number;
  }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('corporate_identity')
      .update({
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        type: formData.type,
        file_url: formData.file_url,
        thumbnail_url: formData.thumbnail_url || null,
        order_index: formData.order_index || 0,
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateCorporateIdentityItem error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCorporateIdentityItem(id: string, fileUrl?: string, thumbnailUrl?: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch original corporate identity item data
    const { data: item, error: fetchError } = await supabase
      .from('corporate_identity')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) throw new Error(fetchError?.message || 'Corporate identity item not found');

    // Collect file paths to delete later
    const filePaths: string[] = [];
    const pathFile = extractStoragePath(item.file_url);
    if (pathFile) filePaths.push(pathFile);
    const pathThumb = extractStoragePath(item.thumbnail_url);
    if (pathThumb) filePaths.push(pathThumb);

    // Move to trash
    const trashResult = await moveToTrash('corporate_identity', id, item, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase
      .from('corporate_identity')
      .delete()
      .eq('id', id);

    if (dbError) throw new Error(dbError.message);

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('deleteCorporateIdentityItem error:', error);
    return { success: false, error: error.message };
  }
}
