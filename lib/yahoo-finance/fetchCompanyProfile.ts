import { unstable_noStore as noStore } from "next/cache"

export async function fetchCompanyProfile(ticker: string) {
  noStore()

  // Fallback Mock Data
  return {
    summaryProfile: {
      longBusinessSummary: `This is a placeholder description for ${ticker}. We are currently unable to fetch the real-time company profile. The company likely operates in a major industry and has significant market presence.`,
      sector: "Technology",
      industryDisp: "Software - Infrastructure",
      country: "United States",
      fullTimeEmployees: 100000,
      website: "https://example.com",
    }
  }
}
