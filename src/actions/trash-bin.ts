'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getTrashItems() {
  try {
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    const supabase = await createClient();

    // First, prune expired items older than 24 hours
    await pruneExpiredTrash(supabase);

    const { data, error } = await supabase
      .from('trash_bin')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getTrashItems error:', error);
    return [];
  }
}

// Function to prune expired items older than 24 hours
async function pruneExpiredTrash(supabase: SupabaseClient): Promise<void> {
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
        const itemRecord = item as Record<string, unknown>;
        if (itemRecord.file_paths && Array.isArray(itemRecord.file_paths)) {
          if (itemRecord.entity_type === 'job_applications') {
            cvPaths.push(...(itemRecord.file_paths as string[]));
          } else {
            assetPaths.push(...(itemRecord.file_paths as string[]));
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
  } catch (err: unknown) {
    console.error('pruneExpiredTrash error:', err);
  }
}

// Move item to trash bin
export async function moveToTrash(
  entityType: string,
  entityId: string,
  originalData: Record<string, unknown>,
  filePaths: string[] = []
) {
  const startTime = performance.now();
  try {
    const supabase = await createClient();

    // Verify auth
    const { user } = await getServerUserAndRole();
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

    await writeAuditLog({
      action: AuditAction.MOVE_TO_TRASH,
      status: 'SUCCESS',
      startTime,
      details: { entityType, entityId },
      oldValues: originalData,
      newValues: null
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('moveToTrash error:', error);

    await writeAuditLog({
      action: AuditAction.MOVE_TO_TRASH,
      status: 'FAILED',
      startTime,
      details: { entityType, entityId },
      oldValues: originalData,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

// Restore item from trash
export async function restoreFromTrash(trashId: string) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch the trash item
    const { data: trashItem, error: fetchError } = await supabase
      .from('trash_bin')
      .select('*')
      .eq('id', trashId)
      .single();

    if (fetchError || !trashItem) throw new Error(fetchError?.message || 'Trash item not found');
    oldValues = trashItem as Record<string, unknown>;

    const originalData = trashItem.original_data as Record<string, unknown>;

    // Restore to original table
    const { error: restoreError } = await supabase
      .from(trashItem.entity_type)
      .insert([originalData]);

    if (restoreError) throw new Error(restoreError.message);

    // If it was a job position, restore the connection in job_applications
    if (trashItem.entity_type === 'job_positions') {
      await supabase
        .from('job_applications')
        .update({ position_id: originalData.id })
        .eq('original_position_id', originalData.id);
    }

    // Delete from trash_bin
    const { error: deleteError } = await supabase
      .from('trash_bin')
      .delete()
      .eq('id', trashId);

    if (deleteError) throw new Error(deleteError.message);

    await writeAuditLog({
      action: AuditAction.RESTORE_FROM_TRASH,
      status: 'SUCCESS',
      startTime,
      details: { entityType: trashItem.entity_type, entityId: originalData.id as string },
      oldValues,
      newValues: originalData
    });

    // Revalidate original layout / pages
    triggerRevalidation(trashItem.entity_type);

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('restoreFromTrash error:', error);

    await writeAuditLog({
      action: AuditAction.RESTORE_FROM_TRASH,
      status: 'FAILED',
      startTime,
      details: { trashId },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

// Delete permanently
export async function deletePermanently(trashId: string) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || role !== 'super_admin') throw new Error('Unauthorized');

    // Fetch the trash item
    const { data: trashItem, error: fetchError } = await supabase
      .from('trash_bin')
      .select('*')
      .eq('id', trashId)
      .single();

    if (fetchError || !trashItem) throw new Error(fetchError?.message || 'Trash item not found');
    oldValues = trashItem as Record<string, unknown>;

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

    await writeAuditLog({
      action: AuditAction.DELETE_PERMANENTLY,
      status: 'SUCCESS',
      startTime,
      details: { entityType: trashItem.entity_type, entityId: trashItem.entity_id as string },
      oldValues,
      newValues: null
    });

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deletePermanently error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_PERMANENTLY,
      status: 'FAILED',
      startTime,
      details: { trashId },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
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
      revalidatePath('/[locale]/i-talks', 'page');
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
