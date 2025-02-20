-- Allow anonymous users to upload photos to storage
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
CREATE POLICY "Allow anyone to upload photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'photos');

-- Allow anonymous users to read photos
DROP POLICY IF EXISTS "Allow authenticated users to read all photos" ON storage.objects;
CREATE POLICY "Allow anyone to read photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Allow anonymous users to manage photos table
DROP POLICY IF EXISTS "Admins can manage photos" ON public.photos;
CREATE POLICY "Anyone can manage photos"
ON public.photos
FOR ALL USING (true)
WITH CHECK (true);

-- Allow anonymous users to manage photo tags
DROP POLICY IF EXISTS "Admins can manage photo-tag relationships" ON public.photos_tags;
CREATE POLICY "Anyone can manage photo-tag relationships"
ON public.photos_tags
FOR ALL USING (true)
WITH CHECK (true);

-- Allow anonymous users to manage face detections
DROP POLICY IF EXISTS "Admins can manage face detections" ON public.face_detections;
CREATE POLICY "Anyone can manage face detections"
ON public.face_detections
FOR ALL USING (true)
WITH CHECK (true);

-- Allow anonymous users to manage tags
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
CREATE POLICY "Anyone can manage tags"
ON public.tags
FOR ALL USING (true)
WITH CHECK (true);
