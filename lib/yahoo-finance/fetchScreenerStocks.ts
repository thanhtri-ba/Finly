import { unstable_noStore as noStore } from "next/cache"
import type { PredefinedScreenerModules } from "@/types/yahoo-finance"

const ITEMS_PER_PAGE = 40

export async function fetchScreenerStocks(query: string, count?: number) {
  noStore()

  // Create mock quotes for screener
  const allMockQuotes = [
    // Technology (High Growth)
    { symbol: 'AAPL', shortName: 'Apple Inc.', regularMarketPrice: 173.72, regularMarketChange: 1.2, regularMarketChangePercent: 0.7, marketCap: 2600000000000, regularMarketVolume: 50000000, averageDailyVolume3Month: 55000000, epsTrailingTwelveMonths: 6.43, sector: "Technology" },
    { symbol: 'MSFT', shortName: 'Microsoft Corp.', regularMarketPrice: 417.32, regularMarketChange: 5.4, regularMarketChangePercent: 1.3, marketCap: 3100000000000, regularMarketVolume: 25000000, averageDailyVolume3Month: 28000000, epsTrailingTwelveMonths: 11.06, sector: "Technology" },
    { symbol: 'GOOGL', shortName: 'Alphabet Inc.', regularMarketPrice: 148.48, regularMarketChange: -0.5, regularMarketChangePercent: -0.3, marketCap: 1800000000000, regularMarketVolume: 30000000, averageDailyVolume3Month: 32000000, epsTrailingTwelveMonths: 5.80, sector: "Technology" },
    { symbol: 'NVDA', shortName: 'NVIDIA Corp.', regularMarketPrice: 878.32, regularMarketChange: 15.2, regularMarketChangePercent: 1.76, marketCap: 2200000000000, regularMarketVolume: 45000000, averageDailyVolume3Month: 48000000, epsTrailingTwelveMonths: 11.93, sector: "Technology" },
    { symbol: 'AMD', shortName: 'Adv. Micro Devices', regularMarketPrice: 180.45, regularMarketChange: 3.2, regularMarketChangePercent: 1.8, marketCap: 290000000000, regularMarketVolume: 65000000, averageDailyVolume3Month: 70000000, epsTrailingTwelveMonths: 2.65, sector: "Technology" },
    
    // Consumer Cyclical (Growth/Large Cap)
    { symbol: 'AMZN', shortName: 'Amazon.com Inc.', regularMarketPrice: 178.22, regularMarketChange: 2.1, regularMarketChangePercent: 1.1, marketCap: 1850000000000, regularMarketVolume: 35000000, averageDailyVolume3Month: 40000000, epsTrailingTwelveMonths: 2.90, sector: "Consumer Cyclical" },
    { symbol: 'TSLA', shortName: 'Tesla Inc.', regularMarketPrice: 175.34, regularMarketChange: -3.2, regularMarketChangePercent: -1.8, marketCap: 550000000000, regularMarketVolume: 90000000, averageDailyVolume3Month: 95000000, epsTrailingTwelveMonths: 3.12, sector: "Consumer Cyclical" },
    
    // Communication Services
    { symbol: 'META', shortName: 'Meta Platforms', regularMarketPrice: 497.37, regularMarketChange: 4.5, regularMarketChangePercent: 0.9, marketCap: 1200000000000, regularMarketVolume: 15000000, averageDailyVolume3Month: 18000000, epsTrailingTwelveMonths: 14.87, sector: "Communication Services" },
    { symbol: 'NFLX', shortName: 'Netflix Inc.', regularMarketPrice: 605.20, regularMarketChange: -5.4, regularMarketChangePercent: -0.9, marketCap: 260000000000, regularMarketVolume: 4000000, averageDailyVolume3Month: 4500000, epsTrailingTwelveMonths: 12.03, sector: "Communication Services" },

    // Financials (Value/Large Cap)
    { symbol: 'JPM', shortName: 'JPMorgan Chase', regularMarketPrice: 195.43, regularMarketChange: 1.2, regularMarketChangePercent: 0.6, marketCap: 560000000000, regularMarketVolume: 9000000, averageDailyVolume3Month: 10000000, epsTrailingTwelveMonths: 16.00, sector: "Financial Services" },
    { symbol: 'BAC', shortName: 'Bank of America', regularMarketPrice: 36.50, regularMarketChange: 0.15, regularMarketChangePercent: 0.4, marketCap: 280000000000, regularMarketVolume: 35000000, averageDailyVolume3Month: 38000000, epsTrailingTwelveMonths: 3.40, sector: "Financial Services" },
    { symbol: 'V', shortName: 'Visa Inc.', regularMarketPrice: 280.15, regularMarketChange: -1.1, regularMarketChangePercent: -0.4, marketCap: 570000000000, regularMarketVolume: 5000000, averageDailyVolume3Month: 6000000, epsTrailingTwelveMonths: 8.50, sector: "Financial Services" },

    // Healthcare
    { symbol: 'JNJ', shortName: 'Johnson & Johnson', regularMarketPrice: 155.20, regularMarketChange: -0.5, regularMarketChangePercent: -0.3, marketCap: 370000000000, regularMarketVolume: 6000000, averageDailyVolume3Month: 7000000, epsTrailingTwelveMonths: 5.20, sector: "Healthcare" },
    { symbol: 'LLY', shortName: 'Eli Lilly', regularMarketPrice: 760.45, regularMarketChange: 12.5, regularMarketChangePercent: 1.6, marketCap: 720000000000, regularMarketVolume: 3000000, averageDailyVolume3Month: 3500000, epsTrailingTwelveMonths: 6.80, sector: "Healthcare" },

    // Energy
    { symbol: 'XOM', shortName: 'Exxon Mobil', regularMarketPrice: 115.30, regularMarketChange: 2.1, regularMarketChangePercent: 1.8, marketCap: 450000000000, regularMarketVolume: 15000000, averageDailyVolume3Month: 18000000, epsTrailingTwelveMonths: 9.50, sector: "Energy" },
    
    // Consumer Defensive
    { symbol: 'WMT', shortName: 'Walmart Inc.', regularMarketPrice: 60.50, regularMarketChange: 0.3, regularMarketChangePercent: 0.5, marketCap: 480000000000, regularMarketVolume: 12000000, averageDailyVolume3Month: 14000000, epsTrailingTwelveMonths: 2.20, sector: "Consumer Defensive" },
    { symbol: 'KO', shortName: 'Coca-Cola Co.', regularMarketPrice: 59.80, regularMarketChange: -0.2, regularMarketChangePercent: -0.3, marketCap: 250000000000, regularMarketVolume: 10000000, averageDailyVolume3Month: 12000000, epsTrailingTwelveMonths: 2.50, sector: "Consumer Defensive" },
  ];

  // Simple filtering based on query
  let filteredQuotes = [...allMockQuotes];

  if (query.includes("technology") || query.includes("growth")) {
    filteredQuotes = allMockQuotes.filter(q => q.sector === "Technology" || q.sector === "Communication Services" || q.sector === "Consumer Cyclical");
  } else if (query.includes("undervalued") || query.includes("value") || query.includes("large_caps")) {
    filteredQuotes = allMockQuotes.filter(q => q.marketCap > 200000000000); // Large cap
  } else if (query.includes("gainers")) {
    filteredQuotes = allMockQuotes.filter(q => q.regularMarketChangePercent > 0).sort((a, b) => b.regularMarketChangePercent - a.regularMarketChangePercent);
  } else if (query.includes("losers")) {
    filteredQuotes = allMockQuotes.filter(q => q.regularMarketChangePercent < 0).sort((a, b) => a.regularMarketChangePercent - b.regularMarketChangePercent);
  } else if (query.includes("small_caps")) {
    // We don't have many small caps in mock, just pick bottom 5 by market cap
    filteredQuotes = [...allMockQuotes].sort((a, b) => a.marketCap - b.marketCap).slice(0, 5);
  } else if (query.includes("foreign")) {
     // Mock some foreign behavior by picking random
     filteredQuotes = allMockQuotes.filter((_, i) => i % 3 === 0);
  }

  // Default or fallback: return a reasonable subset if filter returns nothing
  if (filteredQuotes.length === 0) filteredQuotes = allMockQuotes;

  const mockQuotes = filteredQuotes;

  // Return mock result with data
  return {
    id: query,
    title: "Market",
    description: "Market Screener (Demo Data)",
    canonicalName: "market",
    criteriaMeta: {
      size: mockQuotes.length,
      offset: 0,
      limit: count || ITEMS_PER_PAGE,
      sortField: "percent_change",
      sortType: "DESC",
      quoteType: "EQUITY",
      topOperator: "AND",
    },
    rawCriteria: "[]",
    total: mockQuotes.length,
    quotes: mockQuotes,
  } as any
}
