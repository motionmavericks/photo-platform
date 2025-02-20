"use client"

import { Photo } from "@/types"
import { cn } from "@/lib/utils"
import { Heart, Plus } from "lucide-react"
import Image from "next/image"
import { MouseEvent } from "react"

interface PhotoCardProps {
  photo: Photo
  isSelected: boolean
  isFavorite: boolean
  onToggleFavorite: (photoId: string) => void
  onAddToAlbum: (photoId: string) => void
  onSelect: (event: MouseEvent<HTMLDivElement>) => void
  onClick: (photo: Photo) => void
}

export function PhotoCard({
  photo,
  isSelected,
  isFavorite,
  onToggleFavorite,
  onAddToAlbum,
  onSelect,
  onClick,
}: PhotoCardProps) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey) {
      onSelect(event)
    } else {
      onClick(photo)
    }
  }

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg bg-zinc-900",
        isSelected && "ring-2 ring-emerald-600"
      )}
      onClick={handleClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(photo))
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={`/api/photos/${photo.id}`}
          alt={photo.title || photo.original_filename}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white truncate">{photo.title || photo.original_filename}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(photo.id)
              }}
              className={`rounded-full p-1.5 transition-colors ${
                isFavorite ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToAlbum(photo.id)
              }}
              className="rounded-full bg-zinc-800 p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
