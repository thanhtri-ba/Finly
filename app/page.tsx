import { DataTable } from "@/components/stocks/markets/data-table"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import { Interval } from "@/types/yahoo-finance"
import { Suspense } from "react"
import MarketsChart from "@/components/chart/MarketsChart"
import Link from "next/link"
import Image from "next/image"
import { columns } from "@/components/stocks/markets/columns"
import SectorPerformance from "@/components/stocks/SectorPerformance"
import MarketMovers from "@/components/stocks/MarketMovers"
import {
  validateInterval,
  validateRange,
} from "@/lib/yahoo-finance/fetchChartData"
import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"
import { TrendingUp, TrendingDown, Newspaper, Activity, BarChart3, ArrowRight } from "lucide-react"

function isMarketOpen() {
  const now = new Date()

  // Convert to New York time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }
  const formatter = new Intl.DateTimeFormat([], options)

  const timeString = formatter.format(now)
  const [hour, minute] = timeString.split(":").map(Number)
  const timeInET = hour + minute / 60

  // Get the day of the week in New York time
  const dayInET = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getDay()

  // Check if the current time is between 9:30 AM and 4:00 PM ET on a weekday
  if (dayInET >= 1 && dayInET <= 5 && timeInET >= 9.5 && timeInET < 16) {
    return true
  } else {
    return false
  }
}

const tickersFutures = [
  { symbol: "ES=F", shortName: "S&P 500 Futures" },
  { symbol: "NQ=F", shortName: "NASDAQ Futures" },
  { symbol: "YM=F", shortName: "Dow Jones Futures" },
  { symbol: "RTY=F", shortName: "Russell 2000 Futures" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

const tickerAfterOpen = [
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "NASDAQ" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "^RUT", shortName: "Russell 2000" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

function getMarketSentiment(changePercentage: number | undefined) {
  if (!changePercentage) {
    return "neutral"
  }
  if (changePercentage > 0.1) {
    return "bullish"
  } else if (changePercentage < -0.1) {
    return "bearish"
  } else {
    return "neutral"
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}) {
  const tickers = isMarketOpen() ? tickerAfterOpen : tickersFutures

  const ticker = searchParams?.ticker || tickers[0].symbol
  const range = validateRange(searchParams?.range || DEFAULT_RANGE)
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_INTERVAL
  )
  const news = await fetchStockSearch("^DJI", 5)

  const promises = tickers.map(async ({ symbol }) => {
    try {
      return await fetchQuote(symbol)
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}`, error)
      return {
        symbol,
        regularMarketPrice: 0,
        regularMarketChange: 0,
        regularMarketChangePercent: 0,
        currency: 'USD',
      }
    }
  })
  const results = (await Promise.all(promises)) as any[]

  const resultsWithTitles = results.map((result, index) => ({
    ...result,
    shortName: tickers[index].shortName,
  }))

  const marketSentiment = getMarketSentiment(
    resultsWithTitles[0].regularMarketChangePercent
  )

  const sentimentColor =
    marketSentiment === "bullish"
      ? "text-green-500"
      : marketSentiment === "bearish"
        ? "text-red-500"
        : "text-neutral-500"

  const sentimentIcon = 
    marketSentiment === "bullish" 
      ? <TrendingUp className="h-5 w-5 text-green-500" />
      : marketSentiment === "bearish"
        ? <TrendingDown className="h-5 w-5 text-red-500" />
        : <Activity className="h-5 w-5 text-neutral-500" />

  // Top 4 indices for Key Metrics
  const keyIndices = resultsWithTitles.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 w-fit">
          Market Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of global markets, trends, and latest news.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {keyIndices.map((index) => (
          <Card key={index.symbol}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {index.shortName}
              </CardTitle>
              {index.regularMarketChangePercent >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{index.regularMarketPrice?.toFixed(2)}</div>
              <p className={`text-xs ${index.regularMarketChangePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                {index.regularMarketChange > 0 ? "+" : ""}
                {index.regularMarketChange?.toFixed(2)} ({index.regularMarketChangePercent?.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Chart & Table) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{ticker}</CardTitle>
                  <CardDescription>
                    Historical price data and performance
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <MarketsChart ticker={ticker} range={range} interval={interval} />
            </CardContent>
          </Card>

          {/* Markets Data Table */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" /> Market Data
              </h2>
            </div>
            <Card>
              <Suspense fallback={<div className="p-8 text-center">Loading data...</div>}>
                <DataTable columns={columns} data={resultsWithTitles} />
              </Suspense>
            </Card>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="flex flex-col gap-6">
          {/* Market Sentiment & Movers */}
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Market Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-lg">
                  The markets are <strong className={`flex items-center gap-1 ${sentimentColor}`}>
                    {marketSentiment} {sentimentIcon}
                  </strong>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on the performance of {resultsWithTitles[0].shortName} today.
                </p>
              </CardContent>
            </Card>

            <Suspense fallback={<div>Loading movers...</div>}>
              <MarketMovers />
            </Suspense>
          </div>

          {/* News Feed */}
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" /> Latest News
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-col gap-4">
                {news.news.map((item: any, i: number) => {
                  const imageUrl = item.thumbnail?.resolutions?.[0]?.url
                  return (
                    <Link
                      key={i}
                      prefetch={false}
                      href={item.link}
                      className="group flex flex-row gap-3 items-start rounded-lg p-2 -mx-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      {imageUrl && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800">
                          <Image
                            src={imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold group-hover:underline line-clamp-2 leading-tight">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.publisher} • {new Date(item.providerPublishTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-sm text-primary flex items-center gap-1 hover:underline w-full justify-center">
                View all news <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* Sector Performance (Optional, small version) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sector Performance</CardTitle>
            </CardHeader>
            <CardContent>
               <Suspense fallback={<div>Loading sectors...</div>}>
                 <SectorPerformance />
               </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
