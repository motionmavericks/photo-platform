import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "./card"
import { Button } from "./button"
import {
  DownloadIcon,
  ShareIcon,
  TagIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface PhotoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  title?: string
  tags?: string[]
  onDownload?: () => void
  onShare?: () => void
  onTagsUpdate?: (tags: string[]) => void
  isAdmin?: boolean
  width?: number
  height?: number
}

export function PhotoCard({
  src,
  alt,
  title,
  tags = [],
  onDownload,
  onShare,
  onTagsUpdate,
  isAdmin = false,
  width = 300,
  height = 200,
  className,
  ...props
}: PhotoCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg",
        className
      )}
      {...props}
    >
      <div className="relative aspect-[3/2]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {onDownload && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-black/20 hover:text-white"
              onClick={onDownload}
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:bg-black/20 hover:text-white"
              onClick={onShare}
            >
              <ShareIcon className="h-4 w-4" />
            </Button>
          )}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:bg-black/20 hover:text-white"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onTagsUpdate?.(tags)}>
                  <TagIcon className="mr-2 h-4 w-4" />
                  Edit Tags
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {(title || tags.length > 0) && (
        <div className="p-3">
          {title && <h3 className="font-medium">{title}</h3>}
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
