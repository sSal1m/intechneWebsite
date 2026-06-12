'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error: dbError } = await supabase.from('team').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    // Clean up image from storage if applicable
    if (imageUrl) {
      const match = imageUrl.match(/\/uploads\/(.+)$/);
      if (match && match[1]) {
        const filePath = `uploads/${match[1]}`;
        await supabase.storage.from('intechne-assets').remove([filePath]);
      }
    }

    revalidatePath('/[locale]/hakkimizda/ekibimiz', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('deleteTeamMember error:', error);
    return { success: false, error: error.message };
  }
}
