"use client"

import React, { useState, createContext, useContext } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { TagsSidebar } from "@/components/layout/tags-sidebar"

interface LayoutContextType {
  rightSidebarOpen: boolean
  toggleRightSidebar: () => void
}

const LayoutContext = createContext<LayoutContextType>({
  rightSidebarOpen: true,
  toggleRightSidebar: () => {},
})

export const useLayout = () => useContext(LayoutContext)

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen)

  const layoutValue = {
    rightSidebarOpen,
    toggleRightSidebar: () => setRightSidebarOpen(!rightSidebarOpen),
  }

  return (
    <LayoutContext.Provider value={layoutValue}>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header className="z-50" toggleLeftSidebar={toggleLeftSidebar} />
        <div className="flex flex-1 overflow-hidden pt-16">
          <Sidebar
            className={`z-40 w-64 flex-shrink-0 transition-all duration-300 ease-in-out transform ${
              leftSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          />
          <main
            className={`flex-1 overflow-hidden bg-background transition-all duration-300 ease-in-out
              ${leftSidebarOpen ? "ml-64" : "ml-0"}
              ${rightSidebarOpen ? "mr-64" : "mr-0"}
            `}
          >
            {children}
          </main>
          <TagsSidebar
            className={`z-40 w-64 flex-shrink-0 transition-all duration-300 ease-in-out transform ${
              rightSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          />
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
