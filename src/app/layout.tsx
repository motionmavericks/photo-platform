import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./custom-scrollbar.css"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { ReactQueryProvider } from "@/components/react-query-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { PhotoProvider } from "@/context/photo-context"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { RootLayoutClient } from "./layout.client"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "A modern photo gallery built with Next.js and Supabase",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
              <PhotoProvider>
                <ErrorBoundary>
                  <RootLayoutClient>{children}</RootLayoutClient>
                </ErrorBoundary>
              </PhotoProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
