"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { GitCompare, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { marketDataService, type HistoricalData } from "@/lib/market-apis"

const tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "JPM", "V"]

function fallbackHistory(symbol: string, seed: number): HistoricalData[] {
  const start = new Date()
  const data: HistoricalData[] = []
  let price = 100 + ((symbol.length * 37 + seed * 13) % 150)
  for (let i = 0; i < 120; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() - 5 + Math.floor(i / 22), start.getDate() - 30)
    const drift = Math.sin(i * 0.6 + seed) * 0.004 + 0.002
    price = price * (1 + drift)
    data.push({
      date: date.toISOString().split("T")[0],
      open: price,
      high: price * 1.01,
      low: price * 0.99,
      close: price,
      volume: 0,
    })
  }
  return data
}

export default function ComparisonPage() {
  const [symbolA, setSymbolA] = useState("AAPL")
  const [symbolB, setSymbolB] = useState("MSFT")
  const [dataA, setDataA] = useState<HistoricalData[]>([])
  const [dataB, setDataB] = useState<HistoricalData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadComparison = async () => {
    setIsLoading(true)
    const [a, b] = await Promise.all([
      marketDataService.getHistoricalData(symbolA, "6m"),
      marketDataService.getHistoricalData(symbolB, "6m"),
    ])
    setDataA(a.length > 1 ? a : fallbackHistory(symbolA, 1))
    setDataB(b.length > 1 ? b : fallbackHistory(symbolB, 2))
    setIsLoading(false)
  }

  useEffect(() => {
    loadComparison()
  }, [symbolA, symbolB])

  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; a?: number; b?: number }>()
    const baseA = dataA[0]?.close || 1
    const baseB = dataB[0]?.close || 1
    for (const d of dataA) {
      const entry = map.get(d.date) || { date: d.date }
      entry.a = Math.round(((d.close - baseA) / baseA) * 10000) / 100
      map.set(d.date, entry)
    }
    for (const d of dataB) {
      const entry = map.get(d.date) || { date: d.date }
      entry.b = Math.round(((d.close - baseB) / baseB) * 10000) / 100
      map.set(d.date, entry)
    }
    return Array.from(map.values()).sort((x, y) => x.date.localeCompare(y.date))
  }, [dataA, dataB])

  const perfA = chartData.length > 1 ? chartData[chartData.length - 1].a ?? 0 : 0
  const perfB = chartData.length > 1 ? chartData[chartData.length - 1].b ?? 0 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GitCompare className="h-8 w-8 text-primary" />
            Asset Comparison
          </h1>
          <p className="text-muted-foreground">Compare the performance of two assets side by side</p>
        </div>
        <Button variant="outline" onClick={loadComparison} disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="glass-effect">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">First Asset</span>
                <Badge variant={perfA >= 0 ? "secondary" : "destructive"} className={perfA >= 0 ? "text-green-500" : ""}>
                  {perfA >= 0 ? "+" : ""}
                  {perfA}%
                </Badge>
              </div>
              <Select value={symbolA} onValueChange={setSymbolA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tickers.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Second Asset</span>
                <Badge variant={perfB >= 0 ? "secondary" : "destructive"} className={perfB >= 0 ? "text-green-500" : ""}>
                  {perfB >= 0 ? "+" : ""}
                  {perfB}%
                </Badge>
              </div>
              <Select value={symbolB} onValueChange={setSymbolB}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tickers.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Relative Performance</CardTitle>
          <CardDescription>
            Normalized 6-month performance for {symbolA} vs {symbolB}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="a"
                  name={symbolA}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  name={symbolB}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[symbolA, symbolB].map((symbol) => {
          const perf = symbol === symbolA ? perfA : perfB
          return (
            <Card key={symbol} className="glass-effect">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{symbol} Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center text-2xl font-bold ${perf >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {perf >= 0 ? <TrendingUp className="mr-2 h-6 w-6" /> : <TrendingDown className="mr-2 h-6 w-6" />}
                  {perf >= 0 ? "+" : ""}
                  {perf}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total return over the selected period</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
