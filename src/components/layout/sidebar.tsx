"use client"

import Link from "next/link"
import { Image, Album, Users, Tag, Heart, LogOut, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import type React from "react"
import { useState } from "react"

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  count?: number
  variant?: "default" | "secondary" | "success"
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null)

  // Fetch counts from Supabase
  const { data: photosCount = { count: 0 } } = useQuery({
    queryKey: ["photos-count"],
    queryFn: async () => {
      const response = await fetch("/api/photos/count")
      if (!response.ok) throw new Error("Failed to fetch photos count")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: albumsCount = { count: 0 } } = useQuery({
    queryKey: ["albums-count"],
    queryFn: async () => {
      const response = await fetch("/api/albums/count")
      if (!response.ok) throw new Error("Failed to fetch albums count")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: tagsCount = { count: 0 } } = useQuery({
    queryKey: ["tags-count"],
    queryFn: async () => {
      const response = await fetch("/api/tags/count")
      if (!response.ok) throw new Error("Failed to fetch tags count")
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const menuSections: MenuSection[] = [
    {
      title: "HOME",
      items: [
        {
          icon: Image,
          label: "All Photos",
          href: "/",
          count: photosCount?.count || 0,
          variant: "success",
        },
      ],
    },
    {
      title: "LIBRARY",
      items: [
        {
          icon: Album,
          label: "Albums",
          href: "/albums",
          count: albumsCount?.count || 0,
          variant: "secondary",
        },
        {
          icon: Tag,
          label: "Tags",
          href: "/tags",
          count: tagsCount?.count || 0,
          variant: "secondary",
        },
      ],
    },
    {
      title: "MANAGE",
      items: [
        {
          icon: Users,
          label: "Users",
          href: "/users",
          count: 0,
          variant: "secondary",
        },
        {
          icon: Heart,
          label: "Favorites",
          href: "/favorites",
          count: 0,
          variant: "secondary",
        },
      ],
    },
  ]

  return (
    <div
      className={`fixed top-16 left-0 bottom-0 w-64 bg-zinc-950 flex flex-col overflow-y-auto border-r border-zinc-800 ${className}`}
    >
      <div className="flex-1 py-6">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-6 px-3">
            <h3 className="mb-2 px-3 text-xs font-semibold text-zinc-400">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors relative ${
                    draggedOverItem === item.label ? "bg-emerald-600 text-white" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDraggedOverItem(item.label)
                  }}
                  onDragLeave={() => setDraggedOverItem(null)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDraggedOverItem(null)
                    // Handle the drop event here (e.g., add to favorites)
                    if (item.label === "Favorites") {
                      const droppedPhoto = JSON.parse(e.dataTransfer.getData("application/json"))
                      console.log("Photo dropped into Favorites:", droppedPhoto)
                      // Implement your logic to add the photo to favorites
                    }
                  }}
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-3" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count !== "undefined" && (
                    <Badge
                      variant={item.variant === "success" ? "default" : "secondary"}
                      className={
                        item.variant === "success"
                          ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                          : "bg-zinc-800 hover:bg-zinc-800 text-zinc-400"
                      }
                    >
                      {item.count}
                    </Badge>
                  )}
                  {draggedOverItem === item.label && (
                    <Plus className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <button className="flex items-center w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors">
          <LogOut className="w-4 h-4 mr-3" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}
