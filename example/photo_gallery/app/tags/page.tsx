"use client"

import { useState } from "react"
import { ContentHeader } from "@/components/content-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ViewMode = "grid" | "list"

interface TagsProps {
  leftSidebarOpen: boolean
  toggleLeftSidebar: () => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

export default function Tags({ leftSidebarOpen, toggleLeftSidebar, rightSidebarOpen, toggleRightSidebar }: TagsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const tags = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Tag ${i + 1}`,
    photoCount: Math.floor(Math.random() * 100) + 1,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split("T")[0],
  }))

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Tags"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leftSidebarOpen={leftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      />
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {tags.map((tag) => (
              <div key={tag.id} className="bg-zinc-800 p-4 rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  {tag.photoCount} photos
                </Badge>
                <h3 className="text-lg font-semibold mb-2">{tag.name}</h3>
                <p className="text-sm text-zinc-400">Created: {tag.createdAt}</p>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Photo Count</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>{tag.photoCount}</TableCell>
                  <TableCell>{tag.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

