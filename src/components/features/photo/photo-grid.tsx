"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { PhotoCard } from "@/components/ui/photo-card"
import PhotoModal from "./photo-modal"
import { Photo } from "@/types"

interface PhotoGridProps {
  photos: Photo[]
  selectedPhotoIds: string[]
  onToggleFavorite: (photoId: string) => void
  onAddToAlbum: (photoId: string) => void
  onSelectionChange: (selectedPhotoIds: string[]) => void
  className?: string
}

export function PhotoGrid({
  photos,
  selectedPhotoIds,
  onToggleFavorite,
  onAddToAlbum,
  onSelectionChange,
  className,
}: PhotoGridProps) {
  const [lastClickedPhotoId, setLastClickedPhotoId] = React.useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null)

  const handleSelect = (photoId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey && lastClickedPhotoId) {
      const startIndex = photos.findIndex((photo) => photo.id === lastClickedPhotoId)
      const endIndex = photos.findIndex((photo) => photo.id === photoId)
      const rangeStart = Math.min(startIndex, endIndex)
      const rangeEnd = Math.max(startIndex, endIndex)
      const selectedRange = photos.slice(rangeStart, rangeEnd + 1).map((photo) => photo.id)

      const allInRangeSelected = selectedRange.every((id) => selectedPhotoIds.includes(id))

      if (allInRangeSelected) {
        // Deselect the range
        onSelectionChange(selectedPhotoIds.filter((id) => !selectedRange.includes(id)))
      } else {
        // Select the range
        onSelectionChange([...new Set([...selectedPhotoIds, ...selectedRange])])
      }
    } else if (event.ctrlKey || event.metaKey) {
      onSelectionChange(
        selectedPhotoIds.includes(photoId)
          ? selectedPhotoIds.filter((id) => id !== photoId)
          : [...selectedPhotoIds, photoId]
      )
    } else {
      onSelectionChange([photoId])
    }
    setLastClickedPhotoId(photoId)
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const handleNavigate = (direction: "prev" | "next") => {
    if (!selectedPhoto) return

    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id)
    if (currentIndex === -1) return

    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < photos.length) {
      setSelectedPhoto(photos[newIndex])
    }
  }

  return (
    <>
      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4", className)}>
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelected={selectedPhotoIds.includes(photo.id)}
            isFavorite={photo.isFavorite || false}
            onToggleFavorite={onToggleFavorite}
            onAddToAlbum={onAddToAlbum}
            onSelect={(e) => handleSelect(photo.id, e)}
            onClick={() => handlePhotoClick(photo)}
          />
        ))}
      </div>

      <PhotoModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onToggleFavorite={onToggleFavorite}
        onNavigate={handleNavigate}
      />
    </>
  )
}
