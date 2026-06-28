'use server';

import { createClient } from '@/src/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';

// Static-friendly client that does NOT read cookies, allowing ISR / static generation to work without dynamic bail-out.
function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));
  const isPlaceholder = !key || key.includes('your-supabase');

  if (!isValidUrl || isPlaceholder) {
    // Return dummy mock query structure
    const mockQuery = new Proxy({}, {
      get(target, prop): any {
        if (prop === 'then') {
          return (resolve: any) => resolve({ data: [], error: null, count: 0 });
        }
        return () => mockQuery;
      }
    });
    return mockQuery as any;
  }

  return createSupabaseClient(url!, key!);
}

export async function getBrandPages() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('brand_pages')
      .select('*')
      .order('slug', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getBrandPages error:', error);
    return [];
  }
}

export async function getBrandPage(slug: string) {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('brand_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw new Error(error.message);
    return data;
  } catch (error: any) {
    console.error('getBrandPage error:', error);
    return null;
  }
}

export async function updateBrandPage(
  slug: string,
  formData: {
    nedir_tr: string;
    nedir_en: string;
    vizyon_tr: string;
    vizyon_en: string;
    kapsam_tr: string;
    kapsam_en: string;
    video_url?: string | null;
    gallery?: string[] | null;
    sections_tr: any[];
    sections_en: any[];
    stats?: any[] | null;
    status_message_tr?: string | null;
    status_message_en?: string | null;
  }
) {
  try {
    const supabase = await createClient();

    // Verify auth using server client
    const { user, role } = await getServerUserAndRole();
    if (!user || (role !== 'super_admin' && role !== 'admin')) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('brand_pages')
      .update({
        nedir_tr: formData.nedir_tr,
        nedir_en: formData.nedir_en,
        vizyon_tr: formData.vizyon_tr,
        vizyon_en: formData.vizyon_en,
        kapsam_tr: formData.kapsam_tr,
        kapsam_en: formData.kapsam_en,
        video_url: formData.video_url || null,
        gallery: formData.gallery || [],
        sections_tr: formData.sections_tr || [],
        sections_en: formData.sections_en || [],
        stats: formData.stats || [],
        status_message_tr: formData.status_message_tr || null,
        status_message_en: formData.status_message_en || null,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select();

    if (error) throw new Error(error.message);

    // On-Demand Revalidation:
    revalidatePath('/[locale]/markalarimiz/[slug]', 'page');
    revalidatePath('/[locale]/markalarimiz', 'layout');
    revalidatePath('/');

    return { success: true, data };
  } catch (error: any) {
    console.error('updateBrandPage error:', error);
    return { success: false, error: error.message };
  }
}
