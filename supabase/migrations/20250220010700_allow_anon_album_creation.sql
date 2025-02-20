-- Drop the existing policy
DROP POLICY IF EXISTS "Admins can do everything with albums" ON public.albums;

-- Create a new policy that allows anonymous users to create and manage albums
CREATE POLICY "Anyone can manage albums" ON public.albums
    FOR ALL USING (true)
    WITH CHECK (true);

-- Update the RLS policies for related junction tables
DROP POLICY IF EXISTS "Admins can manage album-tag relationships" ON public.albums_tags;
CREATE POLICY "Anyone can manage album-tag relationships" ON public.albums_tags
    FOR ALL USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage photo-album relationships" ON public.photos_albums;
CREATE POLICY "Anyone can manage photo-album relationships" ON public.photos_albums
    FOR ALL USING (true)
    WITH CHECK (true);
