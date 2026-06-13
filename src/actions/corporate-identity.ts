'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCorporateIdentityItems() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('corporate_identity')
      .select('*')
      .order('created_at', { ascending: true });

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

    const { error: dbError } = await supabase
      .from('corporate_identity')
      .delete()
      .eq('id', id);

    if (dbError) throw new Error(dbError.message);

    // Clean up file from storage if applicable
    if (fileUrl) {
      const match = fileUrl.match(/\/intechne-assets\/(.+)$/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        await supabase.storage.from('intechne-assets').remove([filePath]);
      }
    }

    // Clean up thumbnail from storage if applicable
    if (thumbnailUrl) {
      const match = thumbnailUrl.match(/\/intechne-assets\/(.+)$/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        await supabase.storage.from('intechne-assets').remove([filePath]);
      }
    }

    revalidatePath('/[locale]/hakkimizda/kurumsal-kimlik', 'page');
    return { success: true };
  } catch (error: any) {
    console.error('deleteCorporateIdentityItem error:', error);
    return { success: false, error: error.message };
  }
}
