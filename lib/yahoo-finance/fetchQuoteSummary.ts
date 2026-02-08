import { unstable_noStore as noStore } from "next/cache"

export async function fetchQuoteSummary(ticker: string) {
  noStore()

  // Return mock data to prevent crash
  return {
    summaryDetail: {
      open: 148.0,
      dayHigh: 152.0,
      dayLow: 147.5,
      volume: 50000000,
      marketCap: 2500000000000,
      fiftyTwoWeekHigh: 180.0,
      fiftyTwoWeekLow: 130.0,
      averageVolume: 48000000,
      dividendYield: 0.005,
      beta: 1.1,
      trailingPE: 28.5,
    },
    defaultKeyStatistics: {
      trailingEps: 5.2,
    },
  } as any
}
