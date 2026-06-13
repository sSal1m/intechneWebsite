'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';

export async function getSliders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sliders')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
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
  stats?: any[];
  order_index?: number;
}) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('sliders')
      .insert([
        {
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
        },
      ])
      .select();

    if (error) throw new Error(error.message);
    
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: any) {
    console.error('createSlider error:', error);
    return { success: false, error: error.message };
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
    stats?: any[];
    order_index?: number;
  }
) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateSlider error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSlider(id: string, imageUrl?: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Fetch original slider data
    const { data: slider, error: fetchError } = await supabase
      .from('sliders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !slider) throw new Error(fetchError?.message || 'Slider not found');

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

    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteSlider error:', error);
    return { success: false, error: error.message };
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
  } catch (error: any) {
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
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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

    revalidatePath('/');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateStat error:', error);
    return { success: false, error: error.message };
  }
}
