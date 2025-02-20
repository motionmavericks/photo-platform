import createClient from '@/lib/supabase/client';

const supabase = createClient();

export async function updateAlbumPolicies() {
  try {
    // Drop existing policies
    await supabase.rpc('drop_policy', { 
      table_name: 'albums',
      policy_name: 'Admins can do everything with albums'
    });

    // Create new policies
    const queries = [
      `CREATE POLICY "Anyone can manage albums" ON public.albums
       FOR ALL USING (true)
       WITH CHECK (true)`,
      
      `DROP POLICY IF EXISTS "Admins can manage album-tag relationships" ON public.albums_tags`,
      
      `CREATE POLICY "Anyone can manage album-tag relationships" ON public.albums_tags
       FOR ALL USING (true)
       WITH CHECK (true)`,
      
      `DROP POLICY IF EXISTS "Admins can manage photo-album relationships" ON public.photos_albums`,
      
      `CREATE POLICY "Anyone can manage photo-album relationships" ON public.photos_albums
       FOR ALL USING (true)
       WITH CHECK (true)`
    ];

    for (const query of queries) {
      const { error } = await supabase.rpc('run_sql', { query });
      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update policies:', error);
    return { error };
  }
}
