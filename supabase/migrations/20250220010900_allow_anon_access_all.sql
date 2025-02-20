-- Enable public access for storage
DROP POLICY IF EXISTS "Allow anyone to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to read photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read photos from public albums" ON storage.objects;

-- Make bucket public
UPDATE storage.buckets SET public = TRUE WHERE id = 'photos';

-- Allow full public access to storage
CREATE POLICY "Allow public full access to photos bucket"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

-- Enable RLS but allow all public access for all tables
ALTER TABLE public.photos FORCE ROW LEVEL SECURITY;
ALTER TABLE public.albums FORCE ROW LEVEL SECURITY;
ALTER TABLE public.tags FORCE ROW LEVEL SECURITY;
ALTER TABLE public.photos_tags FORCE ROW LEVEL SECURITY;
ALTER TABLE public.photos_albums FORCE ROW LEVEL SECURITY;
ALTER TABLE public.face_detections FORCE ROW LEVEL SECURITY;
ALTER TABLE public.downloads FORCE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can manage photos" ON public.photos;
DROP POLICY IF EXISTS "Anyone can manage albums" ON public.albums;
DROP POLICY IF EXISTS "Anyone can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Anyone can manage photo-tag relationships" ON public.photos_tags;
DROP POLICY IF EXISTS "Anyone can manage photo-album relationships" ON public.photos_albums;
DROP POLICY IF EXISTS "Anyone can manage face detections" ON public.face_detections;

-- Create simple "allow all" policies for each table
CREATE POLICY "Allow public full access to photos"
ON public.photos FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to albums"
ON public.albums FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to tags"
ON public.tags FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to photos_tags"
ON public.photos_tags FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to photos_albums"
ON public.photos_albums FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to face_detections"
ON public.face_detections FOR ALL TO public
USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full access to downloads"
ON public.downloads FOR ALL TO public
USING (true) WITH CHECK (true);
