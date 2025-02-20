"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { Tag } from "@/types"

interface TagsSidebarProps {
  className?: string
}

export function TagsSidebar({ className }: TagsSidebarProps) {
  const { data: tags = [] } = useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: async () => {
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("Failed to fetch tags")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return (
    <div className={`fixed top-16 right-0 bottom-0 w-64 bg-zinc-950 border-l border-zinc-800 ${className}`}>
      <div className="p-4 h-full">
        <h2 className="text-lg font-semibold mb-4 text-zinc-100">Tags</h2>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="bg-zinc-800 text-zinc-300">
                {tag.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
