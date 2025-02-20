import { useState } from "react"
import Image from "next/image"
import { Heart, MoreHorizontal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonPhoto } from "./skeleton-photo"
import type { Photo } from "@/types"
import type React from "react"

interface PhotoCardProps {
  photo: Photo
  isSelected: boolean
  isFavorite: boolean
  onToggleFavorite: (photoId: string) => void
  onAddToAlbum: (photoId: string) => void
  onSelect?: (photoId: string, event: React.MouseEvent) => void
  onClick?: (photo: Photo) => void
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
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer w-full h-full"
      onClick={(e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
        if (e instanceof MouseEvent) {
          e.preventDefault()
        } else {
          e.stopPropagation()
        }

        // Only trigger modal if no modifier keys are pressed
        if (!e.ctrlKey && !e.shiftKey && typeof onClick === "function") {
          onClick(photo)
        }

        if (typeof onSelect === "function") {
          onSelect(photo.id, e)
        }
      }}
    >
      <CardContent className="p-0 h-full">
        {isLoading && <SkeletonPhoto />}
        <div
          className={cn(
            "relative aspect-square w-full h-full",
            isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300",
          )}
        >
          <Image
            src={photo.src || `/placeholder.svg?height=400&width=400`}
            alt={photo.title}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            onLoad={() => setIsLoading(false)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-sm font-medium leading-tight">{photo.title}</h3>
            <p className="mt-1 text-xs text-zinc-300">{photo.userId}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 left-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full",
              isFavorite && "text-red-500",
            )}
            onClick={(e: React.MouseEvent<HTMLButtonElement> | MouseEvent) => {
              if (e instanceof MouseEvent) {
                e.preventDefault()
              } else {
                e.stopPropagation()
              }
              onToggleFavorite(photo.id)
            }}
          >
            <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAddToAlbum(photo.id)}>Add to Album</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute bottom-2 right-2 text-white rounded-full",
              isSelected
                ? "bg-emerald-600 opacity-100"
                : "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            )}
            onClick={(e: React.MouseEvent<HTMLButtonElement> | MouseEvent) => {
              if (e instanceof MouseEvent) {
                e.preventDefault()
              } else {
                e.stopPropagation()
              }
              if (typeof onSelect === "function") {
                onSelect(photo.id, e)
              }
            }}
          >
            {isSelected ? (
              <Check className="h-5 w-5 text-white" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-white" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

