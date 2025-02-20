"use client"

import { Search, Bell, Settings, HelpCircle, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ErrorModal } from "@/components/shared/error-modal"
import { useState } from "react"

interface HeaderProps {
  className?: string
  toggleLeftSidebar?: () => void
}

export function Header({ className, toggleLeftSidebar }: HeaderProps) {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const handleFeatureNotImplemented = () => {
    setIsErrorModalOpen(true)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 border-b border-zinc-800 bg-zinc-950 ${className}`}>
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-100 rounded-full"
          onClick={toggleLeftSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 text-zinc-100">
          <span className="flex items-center">
            <span className="text-lg font-semibold">Photo Gallery</span>
          </span>
        </div>

        <div className="flex-1 flex items-center max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search photos by title, album, or tag..."
              className="w-full pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-zinc-700 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 rounded-full"
            onClick={handleFeatureNotImplemented}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 rounded-full"
            onClick={handleFeatureNotImplemented}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100 rounded-full"
            onClick={handleFeatureNotImplemented}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message="This feature is not implemented yet. Check back soon!"
      />
    </header>
  )
}
