'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { extractStoragePath } from '@/src/utils/storage';

export async function getTrashItems() {
  try {
    const supabase = await createClient();
    
    // First, prune expired items older than 24 hours
    await pruneExpiredTrash(supabase);

    const { data, error } = await supabase
      .from('trash_bin')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getTrashItems error:', error);
    return [];
  }
}

// Function to prune expired items older than 24 hours
async function pruneExpiredTrash(supabase: any) {
  try {
    const expiredTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch expired items to clean up storage files
    const { data: expiredItems } = await supabase
      .from('trash_bin')
      .select('entity_type, file_paths')
      .lt('deleted_at', expiredTime);

    if (expiredItems && expiredItems.length > 0) {
      // Collect storage files to remove grouped by bucket
      const assetPaths: string[] = [];
      const cvPaths: string[] = [];
      for (const item of expiredItems) {
        if (item.file_paths && Array.isArray(item.file_paths)) {
          if (item.entity_type === 'job_applications') {
            cvPaths.push(...item.file_paths);
          } else {
            assetPaths.push(...item.file_paths);
          }
        }
      }

      if (assetPaths.length > 0) {
        await supabase.storage.from('intechne-assets').remove(assetPaths);
      }
      if (cvPaths.length > 0) {
        await supabase.storage.from('cv_uploads').remove(cvPaths);
      }
      
      // Delete from DB
      await supabase
        .from('trash_bin')
        .delete()
        .lt('deleted_at', expiredTime);
    }
  } catch (err) {
    console.error('pruneExpiredTrash error:', err);
  }
}

// Move item to trash bin
export async function moveToTrash(
  entityType: string,
  entityId: string,
  originalData: any,
  filePaths: string[] = []
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('trash_bin')
      .insert([
        {
          entity_type: entityType,
          entity_id: entityId,
          original_data: originalData,
          file_paths: filePaths,
        }
      ]);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error: any) {
    console.error('moveToTrash error:', error);
    return { success: false, error: error.message };
  }
}

// Restore item from trash
export async function restoreFromTrash(trashId: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch the trash item
    const { data: trashItem, error: fetchError } = await supabase
      .from('trash_bin')
      .select('*')
      .eq('id', trashId)
      .single();

    if (fetchError || !trashItem) throw new Error(fetchError?.message || 'Trash item not found');

    // Restore to original table
    const { error: restoreError } = await supabase
      .from(trashItem.entity_type)
      .insert([trashItem.original_data]);

    if (restoreError) throw new Error(restoreError.message);

    // If it was a job position, restore the connection in job_applications
    if (trashItem.entity_type === 'job_positions') {
      await supabase
        .from('job_applications')
        .update({ position_id: trashItem.original_data.id })
        .eq('original_position_id', trashItem.original_data.id);
    }

    // Delete from trash_bin
    const { error: deleteError } = await supabase
      .from('trash_bin')
      .delete()
      .eq('id', trashId);

    if (deleteError) throw new Error(deleteError.message);

    // Revalidate original layout / pages
    triggerRevalidation(trashItem.entity_type);

    return { success: true };
  } catch (error: any) {
    console.error('restoreFromTrash error:', error);
    return { success: false, error: error.message };
  }
}

// Delete permanently
export async function deletePermanently(trashId: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch the trash item
    const { data: trashItem, error: fetchError } = await supabase
      .from('trash_bin')
      .select('*')
      .eq('id', trashId)
      .single();

    if (fetchError || !trashItem) throw new Error(fetchError?.message || 'Trash item not found');

    // Remove from storage
    if (trashItem.file_paths && Array.isArray(trashItem.file_paths) && trashItem.file_paths.length > 0) {
      const bucketName = trashItem.entity_type === 'job_applications' ? 'cv_uploads' : 'intechne-assets';
      await supabase.storage.from(bucketName).remove(trashItem.file_paths);
    }

    // Delete from trash_bin
    const { error: deleteError } = await supabase
      .from('trash_bin')
      .delete()
      .eq('id', trashId);

    if (deleteError) throw new Error(deleteError.message);

    return { success: true };
  } catch (error: any) {
    console.error('deletePermanently error:', error);
    return { success: false, error: error.message };
  }
}

function triggerRevalidation(entityType: string) {
  try {
    if (entityType === 'sliders') {
      revalidatePath('/');
      revalidatePath('/[locale]', 'layout');
    } else if (entityType === 'news') {
      revalidatePath('/[locale]/haberler', 'page');
    } else if (entityType === 'team') {
      revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    } else if (entityType === 'corporate_identity') {
      revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    } else if (entityType === 'interactive') {
      revalidatePath('/[locale]/interaktif', 'page');
      revalidatePath('/');
      revalidatePath('/[locale]', 'layout');
    } else if (entityType === 'messages') {
      revalidatePath('/admin');
      revalidatePath('/admin/messages');
    } else if (entityType === 'job_positions' || entityType === 'job_applications') {
      revalidatePath('/admin/careers');
      revalidatePath('/[locale]/kariyer', 'page');
    } else if (entityType === 'volunteers') {
      revalidatePath('/admin/volunteers');
    }
  } catch (e) {
    console.error('triggerRevalidation error:', e);
  }
}
