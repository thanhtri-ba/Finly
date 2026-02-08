import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import { Interval, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

export default async function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string
  range: Range
  interval: Interval
}) {
  const chartData = await fetchChartData(ticker, range, interval)
  const quoteData = await fetchQuote(ticker)

  const [chart, quote] = await Promise.all([chartData, quoteData])

  const stockQuotes = chart.quotes
    ? chart.quotes
        .map((quote: any) => ({
          date: quote.date,
          close: quote.close?.toFixed(2),
        }))
        .filter((quote: any) => quote.close !== undefined && quote.date !== null)
    : []

  return (
    <>
      {chart.quotes.length > 0 ? (
        <AreaClosedChart chartQuotes={stockQuotes} range={range} />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
    </>
  )
}
