"use client"

import { useState, useEffect } from "react"
import { marketDataService, type StockQuote } from "@/lib/market-apis"

export function useMarketData(symbols: string[], refreshInterval = 60000) {
  const [quotes, setQuotes] = useState<StockQuote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchQuotes = async () => {
    try {
      setError(null)
      const promises = symbols.map((symbol) => marketDataService.getStockQuote(symbol))
      const results = await Promise.all(promises)
      const validQuotes = results.filter(Boolean) as StockQuote[]
      setQuotes(validQuotes)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch market data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (symbols.length > 0) {
      fetchQuotes()
      const interval = setInterval(fetchQuotes, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [symbols, refreshInterval])

  return {
    quotes,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchQuotes,
  }
}
