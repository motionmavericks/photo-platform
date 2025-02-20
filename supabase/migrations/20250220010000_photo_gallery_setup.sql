-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Create enum for photo status
CREATE TYPE public.photo_status AS ENUM ('processing', 'active', 'archived');

-- Create photos table
CREATE TABLE public.photos (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    storage_path text NOT NULL,
    original_filename text NOT NULL,
    mime_type text NOT NULL,
    size_bytes bigint NOT NULL,
    width integer,
    height integer,
    status photo_status DEFAULT 'processing' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create albums table
CREATE TABLE public.albums (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    cover_photo_id uuid REFERENCES public.photos(id),
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create tags table
CREATE TABLE public.tags (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create junction table for photos and albums
CREATE TABLE public.photos_albums (
    photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
    album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
    position integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (photo_id, album_id)
);

-- Create junction table for photos and tags
CREATE TABLE public.photos_tags (
    photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (photo_id, tag_id)
);

-- Create junction table for albums and tags
CREATE TABLE public.albums_tags (
    album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (album_id, tag_id)
);

-- Create download tracking table
CREATE TABLE public.downloads (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    photo_id uuid REFERENCES public.photos(id) ON DELETE SET NULL,
    ip_address inet NOT NULL,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_photos_updated_at
    BEFORE UPDATE ON public.photos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_albums_updated_at
    BEFORE UPDATE ON public.albums
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX idx_photos_status ON public.photos(status);
CREATE INDEX idx_albums_is_public ON public.albums(is_public);
CREATE INDEX idx_photos_albums_album_id ON public.photos_albums(album_id);
CREATE INDEX idx_photos_albums_position ON public.photos_albums(position);
CREATE INDEX idx_photos_tags_tag_id ON public.photos_tags(tag_id);
CREATE INDEX idx_albums_tags_tag_id ON public.albums_tags(tag_id);
CREATE INDEX idx_downloads_photo_id ON public.downloads(photo_id);
CREATE INDEX idx_downloads_created_at ON public.downloads(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for photos
CREATE POLICY "Public photos are viewable by everyone" ON public.photos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.photos_albums pa
            JOIN public.albums a ON a.id = pa.album_id
            WHERE pa.photo_id = photos.id AND a.is_public = true
        )
    );

CREATE POLICY "Admins can do everything with photos" ON public.photos
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- Create policies for albums
CREATE POLICY "Public albums are viewable by everyone" ON public.albums
    FOR SELECT USING (
        is_public = true
    );

CREATE POLICY "Admins can do everything with albums" ON public.albums
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- Create policies for tags
CREATE POLICY "Tags are viewable by everyone" ON public.tags
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage tags" ON public.tags
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- Create policies for junction tables
CREATE POLICY "Junction tables are viewable by everyone" ON public.photos_albums
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage photo-album relationships" ON public.photos_albums
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Junction tables are viewable by everyone" ON public.photos_tags
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage photo-tag relationships" ON public.photos_tags
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

CREATE POLICY "Junction tables are viewable by everyone" ON public.albums_tags
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage album-tag relationships" ON public.albums_tags
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- Create policy for downloads
CREATE POLICY "Downloads are tracked for everyone" ON public.downloads
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view download stats" ON public.downloads
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Anonymous user permissions (public access)
GRANT SELECT ON public.photos TO anon;
GRANT SELECT ON public.albums TO anon;
GRANT SELECT ON public.tags TO anon;
GRANT SELECT ON public.photos_albums TO anon;
GRANT SELECT ON public.photos_tags TO anon;
GRANT SELECT ON public.albums_tags TO anon;
GRANT INSERT ON public.downloads TO anon;

-- Authenticated user (admin) permissions
GRANT ALL ON public.photos TO authenticated;
GRANT ALL ON public.albums TO authenticated;
GRANT ALL ON public.tags TO authenticated;
GRANT ALL ON public.photos_albums TO authenticated;
GRANT ALL ON public.photos_tags TO authenticated;
GRANT ALL ON public.albums_tags TO authenticated;
GRANT ALL ON public.downloads TO authenticated;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
