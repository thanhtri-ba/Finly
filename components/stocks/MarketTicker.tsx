import Marquee from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

export default async function MarketTicker() {
  const symbols = ["^GSPC", "^DJI", "^IXIC", "BTC-USD", "EURUSD=X", "GC=F", "CL=F", "NVDA", "AAPL", "MSFT"]
  
  // Mock data
  const quotes = [
     { symbol: "^GSPC", shortName: "S&P 500", regularMarketPrice: 5200.00, regularMarketChangePercent: 0.5 },
     { symbol: "^DJI", shortName: "Dow Jones", regularMarketPrice: 39000.00, regularMarketChangePercent: 0.2 },
     { symbol: "^IXIC", shortName: "Nasdaq", regularMarketPrice: 16300.00, regularMarketChangePercent: 0.8 },
     { symbol: "BTC-USD", shortName: "Bitcoin", regularMarketPrice: 70000.00, regularMarketChangePercent: 1.5 },
     { symbol: "EURUSD=X", shortName: "EUR/USD", regularMarketPrice: 1.08, regularMarketChangePercent: -0.1 },
     { symbol: "GC=F", shortName: "Gold", regularMarketPrice: 2350.00, regularMarketChangePercent: 1.2 },
     { symbol: "CL=F", shortName: "Crude Oil", regularMarketPrice: 85.00, regularMarketChangePercent: 0.5 },
     { symbol: "NVDA", shortName: "NVIDIA", regularMarketPrice: 880.00, regularMarketChangePercent: 2.5 },
     { symbol: "AAPL", shortName: "Apple", regularMarketPrice: 175.00, regularMarketChangePercent: 0.8 },
     { symbol: "MSFT", shortName: "Microsoft", regularMarketPrice: 420.00, regularMarketChangePercent: 1.1 },
  ]

  if (!quotes || quotes.length === 0) return null

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm border-b z-40">
      <Marquee pauseOnHover className="[--duration:40s]">
        {quotes.map((quote) => (
          <div key={quote.symbol} className="flex items-center space-x-2 px-6 border-r border-border/50 last:border-r-0">
             <span className="font-semibold text-sm">{quote.shortName || quote.symbol}</span>
             <span className={cn("text-sm font-mono", (quote.regularMarketChangePercent || 0) >= 0 ? "text-green-500" : "text-red-500")}>
               {quote.regularMarketPrice?.toFixed(2)}
             </span>
             <span className={cn("text-xs", (quote.regularMarketChangePercent || 0) >= 0 ? "text-green-500" : "text-red-500")}>
               {(quote.regularMarketChangePercent || 0) > 0 ? "+" : ""}
               {quote.regularMarketChangePercent?.toFixed(2)}%
             </span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
