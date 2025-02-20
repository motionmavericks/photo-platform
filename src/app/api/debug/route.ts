import createClient from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // Get photos with tags
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select(`
      *,
      photos_tags (
        tags (
          name
        )
      ),
      face_detections (
        *
      )
    `);

  // Get storage info
  const { data: storageData } = await supabase
    .storage
    .from('photos')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  // Get storage URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('photos')
    .getPublicUrl('');

  // Get face detections
  const { data: faceDetections, error: faceError } = await supabase
    .from('face_detections')
    .select('*');

  return NextResponse.json({
    photos,
    photosError,
    faceDetections,
    faceError,
    storage: storageData
  });
}
