import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "./card"
import { Button } from "./button"
import {
  MoreHorizontalIcon,
  PencilIcon,
  ImageIcon,
  TrashIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface Album {
  id: string
  title: string
  description?: string
  coverImage?: string
  photoCount: number
  createdAt: string
}

interface AlbumGridProps extends React.HTMLAttributes<HTMLDivElement> {
  albums: Album[]
  onAlbumClick?: (album: Album) => void
  onEdit?: (album: Album) => void
  onDelete?: (album: Album) => void
  isAdmin?: boolean
}

export function AlbumGrid({
  albums,
  onAlbumClick,
  onEdit,
  onDelete,
  isAdmin = false,
  className,
  ...props
}: AlbumGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {albums.map((album) => (
        <Card
          key={album.id}
          className={cn(
            "group relative overflow-hidden transition-all hover:shadow-lg",
            onAlbumClick && "cursor-pointer"
          )}
          onClick={() => onAlbumClick?.(album)}
        >
          {/* Album Cover */}
          <div className="relative aspect-square">
            {album.coverImage ? (
              <Image
                src={album.coverImage}
                alt={album.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {/* Admin Actions */}
            {isAdmin && (
              <div className="absolute right-2 top-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 bg-black/20 text-white hover:bg-black/40"
                    >
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation()
                      onEdit?.(album)
                    }}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit Album
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(album)
                      }}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Album Info */}
          <div className="p-3">
            <h3 className="font-medium">{album.title}</h3>
            {album.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {album.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{album.photoCount} photos</span>
              <span className="text-xs">•</span>
              <time dateTime={album.createdAt}>
                {new Date(album.createdAt).toLocaleDateString()}
              </time>
            </div>
          </div>
        </Card>
      ))}

      {/* Empty State */}
      {albums.length === 0 && (
        <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">No albums available</p>
        </div>
      )}
    </div>
  )
}
