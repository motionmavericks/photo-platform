import createClient from '@/lib/supabase/client';
import { Database } from '@/types/database';

type FaceDetection = Database['public']['Tables']['face_detections']['Row'];
type FaceDetectionInsert = Database['public']['Tables']['face_detections']['Insert'];

const supabase = createClient();

interface BoundingBox {
  x: number;      // X coordinate (percentage of image width)
  y: number;      // Y coordinate (percentage of image height)
  width: number;  // Width (percentage of image width)
  height: number; // Height (percentage of image height)
}

export async function addFaceDetection(
  photoId: string,
  personName: string,
  confidenceScore: number,
  boundingBox: BoundingBox
) {
  try {
    // First ensure the person tag exists
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .upsert({ name: `person:${personName}` })
      .select()
      .single();

    if (tagError) throw tagError;

    // Link tag to photo
    const { error: tagLinkError } = await supabase
      .from('photos_tags')
      .insert({
        photo_id: photoId,
        tag_id: tag.id
      });

    if (tagLinkError) throw tagLinkError;

    // Create face detection record
    const { data: detection, error: detectionError } = await supabase
      .from('face_detections')
      .insert({
        photo_id: photoId,
        tag_id: tag.id,
        confidence_score: confidenceScore,
        bounding_box: boundingBox
      })
      .select()
      .single();

    if (detectionError) throw detectionError;

    return { detection };
  } catch (error) {
    return { error };
  }
}

export async function getFaceDetections(photoId: string) {
  try {
    const { data: detections, error } = await supabase
      .from('face_detections')
      .select(`
        *,
        tags (
          name
        )
      `)
      .eq('photo_id', photoId);

    if (error) throw error;

    return { detections };
  } catch (error) {
    return { error };
  }
}

export async function updateFaceDetection(
  id: string,
  data: Partial<Omit<FaceDetectionInsert, 'photo_id' | 'tag_id'>>
) {
  try {
    const { data: detection, error } = await supabase
      .from('face_detections')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { detection };
  } catch (error) {
    return { error };
  }
}

export async function deleteFaceDetection(id: string) {
  try {
    const { error } = await supabase
      .from('face_detections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return { error };
  }
}
