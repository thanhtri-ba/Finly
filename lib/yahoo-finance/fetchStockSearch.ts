import { unstable_noStore as noStore } from "next/cache"

export async function fetchStockSearch(query: string, newsCount?: number) {
  noStore()

  return {
    explains: [],
    count: 2,
    quotes: [
      { symbol: 'AAPL', shortname: 'Apple Inc.', exchange: 'NAS', isYahooFinance: true },
      { symbol: 'MSFT', shortname: 'Microsoft Corp.', exchange: 'NAS', isYahooFinance: true },
      { symbol: 'GOOGL', shortname: 'Alphabet Inc.', exchange: 'NAS', isYahooFinance: true },
      { symbol: 'NVDA', shortname: 'NVIDIA Corp.', exchange: 'NAS', isYahooFinance: true },
      { symbol: 'AMZN', shortname: 'Amazon.com Inc.', exchange: 'NAS', isYahooFinance: true },
    ].filter(q => q.symbol.toLowerCase().includes(query.toLowerCase()) || q.shortname.toLowerCase().includes(query.toLowerCase())),
    news: [
      {
        uuid: '1',
        title: "Market Rally Continues as Tech Sector Leads Gains",
        publisher: 'Financial News',
        link: '#',
        providerPublishTime: new Date(),
        published_at: new Date().toLocaleDateString(),
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
        published_at: new Date(Date.now() - 3600000).toLocaleDateString(),
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
