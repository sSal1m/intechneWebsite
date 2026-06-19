'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'İsim boş olamaz').max(100),
  email: z.string().trim().email('Geçersiz e-posta').max(100),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  subject: z.string().trim().max(150).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Mesaj boş olamaz').max(2000),
  kvkk_approved: z.boolean().optional(),
  hp_field: z.string().optional(),
});

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  kvkk_approved?: boolean;
  hp_field?: string;
}) {
  try {
    // 1. Honeypot (Bot Tuzağı) Kontrolü
    if (formData.hp_field) {
      console.warn("Bot activity detected via Honeypot!");
      return { success: false, error: "Mesajınız iletilemedi." };
    }

    // 2. Zod ile Veri Doğrulama ve Sıkılaştırma
    const parseResult = contactFormSchema.safeParse(formData);
    if (!parseResult.success) {
      return { success: false, error: "Mesajınız iletilemedi." };
    }

    const validatedData = parseResult.data;
    const supabase = await createClient();

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || '',
          subject: validatedData.subject || '',
          message: validatedData.message,
          kvkk_approved: validatedData.kvkk_approved || false,
        },
      ]);

    if (error) throw new Error(error.message);

    // Revalidate dashboard to update unread counts
    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    
    return { success: true };
  } catch (error: any) {
    console.error('submitContactForm error:', error);
    return { success: false, error: "Mesajınız iletilemedi." };
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

    // Fetch original message data
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !message) throw new Error(fetchError?.message || 'Message not found');

    // Move to trash
    const trashResult = await moveToTrash('messages', id, message, []);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Remove from main DB
    const { error: dbError } = await supabase.from('messages').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    revalidatePath('/admin');
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error: any) {
    console.error('deleteMessage error:', error);
    return { success: false, error: error.message };
  }
}
