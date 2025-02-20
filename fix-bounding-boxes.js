import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBoundingBoxes() {
  console.log('Getting current face detections...');
  const { data: detections, error: getError } = await supabase
    .from('face_detections')
    .select('*');

  if (getError) {
    console.error('Error getting face detections:', getError);
    return;
  }

  console.log('Current face detections:', detections);

  // Fix bounding boxes for all detections except DSC01574
  for (const detection of detections) {
    if (detection.photo_id) {
      const { data: photo } = await supabase
        .from('photos')
        .select('title')
        .eq('id', detection.photo_id)
        .single();

      if (photo?.title?.startsWith('Test Photo')) {
        const box = detection.bounding_box;
        const updatedBox = {
          x: box.x / 100,
          y: box.y / 100,
          width: box.width / 100,
          height: box.height / 100
        };

        console.log(`Updating detection ${detection.id}:`, {
          old: box,
          new: updatedBox
        });

        const { error: updateError } = await supabase
          .from('face_detections')
          .update({ bounding_box: updatedBox })
          .eq('id', detection.id);

        if (updateError) {
          console.error(`Error updating detection ${detection.id}:`, updateError);
        }
      }
    }
  }

  console.log('Finished updating bounding boxes');

  // Verify the changes
  const { data: updatedDetections, error: verifyError } = await supabase
    .from('face_detections')
    .select('*, photos(title)');

  if (verifyError) {
    console.error('Error verifying updates:', verifyError);
    return;
  }

