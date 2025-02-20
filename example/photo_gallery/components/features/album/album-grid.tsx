import Image from "next/image"
import { cn } from "@/lib/utils"

interface Album {
  id: number
  title: string
  coverImage: string
  photoCount: number
  user: string
}

interface AlbumGridProps {
  albums: Album[]
  className?: string
}

export function AlbumGrid({ albums, className }: AlbumGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {albums.map((album) => (
        <div key={album.id} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900">
          <Image
            src={album.coverImage || `https://picsum.photos/seed/${album.id + 400}/800/600`}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-lg font-medium leading-tight">{album.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">
              {album.photoCount} photos • {album.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

