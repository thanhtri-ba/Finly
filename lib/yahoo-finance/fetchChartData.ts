import { unstable_noStore as noStore } from "next/cache"
import type { Interval, Range } from "@/types/yahoo-finance"
import { DEFAULT_RANGE, INTERVALS_FOR_RANGE, VALID_RANGES } from "./constants"

export const validateRange = (range: string): Range =>
  VALID_RANGES.includes(range as Range) ? (range as Range) : DEFAULT_RANGE

export const validateInterval = (range: Range, interval: Interval): Interval =>
  INTERVALS_FOR_RANGE[range].includes(interval)
    ? interval
    : INTERVALS_FOR_RANGE[range][0]

export async function fetchChartData(
  ticker: string,
  range: Range,
  interval: Interval
) {
  noStore()

  // Generate mock chart data with Random Walk
  const now = new Date();
  const mockQuotes = [];
  let currentPrice = 150.0;
  
  // Create realistic looking random walk data
  for (let i = 0; i < 100; i++) {
    const date = new Date(now.getTime() - (100 - i) * 60 * 60 * 1000); // Hourly points
    
    // Random walk step: -1% to +1% change
    const changePercent = (Math.random() - 0.5) * 0.02; 
    currentPrice = currentPrice * (1 + changePercent);
    
    mockQuotes.push({
      date,
      high: currentPrice * (1 + Math.random() * 0.005),
      low: currentPrice * (1 - Math.random() * 0.005),
      open: currentPrice * (1 + (Math.random() - 0.5) * 0.005),
      close: currentPrice,
      volume: Math.floor(1000000 + Math.random() * 500000),
      adjClose: currentPrice,
    });
  }

  // Return mock data
  return {
    meta: {
      currency: "USD",
      symbol: ticker,
      regularMarketPrice: currentPrice,
      previousClose: mockQuotes[0].close,
      exchangeName: "NAS",
      instrumentType: "EQUITY",
    },
    quotes: mockQuotes,
  } as any
}
