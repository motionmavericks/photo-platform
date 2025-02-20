import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: string
  uploading?: boolean
  error?: string
}

export function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*",
  uploading = false,
  error,
  className,
  ...props
}: ImageUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [previews, setPreviews] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    const newPreviews: string[] = []
    const errors: string[] = []

    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`)
        return
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${maxSize / 1024 / 1024}MB)`)
        return
      }

      validFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    })

    if (errors.length > 0) {
      console.error(errors.join("\n"))
      return
    }

    if (validFiles.length + selectedFiles.length > maxFiles) {
      console.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  // Clean up previews on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [previews])

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  // Remove a selected file
  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    try {
      await onUpload(selectedFiles)
      setSelectedFiles([])
      setPreviews([])
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  return (
    <div
      className={cn("space-y-4", className)}
      onDragEnter={handleDrag}
      {...props}
    >
      {/* Drop zone */}
      <div
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:bg-muted/50",
          error && "border-destructive"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Drag & drop images here or click to select
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports images up to {maxSize / 1024 / 1024}MB
          </p>
          {error && (
            <p className="mt-1 text-xs text-destructive">{error}</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Selected files preview */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {previews.map((preview, index) => (
            <div key={preview} className="group relative aspect-square">
              <Image
                src={preview}
                alt={selectedFiles[index].name}
                fill
                className="rounded-lg object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : `Upload ${selectedFiles.length} files`}
          </Button>
        </div>
      )}
    </div>
  )
}
