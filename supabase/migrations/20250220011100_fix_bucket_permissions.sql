-- Grant permissions to list buckets
GRANT SELECT ON storage.buckets TO anon;

-- Grant permissions to list objects
GRANT SELECT ON storage.objects TO anon;

-- Ensure bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO UPDATE 
SET public = true,
    updated_at = now();
