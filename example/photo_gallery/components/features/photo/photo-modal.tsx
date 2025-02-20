"use client"

import { useEffect, useCallback, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Heart, Download, Share2, ChevronLeft, ChevronRight, PanelRightClose, PanelRight, X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { CustomDialog, CustomDialogContent } from "@/components/ui/custom-dialog"

interface Photo {
  id: string
  title: string
  src: string
  user: string
  tags: string[]
  createdAt: string
  isFavorite: boolean
  description?: string
}

interface PhotoModalProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
  onToggleFavorite: (photoId: string) => void
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
    onToggleFavorite(photo.id)
  }

  return (
    <CustomDialog open={isOpen} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-7xl p-0 overflow-hidden bg-zinc-900">
        <div className="flex h-[90vh] relative">
          <motion.div
            className="relative flex-1 bg-zinc-950 overflow-hidden"
            initial={false}
            animate={{
              flexBasis: showInfo ? "calc(100% - 24rem)" : "100%",
              flexGrow: showInfo ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0">
              <Image
                src={photo?.src || "/placeholder.svg"}
                alt={photo?.title || "Photo"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                priority
              />
            </div>
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10"
                onClick={handleToggleFavorite}
              >
                <Heart className="h-5 w-5" fill={photo.isFavorite ? "currentColor" : "none"} />
                <span className="sr-only">{photo.isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
              </Button>
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
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10 z-10"
              onClick={() => onNavigate && onNavigate("prev")}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous photo</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/75 rounded-full w-10 h-10 z-10"
              onClick={() => onNavigate && onNavigate("next")}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next photo</span>
            </Button>
          </motion.div>
          <AnimatePresence mode="popLayout">
            {showInfo && (
              <motion.div
                layout
                initial={{ flexBasis: 0, opacity: 0 }}
                animate={{ flexBasis: "24rem", opacity: 1 }}
                exit={{ flexBasis: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-shrink-0 overflow-hidden bg-zinc-800"
              >
                <div className="w-96 p-6 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-zinc-100">{photo?.title}</h2>
                  </div>
                  <p className="text-zinc-400 mb-4">By {photo?.user}</p>
                  {photo?.description && <p className="text-zinc-300 mb-4">{photo.description}</p>}
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-zinc-400">
                      {photo?.createdAt ? new Date(photo.createdAt).toLocaleDateString() : "Unknown date"}
                    </p>
                  </div>
                  <div className="flex space-x-2 mb-6">
                    <Button variant="secondary" size="sm" className="rounded-full flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="secondary" size="sm" className="rounded-full flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-2 text-zinc-200">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {photo?.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <h3 className="text-lg font-semibold mb-2 text-zinc-200">Details</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="text-zinc-400">Dimensions</dt>
                    <dd className="text-zinc-300">3000 x 2000</dd>
                    <dt className="text-zinc-400">Size</dt>
                    <dd className="text-zinc-300">2.5 MB</dd>
                    <dt className="text-zinc-400">Format</dt>
                    <dd className="text-zinc-300">JPEG</dd>
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}

