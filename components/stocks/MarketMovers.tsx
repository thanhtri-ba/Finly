import { fetchScreenerStocks } from "@/lib/yahoo-finance/fetchScreenerStocks"
import MarketMoversClient from "./MarketMoversClient"

export default async function MarketMovers() {
  const [gainersData, losersData, activesData] = await Promise.all([
    fetchScreenerStocks("day_gainers", 5),
    fetchScreenerStocks("day_losers", 5),
    fetchScreenerStocks("most_actives", 5),
  ])

  // Extract quotes or default to empty array
  const gainers = gainersData?.quotes || []
  const losers = losersData?.quotes || []
  const actives = activesData?.quotes || []

  return (
    <MarketMoversClient
      gainers={gainers}
      losers={losers}
      actives={actives}
    />
  )
}
