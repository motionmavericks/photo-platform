import { Button } from "@/components/ui/button"
import { LayoutGrid, List, SortAsc, PanelRightClose, PanelRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ContentHeaderProps {
  title: string
  viewMode?: "grid" | "list"
  onViewModeChange?: (mode: "grid" | "list") => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

export function ContentHeader({
  title,
  viewMode = "grid",
  onViewModeChange,
  rightSidebarOpen,
  toggleRightSidebar,
}: ContentHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between px-4 py-2 border-b border-zinc-800 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>
      </div>

      <div className="flex items-center gap-4 py-2">
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-100 rounded-full h-8 px-3">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 rounded-xl overflow-hidden">
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            {title === "Albums" && <SelectItem value="photoCount">Photo Count</SelectItem>}
          </SelectContent>
        </Select>

        <Tabs
          value={viewMode}
          onValueChange={(value) => onViewModeChange?.(value as "grid" | "list")}
          className="rounded-full border border-zinc-800 bg-zinc-900 h-8"
        >
          <TabsList className="rounded-full bg-transparent h-full">
            <TabsTrigger
              value="grid"
              className={cn(
                "rounded-full data-[state=active]:bg-zinc-800 h-full px-3",
                "text-zinc-400 hover:text-zinc-100 data-[state=active]:text-zinc-100",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className={cn(
                "rounded-full data-[state=active]:bg-zinc-800 h-full px-3",
                "text-zinc-400 hover:text-zinc-100 data-[state=active]:text-zinc-100",
              )}
            >
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-100 h-8 w-8 p-0"
          onClick={toggleRightSidebar}
        >
          {rightSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

