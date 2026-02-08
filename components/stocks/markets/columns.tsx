"use client"

import { ColumnDef } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import Link from "next/link"

export type Quote = {
  symbol: string
  shortName?: string
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
}

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "shortName",
    header: "Symbol/Name",
    cell: (props) => {
      const { row } = props
      const title = row.getValue("shortName") as string
      const symbol = row.original.symbol

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="flex flex-col group"
        >
          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</span>
          <span className="text-xs text-muted-foreground font-mono">{symbol}</span>
        </Link>
      )
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
      const { row } = props
      const price = row.getValue("regularMarketPrice") as number
      return <div className="text-right font-mono font-medium">{price?.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "regularMarketChange",
    header: () => <div className="text-right">$ Change</div>,
    cell: (props) => {
      const { row } = props
      const change = row.getValue("regularMarketChange") as number
      return (
        <div
          className={cn(
            "text-right font-mono",
            change < 0 ? "text-red-500" : "text-green-500"
          )}
        >
          {change > 0 ? "+" : ""}
          {change?.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketChangePercent",
    header: () => <div className="text-right">% Change</div>,
    cell: (props) => {
      const { row } = props
      const changePercent = row.getValue("regularMarketChangePercent") as number
      const isPositive = changePercent >= 0
      
      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "flex w-[4.5rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold",
              isPositive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {isPositive ? "+" : ""}
            {changePercent?.toFixed(2)}%
          </div>
        </div>
      )
    },
  },
]
