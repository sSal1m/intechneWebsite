'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { extractStoragePath } from '@/src/utils/storage';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';

export async function getTeam() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('team')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
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
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('team')
      .insert([
        {
          name: formData.name,
          role_tr: formData.role_tr,
          role_en: formData.role_en,
          image_url: formData.image_url || '',
          email: formData.email || '',
          linkedin_url: formData.linkedin_url || '',
          order_index: formData.order_index || 0,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('createTeamMember error:', error);
    return { success: false, error: error.message };
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
  try {
    const supabase = await createClient();

    // Verify auth
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) throw new Error('Unauthorized');

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

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true, data };
  } catch (error: any) {
    console.error('updateTeamMember error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMember(id: string, imageUrl?: string) {
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

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('deleteTeamMember error:', error);
    return { success: false, error: error.message };
  }
}
