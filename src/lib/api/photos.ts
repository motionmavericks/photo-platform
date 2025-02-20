import createClient from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Photo = Database['public']['Tables']['photos']['Row'];
type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
type Album = Database['public']['Tables']['albums']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];

const supabase = createClient();

export async function uploadPhoto(file: File, data: Omit<PhotoInsert, 'storage_path' | 'size_bytes' | 'mime_type'>) {
  try {
    // Upload file to storage
    const filename = `${crypto.randomUUID()}-${file.name}`;
    const storagePath = `photos/${filename}`;
    
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(storagePath, file);

    if (uploadError) throw uploadError;

    // Create photo record
    const { data: photo, error: insertError } = await supabase
      .from('photos')
      .insert({
        ...data,
        storage_path: storagePath,
        size_bytes: file.size,
        mime_type: file.type,
        original_filename: file.name,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return { photo };
  } catch (error) {
    return { error };
  }
}

export async function getPhotos(albumId?: string) {
  try {
    let query = supabase
      .from('photos')
      .select(`
        *,
        photos_albums (
          position,
          album_id
        ),
        photos_tags (
          tag_id,
          tags (
            name
          )
        ),
        face_detections (
          *,
          tags (
            name
          )
        )
      `);

    if (albumId) {
      query = query.eq('photos_albums.album_id', albumId);
    }

    const { data: photos, error } = await query;
    if (error) throw error;

    return { photos };
  } catch (error) {
    return { error };
  }
}

export async function getPhoto(id: string) {
  try {
    const { data: photo, error } = await supabase
      .from('photos')
      .select(`
        *,
        photos_albums (
          position,
          album_id,
          albums (
            name,
            description,
            is_public
          )
        ),
        photos_tags (
          tag_id,
          tags (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { photo };
  } catch (error) {
    return { error };
  }
}

export async function updatePhoto(id: string, data: Partial<PhotoInsert>) {
  try {
    const { data: photo, error } = await supabase
      .from('photos')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { photo };
  } catch (error) {
    return { error };
  }
}

export async function deletePhoto(id: string) {
  try {
    // Get photo to find storage path
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([photo.storage_path]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    return { error };
  }
}

export async function addPhotoToAlbum(photoId: string, albumId: string, position: number) {
  try {
    const { data, error } = await supabase
      .from('photos_albums')
      .insert({
        photo_id: photoId,
        album_id: albumId,
        position,
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error };
  }
}

export async function removePhotoFromAlbum(photoId: string, albumId: string) {
  try {
    const { error } = await supabase
      .from('photos_albums')
      .delete()
      .match({ photo_id: photoId, album_id: albumId });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error };
  }
}

export async function addTagToPhoto(photoId: string, tagName: string) {
  try {
    // First get or create tag
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .upsert({ name: tagName })
      .select()
      .single();

    if (tagError) throw tagError;

    // Then create relationship
    const { data, error } = await supabase
      .from('photos_tags')
      .insert({
        photo_id: photoId,
        tag_id: tag.id,
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error };
  }
}

export async function removeTagFromPhoto(photoId: string, tagId: string) {
  try {
    const { error } = await supabase
      .from('photos_tags')
      .delete()
      .match({ photo_id: photoId, tag_id: tagId });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error };
  }
}

export async function trackDownload(photoId: string) {
  try {
    const { data, error } = await supabase
      .from('downloads')
      .insert({
        photo_id: photoId,
        // IP and user agent will be captured by RLS policies
      })
      .select()
      .single();

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error };
  }
}
