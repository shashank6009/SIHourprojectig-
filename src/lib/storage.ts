import { supabaseServer } from './supabase-server';

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'resumes';

export async function uploadResumePdf(
  buffer: Uint8Array,
  path: string
): Promise<{ signedUrl: string }> {
  try {
    // Upload the PDF buffer to Supabase Storage
    const { data, error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: 'application/pdf',
        upsert: true, // Allow overwriting
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Generate signed URL (7 days expiry)
    const { data: signedUrlData, error: signedUrlError } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .createSignedUrl(data.path, 7 * 24 * 60 * 60); // 7 days in seconds

    if (signedUrlError) {
      throw new Error(`Signed URL generation failed: ${signedUrlError.message}`);
    }

    return { signedUrl: signedUrlData.signedUrl };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
}

export async function getSignedUrl(path: string, expiresIn: number = 7 * 24 * 60 * 60): Promise<string> {
  try {
    const { data, error } = await supabaseServer.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw new Error(`Signed URL generation failed: ${error.message}`);
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL generation error:', error);
    throw error;
  }
}
