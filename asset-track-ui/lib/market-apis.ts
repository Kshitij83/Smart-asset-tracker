// Free APIs that don't require API keys
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo"
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || ""
const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || ""
const TWELVE_DATA_API_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || ""

export interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  sector?: string
}

export interface CryptoQuote {
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

class MarketDataService {
  // Free APIs - No API key required

  // Yahoo Finance Alternative (Free)
  async getStockQuoteYahoo(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`)
      const data = await response.json()

      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0]
        const meta = result.meta
        const quote = result.indicators.quote[0]

        return {
          symbol: meta.symbol,
          name: meta.longName || meta.symbol,
          price: meta.regularMarketPrice,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          volume: meta.regularMarketVolume,
          marketCap: meta.marketCap,
          sector: meta.sector,
        }
      }
      return null
    } catch (error) {
      console.error("Yahoo Finance API error:", error)
      return null
    }
  }

  // CoinGecko API (Free - No API key required)
  async getCryptoQuote(coinId: string): Promise<CryptoQuote | null> {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      )
      const data = await response.json()

      if (data[coinId]) {
        const coin = data[coinId]
        return {
          symbol: coinId.toUpperCase(),
          name: coinId,
          price: coin.usd,
          change24h: coin.usd_24h_change || 0,
          changePercent24h: coin.usd_24h_change || 0,
          volume24h: coin.usd_24h_vol || 0,
          marketCap: coin.usd_market_cap || 0,
        }
      }
      return null
    } catch (error) {
      console.error("CoinGecko API error:", error)
      return null
    }
  }

  // Get list of cryptocurrencies
  async getCryptoList(): Promise<Array<{ id: string; symbol: string; name: string }>> {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/list")
      const data = await response.json()
      return data.slice(0, 100) // Return top 100
    } catch (error) {
      console.error("CoinGecko list API error:", error)
      return []
    }
  }

  // Financial Modeling Prep (Free tier available)
  async getStockQuoteFMP(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}`)
      const data = await response.json()

      if (data && data.length > 0) {
        const quote = data[0]
        return {
          symbol: quote.symbol,
          name: quote.name,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changesPercentage,
          volume: quote.volume,
          marketCap: quote.marketCap,
        }
      }
      return null
    } catch (error) {
      console.error("FMP API error:", error)
      return null
    }
  }

  // APIs that require API keys (will work if keys are provided)

  // Alpha Vantage API
  async getStockQuoteAlphaVantage(symbol: string): Promise<StockQuote | null> {
    if (!ALPHA_VANTAGE_API_KEY || ALPHA_VANTAGE_API_KEY === "demo") {
      console.warn("Alpha Vantage API key not provided")
      return null
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      )
      const data = await response.json()

      if (data["Global Quote"]) {
        const quote = data["Global Quote"]
        return {
          symbol: quote["01. symbol"],
          name: quote["01. symbol"],
          price: Number.parseFloat(quote["05. price"]),
          change: Number.parseFloat(quote["09. change"]),
          changePercent: Number.parseFloat(quote["10. change percent"].replace("%", "")),
          volume: Number.parseInt(quote["06. volume"]),
        }
      }
      return null
    } catch (error) {
      console.error("Alpha Vantage API error:", error)
      return null
    }
  }

  // Finnhub API
  async getStockQuoteFinnhub(symbol: string): Promise<StockQuote | null> {
    if (!FINNHUB_API_KEY) {
      console.warn("Finnhub API key not provided")
      return null
    }

    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
      const data = await response.json()

      if (data.c) {
        return {
          symbol: symbol,
          name: symbol,
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          volume: 0, // Volume not provided in this endpoint
        }
      }
      return null
    } catch (error) {
      console.error("Finnhub API error:", error)
      return null
    }
  }

  // Polygon.io API
  async getStockQuotePolygon(symbol: string): Promise<StockQuote | null> {
    if (!POLYGON_API_KEY) {
      console.warn("Polygon API key not provided")
      return null
    }

    try {
      const response = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_API_KEY}`,
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        return {
          symbol: symbol,
          name: symbol,
          price: result.c,
          change: result.c - result.o,
          changePercent: ((result.c - result.o) / result.o) * 100,
          volume: result.v,
        }
      }
      return null
    } catch (error) {
      console.error("Polygon API error:", error)
      return null
    }
  }

  // Twelve Data API
  async getStockQuoteTwelveData(symbol: string): Promise<StockQuote | null> {
    if (!TWELVE_DATA_API_KEY) {
      console.warn("Twelve Data API key not provided")
      return null
    }

    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`)
      const data = await response.json()

      if (data.symbol) {
        return {
          symbol: data.symbol,
          name: data.name,
          price: Number.parseFloat(data.close),
          change: Number.parseFloat(data.change),
          changePercent: Number.parseFloat(data.percent_change),
          volume: Number.parseInt(data.volume),
        }
      }
      return null
    } catch (error) {
      console.error("Twelve Data API error:", error)
      return null
    }
  }

  // Aggregated quote function that tries multiple sources
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    // Try free APIs first
    let quote = await this.getStockQuoteYahoo(symbol)
    if (quote) return quote

    quote = await this.getStockQuoteFMP(symbol)
    if (quote) return quote

    // Try paid APIs if keys are available
    quote = await this.getStockQuoteAlphaVantage(symbol)
    if (quote) return quote

    quote = await this.getStockQuoteFinnhub(symbol)
    if (quote) return quote

    quote = await this.getStockQuotePolygon(symbol)
    if (quote) return quote

    quote = await this.getStockQuoteTwelveData(symbol)
    if (quote) return quote

    return null
  }

  // Historical data from Yahoo Finance (Free)
  async getHistoricalData(symbol: string, period = "1y"): Promise<HistoricalData[]> {
    try {
      const endDate = Math.floor(Date.now() / 1000)
      const startDate = endDate - this.getPeriodInSeconds(period)

      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startDate}&period2=${endDate}&interval=1d`,
      )
      const data = await response.json()

      if (data.chart?.result?.[0]) {
        const result = data.chart.result[0]
        const timestamps = result.timestamp
        const quotes = result.indicators.quote[0]

        return timestamps
          .map((timestamp: number, index: number) => ({
            date: new Date(timestamp * 1000).toISOString().split("T")[0],
            open: quotes.open[index] || 0,
            high: quotes.high[index] || 0,
            low: quotes.low[index] || 0,
            close: quotes.close[index] || 0,
            volume: quotes.volume[index] || 0,
          }))
          .filter((item: HistoricalData) => item.close > 0)
      }
      return []
    } catch (error) {
      console.error("Historical data API error:", error)
      return []
    }
  }

  private getPeriodInSeconds(period: string): number {
    const periods: Record<string, number> = {
      "1d": 86400,
      "1w": 604800,
      "1m": 2592000,
      "3m": 7776000,
      "6m": 15552000,
      "1y": 31536000,
      "2y": 63072000,
      "5y": 157680000,
    }
    return periods[period] || periods["1y"]
  }

  // Search stocks
  async searchStocks(query: string): Promise<Array<{ symbol: string; name: string; type: string }>> {
    try {
      // Using Yahoo Finance search
      const response = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      )
      const data = await response.json()

      if (data.quotes) {
        return data.quotes.map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          type: quote.typeDisp || "Stock",
        }))
      }
      return []
    } catch (error) {
      console.error("Stock search API error:", error)
      return []
    }
  }

  // Get market indices
  async getMarketIndices(): Promise<StockQuote[]> {
    const indices = ["^GSPC", "^DJI", "^IXIC", "^RUT"] // S&P 500, Dow Jones, NASDAQ, Russell 2000
    const quotes: StockQuote[] = []

    for (const index of indices) {
      const quote = await this.getStockQuoteYahoo(index)
      if (quote) {
        quotes.push(quote)
      }
    }

    return quotes
  }

  // Get sector performance
  async getSectorETFs(): Promise<StockQuote[]> {
    const sectorETFs = [
      "XLK", // Technology
      "XLF", // Financial
      "XLV", // Healthcare
      "XLE", // Energy
      "XLI", // Industrial
      "XLY", // Consumer Discretionary
      "XLP", // Consumer Staples
      "XLU", // Utilities
      "XLB", // Materials
      "XLRE", // Real Estate
    ]

    const quotes: StockQuote[] = []

    for (const etf of sectorETFs) {
      const quote = await this.getStockQuoteYahoo(etf)
      if (quote) {
        quotes.push(quote)
      }
    }

    return quotes
  }
}

export const marketDataService = new MarketDataService()
