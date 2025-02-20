-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO anon;

-- Enable RLS on buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policy for listing buckets
DROP POLICY IF EXISTS "Allow public to list buckets" ON storage.buckets;
CREATE POLICY "Allow public to list buckets"
ON storage.buckets FOR SELECT TO public
USING (true);

-- Update bucket to be public
UPDATE storage.buckets 
SET public = true,
    updated_at = now()
WHERE id = 'photos';

-- Grant additional permissions
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.objects TO anon;

-- Ensure storage policies
DROP POLICY IF EXISTS "Allow anonymous storage access" ON storage.objects;
CREATE POLICY "Allow anonymous storage access"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');
