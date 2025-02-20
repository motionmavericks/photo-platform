"use client"

import { PhotoGrid } from "@/components/features/photo/photo-grid"
import { useQuery } from "@tanstack/react-query"
import { Photo } from "@/types"
import { useState } from "react"
import { ContentHeader } from "@/components/layout/content-header"
import { useLayout } from "@/app/layout.client"

export default function HomePage() {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { rightSidebarOpen, toggleRightSidebar } = useLayout()

  const { data: photos = [], isLoading, error } = useQuery<Photo[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const response = await fetch("/api/photos")
      if (!response.ok) throw new Error("Failed to fetch photos")
      return response.json()
    },
  })

  const handleToggleFavorite = async (photoId: string) => {
    // TODO: Implement toggle favorite
    console.log("Toggle favorite:", photoId)
  }

  const handleAddToAlbum = async (photoId: string) => {
    // TODO: Implement add to album
    console.log("Add to album:", photoId)
  }

  return (
    <div className="h-full flex flex-col">
      <ContentHeader
        title="All Photos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      />
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400">Loading photos...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">Error loading photos</div>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400">No photos found</div>
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            selectedPhotoIds={selectedPhotoIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToAlbum={handleAddToAlbum}
            onSelectionChange={setSelectedPhotoIds}
          />
        )}
      </div>
    </div>
  )
}
