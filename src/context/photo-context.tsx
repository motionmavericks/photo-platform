"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Photo } from "@/types"

interface PhotoContextType {
  photos: Photo[]
  selectedPhotoIds: string[]
  setSelectedPhotoIds: (ids: string[]) => void
  toggleFavorite: (photoId: string) => void
  addToAlbum: (photoId: string) => void
  isLoading: boolean
  error: Error | null
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined)

export function PhotoProvider({ children }: { children: React.ReactNode }) {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])

  const { data: photos = [], isLoading, error } = useQuery<Photo[], Error>({
    queryKey: ["photos"],
    queryFn: async () => {
      const response = await fetch("/api/photos")
      if (!response.ok) {
        throw new Error("Failed to fetch photos")
      }
      return response.json()
    },
  })

  const toggleFavorite = useCallback(async (photoId: string) => {
    // TODO: Implement toggle favorite functionality
    console.log("Toggle favorite for photo:", photoId)
  }, [])

  const addToAlbum = useCallback(async (photoId: string) => {
    // TODO: Implement add to album functionality
    console.log("Add photo to album:", photoId)
  }, [])

  return (
    <PhotoContext.Provider
      value={{
        photos,
        selectedPhotoIds,
        setSelectedPhotoIds,
        toggleFavorite,
        addToAlbum,
        isLoading,
        error: error || null,
      }}
    >
      {children}
    </PhotoContext.Provider>
  )
}

export function usePhoto() {
  const context = useContext(PhotoContext)
  if (context === undefined) {
    throw new Error("usePhoto must be used within a PhotoProvider")
  }
  return context
}
