"use client"

import { useState } from "react"
import { ContentHeader } from "@/components/content-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type ViewMode = "grid" | "list"

interface UsersProps {
  leftSidebarOpen: boolean
  toggleLeftSidebar: () => void
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

export default function Users({
  leftSidebarOpen,
  toggleLeftSidebar,
  rightSidebarOpen,
  toggleRightSidebar,
}: UsersProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const users = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    photoCount: Math.floor(Math.random() * 100) + 1,
    albumCount: Math.floor(Math.random() * 10) + 1,
    joinedAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString().split("T")[0],
  }))

  return (
    <div className="flex flex-col h-full">
      <ContentHeader
        title="Users"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        leftSidebarOpen={leftSidebarOpen}
        toggleLeftSidebar={toggleLeftSidebar}
        rightSidebarOpen={rightSidebarOpen}
        toggleRightSidebar={toggleRightSidebar}
      />
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-zinc-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-zinc-700"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-emerald-500">
                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">{user.name}</h3>
                    <p className="text-sm text-zinc-400">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm bg-zinc-700 p-4 rounded-md">
                  <div>
                    <p className="text-zinc-400">Photos</p>
                    <p className="font-semibold text-emerald-400">{user.photoCount}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400">Albums</p>
                    <p className="font-semibold text-emerald-400">{user.albumCount}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-400">Joined</p>
                    <p className="font-semibold text-zinc-100">{user.joinedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead>Albums</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.photoCount}</TableCell>
                  <TableCell>{user.albumCount}</TableCell>
                  <TableCell>{user.joinedAt}</TableCell>
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

