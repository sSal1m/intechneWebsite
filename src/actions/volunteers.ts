'use server';

import { createClient } from '@/src/utils/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { moveToTrash } from './trash-bin';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';
import fs from 'fs';
import path from 'path';

function logDebug(message: string, error: unknown) {
  const logMsg = `[${new Date().toISOString()}] ${message}: ${error instanceof Error ? error.message : String(error)}\n${error instanceof Error && error.stack ? error.stack : ''}\n---\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), 'debug.log'), logMsg);
  } catch (e) {
    console.error('Failed to write to debug.log:', e);
  }
}

const volunteerSchema = z.object({
  first_name: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(150, 'Ad en fazla 150 karakter olabilir').trim(),
  last_name: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').max(150, 'Soyad en fazla 150 karakter olabilir').trim(),
  birth_date: z.string().refine(val => !isNaN(Date.parse(val)), 'Geçersiz doğum tarihi'),
  gender: z.enum(['Kadin', 'Erkek']),
  phone: z.string().min(7, 'Telefon numarası en az 7 karakter olmalıdır').max(30, 'Telefon numarası en fazla 30 karakter olabilir').trim(),
  city: z.string().min(2, 'Şehir en az 2 karakter olmalıdır').max(100, 'Şehir en fazla 100 karakter olabilir').trim(),
  employment_status: z.string().min(2, 'İş/Eğitim durumu en az 2 karakter olmalıdır').max(255, 'İş/Eğitim durumu en fazla 255 karakter olabilir').trim(),
  school_department: z.string().min(2, 'Okul/Bölüm en az 2 karakter olmalıdır').max(255, 'Okul/Bölüm en fazla 255 karakter olabilir').trim(),
  food_allergies: z.string().max(1000, 'Gıda alerjileri en fazla 1000 karakter olabilir').optional().default('').transform(val => val.trim()),
  medical_conditions: z.string().max(1000, 'Rahatsızlık durumu en fazla 1000 karakter olabilir').optional().default('').transform(val => val.trim()),
});

// Auth helper
async function checkVolunteerAccess(): Promise<void> {
  const { user, role } = await getServerUserAndRole();
  if (!user || (role !== 'super_admin' && role !== 'operations_manager')) {
    throw new Error('Yetkisiz erişim');
  }
}

export async function submitVolunteerForm(rawFormData: FormData) {
  const startTime = performance.now();
  // 1. Honeypot check
  const hpField = rawFormData.get('hp_field');
  if (hpField && hpField.toString().trim() !== '') {
    console.warn('Volunteer Honeypot field triggered. Silently ignoring submit.');
    return { success: true, message: 'Başvurunuz başarıyla alınmıştır.' };
  }

  // 2. Parse fields
  const parsedData = {
    first_name: rawFormData.get('first_name')?.toString() || '',
    last_name: rawFormData.get('last_name')?.toString() || '',
    birth_date: rawFormData.get('birth_date')?.toString() || '',
    gender: rawFormData.get('gender')?.toString() || '',
    phone: rawFormData.get('phone')?.toString() || '',
    city: rawFormData.get('city')?.toString() || '',
    employment_status: rawFormData.get('employment_status')?.toString() || '',
    school_department: rawFormData.get('school_department')?.toString() || '',
    food_allergies: rawFormData.get('food_allergies')?.toString() || '',
    medical_conditions: rawFormData.get('medical_conditions')?.toString() || '',
  };

  try {
    const validated = volunteerSchema.parse(parsedData);
    const supabase = await createClient();

    const { error: dbError } = await supabase
      .from('volunteers')
      .insert([validated]);

    if (dbError) {
      console.error('Database insert error in volunteers:', dbError);
      throw new Error('Database insert failed');
    }

    const newValues = validated as Record<string, unknown>;

    await writeAuditLog({
      action: AuditAction.SUBMIT_VOLUNTEER_FORM,
      status: 'SUCCESS',
      startTime,
      details: { title: `${validated.first_name} ${validated.last_name}` },
      oldValues: null,
      newValues
    });

    revalidatePath('/admin');
    revalidatePath('/admin/volunteers');

    return { success: true, message: 'Başvurunuz başarıyla alınmıştır.' };
  } catch (error: unknown) {
    console.error('submitVolunteerForm error:', error);

    await writeAuditLog({
      action: AuditAction.SUBMIT_VOLUNTEER_FORM,
      status: 'FAILED',
      startTime,
      details: {},
      oldValues: null,
      newValues: null,
      error
    });

    // Mask original database/technical errors from user
    return { success: false, error: 'Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.' };
  }
}

export async function getVolunteers() {
  try {
    await checkVolunteerAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getVolunteers error:', error);
    logDebug('getVolunteers error', error);
    return [];
  }
}

export async function deleteVolunteer(id: string) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    await checkVolunteerAccess();
    const supabase = await createClient();

    // Fetch the volunteer row to back it up
    const { data: item, error: fetchError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) throw new Error(fetchError?.message || 'Kayıt bulunamadı');
    oldValues = item as Record<string, unknown>;

    const trashResult = await moveToTrash('volunteers', id, item, []);
    if (!trashResult.success) throw new Error(trashResult.error);

    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    await writeAuditLog({
      action: AuditAction.DELETE_VOLUNTEER,
      status: 'SUCCESS',
      startTime,
      details: { title: `${oldValues.first_name || ''} ${oldValues.last_name || ''}` },
      oldValues,
      newValues: null
    });

    revalidatePath('/admin/volunteers');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteVolunteer error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_VOLUNTEER,
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
