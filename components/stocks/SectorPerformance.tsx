import { cn } from "@/lib/utils"

async function fetchSectorPerformance() {
  const url = `https://financialmodelingprep.com/api/v3/sector-performance?apikey=${process.env.FMP_API_KEY}`
  const options = {
    method: "GET",
    next: {
      revalidate: 3600,
    },
  }
  const res = await fetch(url, options)

  if (!res.ok) {
    // throw new Error("Failed to fetch sector performance")
    return []
  }
  return res.json()
}

interface Sector {
  sector: string
  changesPercentage: string
}

export default async function SectorPerformance() {
  let data
  try {
    data = (await fetchSectorPerformance()) as Sector[]
  } catch (e) {
    console.error(e)
    data = []
  }
  
  if (!data || data.length === 0) {
    // Return mock data if fetch fails
    data = [
      { sector: "Communication Services", changesPercentage: "1.74" },
      { sector: "Consumer Defensive", changesPercentage: "0.87" },
      { sector: "Financials", changesPercentage: "0.61" },
      { sector: "Industrials", changesPercentage: "1.07" },
      { sector: "Materials", changesPercentage: "1.52" },
      { sector: "Consumer Cyclical", changesPercentage: "1.16" },
      { sector: "Energy", changesPercentage: "1.47" },
      { sector: "Health Care", changesPercentage: "0.96" },
      { sector: "Utilities", changesPercentage: "3.44" },
    ]
  }

  const totalChangePercentage = data.reduce((total, sector) => {
    return total + parseFloat(sector.changesPercentage)
  }, 0)

  const averageChangePercentage =
    (totalChangePercentage / data.length).toFixed(2) + "%"

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  }
  data.unshift(allSectors)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {data.map((sector: Sector) => (
        <div
          key={sector.sector}
          className="flex w-full flex-row items-center justify-between text-sm"
        >
          <span className="font-medium">{sector.sector}</span>
          <span
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
              parseFloat(sector.changesPercentage) > 0
                ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                : "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
            )}
          >
            {parseFloat(sector.changesPercentage).toFixed(2) + "%"}
          </span>
        </div>
      ))}
    </div>
  )
}
