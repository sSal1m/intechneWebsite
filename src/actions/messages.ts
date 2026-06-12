'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  kvkk_approved?: boolean;
}) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          subject: formData.subject || '',
          message: formData.message,
          kvkk_approved: formData.kvkk_approved || false,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    // Revalidate dashboard to update unread counts
    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    
    return { success: true };
  } catch (error: any) {
    console.error('submitContactForm error:', error);
    return { success: false, error: error.message };
  }
}

export async function getMessages() {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getMessages error:', error);
    return [];
  }
}

export async function deleteMessage(id: string) {
  try {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('deleteMessage error:', error);
    return { success: false, error: error.message };
  }
}
