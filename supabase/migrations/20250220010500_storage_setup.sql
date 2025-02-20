-- Create photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', false);

-- Allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND owner = auth.uid()
);

-- Allow authenticated users to update their own photos
CREATE POLICY "Allow authenticated users to update their own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos'
  AND owner = auth.uid()
);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Allow authenticated users to delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos'
  AND owner = auth.uid()
);

-- Allow public to read photos from public albums
CREATE POLICY "Allow public to read photos from public albums"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'photos'
  AND EXISTS (
    SELECT 1
    FROM public.photos p
    JOIN public.photos_albums pa ON pa.photo_id = p.id
    JOIN public.albums a ON a.id = pa.album_id
    WHERE p.storage_path = storage.objects.name
    AND a.is_public = true
  )
);

-- Allow authenticated users to read all photos
CREATE POLICY "Allow authenticated users to read all photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'photos'
);
