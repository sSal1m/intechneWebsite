'use server';

import { createClient } from '@/src/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(255).trim(),
  email: z.string().email('Geçersiz e-posta adresi').max(255).trim(),
  phone: z.string().min(7, 'Telefon numarası en az 7 karakter olmalıdır').max(30).trim(),
  cover_letter: z.string().max(2000, 'Niyet mektubu en fazla 2000 karakter olabilir').optional().default('').transform(val => val.trim()),
  kvkk_approved: z.boolean().refine(val => val === true, 'KVKK onayı zorunludur'),
});

// Auth helper
async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'admin@intechne.com.tr') {
    throw new Error('Yetkisiz erişim');
  }
}

// ----------------------------------------------------
// JOB POSITIONS (AÇIK POZİSYONLAR) ACTIONS
// ----------------------------------------------------

export async function getJobPositions() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('job_positions')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getJobPositions error:', error);
    return [];
  }
}

export async function createJobPosition(formData: z.infer<typeof positionSchema>) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const validated = positionSchema.parse(formData);

    const { data, error } = await supabase
      .from('job_positions')
      .insert([validated])
      .select();

    if (error) throw new Error(error.message);

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');

    return { success: true, data };
  } catch (error: any) {
    console.error('createJobPosition error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateJobPosition(id: string, formData: z.infer<typeof positionSchema>) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const validated = positionSchema.parse(formData);

    const { data, error } = await supabase
      .from('job_positions')
      .update(validated)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');

    return { success: true, data };
  } catch (error: any) {
    console.error('updateJobPosition error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteJobPosition(id: string) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const { error } = await supabase
      .from('job_positions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    // On-Demand Revalidation
    revalidatePath('/');
    revalidatePath('/[locale]/kariyer', 'page');

    return { success: true };
  } catch (error: any) {
    console.error('deleteJobPosition error:', error);
    return { success: false, error: error.message };
  }
}

// ----------------------------------------------------
// JOB APPLICATIONS (BAŞVURULAR) ACTIONS
// ----------------------------------------------------

export async function submitJobApplication(rawFormData: FormData) {
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
      name: rawFormData.get('name')?.toString() || '',
      email: rawFormData.get('email')?.toString() || '',
      phone: rawFormData.get('phone')?.toString() || '',
      cover_letter: rawFormData.get('cover_letter')?.toString() || '',
      kvkk_approved: rawFormData.get('kvkk_approved') === 'true',
    };

    const validated = applicationSchema.parse(parsedData);

    // 3. File validation
    const file = rawFormData.get('cv') as File | null;
    if (!file) {
      return { success: false, error: 'CV dosyası zorunludur' };
    }

    // Validate using Zod (specifically checking type and size)
    const fileValidation = z.object({
      type: z.string().refine(val => val === 'application/pdf', {
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
    const extension = 'pdf'; // Guaranteed by mime-type validation
    const originalNameSanitized = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueFilename = `${crypto.randomUUID()}-${originalNameSanitized}`;
    const cvPath = `${validated.position_id}/${uniqueFilename}`;

    // 5. Upload file to private Supabase Storage bucket 'cv_uploads'
    const supabase = await createClient();
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('cv_uploads')
      .upload(cvPath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Dosya yüklenirken hata oluştu: ${uploadError.message}`);
    }

    // 6. Save to job_applications table
    const { error: dbError } = await supabase
      .from('job_applications')
      .insert([
        {
          position_id: validated.position_id,
          name: validated.name,
          email: validated.email,
          phone: validated.phone,
          cover_letter: validated.cover_letter,
          cv_path: cvPath,
        }
      ]);

    if (dbError) {
      // Clean up uploaded file if DB insert fails
      await supabase.storage.from('cv_uploads').remove([cvPath]);
      console.error('Database insert error:', dbError);
      throw new Error(`Başvuru kaydedilemedi: ${dbError.message}`);
    }

    return { success: true, message: 'Başvurunuz başarıyla alındı.' };
  } catch (error: any) {
    console.error('submitJobApplication error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || 'Doğrulama hatası' };
    }
    return { success: false, error: error.message };
  }
}

export async function getJobApplications() {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job_positions(title_tr, title_en)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  } catch (error: any) {
    console.error('getJobApplications error:', error);
    return [];
  }
}

export async function generateCVDownloadUrl(cvPath: string) {
  try {
    const supabase = await createClient();
    await checkAdmin(supabase);

    const { data, error } = await supabase.storage
      .from('cv_uploads')
      .createSignedUrl(cvPath, 60);

    if (error) throw new Error(error.message);

    return { success: true, url: data.signedUrl };
  } catch (error: any) {
    console.error('generateCVDownloadUrl error:', error);
    return { success: false, error: error.message };
  }
}
