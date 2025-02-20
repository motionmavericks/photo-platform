"use client"

import { useState } from "react"
import { ContentHeader } from "@/components/layout/content-header"
import { AlbumGrid } from "@/components/features/album/album-grid"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type ViewMode = "grid" | "list"

interface AlbumsProps {
  leftSidebarOpen: boolean
  toggleLeftSidebar: () => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

export default function Albums({
  leftSidebarOpen,
  toggleLeftSidebar,
  rightSidebarOpen,
  toggleRightSidebar,
}: AlbumsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const albums = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Album ${i + 1}`,
    coverImage: `https://picsum.photos/seed/${i + 200}/800/600`,
    photoCount: Math.floor(Math.random() * 200) + 50,
    user: `user_${Math.floor(Math.random() * 10) + 1}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split("T")[0],
  }))

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Albums"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leftSidebarOpen={leftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      />
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {viewMode === "grid" ? (
          <AlbumGrid albums={albums} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Photo Count</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albums.map((album) => (
                <TableRow key={album.id}>
                  <TableCell>{album.id}</TableCell>
                  <TableCell>
                    <Image
                      src={album.coverImage || "/placeholder.svg"}
                      alt={album.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{album.title}</TableCell>
                  <TableCell>{album.user}</TableCell>
                  <TableCell>{album.photoCount}</TableCell>
                  <TableCell>{album.createdAt}</TableCell>
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

