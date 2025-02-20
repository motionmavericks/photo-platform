-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO anon;

-- Enable RLS on buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policy for listing buckets
CREATE POLICY "Allow public to list buckets"
ON storage.buckets FOR SELECT TO public
USING (true);

-- Recreate bucket
DELETE FROM storage.buckets WHERE id = 'photos';
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Grant additional permissions
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.objects TO anon;
