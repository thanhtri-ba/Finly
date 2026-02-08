import { SectorPerformanceChart } from "./SectorPerformanceChart"

interface Sector {
  sector: string
  changesPercentage: string
}

export default async function SectorPerformance() {
  // Mock data directly, removing API call
  const data = [
    { sector: "Technology", changesPercentage: "2.15" },
    { sector: "Communication Services", changesPercentage: "1.74" },
    { sector: "Consumer Defensive", changesPercentage: "0.87" },
    { sector: "Financials", changesPercentage: "0.61" },
    { sector: "Industrials", changesPercentage: "1.07" },
    { sector: "Materials", changesPercentage: "1.52" },
    { sector: "Consumer Cyclical", changesPercentage: "1.16" },
    { sector: "Energy", changesPercentage: "1.47" },
    { sector: "Health Care", changesPercentage: "0.96" },
    { sector: "Utilities", changesPercentage: "3.44" },
    { sector: "Real Estate", changesPercentage: "-0.45" },
  ]

  return (
    <div className="w-full">
      <SectorPerformanceChart data={data} />
    </div>
  )
}
