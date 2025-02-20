import { getAlbums } from "@/lib/api/albums"
import { getPhotos } from "@/lib/api/photos"
import { DashboardClient } from "./page.client"

export default async function DashboardPage() {
  try {
    const { albums = [], error: albumsError } = await getAlbums({ includePrivate: false })
    if (albumsError) throw albumsError;

    const { photos = [], error: photosError } = await getPhotos()
    if (photosError) throw photosError;

    console.log('Photos loaded:', photos.length);

    // Get unique tags from photos_tags
    const tags = [...new Set(photos.flatMap(photo => 
      (photo.photos_tags || [])
        .filter(pt => pt.tags?.name)
        .map(pt => pt.tags!.name)
    ))]

    return <DashboardClient albums={albums} photos={photos} tags={tags} />
  } catch (error) {
    console.error('Dashboard error:', error);
    return <div>Error loading dashboard: {String(error)}</div>
  }
}
