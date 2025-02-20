"use client"

import { useState, useCallback, useEffect } from "react"
import { ContentHeader } from "@/components/layout/content-header"
import { PhotoGrid } from "@/components/features/photo/photo-grid"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Heart, Plus, Check } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import PhotoModal from "@/components/features/photo/photo-modal"
import { usePhoto } from "@/context/PhotoContext"
import type { Photo, Favorite } from "@/types"
import { fetchPhotos } from "@/services/photoService"
import { UndoRedoManager, useUndoRedoState } from "@/components/shared/undo-redo-manager"
import { ErrorBoundary } from "@/components/shared/error-boundary"

type ViewMode = "grid" | "list"

interface FavoritesProps {
  leftSidebarOpen: boolean
  toggleLeftSidebar: () => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

function FavoritesContent({
  leftSidebarOpen,
  toggleLeftSidebar,
  rightSidebarOpen,
  toggleRightSidebar,
}: FavoritesProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [lastClickedPhotoId, setLastClickedPhotoId] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { state, dispatch } = usePhoto()
  const [photos, setPhotos] = useState<Photo[]>([])

  const {
    state: favorites,
    updateState: updateFavorites,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedoState<Favorite[]>([])

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const fetchedPhotos = await fetchPhotos()
        setPhotos(fetchedPhotos)
        dispatch({ type: "SET_PHOTOS", payload: fetchedPhotos })
      } catch (error) {
        console.error("Failed to fetch photos:", error)
        setError(error instanceof Error ? error : new Error("Failed to fetch photos"))
      }
    }
    loadPhotos()
  }, [dispatch])

  if (error) {
    throw error // This will be caught by the ErrorBoundary
  }

  const favoritePhotos = photos.filter((photo) => favorites.some((fav) => fav.photoId === photo.id))

  const handleToggleFavorite = useCallback(
    (photoId: string) => {
      const userId = "current-user-id" // In a real app, this would come from authentication
      const photosToUpdate = selectedPhotoIds.includes(photoId) ? selectedPhotoIds : [photoId]
      const updatedFavorites = [...favorites]

      photosToUpdate.forEach((id) => {
        const existingFavoriteIndex = updatedFavorites.findIndex((fav) => fav.photoId === id && fav.userId === userId)
        if (existingFavoriteIndex !== -1) {
          updatedFavorites.splice(existingFavoriteIndex, 1)
        } else {
          updatedFavorites.push({ userId, photoId: id, createdAt: new Date().toISOString() })
        }
      })

      updateFavorites(updatedFavorites)
    },
    [favorites, selectedPhotoIds, updateFavorites],
  )

  const handleAddToAlbum = useCallback((photoId: string) => {
    console.log(`Add photo ${photoId} to album`)
  }, [])

  const handleSelectPhoto = useCallback(
    (photoId: string, event: React.MouseEvent) => {
      if (event.shiftKey && lastClickedPhotoId) {
        const startIndex = favoritePhotos.findIndex((photo) => photo.id === lastClickedPhotoId)
        const endIndex = favoritePhotos.findIndex((photo) => photo.id === photoId)
        const rangeStart = Math.min(startIndex, endIndex)
        const rangeEnd = Math.max(startIndex, endIndex)
        const selectedRange = favoritePhotos.slice(rangeStart, rangeEnd + 1).map((photo) => photo.id)

        const allInRangeSelected = selectedRange.every((id) => selectedPhotoIds.includes(id))

        if (allInRangeSelected) {
          // Deselect the range
          setSelectedPhotoIds((prev) => prev.filter((id) => !selectedRange.includes(id)))
        } else {
          // Select the range
          setSelectedPhotoIds((prev) => [...new Set([...prev, ...selectedRange])])
        }
      } else if (event.ctrlKey || event.metaKey) {
        setSelectedPhotoIds((prev) =>
          prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId],
        )
      } else {
        setSelectedPhotoIds([photoId])
      }
      setLastClickedPhotoId(photoId)
    },
    [favoritePhotos, lastClickedPhotoId, selectedPhotoIds],
  )

  const handlePhotoClick = useCallback(
    (photo: Photo) => {
      setSelectedPhotoIndex(favoritePhotos.findIndex((p) => p.id === photo.id))
    },
    [favoritePhotos],
  )

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      if (selectedPhotoIndex === null) return
      const newIndex =
        direction === "prev"
          ? (selectedPhotoIndex - 1 + favoritePhotos.length) % favoritePhotos.length
          : (selectedPhotoIndex + 1) % favoritePhotos.length
      setSelectedPhotoIndex(newIndex)
    },
    [selectedPhotoIndex, favoritePhotos.length],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault()
        const allPhotoIds = favoritePhotos.map((photo) => photo.id)
        setSelectedPhotoIds(allPhotoIds)
      } else if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault()
        setSelectedPhotoIds([])
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [favoritePhotos, undo, redo])

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Favorites"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leftSidebarOpen={leftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      >
        <UndoRedoManager onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
      </ContentHeader>
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {viewMode === "grid" ? (
          <PhotoGrid
            photos={favoritePhotos}
            selectedPhotoIds={selectedPhotoIds}
            onToggleFavorite={handleToggleFavorite}
            onAddToAlbum={handleAddToAlbum}
            onSelectionChange={setSelectedPhotoIds}
            onPhotoClick={handlePhotoClick}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Select</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {favoritePhotos.map((photo) => (
                <TableRow
                  key={photo.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    selectedPhotoIds.includes(photo.id) && "bg-zinc-100 dark:bg-zinc-800",
                  )}
                  onClick={(e) => handleSelectPhoto(photo.id, e)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "text-zinc-400 rounded-full",
                        selectedPhotoIds.includes(photo.id) && "bg-emerald-600 text-white hover:bg-emerald-700",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectPhoto(photo.id, e)
                      }}
                    >
                      {selectedPhotoIds.includes(photo.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-zinc-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{photo.id}</TableCell>
                  <TableCell>
                    <Image
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{photo.title}</TableCell>
                  <TableCell>{photo.userId}</TableCell>
                  <TableCell>{photo.createdAt}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(photo.id)
                        }}
                        className="rounded-full text-red-500"
                      >
                        <Heart className="h-4 w-4" fill="currentColor" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddToAlbum(photo.id)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Album
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {selectedPhotoIndex !== null && (
        <PhotoModal
          photo={favoritePhotos[selectedPhotoIndex]}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          onToggleFavorite={handleToggleFavorite}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}

export default function Favorites(props: FavoritesProps) {
  return (
    <ErrorBoundary>
      <FavoritesContent {...props} />
    </ErrorBoundary>
  )
}

