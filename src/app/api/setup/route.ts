import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const supabase = createClient(
  env().SUPABASE_URL,
  env().SUPABASE_BASE_KEY
);

export async function GET() {
  console.log('Setting up database...');
  
  try {
    // Create enum and tables
    const setupResult = await supabase.rpc('exec_sql', {
      sql_string: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

        -- Create enum for photo status
        DO $$ BEGIN
          CREATE TYPE public.photo_status AS ENUM ('processing', 'active', 'archived');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;

        -- Create photos table
        CREATE TABLE IF NOT EXISTS public.photos (
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
        CREATE TABLE IF NOT EXISTS public.albums (
          id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
          name text NOT NULL,
          description text,
          cover_photo_id uuid REFERENCES public.photos(id),
          is_public boolean DEFAULT false NOT NULL,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          updated_at timestamp with time zone DEFAULT now() NOT NULL
        );

        -- Create tags table
        CREATE TABLE IF NOT EXISTS public.tags (
          id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
          name text NOT NULL UNIQUE,
          created_at timestamp with time zone DEFAULT now() NOT NULL
        );

        -- Create junction tables
        CREATE TABLE IF NOT EXISTS public.photos_albums (
          photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
          album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
          position integer NOT NULL,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (photo_id, album_id)
        );

        CREATE TABLE IF NOT EXISTS public.photos_tags (
          photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
          tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (photo_id, tag_id)
        );

        CREATE TABLE IF NOT EXISTS public.albums_tags (
          album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
          tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
          created_at timestamp with time zone DEFAULT now() NOT NULL,
          PRIMARY KEY (album_id, tag_id)
        );

        -- Create downloads table
        CREATE TABLE IF NOT EXISTS public.downloads (
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
        DROP TRIGGER IF EXISTS set_photos_updated_at ON public.photos;
        CREATE TRIGGER set_photos_updated_at
          BEFORE UPDATE ON public.photos
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_updated_at();

        DROP TRIGGER IF EXISTS set_albums_updated_at ON public.albums;
        CREATE TRIGGER set_albums_updated_at
          BEFORE UPDATE ON public.albums
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_updated_at();

        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_photos_status ON public.photos(status);
        CREATE INDEX IF NOT EXISTS idx_albums_is_public ON public.albums(is_public);
        CREATE INDEX IF NOT EXISTS idx_photos_albums_album_id ON public.photos_albums(album_id);
        CREATE INDEX IF NOT EXISTS idx_photos_albums_position ON public.photos_albums(position);
        CREATE INDEX IF NOT EXISTS idx_photos_tags_tag_id ON public.photos_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_albums_tags_tag_id ON public.albums_tags(tag_id);
        CREATE INDEX IF NOT EXISTS idx_downloads_photo_id ON public.downloads(photo_id);
        CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at);

        -- Enable RLS
        ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.photos_albums ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.photos_tags ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.albums_tags ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        DROP POLICY IF EXISTS "Anyone can manage albums" ON public.albums;
        CREATE POLICY "Anyone can manage albums" ON public.albums
          FOR ALL USING (true)
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Anyone can manage album-tag relationships" ON public.albums_tags;
        CREATE POLICY "Anyone can manage album-tag relationships" ON public.albums_tags
          FOR ALL USING (true)
          WITH CHECK (true);

        DROP POLICY IF EXISTS "Anyone can manage photo-album relationships" ON public.photos_albums;
        CREATE POLICY "Anyone can manage photo-album relationships" ON public.photos_albums
          FOR ALL USING (true)
          WITH CHECK (true);

        -- Grant permissions
        GRANT USAGE ON SCHEMA public TO anon, authenticated;
        GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
        GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;
        GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
      `
    });
    
    console.log('Database setup completed');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up database:', error);
    return NextResponse.json(
      { error: "Database setup failed" },
      { status: 500 }
    );
  }
}
