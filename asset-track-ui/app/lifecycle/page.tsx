"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Calendar, DollarSign, Percent } from "lucide-react"
import { AssetFilters } from "@/components/filters/asset-filters"

const assets = [
  { id: "1", symbol: "AAPL", name: "Apple Inc.", type: "stock", sector: "technology" },
  { id: "2", symbol: "TSLA", name: "Tesla Inc.", type: "stock", sector: "consumer" },
  { id: "3", symbol: "BTC", name: "Bitcoin", type: "crypto", sector: "crypto" },
  { id: "4", symbol: "VTSAX", name: "Vanguard Total Stock", type: "mutual_fund", sector: "diversified" },
  { id: "5", symbol: "MSFT", name: "Microsoft Corp.", type: "stock", sector: "technology" },
  { id: "6", symbol: "GOOGL", name: "Alphabet Inc.", type: "stock", sector: "technology" },
  { id: "7", symbol: "JPM", name: "JPMorgan Chase", type: "stock", sector: "finance" },
  { id: "8", symbol: "JNJ", name: "Johnson & Johnson", type: "stock", sector: "healthcare" },
  { id: "9", symbol: "XOM", name: "Exxon Mobil", type: "stock", sector: "energy" },
  { id: "10", symbol: "GOLD", name: "Barrick Gold", type: "stock", sector: "metals" },
]

const generateLifecycleData = (symbol: string) => {
  const basePrice = symbol === "AAPL" ? 150 : symbol === "TSLA" ? 200 : symbol === "BTC" ? 45000 : 100
  const data = []
  let price = basePrice
  let seed = 0
  for (let ch of symbol) seed += ch.charCodeAt(0)

  for (let i = 0; i < 365; i++) {
    const change = (Math.sin((i + 1) * 7 + seed) * 0.008 + Math.cos((i + 1) * 13 + seed) * 0.01 + 0.001)
    price = price * (1 + change)
    data.push({
      date: new Date(2024, 0, i + 1).toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      value: Math.round(price * 50 * 100) / 100, // Assuming 50 shares
      dayChange: change * 100,
    })
  }

  return data
}

export default function LifecyclePage() {
  const [selectedAsset, setSelectedAsset] = useState("AAPL")
  const [timeframe, setTimeframe] = useState("1Y")

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "all" || asset.type === selectedType
      const matchesSector = selectedSector === "all" || asset.sector === selectedSector

      return matchesSearch && matchesType && matchesSector
    })
  }, [searchTerm, selectedType, selectedSector])

  const selectedAssetData = assets.find((a) => a.symbol === selectedAsset)
  const fullLifecycleData = useMemo(() => generateLifecycleData(selectedAsset), [selectedAsset])

  // Respect the selected timeframe (1M, 3M, 6M, 1Y, ALL)
  const timeframeDays: Record<string, number> = { "1M": 30, "3M": 91, "6M": 182, "1Y": 365, ALL: 365 }
  const sliceDays = timeframeDays[timeframe] || 365
  const lifecycleData = useMemo(() => fullLifecycleData.slice(-sliceDays), [fullLifecycleData, sliceDays])

  const currentData = lifecycleData[lifecycleData.length - 1]
  const initialData = lifecycleData[0]
  const totalReturn = ((currentData.price - initialData.price) / initialData.price) * 100
  const totalValue = currentData.value
  const totalGain = totalValue - initialData.price * 50

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedType("all")
    setSelectedSector("all")
  }

  const stats = [
    {
      title: "Current Price",
      value: `$${currentData.price.toLocaleString()}`,
      icon: DollarSign,
      change: currentData.dayChange.toFixed(2) + "%",
      changeType: currentData.dayChange >= 0 ? "positive" : "negative",
    },
    {
      title: "Total Return",
      value: `${totalReturn >= 0 ? "+" : ""}${totalReturn.toFixed(2)}%`,
      icon: Percent,
      change: `Since ${timeframe}`,
      changeType: totalReturn >= 0 ? "positive" : "negative",
    },
    {
      title: "Investment Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: TrendingUp,
      change: `${totalGain >= 0 ? "+" : ""}$${Math.abs(totalGain).toLocaleString()}`,
      changeType: totalGain >= 0 ? "positive" : "negative",
    },
    {
      title: "Purchase Date",
      value: "Jan 1, 2024",
      icon: Calendar,
      change: "365 days ago",
      changeType: "neutral",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asset Lifecycle</h1>
          <p className="text-muted-foreground">Track individual asset performance over time</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filteredAssets.map((asset) => (
                <SelectItem key={asset.id} value={asset.symbol}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{asset.symbol}</span>
                    <Badge variant="secondary" className="text-xs">
                      {asset.type.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {asset.sector}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="6M">6M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="ALL">ALL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Asset Filters */}
      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        onClearFilters={handleClearFilters}
      />

      {/* Asset Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{selectedAssetData?.symbol}</CardTitle>
              <CardDescription className="text-lg">{selectedAssetData?.name}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="capitalize">
                {selectedAssetData?.type.replace("_", " ")}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {selectedAssetData?.sector}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-slide-up glass-effect"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.changeType === "positive" && <TrendingUp className="mr-1 h-3 w-3 text-green-500" />}
                {stat.changeType === "negative" && <TrendingDown className="mr-1 h-3 w-3 text-red-500" />}
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-500"
                      : stat.changeType === "negative"
                        ? "text-red-500"
                        : "text-muted-foreground"
                  }
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lifecycle Charts */}
      <Tabs defaultValue="price" className="space-y-4">
        <TabsList>
          <TabsTrigger value="price">Price History</TabsTrigger>
          <TabsTrigger value="value">Investment Value</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="price">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Price Movement</CardTitle>
              <CardDescription>Historical price changes over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lifecycleData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
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
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Investment Value</CardTitle>
              <CardDescription>Total value of your investment over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lifecycleData}>
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
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Investment Value"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Daily Performance</CardTitle>
                <CardDescription>Day-to-day percentage changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lifecycleData}>
                      <defs>
                        <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        className="text-xs"
                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short" })}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        className="text-xs"
                        tickFormatter={(value) => `${value.toFixed(1)}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Daily Change"]}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Area
                        type="monotone"
                        dataKey="dayChange"
                        stroke="#10b981"
                        strokeWidth={1}
                        fill="url(#performanceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Key Milestones</CardTitle>
                <CardDescription>Important events in asset lifecycle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <div className="font-medium text-green-600">All-Time High</div>
                    <div className="text-sm text-muted-foreground">
                      ${Math.max(...lifecycleData.map((d) => d.price)).toLocaleString()} on Dec 15, 2024
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-blue-600">Purchase Date</div>
                    <div className="text-sm text-muted-foreground">
                      ${initialData.price.toLocaleString()} on Jan 1, 2024
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div>
                    <div className="font-medium text-yellow-600">Biggest Drop</div>
                    <div className="text-sm text-muted-foreground">-8.2% on Mar 15, 2024</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <div>
                    <div className="font-medium text-purple-600">Best Day</div>
                    <div className="text-sm text-muted-foreground">+12.4% on Aug 22, 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
