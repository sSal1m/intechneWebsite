'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

export async function getCorporateIdentityItems() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('corporate_identity')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
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
  const startTime = performance.now();
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || role !== 'super_admin') throw new Error('Unauthorized');

    const insertPayload = {
      title_tr: formData.title_tr,
      title_en: formData.title_en,
      type: formData.type,
      file_url: formData.file_url,
      thumbnail_url: formData.thumbnail_url || null,
      order_index: formData.order_index || 0,
    };

    const { data, error } = await supabase
      .from('corporate_identity')
      .insert([insertPayload])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_CORPORATE_IDENTITY,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues: null,
      newValues
    });

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createCorporateIdentityItem error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_CORPORATE_IDENTITY,
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
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || role !== 'super_admin') throw new Error('Unauthorized');

    // Fetch old values
    const { data: oldData } = await supabase
      .from('corporate_identity')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

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

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_CORPORATE_IDENTITY,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues,
      newValues
    });

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateCorporateIdentityItem error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_CORPORATE_IDENTITY,
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

export async function deleteCorporateIdentityItem(id: string, fileUrl?: string, thumbnailUrl?: string) {
  (void fileUrl);
  (void thumbnailUrl);
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || role !== 'super_admin') throw new Error('Unauthorized');

    // Fetch original corporate identity item data
    const { data: item, error: fetchError } = await supabase
      .from('corporate_identity')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) throw new Error(fetchError?.message || 'Corporate identity item not found');
    oldValues = item as Record<string, unknown>;

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

    await writeAuditLog({
      action: AuditAction.DELETE_CORPORATE_IDENTITY,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.title_tr || '') },
      oldValues,
      newValues: null
    });

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteCorporateIdentityItem error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_CORPORATE_IDENTITY,
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
