'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { moveToTrash } from './trash-bin';
import { getServerUserAndRole } from '@/src/utils/supabase/role-server';
import { writeAuditLog, AuditAction } from '@/src/utils/supabase/log-helper';

// Zod schemas for validation
const positionSchema = z.object({
  title_tr: z.string().min(2, 'Başlık (TR) en az 2 karakter olmalıdır').max(255).trim(),
  title_en: z.string().min(2, 'Başlık (EN) en az 2 karakter olmalıdır').max(255).trim(),
  department_tr: z.string().min(2, 'Departman (TR) en az 2 karakter olmalıdır').max(255).trim(),
  department_en: z.string().min(2, 'Departman (EN) en az 2 karakter olmalıdır').max(255).trim(),
  location_tr: z.string().min(2, 'Lokasyon (TR) en az 2 karakter olmalıdır').max(255).trim(),
  location_en: z.string().min(2, 'Lokasyon (EN) en az 2 karakter olmalıdır').max(255).trim(),
  type_tr: z.string().min(2, 'Çalışma Türü (TR) en az 2 karakter olmalıdır').max(100).trim(),
  type_en: z.string().min(2, 'Çalışma Türü (EN) en az 2 karakter olmalıdır').max(100).trim(),
  description_tr: z.string().min(10, 'Açıklama (TR) en az 10 karakter olmalıdır').trim(),
  description_en: z.string().min(10, 'Açıklama (EN) en az 10 karakter olmalıdır').trim(),
  requirements_tr: z.string().min(10, 'Gereksinimler (TR) en az 10 karakter olmalıdır').trim(),
  requirements_en: z.string().min(10, 'Gereksinimler (EN) en az 10 karakter olmalıdır').trim(),
  order_index: z.number().int().default(0),
});

const applicationSchema = z.object({
  position_id: z.string().uuid('Geçersiz pozisyon seçimi'),
  first_name: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(150, 'Ad en fazla 150 karakter olabilir').trim(),
  last_name: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').max(150, 'Soyad en fazla 150 karakter olabilir').trim(),
  email: z.string().email('Geçersiz e-posta adresi').max(255).trim(),
  phone: z.string().min(7, 'Telefon numarası en az 7 karakter olmalıdır').max(30).trim(),
  cover_letter: z.string().max(2000, 'Niyet mektubu en fazla 2000 karakter olabilir').optional().default('').transform((val: string) => val.trim()),
  kvkk_approved: z.boolean().refine((val: boolean) => val === true, 'KVKK onayı zorunludur'),
});

// Auth helpers
async function checkPositionAccess(): Promise<void> {
  const { user, role } = await getServerUserAndRole();
  if (!user || (role !== 'super_admin' && role !== 'admin' && role !== 'operations_manager')) {
    throw new Error('Yetkisiz erişim');
  }
}

async function checkApplicationAccess(): Promise<void> {
  const { user, role } = await getServerUserAndRole();
  if (!user || (role !== 'super_admin' && role !== 'operations_manager')) {
    throw new Error('Yetkisiz erişim');
  }
}

// ----------------------------------------------------
// JOB POSITIONS (AÇIK POZİSYONLAR) ACTIONS
// ----------------------------------------------------

export async function getJobPositions(onlyActive = false) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('job_positions')
      .select('*')
      .order('order_index', { ascending: true });

    if (onlyActive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getJobPositions error:', error);
    return [];
  }
}

export async function getJobPositionById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data || null;
  } catch (error: unknown) {
    console.error('getJobPositionById error:', error);
    return null;
  }
}

export async function createJobPosition(formData: z.infer<typeof positionSchema>) {
  const startTime = performance.now();
  try {
    await checkPositionAccess();
    const supabase = await createClient();

    const validated = positionSchema.parse(formData);

    const { data, error } = await supabase
      .from('job_positions')
      .insert([validated])
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.CREATE_JOB_POSITION,
      status: 'SUCCESS',
      startTime,
      details: { title: validated.title_tr },
      oldValues: null,
      newValues
    });

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');
    revalidatePath('/[locale]/kariyer/[id]', 'page');

    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('createJobPosition error:', error);

    await writeAuditLog({
      action: AuditAction.CREATE_JOB_POSITION,
      status: 'FAILED',
      startTime,
      details: { title: formData?.title_tr },
      oldValues: null,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function updateJobPosition(id: string, formData: z.infer<typeof positionSchema>) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    await checkPositionAccess();
    const supabase = await createClient();

    const validated = positionSchema.parse(formData);

    // Fetch old values
    const { data: oldData } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

    const { data, error } = await supabase
      .from('job_positions')
      .update(validated)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.UPDATE_JOB_POSITION,
      status: 'SUCCESS',
      startTime,
      details: { title: validated.title_tr },
      oldValues,
      newValues
    });

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');
    revalidatePath('/[locale]/kariyer/[id]', 'page');

    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('updateJobPosition error:', error);

    await writeAuditLog({
      action: AuditAction.UPDATE_JOB_POSITION,
      status: 'FAILED',
      startTime,
      details: { title: formData?.title_tr },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function deleteJobPosition(id: string) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    await checkPositionAccess();
    const supabase = await createClient();

    // Fetch original position data
    const { data: positionItem, error: fetchError } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !positionItem) throw new Error(fetchError?.message || 'Pozisyon bulunamadı');
    oldValues = positionItem as Record<string, unknown>;

    // Move to trash
    const trashResult = await moveToTrash('job_positions', id, positionItem, []);
    if (!trashResult.success) throw new Error(trashResult.error);

    const { error } = await supabase
      .from('job_positions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    await writeAuditLog({
      action: AuditAction.DELETE_JOB_POSITION,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues.title_tr || '') },
      oldValues,
      newValues: null
    });

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');
    revalidatePath('/[locale]/kariyer/[id]', 'page');

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteJobPosition error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_JOB_POSITION,
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

// ----------------------------------------------------
// JOB APPLICATIONS (BAŞVURULAR) ACTIONS
// ----------------------------------------------------

export async function submitJobApplication(rawFormData: FormData) {
  const startTime = performance.now();
  try {
    // 1. Honeypot check
    const hpField = rawFormData.get('hp_field');
    if (hpField && hpField.toString().trim() !== '') {
      console.warn('Honeypot field triggered. Silently ignoring submit.');
      return { success: true, message: 'Başvurunuz başarıyla alındı.' };
    }

    // 2. Parse text fields
    const parsedData = {
      position_id: rawFormData.get('position_id')?.toString() || '',
      first_name: rawFormData.get('first_name')?.toString() || '',
      last_name: rawFormData.get('last_name')?.toString() || '',
      email: rawFormData.get('email')?.toString() || '',
      phone: rawFormData.get('phone')?.toString() || '',
      cover_letter: rawFormData.get('cover_letter')?.toString() || '',
      kvkk_approved: rawFormData.get('kvkk_approved') === 'true',
    };

    const validated = applicationSchema.parse(parsedData);

    const supabase = await createClient();

    // Fetch position details to store titles in application
    const { data: positionData, error: positionError } = await supabase
      .from('job_positions')
      .select('title_tr, title_en')
      .eq('id', validated.position_id)
      .single();

    if (positionError || !positionData) {
      throw new Error('Başvurulan pozisyon bulunamadı.');
    }

    // 3. File validation
    const file = rawFormData.get('cv') as File | null;
    if (!file) {
      return { success: false, error: 'CV dosyası zorunludur' };
    }

    // Validate using Zod (specifically checking type and size)
    const fileValidation = z.object({
      type: z.string().refine((val: string) => val === 'application/pdf', {
        message: 'Sadece PDF formatında CV yükleyebilirsiniz.'
      }),
      size: z.number().max(600 * 1024, 'Maksimum dosya boyutu 600KB ile sınırlandırılmıştır.')
    }).safeParse({
      type: file.type,
      size: file.size
    });

    if (!fileValidation.success) {
      return { success: false, error: fileValidation.error.issues[0]?.message };
    }

    // 4. Create unique filename path: 'pozisyon_id/uuid-orijinal_isim.pdf'
    const originalNameSanitized = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueFilename = `${crypto.randomUUID()}-${originalNameSanitized}`;
    const cvPath = `${validated.position_id}/${uniqueFilename}`;

    // 5. Upload file to private Supabase Storage bucket 'cv_uploads'
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('cv_uploads')
      .upload(cvPath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Dosya yüklenirken hata oluştu: ${uploadError.message}`);
    }

    // 6. Save to job_applications table
    const { data: insertedData, error: dbError } = await supabase
      .from('job_applications')
      .insert([
        {
          position_id: validated.position_id,
          original_position_id: validated.position_id,
          first_name: validated.first_name,
          last_name: validated.last_name,
          email: validated.email,
          phone: validated.phone,
          cover_letter: validated.cover_letter,
          cv_path: cvPath,
          position_title_tr: positionData.title_tr,
          position_title_en: positionData.title_en,
        }
      ])
      .select();

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      await supabase.storage.from('cv_uploads').remove([cvPath]);
      console.error('Database insert error:', dbError);
      throw new Error(`Başvuru kaydedilemedi: ${dbError.message}`);
    }

    const newValues = insertedData && insertedData[0] ? (insertedData[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.SUBMIT_JOB_APPLICATION,
      status: 'SUCCESS',
      startTime,
      details: { title: `${validated.first_name} ${validated.last_name}` },
      oldValues: null,
      newValues
    });

    return { success: true, message: 'Başvurunuz başarıyla alındı.' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('submitJobApplication error:', error);

    await writeAuditLog({
      action: AuditAction.SUBMIT_JOB_APPLICATION,
      status: 'FAILED',
      startTime,
      details: {},
      oldValues: null,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function getJobApplications() {
  try {
    await checkApplicationAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job_positions(title_tr, title_en, is_active)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: unknown) {
    console.error('getJobApplications error:', error);
    return [];
  }
}

export async function deleteJobApplication(id: string) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    await checkApplicationAccess();
    const supabase = await createClient();

    // Fetch the application to get original data and file path
    const { data: applicationItem, error: fetchError } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !applicationItem) throw new Error(fetchError?.message || 'Başvuru bulunamadı');
    oldValues = applicationItem as Record<string, unknown>;

    // Collect CV file path
    const filePaths: string[] = [];
    if (applicationItem.cv_path) {
      filePaths.push(applicationItem.cv_path);
    }

    // Move to trash
    const trashResult = await moveToTrash('job_applications', id, applicationItem, filePaths);
    if (!trashResult.success) throw new Error(trashResult.error);

    // Delete from DB
    const { error: deleteError } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (deleteError) throw new Error(deleteError.message);

    await writeAuditLog({
      action: AuditAction.DELETE_JOB_APPLICATION,
      status: 'SUCCESS',
      startTime,
      details: { title: `${oldValues.first_name} ${oldValues.last_name}` },
      oldValues,
      newValues: null
    });

    revalidatePath('/admin/careers');
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('deleteJobApplication error:', error);

    await writeAuditLog({
      action: AuditAction.DELETE_JOB_APPLICATION,
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

export async function toggleJobPositionStatus(id: string, isActive: boolean) {
  const startTime = performance.now();
  let oldValues: Record<string, unknown> | null = null;
  try {
    await checkPositionAccess();
    const supabase = await createClient();

    // Fetch old values
    const { data: oldData } = await supabase
      .from('job_positions')
      .select('*')
      .eq('id', id)
      .single();
    if (oldData) {
      oldValues = oldData as Record<string, unknown>;
    }

    const { data, error } = await supabase
      .from('job_positions')
      .update({ is_active: isActive })
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    const newValues = data && data[0] ? (data[0] as Record<string, unknown>) : null;

    await writeAuditLog({
      action: AuditAction.TOGGLE_JOB_POSITION_STATUS,
      status: 'SUCCESS',
      startTime,
      details: { title: String(oldValues?.title_tr || ''), isActive },
      oldValues,
      newValues
    });

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');
    revalidatePath('/[locale]/kariyer/[id]', 'page');

    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('toggleJobPositionStatus error:', error);

    await writeAuditLog({
      action: AuditAction.TOGGLE_JOB_POSITION_STATUS,
      status: 'FAILED',
      startTime,
      details: { isActive },
      oldValues,
      newValues: null,
      error
    });

    return { success: false, error: errorMessage };
  }
}

export async function generateCVDownloadUrl(cvPath: string) {
  try {
    await checkApplicationAccess();
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from('cv_uploads')
      .createSignedUrl(cvPath, 60);

    if (error) throw new Error(error.message);

    return { success: true, url: data.signedUrl };
  } catch (error: unknown) {
    console.error('generateCVDownloadUrl error:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
