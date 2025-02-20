import createClient from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Album = Database['public']['Tables']['albums']['Row'];
type AlbumInsert = Database['public']['Tables']['albums']['Insert'];

const supabase = createClient();

export async function getAlbums(options?: { includePrivate?: boolean }) {
  try {
    let query = supabase
      .from('albums')
      .select(`
        *,
        cover_photo:photos!cover_photo_id (
          id,
          title,
          storage_path
        ),
        photos_albums (
          position,
          photos (
            id,
            title,
            storage_path
          )
        ),
        albums_tags (
          tags (
            id,
            name
          )
        )
      `);

    if (!options?.includePrivate) {
      query = query.eq('is_public', true);
    }

    const { data: albums, error } = await query;
    if (error) throw error;

    return { albums };
  } catch (error) {
    return { error };
  }
}

export async function getAlbum(id: string) {
  try {
    const { data: album, error } = await supabase
      .from('albums')
      .select(`
        *,
        cover_photo:photos!cover_photo_id (
          id,
          title,
          storage_path
        ),
        photos_albums (
          position,
          photos (
            id,
            title,
            description,
            storage_path,
            photos_tags (
              tags (
                id,
                name
              )
            )
          )
        ),
        albums_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { album };
  } catch (error) {
    return { error };
  }
}

export async function createAlbum(data: Omit<AlbumInsert, 'created_at' | 'updated_at'>) {
  try {
    const response = await fetch('/api/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create album');
    }

    const album = await response.json();
    return { album };
  } catch (error) {
    return { error };
  }
}

export async function updateAlbum(id: string, data: Partial<AlbumInsert>) {
  try {
    const { data: album, error } = await supabase
      .from('albums')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { album };
  } catch (error) {
    return { error };
  }
}

export async function deleteAlbum(id: string) {
  try {
    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error };
  }
}

export async function addTagToAlbum(albumId: string, tagName: string) {
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
      .from('albums_tags')
      .insert({
        album_id: albumId,
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

export async function removeTagFromAlbum(albumId: string, tagId: string) {
  try {
    const { error } = await supabase
      .from('albums_tags')
      .delete()
      .match({ album_id: albumId, tag_id: tagId });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error };
  }
}

export async function reorderPhotosInAlbum(albumId: string, photoOrders: { photoId: string; position: number }[]) {
  try {
    const { data, error } = await supabase
      .from('photos_albums')
      .upsert(
        photoOrders.map(({ photoId, position }) => ({
          album_id: albumId,
          photo_id: photoId,
          position,
        }))
      )
      .select();

    if (error) throw error;

    return { data };
  } catch (error) {
    return { error };
  }
}
