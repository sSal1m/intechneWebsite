import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const extension = file.name.split('.').pop() || '';
    const uniqueName = `${crypto.randomUUID()}.${extension}`;
    
    // Validate folder
    const permittedFolders = ['sliders', 'news', 'team', 'identity', 'uploads'];
    const targetFolder = permittedFolders.includes(folder) ? folder : 'uploads';
    const filePath = `${targetFolder}/${uniqueName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('intechne-assets')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('intechne-assets')
      .getPublicUrl(filePath);

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
