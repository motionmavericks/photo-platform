import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  'https://rthnpitxydzbjssrqbpz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aG5waXR4eWR6Ympzc3JxYnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDk1MjMsImV4cCI6MjA1NTU4NTUyM30.JeNRfrB8E58KxqAbSZF77XxeZ4vKYSjdt_Mouno13MY'
);

interface ImportResult {
  id: string;
  success: boolean;
  error?: string;
}

export async function GET() {
  try {
    // Get all photo directories
    const photosDir = path.join(process.cwd(), 'photos');
    const photoDirs = fs.readdirSync(photosDir);
    const results: ImportResult[] = [];

    for (const photoId of photoDirs) {
      try {
        const photoDir = path.join(photosDir, photoId);
        const files = fs.readdirSync(photoDir);
        const jsonFile = files.find(f => f.endsWith('.json'));
        const jpgFile = files.find(f => f.endsWith('.jpg'));
        
        if (!jsonFile || !jpgFile) continue;

        const jsonPath = path.join(photoDir, jsonFile);
        const photoPath = path.join(photoDir, jpgFile);

        // Read metadata
        const metadata = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        
        // Check if photo exists in database
        const { data: existingPhoto } = await supabase
          .from('photos')
          .select()
          .eq('id', metadata.id)
          .single();

        if (existingPhoto) {
          results.push({ id: photoId, success: true, error: 'Photo already exists' });
          continue;
        }

        // Upload photo to storage
        const photoFile = fs.readFileSync(photoPath);
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(metadata.original_filename, photoFile, {
            contentType: metadata.mime_type,
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Create photo record
        const { data: photo, error: photoError } = await supabase
          .from('photos')
          .insert({
            id: metadata.id,
            title: metadata.title,
            description: metadata.description,
            storage_path: metadata.original_filename,
            original_filename: metadata.original_filename,
            mime_type: metadata.mime_type,
            size_bytes: metadata.size_bytes,
            width: metadata.width,
            height: metadata.height,
            status: metadata.status
          })
          .select()
          .single();

        if (photoError) throw photoError;

        // Process face detections
        for (const detection of metadata.face_detections) {
          // Get existing tag first
          const tagName = `person:${detection.person}`;
          let { data: tag } = await supabase
            .from('tags')
            .select()
            .eq('name', tagName)
            .single();

          // Create tag if it doesn't exist
          if (!tag) {
            const { data: newTag, error: tagError } = await supabase
              .from('tags')
              .insert({ name: tagName })
              .select()
              .single();

            if (tagError) throw tagError;
            tag = newTag;
          }

          // Create face detection record
          const { error: detectionError } = await supabase
            .from('face_detections')
            .insert({
              photo_id: photo.id,
              tag_id: tag.id,
              confidence_score: detection.confidence_score,
              bounding_box: {
                x: detection.bounding_box.x / 100, // Convert percentage to decimal
                y: detection.bounding_box.y / 100,
                width: detection.bounding_box.width / 100,
                height: detection.bounding_box.height / 100
              }
            });

          if (detectionError) throw detectionError;

          // Link tag to photo
          const { error: linkError } = await supabase
            .from('photos_tags')
            .insert({
              photo_id: photo.id,
              tag_id: tag.id
            });

          if (linkError) throw linkError;
        }

        // Mark photo as active
        const { error: updateError } = await supabase
          .from('photos')
          .update({ status: 'active' })
          .eq('id', photo.id);

        if (updateError) throw updateError;

        results.push({ id: photoId, success: true });

      } catch (error) {
        console.error(`Error processing photo ${photoId}:`, error);
        results.push({ id: photoId, success: false, error: String(error) });
      }
    }

    return NextResponse.json({ 
      success: true,
      processed: photoDirs.length,
      results 
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
