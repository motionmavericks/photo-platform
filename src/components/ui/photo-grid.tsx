import * as React from "react"
import { cn } from "@/lib/utils"
import { PhotoCard } from "./photo-card"

interface Photo {
  id: string
  src: string
  alt: string
  title?: string
  tags?: string[]
}

interface PhotoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  photos: Photo[]
  onDownload?: (photo: Photo) => void
  onShare?: (photo: Photo) => void
  onTagsUpdate?: (photo: Photo, tags: string[]) => void
  isAdmin?: boolean
  selectedTags?: string[]
  onTagFilter?: (tag: string) => void
}

export function PhotoGrid({
  photos,
  onDownload,
  onShare,
  onTagsUpdate,
  isAdmin = false,
  selectedTags = [],
  onTagFilter,
  className,
  ...props
}: PhotoGridProps) {
  // Filter photos by selected tags
  const filteredPhotos = React.useMemo(() => {
    if (selectedTags.length === 0) return photos
    return photos.filter((photo) =>
      selectedTags.some((tag) => photo.tags?.includes(tag))
    )
  }, [photos, selectedTags])

  // Get unique tags from all photos
  const allTags = React.useMemo(() => {
    const tags = new Set<string>()
    photos.forEach((photo) => {
      photo.tags?.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [photos])

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Tags filter */}
      {onTagFilter && allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagFilter(tag)}
              className={cn(
                "rounded-full px-3 py-1 text-sm transition-colors",
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPhotos.map((photo) => (
          <PhotoCard
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            title={photo.title}
            tags={photo.tags}
            onDownload={onDownload ? () => onDownload(photo) : undefined}
            onShare={onShare ? () => onShare(photo) : undefined}
            onTagsUpdate={
              onTagsUpdate ? (tags) => onTagsUpdate(photo, tags) : undefined
            }
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredPhotos.length === 0 && (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            {selectedTags.length > 0
              ? "No photos match the selected tags"
              : "No photos available"}
          </p>
        </div>
      )}
    </div>
  )
}
