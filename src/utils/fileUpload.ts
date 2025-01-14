import { supabase } from '../lib/supabase';

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}-${safeName}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('logos')
      .upload(`${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
};