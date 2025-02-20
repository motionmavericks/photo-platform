import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus } from "lucide-react"

interface ContextMenuProps {
  onAddToAlbum: () => void
}

export function ContextMenu({ onAddToAlbum }: ContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAddToAlbum}>
          <Plus className="mr-2 h-4 w-4" />
          Add to Album
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

