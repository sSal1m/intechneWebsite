'use server';

import { createClient as createServerClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { notFound } from 'next/navigation';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

const mockQuery: unknown = new Proxy({}, {
  get(target, prop): unknown {
    if (prop === 'then') {
      return (resolve: (val: unknown) => void) => resolve({ data: [], error: null, count: 0 });
    }
    return () => mockQuery;
  }
});

const mockSupabase = new Proxy({}, {
  get(target, prop): unknown {
    if (prop === 'then') return undefined;
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
}) as unknown as SupabaseClient;

function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    return mockSupabase;
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    const errObj = error as Record<string, unknown>;
    if (errObj?.message === 'NEXT_NOT_FOUND' || errObj?.digest === 'NEXT_NOT_FOUND') {
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
  const startTime = performance.now();
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    const insertPayload = {
      title_tr: formData.title_tr,
      title_en: formData.title_en,
      description_tr: formData.description_tr,
      description_en: formData.description_en,
      category: formData.category,
      type: formData.type,
      file_url: formData.file_url || '',
      video_url: formData.video_url || '',
      image_url: formData.image_url || '',
    };

    const { data, error } = await supabase
      .from('interactive')
      .insert([insertPayload])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_I_TALKS,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues: null,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]/i-talks', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createITalksItem error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_I_TALKS,
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
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch old values
    const { data: oldData } = await supabase
      .from('interactive')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

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

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_I_TALKS,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.title_tr },
      oldValues,
      newValues
    });

    revalidatePath('/');
    revalidatePath('/[locale]/i-talks', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateITalksItem error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_I_TALKS,
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

export async function deleteITalksItem(id: string, imageUrl?: string, fileUrl?: string) {
  (void imageUrl);
  (void fileUrl);
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createServerClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch original interactive item data
    const { data: item, error: fetchError } = await supabase
      .from('interactive')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) throw new Error(fetchError?.message || 'Interactive item not found');
    oldValues = item as Record<string, unknown>;

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

    await writeAuditLog({
      action: AuditAction.DELETE_I_TALKS,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.title_tr || '') },
      oldValues,
      newValues: null
    });

    revalidatePath('/[locale]/i-talks', 'page');
    revalidatePath(`/[locale]/i-talks/${id}`);
    revalidatePath('/[locale]/i-talks/[id]', 'page');
    revalidatePath('/');
    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteITalksItem error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_I_TALKS,
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
