"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react"
import { marketDataService, type StockQuote, type CryptoQuote } from "@/lib/market-apis"

export function RealTimeQuotes() {
  const [stockQuotes, setStockQuotes] = useState<StockQuote[]>([])
  const [cryptoQuotes, setCryptoQuotes] = useState<CryptoQuote[]>([])
  const [marketIndices, setMarketIndices] = useState<StockQuote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; type: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Popular stocks to track
  const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"]
  const popularCryptos = ["bitcoin", "ethereum", "binancecoin", "cardano", "solana", "polkadot"]

  useEffect(() => {
    loadInitialData()
    const interval = setInterval(refreshData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)

    // Load stock quotes
    const stockPromises = popularStocks.map((symbol) => marketDataService.getStockQuote(symbol))
    const stockResults = await Promise.all(stockPromises)
    setStockQuotes(stockResults.filter(Boolean) as StockQuote[])

    // Load crypto quotes
    const cryptoPromises = popularCryptos.map((id) => marketDataService.getCryptoQuote(id))
    const cryptoResults = await Promise.all(cryptoPromises)
    setCryptoQuotes(cryptoResults.filter(Boolean) as CryptoQuote[])

    // Load market indices
    const indices = await marketDataService.getMarketIndices()
    setMarketIndices(indices)

    setLastUpdate(new Date())
    setIsLoading(false)
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    const results = await marketDataService.searchStocks(searchQuery)
    setSearchResults(results)
  }

  const addToWatchlist = async (symbol: string) => {
    const quote = await marketDataService.getStockQuote(symbol)
    if (quote && !stockQuotes.find((q) => q.symbol === symbol)) {
      setStockQuotes((prev) => [...prev, quote])
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change: number, isPercent = false) => {
    const formatted = isPercent ? `${change.toFixed(2)}%` : formatPrice(change)
    return change >= 0 ? `+${formatted}` : formatted
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Market Data</h2>
          <p className="text-muted-foreground">Last updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Search Assets</CardTitle>
          <CardDescription>Search for stocks, ETFs, and other securities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map((result) => (
                <div key={result.symbol} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <span className="font-medium">{result.symbol}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{result.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {result.type}
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => addToWatchlist(result.symbol)}>
                    Add to Watchlist
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="stocks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          <TabsTrigger value="indices">Market Indices</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stockQuotes.map((quote) => (
              <Card key={quote.symbol} className="glass-effect">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{quote.symbol}</h3>
                      <p className="text-sm text-muted-foreground truncate">{quote.name}</p>
                    </div>
                    {quote.sector && (
                      <Badge variant="outline" className="text-xs">
                        {quote.sector}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{formatPrice(quote.price)}</div>
                    <div
                      className={`flex items-center text-sm ${quote.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {quote.change >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {formatChange(quote.change)} ({formatChange(quote.changePercent, true)})
                    </div>
                    {quote.volume && (
                      <div className="text-xs text-muted-foreground">Volume: {quote.volume.toLocaleString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crypto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cryptoQuotes.map((quote) => (
              <Card key={quote.symbol} className="glass-effect">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold">{quote.symbol}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{quote.name}</p>
                    </div>
                    <Badge variant="secondary">Crypto</Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{formatPrice(quote.price)}</div>
                    <div
                      className={`flex items-center text-sm ${quote.changePercent24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {quote.changePercent24h >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {formatChange(quote.changePercent24h, true)} (24h)
                    </div>
                    <div className="text-xs text-muted-foreground">Vol: {formatPrice(quote.volume24h)}</div>
                    <div className="text-xs text-muted-foreground">MCap: {formatPrice(quote.marketCap)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indices">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {marketIndices.map((index) => (
              <Card key={index.symbol} className="glass-effect">
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-bold">{index.symbol}</h3>
                    <p className="text-sm text-muted-foreground">{index.name}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-bold">{formatPrice(index.price)}</div>
                    <div
                      className={`flex items-center text-sm ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {index.change >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {formatChange(index.change)} ({formatChange(index.changePercent, true)})
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
