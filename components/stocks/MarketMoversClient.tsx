"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Stock {
  symbol: string
  shortName: string
  regularMarketPrice: number
  regularMarketChange: number
  regularMarketChangePercent: number
}

interface MarketMoversClientProps {
  gainers: Stock[]
  losers: Stock[]
  actives: Stock[]
}

export default function MarketMoversClient({
  gainers,
  losers,
  actives,
}: MarketMoversClientProps) {
  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "actives">(
    "gainers"
  )

  const getData = () => {
    switch (activeTab) {
      case "gainers":
        return gainers
      case "losers":
        return losers
      case "actives":
        return actives
      default:
        return []
    }
  }

  const data = getData()

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Market Movers</CardTitle>
          <div className="flex space-x-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTab("gainers")}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-all",
                activeTab === "gainers"
                  ? "bg-white text-green-600 shadow-sm dark:bg-neutral-950 dark:text-green-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
            >
              Gainers
            </button>
            <button
              onClick={() => setActiveTab("losers")}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-all",
                activeTab === "losers"
                  ? "bg-white text-red-600 shadow-sm dark:bg-neutral-950 dark:text-red-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
            >
              Losers
            </button>
            <button
              onClick={() => setActiveTab("actives")}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-all",
                activeTab === "actives"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-950 dark:text-blue-400"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              )}
            >
              Active
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.slice(0, 5).map((stock) => (
            <Link
              key={stock.symbol}
              href={`/?ticker=${stock.symbol}`}
              className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <div>
                <div className="font-bold">{stock.symbol}</div>
                <div className="text-xs text-neutral-500 truncate max-w-[150px]">
                  {stock.shortName}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {stock.regularMarketPrice.toFixed(2)}
                </div>
                <div
                  className={cn(
                    "text-xs font-medium",
                    stock.regularMarketChange >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {stock.regularMarketChange > 0 ? "+" : ""}
                  {stock.regularMarketChange.toFixed(2)} (
                  {stock.regularMarketChangePercent.toFixed(2)}%)
                </div>
              </div>
            </Link>
          ))}
          {data.length === 0 && (
            <div className="text-center text-sm text-neutral-500">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
