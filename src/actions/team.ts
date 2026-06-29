'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

export async function getTeam() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getTeam error:', error);
    return [];
  }
}

export async function createTeamMember(formData: {
  name: string;
  role_tr: string;
  role_en: string;
  image_url?: string;
  email?: string;
  linkedin_url?: string;
  order_index?: number;
}) {
  const startTime = performance.now();
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    const insertPayload = {
      name: formData.name,
      role_tr: formData.role_tr,
      role_en: formData.role_en,
      image_url: formData.image_url || '',
      email: formData.email || '',
      linkedin_url: formData.linkedin_url || '',
      order_index: formData.order_index || 0,
    };

    const { data, error } = await supabase
      .from('team')
      .insert([insertPayload])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_TEAM_MEMBER,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.name },
      oldValues: null,
      newValues
    });

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createTeamMember error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_TEAM_MEMBER,
      status: 'FAILED',
      startTime,
      details: { title: formData.name },
      oldValues: null,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function updateTeamMember(
  id: string,
  formData: {
    name: string;
    role_tr: string;
    role_en: string;
    image_url?: string;
    email?: string;
    linkedin_url?: string;
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
      .from('team')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

    const { data, error } = await supabase
      .from('team')
      .update({
        name: formData.name,
        role_tr: formData.role_tr,
        role_en: formData.role_en,
        image_url: formData.image_url || '',
        email: formData.email || '',
        linkedin_url: formData.linkedin_url || '',
        order_index: formData.order_index || 0,
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_TEAM_MEMBER,
      status: 'SUCCESS',
      startTime,
      details: { title: formData.name },
      oldValues,
      newValues
    });

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateTeamMember error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_TEAM_MEMBER,
      status: 'FAILED',
      startTime,
      details: { title: formData.name },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function deleteTeamMember(id: string, imageUrl?: string) {
  (void imageUrl);
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    // Fetch original team member data
    const { data: member, error: fetchError } = await supabase
      .from('team')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !member) throw new Error(fetchError?.message || 'Team member not found');
    oldValues = member as Record<string, unknown>;

    // Collect file paths to delete later
    const filePaths: string[] = [];
    const path = extractStoragePath(member.image_url);
    if (path) filePaths.push(path);

    // Move to trash
    const trashResult = await moveToTrash('team', id, member, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase.from('team').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    await writeAuditLog({
      action: AuditAction.DELETE_TEAM_MEMBER,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.name || '') },
      oldValues,
      newValues: null
    });

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteTeamMember error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_TEAM_MEMBER,
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
