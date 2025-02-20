const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpData() {
  console.log('Dumping photos...');
  const { data: photos, error: photosError } = await supabase
    .from('photos')
    .select('*');
  if (photosError) console.error('Photos error:', photosError);
  else console.log('Photos:', JSON.stringify(photos, null, 2));

  console.log('\nDumping face detections...');
  const { data: faceDetections, error: fdError } = await supabase
    .from('face_detections')
    .select('*');
  if (fdError) console.error('Face detections error:', fdError);
  else console.log('Face detections:', JSON.stringify(faceDetections, null, 2));

  console.log('\nDumping tags...');
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*');
  if (tagsError) console.error('Tags error:', tagsError);
  else console.log('Tags:', JSON.stringify(tags, null, 2));

  console.log('\nDumping photo tags...');
  const { data: photoTags, error: ptError } = await supabase
    .from('photos_tags')
    .select('*');
  if (ptError) console.error('Photo tags error:', ptError);
  else console.log('Photo tags:', JSON.stringify(photoTags, null, 2));

  console.log('\nDumping photos with face detections and tags...');
  const { data: fullData, error: fullError } = await supabase
    .from('photos')
    .select(`
      *,
      face_detections (*),
      photos_tags (
        tags (*)
      )
    `);
  if (fullError) console.error('Full data error:', fullError);
  else console.log('Full data:', JSON.stringify(fullData, null, 2));
}

dumpData().catch(console.error);
