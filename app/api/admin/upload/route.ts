import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAdminSession } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/db';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = String(formData.get('category') || 'general').replace(/[^a-z0-9_-]/gi, '');

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: JPG, PNG, WEBP, SVG, PDF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File size exceeds 10 MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeBaseName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    const finalFileName = `${category}_${Date.now()}_${safeBaseName}`;

    // Try Supabase Storage first if configured
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      try {
        const bucketName = 'portfolio-assets';
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(finalFileName, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: pubUrl } = supabase.storage
            .from(bucketName)
            .getPublicUrl(finalFileName);
          if (pubUrl?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: pubUrl.publicUrl,
              storage: 'supabase',
            });
          }
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback to local public/uploads:', e);
      }
    }

    // Save to local public/uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, finalFileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${finalFileName}`,
      fileName: finalFileName,
      storage: 'local',
    });
  } catch (err) {
    console.error('Error in POST /api/admin/upload:', err);
    return NextResponse.json(
      { error: 'File upload failed.' },
      { status: 500 }
    );
  }
}
