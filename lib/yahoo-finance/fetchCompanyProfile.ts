import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import { getFMPCompanyProfile } from "@/lib/fmp-helper"

export async function fetchCompanyProfile(ticker: string) {
  noStore()

  // Try FMP API first
  if (process.env.FMP_API_KEY) {
    const fmpProfile = await getFMPCompanyProfile(ticker)
    if (fmpProfile) return fmpProfile
  }

  try {
    const data = await yahooFinance.quoteSummary(ticker, {
      modules: ["summaryProfile"],
    })
    return data
  } catch (error) {
    console.error("Failed to fetch company profile", error)
    
    // Fallback Mock Data
    return {
      summaryProfile: {
        longBusinessSummary: `This is a placeholder description for ${ticker}. We are currently unable to fetch the real-time company profile. The company likely operates in a major industry and has significant market presence.`,
        sector: "Unknown Sector",
        industryDisp: "Unknown Industry",
        country: "Unknown Country",
        fullTimeEmployees: 0,
        website: "https://example.com",
      }
    }
  }
}
