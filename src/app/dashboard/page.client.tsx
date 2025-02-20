"use client"

import { PhotoGrid } from "@/components/ui/photo-grid"
import { AlbumGrid } from "@/components/ui/album-grid"
import { Card } from "@/components/ui/card"

interface Album {
  id: string
  name: string
  description: string | null
  cover_photo?: { id: string; storage_path: string }[]
  photos_albums?: unknown[]
  created_at: string
}

interface PhotoTag {
  tags: {
    name: string
  } | null
}

interface Photo {
  id: string
  storage_path: string
  title: string
  description: string | null
  created_at: string
  photos_tags?: PhotoTag[]
}

interface DashboardClientProps {
  albums: Album[]
  photos: Photo[]
  tags: string[]
}

export function DashboardClient({ albums, photos, tags }: DashboardClientProps) {
  return (
    <div className="container py-6 space-y-8">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="font-semibold mb-1">Total Photos</h3>
          <p className="text-2xl">{photos.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-1">Albums</h3>
          <p className="text-2xl">{albums.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-1">Tags</h3>
          <p className="text-2xl">{tags.length}</p>
        </Card>
      </div>

      {/* Recent Albums */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Albums</h2>
        <AlbumGrid
          albums={albums.slice(0, 4).map(album => ({
            id: album.id,
            title: album.name,
            description: album.description || undefined,
            coverImage: album.cover_photo?.[0]?.storage_path,
            photoCount: album.photos_albums?.length || 0,
            createdAt: album.created_at,
          }))}
        />
      </div>

      {/* Recent Photos */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Photos</h2>
        <PhotoGrid
          photos={photos.slice(0, 8).map(photo => ({
            id: photo.id,
            src: `https://rthnpitxydzbjssrqbpz.supabase.co/storage/v1/object/public/photos/${photo.storage_path}`,
            alt: photo.description || "Photo",
            title: photo.title,
            tags: (photo.photos_tags?.filter(pt => pt.tags?.name).map(pt => pt.tags!.name) || []) as string[],
            createdAt: photo.created_at,
          }))}
          onTagFilter={(tag) => {
            console.log("Filter by tag:", tag)
          }}
        />
      </div>
    </div>
  )
}
