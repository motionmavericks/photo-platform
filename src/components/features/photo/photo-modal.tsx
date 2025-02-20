"use client"

import { useEffect, useCallback, useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, Download, Share2, ChevronLeft, ChevronRight, PanelRightClose, PanelRight, X } from "lucide-react"
import Image from "next/image"
import { CustomDialog, CustomDialogContent, CustomDialogTitle } from "@/components/ui/custom-dialog"
import { Photo } from "@/types"

interface PhotoModalProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
  onToggleFavorite?: (photoId: string) => void
  onNavigate?: (direction: "prev" | "next") => void
}

export default function PhotoModal({ photo, isOpen, onClose, onToggleFavorite, onNavigate }: PhotoModalProps) {
  const [showInfo, setShowInfo] = useState(true)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && onNavigate) {
        onNavigate("prev")
      } else if (event.key === "ArrowRight" && onNavigate) {
        onNavigate("next")
      } else if (event.key === "Escape") {
        onClose()
      }
    },
    [onNavigate, onClose],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  if (!photo || !isOpen) return null

  const handleToggleFavorite = () => {
    onToggleFavorite?.(photo.id)
  }

  return (
    <CustomDialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-[95vw] max-h-[90vh] w-full p-0 overflow-hidden bg-zinc-900">
        <CustomDialogTitle className="sr-only">{photo.title}</CustomDialogTitle>
        <div className="flex h-[85vh] relative">
          <div 
            className={cn(
              "relative flex-1 bg-zinc-950 overflow-hidden transition-all duration-300 flex items-center justify-center",
              showInfo ? "basis-[calc(100%-24rem)]" : "basis-full"
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={`/api/photos/${photo.id}`}
                alt={photo.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                priority
              />
            {(() => {
              console.log('Photo:', {
                id: photo.id,
                title: photo.title,
                faceDetections: JSON.stringify(photo.faceDetections, null, 2)
              });
              
              if (!photo.faceDetections?.length) {
                console.log('No face detections for this photo');
                return null;
              }

              return (
                <>
                  {photo.faceDetections.map((detection) => {
                    // Parse the bounding box data which comes as JSON
                    const box = typeof detection.bounding_box === 'string' 
                      ? JSON.parse(detection.bounding_box)
                      : detection.bounding_box;

                    console.log('Detection data:', {
                      id: detection.id,
                      rawBox: detection.bounding_box,
                      parsedBox: box
                    });

                    // Convert coordinates to percentages (0-100)
                    const x = parseFloat(box.x.toString());
                    const y = parseFloat(box.y.toString());
                    const width = parseFloat(box.width.toString());
                    const height = parseFloat(box.height.toString());

                    // If the value is already a percentage (> 1), use it directly
                    // If it's a decimal (≤ 1), multiply by 100 to get percentage
                    const xPercent = x > 1 ? x : x * 100;
                    const yPercent = y > 1 ? y : y * 100;
                    const widthPercent = width > 1 ? width : width * 100;
                    const heightPercent = height > 1 ? height : height * 100;

                    return (
                      <div
                        key={detection.id}
                        className="absolute border-2 border-red-500"
                        style={{
                          left: `${xPercent}%`,
                          top: `${yPercent}%`,
                          width: `${widthPercent}%`,
                          height: `${heightPercent}%`,
                        }}
                      />
                    );
                  })}
                </>
              );
            })()}
            </div>
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10"
                  onClick={handleToggleFavorite}
                >
                  <Heart className="h-5 w-5" fill={photo.isFavorite ? "currentColor" : "none"} />
                  <span className="sr-only">{photo.isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10"
                onClick={() => setShowInfo(!showInfo)}
              >
                {showInfo ? <PanelRightClose className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {onNavigate && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10 z-10"
                  onClick={() => onNavigate("prev")}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous photo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10 z-10"
                  onClick={() => onNavigate("next")}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next photo</span>
                </Button>
              </>
            )}
          </div>
          <div
            className={cn(
              "flex-shrink-0 overflow-hidden bg-zinc-800 w-96 transition-all duration-300 transform",
              showInfo ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}
          >
            <div className="w-96 p-6 overflow-y-auto custom-scrollbar h-[85vh]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-zinc-100">{photo.title}</h2>
                  </div>
                  {photo.uploader && <p className="text-zinc-400 mb-4">By {photo.uploader}</p>}
                  {photo.description && <p className="text-zinc-300 mb-4">{photo.description}</p>}
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-zinc-400">
                      {photo.date_created
                        ? new Date(photo.date_created).toLocaleDateString()
                        : new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 mb-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full flex-1"
                      onClick={async () => {
                        const response = await fetch(`/api/photos/${photo.id}`);
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = photo.title || "photo";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  {photo.photos_tags && photo.photos_tags.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="text-lg font-semibold mb-2 text-zinc-200">Tags</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {photo.photos_tags?.map((photoTag) => (
                          <Badge
                            key={photoTag.tags.id}
                            variant="secondary"
                            className="rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                          >
                            {photoTag.tags.name}
                          </Badge>
                        ))}
                      </div>
                    </>
                  )}
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-2 text-zinc-200">Details</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {photo.width && photo.height && (
                      <>
                        <dt className="text-zinc-400">Dimensions</dt>
                        <dd className="text-zinc-300">{`${photo.width} x ${photo.height}`}</dd>
                      </>
                    )}
                    <dt className="text-zinc-400">Size</dt>
                    <dd className="text-zinc-300">{`${(photo.size_bytes / (1024 * 1024)).toFixed(1)} MB`}</dd>
                    <dt className="text-zinc-400">Format</dt>
                    <dd className="text-zinc-300">{photo.mime_type.split("/")[1].toUpperCase()}</dd>
                    {photo.camera && (
                      <>
                        <dt className="text-zinc-400">Camera</dt>
                        <dd className="text-zinc-300">{`${photo.camera} ${photo.lens || ""}`}</dd>
                      </>
                    )}
                    {photo.exposure_time && (
                      <>
                        <dt className="text-zinc-400">Exposure</dt>
                        <dd className="text-zinc-300">{photo.exposure_time}</dd>
                      </>
                    )}
                    {photo.aperture && (
                      <>
                        <dt className="text-zinc-400">Aperture</dt>
                        <dd className="text-zinc-300">f/{photo.aperture}</dd>
                      </>
                    )}
                    {photo.iso && (
                      <>
                        <dt className="text-zinc-400">ISO</dt>
                        <dd className="text-zinc-300">{photo.iso}</dd>
                      </>
                    )}
                    {photo.focal_length && (
                      <>
                        <dt className="text-zinc-400">Focal Length</dt>
                        <dd className="text-zinc-300">{photo.focal_length}</dd>
                      </>
                    )}
                  </dl>
                  {photo.license && (
                    <>
                      <Separator className="my-4" />
                      <h3 className="text-lg font-semibold mb-2 text-zinc-200">Rights</h3>
                      <p className="text-zinc-300 text-sm">{photo.license}</p>
                      {photo.license && <p className="text-zinc-400 text-sm mt-1">{photo.license}</p>}
                    </>
                  )}
            </div>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}
