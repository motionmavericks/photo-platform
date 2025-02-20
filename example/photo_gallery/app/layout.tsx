"use client"

import { useState, type ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import "./custom-scrollbar.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PhotoProvider } from "@/context/PhotoContext"
import { Sidebar } from "@/components/layout/sidebar"
import { TagsSidebar } from "@/components/layout/tags-sidebar"
import { Header } from "@/components/layout/header"
import { ErrorBoundary } from "@/components/shared/error-boundary"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen)
  const toggleRightSidebar = () => setRightSidebarOpen(!rightSidebarOpen)

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <PhotoProvider>
            <ErrorBoundary>
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
                    {React.Children.map(children, (child) =>
                      React.isValidElement(child)
                        ? React.cloneElement(child as React.ReactElement<any>, {
                            leftSidebarOpen,
                            toggleLeftSidebar,
                            rightSidebarOpen,
                            toggleRightSidebar,
                          })
                        : child,
                    )}
                  </main>
                  <TagsSidebar
                    className={`z-40 w-64 flex-shrink-0 transition-all duration-300 ease-in-out transform ${
                      rightSidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                  />
                </div>
              </div>
            </ErrorBoundary>
          </PhotoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
