import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TagsSidebarProps {
  className?: string
}

export function TagsSidebar({ className }: TagsSidebarProps) {
  // This would typically fetch tags from the API
  const tags = [
    "nature",
    "landscape",
    "portrait",
    "urban",
    "travel",
    "food",
    "architecture",
    "wildlife",
    "macro",
    "street",
    "night",
    "black and white",
    "abstract",
    "sports",
    "fashion",
    "underwater",
    "aerial",
    "wedding",
    "product",
    "fine art",
  ]

  return (
    <div className={`fixed top-16 right-0 bottom-0 w-64 bg-zinc-950 border-l border-zinc-800 ${className}`}>
      <div className="p-4 h-full">
        <h2 className="text-lg font-semibold mb-4 text-zinc-100">Tags</h2>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-300">
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

