"use client"

import { useState } from "react"
import { PhotoCard } from "@/components/ui/photo-card"
import { PhotoGrid } from "@/components/ui/photo-grid"
import { AlbumGrid } from "@/components/ui/album-grid"
import { ImageUpload } from "@/components/ui/image-upload"
import { TagInput } from "@/components/ui/tag-input"
import { Button } from "@/components/ui/button"

// Sample data
const samplePhotos = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    alt: "Sample photo 1",
    title: "Forest Path",
    tags: ["nature", "landscape", "forest"]
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    alt: "Sample photo 2",
    title: "Architecture",
    tags: ["building", "city"]
  }
]

const sampleAlbums = [
  {
    id: "1",
    title: "Nature Collection",
    description: "Beautiful landscapes and nature shots",
    coverImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    photoCount: 12,
    createdAt: "2025-02-20T00:00:00.000Z"
  },
  {
    id: "2",
    title: "Urban Photography",
    description: "City life and architecture",
    coverImage: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    photoCount: 8,
    createdAt: "2025-02-20T00:00:00.000Z"
  }
]

const sampleTags = [
  "nature",
  "landscape",
  "architecture",
  "city",
  "people",
  "travel",
  "food",
  "animals"
]

export default function TestComponents() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  // Handlers
  const handleDownload = (photo: any) => {
    console.log("Downloading photo:", photo)
  }

  const handleShare = (photo: any) => {
    console.log("Sharing photo:", photo)
  }

  const handleTagsUpdate = (photo: any, tags: string[]) => {
    console.log("Updating tags for photo:", photo, tags)
  }

  const handleUpload = async (files: File[]) => {
    setUploading(true)
    console.log("Uploading files:", files)
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setUploading(false)
  }

  const handleAlbumClick = (album: any) => {
    console.log("Opening album:", album)
  }

  const handleAlbumEdit = (album: any) => {
    console.log("Editing album:", album)
  }

  const handleAlbumDelete = (album: any) => {
    console.log("Deleting album:", album)
  }

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Single Photo Card</h2>
        <PhotoCard
          src={samplePhotos[0].src}
          alt={samplePhotos[0].alt}
          title={samplePhotos[0].title}
          tags={samplePhotos[0].tags}
          onDownload={() => handleDownload(samplePhotos[0])}
          onShare={() => handleShare(samplePhotos[0])}
          onTagsUpdate={(tags) => handleTagsUpdate(samplePhotos[0], tags)}
          isAdmin
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Photo Grid</h2>
        <PhotoGrid
          photos={samplePhotos}
          onDownload={handleDownload}
          onShare={handleShare}
          onTagsUpdate={handleTagsUpdate}
          isAdmin
          selectedTags={selectedTags}
          onTagFilter={(tag) => 
            setSelectedTags(prev => 
              prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
            )
          }
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Album Grid</h2>
        <AlbumGrid
          albums={sampleAlbums}
          onAlbumClick={handleAlbumClick}
          onEdit={handleAlbumEdit}
          onDelete={handleAlbumDelete}
          isAdmin
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Image Upload</h2>
        <ImageUpload
          onUpload={handleUpload}
          uploading={uploading}
          maxFiles={5}
          maxSize={2 * 1024 * 1024} // 2MB
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tag Input</h2>
        <TagInput
          value={selectedTags}
          onChange={setSelectedTags}
          suggestions={sampleTags}
          placeholder="Add tags..."
        />
      </div>
    </div>
  )
}
