import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navigation from "@/components/ui/navigation"

import { Suspense } from "react"
import MarketTicker from "@/components/stocks/MarketTicker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finly: Stock Quotes, Market News, & Analysis",
  description:
    "Finly is a source of free stock quotes, business and finance news, portfolio management tools, and international market data.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen bg-background pb-6 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <Suspense fallback={<div className="h-10 w-full border-b bg-background" />}>
              <MarketTicker />
            </Suspense>
            <main className="container mt-6 min-h-[calc(100vh-200px)]">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
