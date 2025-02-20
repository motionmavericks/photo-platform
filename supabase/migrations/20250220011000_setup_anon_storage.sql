-- Create photos bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop any existing storage policies
DROP POLICY IF EXISTS "Allow authenticated users to upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read photos from public albums" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read all photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public full access to photos bucket" ON storage.objects;

-- Create simple storage policy for anonymous access
CREATE POLICY "Allow anonymous storage access"
ON storage.objects FOR ALL TO public
USING (bucket_id = 'photos')
WITH CHECK (bucket_id = 'photos');

-- Grant storage permissions
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO anon;
