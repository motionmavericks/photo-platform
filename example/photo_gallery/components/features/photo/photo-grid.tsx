"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"
import { PhotoCard } from "@/components/features/photo/photo-card"
import type { Photo } from "@/types"
import type React from "react"

interface PhotoGridProps {
  photos: Photo[]
  selectedPhotoIds: string[]
  className?: string
  onToggleFavorite: (photoId: string) => void
  onAddToAlbum: (photoId: string) => void
  onSelectionChange: (selectedPhotoIds: string[]) => void
  onPhotoClick: (photo: Photo) => void
}

export function PhotoGrid({
  photos,
  selectedPhotoIds,
  onToggleFavorite,
  onAddToAlbum,
  onSelectionChange,
  onPhotoClick,
  className,
}: PhotoGridProps) {
  const handleSelectPhoto = useCallback(
    (photoId: string, event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (event.shiftKey && selectedPhotoIds.length > 0) {
        const lastSelectedId = selectedPhotoIds[selectedPhotoIds.length - 1]
        const startIndex = photos.findIndex((photo) => photo.id === lastSelectedId)
        const endIndex = photos.findIndex((photo) => photo.id === photoId)
        const rangeStart = Math.min(startIndex, endIndex)
        const rangeEnd = Math.max(startIndex, endIndex)
        const selectedRange = photos.slice(rangeStart, rangeEnd + 1).map((photo) => photo.id)
        onSelectionChange([...new Set([...selectedPhotoIds, ...selectedRange])])
      } else if (event.ctrlKey || event.metaKey) {
        onSelectionChange(
          selectedPhotoIds.includes(photoId)
            ? selectedPhotoIds.filter((id) => id !== photoId)
            : [...selectedPhotoIds, photoId],
        )
      } else {
        onSelectionChange([photoId])
      }
    },
    [photos, selectedPhotoIds, onSelectionChange],
  )

  return (
    <div
      className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4", className)}
    >
      {photos.map((photo) => (
        <div key={photo.id} className="w-full">
          <PhotoCard
            photo={photo}
            isSelected={selectedPhotoIds.includes(photo.id)}
            isFavorite={photo.isFavorite}
            onToggleFavorite={onToggleFavorite}
            onAddToAlbum={onAddToAlbum}
            onSelect={handleSelectPhoto}
            onClick={onPhotoClick}
          />
        </div>
      ))}
    </div>
  )
}

