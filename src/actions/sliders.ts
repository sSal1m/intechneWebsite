'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

export async function getSliders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sliders')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getSliders error:', error);
    return [];
  }
}

export async function createSlider(formData: {
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  button_label_tr?: string;
  button_label_en?: string;
  href?: string;
  image_url?: string;
  stats?: unknown[];
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
      description_tr: formData.description_tr,
      description_en: formData.description_en,
      button_label_tr: formData.button_label_tr || '',
      button_label_en: formData.button_label_en || '',
      href: formData.href || '',
      image_url: formData.image_url || '',
      stats: formData.stats || [],
      order_index: formData.order_index || 0,
    };

    const { data, error } = await supabase
      .from('sliders')
      .insert([insertPayload])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_SLIDER,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues: null,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createSlider error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_SLIDER,
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

export async function updateSlider(
  id: string,
  formData: {
    title_tr: string;
    title_en: string;
    description_tr: string;
    description_en: string;
    button_label_tr?: string;
    button_label_en?: string;
    href?: string;
    image_url?: string;
    stats?: unknown[];
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
      .from('sliders')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

    const { data, error } = await supabase
      .from('sliders')
      .update({
        title_tr: formData.title_tr,
        title_en: formData.title_en,
        description_tr: formData.description_tr,
        description_en: formData.description_en,
        button_label_tr: formData.button_label_tr || '',
        button_label_en: formData.button_label_en || '',
        href: formData.href || '',
        image_url: formData.image_url || '',
        stats: formData.stats || [],
        order_index: formData.order_index || 0,
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_SLIDER,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateSlider error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_SLIDER,
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

export async function deleteSlider(id: string, imageUrl?: string) {
  (void imageUrl);
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch original slider data
    const { data: slider, error: fetchError } = await supabase
      .from('sliders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !slider) throw new Error(fetchError?.message || 'Slider not found');
    oldValues = slider as Record<string, unknown>;

    // Collect file paths to delete later
    const filePaths: string[] = [];
    const path = extractStoragePath(slider.image_url);
    if (path) filePaths.push(path);

    // Move to trash
    const trashResult = await moveToTrash('sliders', id, slider, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase.from('sliders').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    await writeAuditLog({
      action: AuditAction.DELETE_SLIDER,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.title_tr || '') },
      oldValues,
      newValues: null
    });

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteSlider error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_SLIDER,
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

// Stats action helpers
export async function getStats() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getStats error:', error);
    return [];
  }
}

export async function updateStat(
  id: string,
  formData: {
    value_tr: string;
    value_en: string;
    label_tr: string;
    label_en: string;
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
      .from('stats')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

    const { data, error } = await supabase
      .from('stats')
      .update({
        value_tr: formData.value_tr,
        value_en: formData.value_en,
        label_tr: formData.label_tr,
        label_en: formData.label_en,
        order_index: formData.order_index || 0,
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_STAT,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.label_tr },
      oldValues,
      newValues
    });

    revalidatePath('/');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateStat error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_STAT,
      status: 'FAILED',
      startTime,
      details: { title: formData.label_tr },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}
