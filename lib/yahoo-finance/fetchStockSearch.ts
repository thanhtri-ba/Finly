import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import { SearchResult } from "@/types/yahoo-finance"
import { getFMPSearch } from "@/lib/fmp-helper"

export async function fetchStockSearch(query: string) {
  noStore()

  // Try FMP API first if key is available
  if (process.env.FMP_API_KEY) {
    const fmpSearch = await getFMPSearch(query)
    if (fmpSearch) return fmpSearch as SearchResult
  }

  try {
    const response = await yahooFinance.search(query)
    return response
  } catch (error) {
    console.error("Failed to fetch stock search", error)
    return {
      explains: [],
      count: 2,
      quotes: [
        { symbol: 'AAPL', shortname: 'Apple Inc.', exchange: 'NAS', isYahooFinance: true },
        { symbol: 'MSFT', shortname: 'Microsoft Corp.', exchange: 'NAS', isYahooFinance: true },
      ],
      news: [
        {
          uuid: '1',
          title: "Market Rally Continues as Tech Sector Leads Gains",
          publisher: 'Financial News',
          link: '#',
          providerPublishTime: new Date(),
          thumbnail: {
             resolutions: [
               { url: 'https://via.placeholder.com/150', width: 150, height: 150, tag: 'original' }
             ]
          }
        },
        {
          uuid: '2',
          title: "Analysts Upgrade Outlook for Major Tech Stocks",
          publisher: 'Market Watch',
          link: '#',
          providerPublishTime: new Date(Date.now() - 3600000),
          thumbnail: {
             resolutions: [
               { url: 'https://via.placeholder.com/150', width: 150, height: 150, tag: 'original' }
             ]
          }
        }
      ],
      nav: [],
      lists: [],
      researchReports: [],
      screenerFieldResults: [],
      totalTime: 0,
      timeTakenForQuotes: 0,
      timeTakenForNews: 0,
      timeTakenForAlgowatchlist: 0,
      timeTakenForPredefinedScreener: 0,
      timeTakenForCrunchbase: 0,
      timeTakenForNav: 0,
      timeTakenForResearchReports: 0,
      timeTakenForScreenerFieldResults: 0,
      timeTakenForCulturalAssets: 0,
    }
  }
}
