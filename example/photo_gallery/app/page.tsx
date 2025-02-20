"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
import { fetchPhotos } from "@/services/photoService"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { UndoRedoManager } from "@/components/shared/undo-redo-manager"
import { SkeletonPhoto } from "@/components/features/photo/skeleton-photo"
import { Skeleton } from "@/components/ui/skeleton"

type ViewMode = "grid" | "list"

interface HomeProps {
  leftSidebarOpen: boolean
  toggleLeftSidebar: () => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

type HistoryState = {
  selectedPhotoIds: string[]
  favoritePhotoIds: string[]
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <SkeletonPhoto key={i} />
      ))}
    </div>
  )
}

function LoadingTable() {
  return (
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
        {Array.from({ length: 10 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-8 w-8 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-12 w-12 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function HomeContent({ leftSidebarOpen, toggleLeftSidebar, rightSidebarOpen, toggleRightSidebar }: HomeProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { state, dispatch } = usePhoto()

  // History management
  const [history, setHistory] = useState<HistoryState[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const isHistoryUpdate = useRef(false)

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const fetchedPhotos = await fetchPhotos()
        dispatch({ type: "SET_PHOTOS", payload: fetchedPhotos })

        // Initialize history with initial state
        const initialState: HistoryState = {
          selectedPhotoIds: [],
          favoritePhotoIds: fetchedPhotos.filter((p) => p.isFavorite).map((p) => p.id),
        }
        setHistory([initialState])
        setCurrentHistoryIndex(0)

        // Simulate a delay to show loading state (remove in production)
        setTimeout(() => {
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Failed to fetch photos:", error)
        setError(error instanceof Error ? error : new Error("Failed to fetch photos"))
        setIsLoading(false)
      }
    }
    loadPhotos()
  }, [dispatch])

  const addToHistory = useCallback(
    (newState: HistoryState) => {
      if (isHistoryUpdate.current) return

      setHistory((prev) => {
        const newHistory = prev.slice(0, currentHistoryIndex + 1)
        return [...newHistory, newState]
      })
      setCurrentHistoryIndex((prev) => prev + 1)
    },
    [currentHistoryIndex],
  )

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      isHistoryUpdate.current = true
      const previousState = history[currentHistoryIndex - 1]
      setSelectedPhotoIds(previousState.selectedPhotoIds)

      dispatch({
        type: "SET_PHOTOS",
        payload: state.photos.map((photo) => ({
          ...photo,
          isFavorite: previousState.favoritePhotoIds.includes(photo.id),
        })),
      })

      setCurrentHistoryIndex((prev) => prev - 1)
      isHistoryUpdate.current = false
    }
  }, [currentHistoryIndex, history, dispatch, state.photos])

  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      isHistoryUpdate.current = true
      const nextState = history[currentHistoryIndex + 1]
      setSelectedPhotoIds(nextState.selectedPhotoIds)

      dispatch({
        type: "SET_PHOTOS",
        payload: state.photos.map((photo) => ({
          ...photo,
          isFavorite: nextState.favoritePhotoIds.includes(photo.id),
        })),
      })

      setCurrentHistoryIndex((prev) => prev + 1)
      isHistoryUpdate.current = false
    }
  }, [currentHistoryIndex, history, dispatch, state.photos])

  const handleToggleFavorite = useCallback(
    (photoId: string) => {
      const updatedPhoto = {
        ...state.photos.find((p) => p.id === photoId)!,
        isFavorite: !state.photos.find((p) => p.id === photoId)!.isFavorite,
      }

      dispatch({
        type: "UPDATE_PHOTO",
        payload: updatedPhoto,
      })

      const newFavoriteIds = state.photos
        .map((p) => (p.id === photoId ? updatedPhoto : p))
        .filter((p) => p.isFavorite)
        .map((p) => p.id)

      addToHistory({
        selectedPhotoIds,
        favoritePhotoIds: newFavoriteIds,
      })
    },
    [dispatch, state.photos, selectedPhotoIds, addToHistory],
  )

  const handleSelectionChange = useCallback(
    (newSelectedPhotoIds: string[]) => {
      setSelectedPhotoIds(newSelectedPhotoIds)

      addToHistory({
        selectedPhotoIds: newSelectedPhotoIds,
        favoritePhotoIds: state.photos.filter((p) => p.isFavorite).map((p) => p.id),
      })
    },
    [state.photos, addToHistory],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault()
        handleSelectionChange(state.photos.map((photo) => photo.id))
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.photos, handleSelectionChange, handleUndo, handleRedo])

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="All Photos"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leftSidebarOpen={leftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      >
        <UndoRedoManager
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={currentHistoryIndex > 0}
          canRedo={currentHistoryIndex < history.length - 1}
        />
      </ContentHeader>
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          viewMode === "grid" ? (
            <LoadingGrid />
          ) : (
            <LoadingTable />
          )
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <PhotoGrid
                photos={state.photos}
                selectedPhotoIds={selectedPhotoIds}
                onToggleFavorite={handleToggleFavorite}
                onAddToAlbum={() => {}}
                onSelectionChange={handleSelectionChange}
                onPhotoClick={(photo) => setSelectedPhotoIndex(state.photos.findIndex((p) => p.id === photo.id))}
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
                  {state.photos.map((photo) => (
                    <TableRow
                      key={photo.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                        selectedPhotoIds.includes(photo.id) && "bg-zinc-100 dark:bg-zinc-800",
                      )}
                      onClick={() => handleSelectionChange([photo.id])}
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "text-zinc-400 rounded-full",
                            selectedPhotoIds.includes(photo.id) && "bg-emerald-600 text-white hover:bg-emerald-700",
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectionChange(
                              selectedPhotoIds.includes(photo.id)
                                ? selectedPhotoIds.filter((id) => id !== photo.id)
                                : [...selectedPhotoIds, photo.id],
                            )
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
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(photo.id)
                            }}
                            className={cn("rounded-full", photo.isFavorite ? "text-red-500" : "text-zinc-400")}
                          >
                            <Heart className="h-4 w-4" fill={photo.isFavorite ? "currentColor" : "none"} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
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
          </>
        )}
      </div>
      {selectedPhotoIndex !== null && state.photos[selectedPhotoIndex] && (
        <PhotoModal
          photo={state.photos[selectedPhotoIndex]}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          onToggleFavorite={handleToggleFavorite}
          onNavigate={(direction) => {
            if (selectedPhotoIndex === null) return
            const newIndex =
              direction === "prev"
                ? (selectedPhotoIndex - 1 + state.photos.length) % state.photos.length
                : (selectedPhotoIndex + 1) % state.photos.length
            setSelectedPhotoIndex(newIndex)
          }}
        />
      )}
    </div>
  )
}

function Home(props: HomeProps) {
  return (
    <ErrorBoundary>
      <HomeContent {...props} />
    </ErrorBoundary>
  )
}

export default Home

