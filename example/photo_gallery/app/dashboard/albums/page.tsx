"use client"

import { Button } from "@/components/ui/button"
import { ContentHeader } from "@/components/content-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Albums() {
  // This would typically fetch albums from the API
  const albums = [
    { id: 1, title: "Summer Vacation", user: "john_doe", photoCount: 25, createdAt: "2023-06-15" },
    { id: 2, title: "Family Reunion", user: "jane_smith", photoCount: 50, createdAt: "2023-07-22" },
    { id: 3, title: "Nature Walks", user: "alex_johnson", photoCount: 30, createdAt: "2023-08-05" },
  ]

  return (
    <div className="-m-8">
      <ContentHeader title="Albums" />
      <div className="p-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Button>Create New Album</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
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
        </div>
      </div>
    </div>
  )
}

