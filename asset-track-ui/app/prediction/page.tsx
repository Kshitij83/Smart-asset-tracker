"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Brain, TrendingUp, Target, AlertTriangle, Play, Download, History } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PredictionResponse } from "@/lib/api"

// Deterministic pseudo-random generator so results are stable per symbol
const seededRandom = (seed: string) => {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295
  }
}

const basePriceFor = (symbol: string) => {
  const prices: Record<string, number> = {
    AAPL: 175.5,
    TSLA: 245.8,
    GOOGL: 158.2,
    MSFT: 428.5,
    AMZN: 186.3,
    NVDA: 128.9,
    BTC: 52000,
    ETH: 2800,
  }
  return prices[symbol] || 100 + (symbol.length * 37) % 200
}

export default function PredictionPage() {
  const [selectedStock, setSelectedStock] = useState("")
  const [predictionDays, setPredictionDays] = useState("30")
  const [selectedModel, setSelectedModel] = useState("LSTM")
  const [isLoading, setIsLoading] = useState(false)
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const buildMockPredictions = (symbol: string, days: number, model: string): PredictionResponse => {
    const rand = seededRandom(`${symbol}-${days}-${model}`)
    const basePrice = basePriceFor(symbol)
    let price = basePrice
    const direction = rand() > 0.5 ? 1 : -1
    const predictions = Array.from({ length: days }, (_, i) => {
      const drift = direction * 0.004 + (rand() - 0.5) * 0.02
      price = price * (1 + drift)
      return {
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        predictedPrice: Math.round(price * 100) / 100,
        confidence: 0.85 + rand() * 0.12,
      }
    })
    return {
      symbol,
      predictions,
      accuracy: model === "LSTM" ? 0.87 : model === "ARIMA" ? 0.82 : 0.75,
      model,
    }
  }

  const handlePredict = async () => {
    if (!selectedStock || !predictionDays) {
      toast({
        title: "Missing Information",
        description: "Please select a stock and prediction timeframe.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // For demo purposes, use mock data generated deterministically from inputs.
      // Swap this for the real Spring Boot API when hosted (lib/api.ts).
      setTimeout(() => {
        setPredictions(buildMockPredictions(selectedStock, Number.parseInt(predictionDays), selectedModel))
        setIsLoading(false)
        toast({
          title: "Prediction Complete",
          description: `Generated ${predictionDays}-day price prediction for ${selectedStock} using ${selectedModel}.`,
        })
      }, 1500)

      // Uncomment for real API integration
      // const request: PredictionRequest = {
      //   symbol: selectedStock,
      //   days: parseInt(predictionDays),
      //   model: selectedModel as 'LSTM' | 'ARIMA' | 'LINEAR_REGRESSION'
      // }
      // const response = await apiClient.predictStockPrice(request)
      // setPredictions(response.data)
    } catch (error) {
      toast({
        title: "Prediction Failed",
        description: "Unable to generate prediction. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!predictions) return
    const header = ["Date", "Predicted Price", "Confidence"]
    const rows = predictions.predictions.map((p) => [
      p.date,
      p.predictedPrice.toFixed(2),
      (p.confidence * 100).toFixed(1) + "%",
    ])
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${predictions.symbol}-prediction-${predictions.model}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({
      title: "Prediction Exported",
      description: `${predictions.predictions.length} data points exported to CSV.`,
    })
  }

  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", sector: "Technology" },
    { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
    { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology" },
    { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
    { symbol: "AMZN", name: "Amazon.com Inc.", sector: "E-commerce" },
    { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology" },
  ]

  const models = [
    {
      id: "LSTM",
      name: "LSTM Neural Network",
      description: "Deep learning model for time series prediction",
      accuracy: "87%",
      complexity: "High",
    },
    {
      id: "ARIMA",
      name: "ARIMA",
      description: "Statistical model for time series forecasting",
      accuracy: "82%",
      complexity: "Medium",
    },
    {
      id: "LINEAR_REGRESSION",
      name: "Linear Regression",
      description: "Simple linear model for trend analysis",
      accuracy: "75%",
      complexity: "Low",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Stock Price Prediction
          </h1>
          <p className="text-muted-foreground">AI-powered stock price forecasting using machine learning</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Prediction Setup */}
        <Card className="glass-effect lg:col-span-1">
          <CardHeader>
            <CardTitle>Prediction Setup</CardTitle>
            <CardDescription>Configure your stock price prediction parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stock Selection */}
            <div className="space-y-2">
              <Label>Stock Symbol</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Search stocks (e.g., AAPL)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stock" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularStocks
                      .filter(
                        (stock) =>
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stock.symbol}</span>
                            <span className="text-sm text-muted-foreground">{stock.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prediction Timeframe */}
            <div className="space-y-2">
              <Label>Prediction Timeframe</Label>
              <Select value={predictionDays} onValueChange={setPredictionDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">Accuracy: {model.accuracy}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Predict Button */}
            <Button
              onClick={handlePredict}
              disabled={isLoading || !selectedStock}
              className="w-full bg-gradient-to-r from-primary to-primary/80"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Generate Prediction
                </>
              )}
            </Button>

            {/* Model Info */}
            {selectedModel && (
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">{models.find((m) => m.id === selectedModel)?.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {models.find((m) => m.id === selectedModel)?.description}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Accuracy: {models.find((m) => m.id === selectedModel)?.accuracy}</Badge>
                  <Badge variant="outline">{models.find((m) => m.id === selectedModel)?.complexity} Complexity</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {predictions ? (
            <Tabs defaultValue="chart" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="chart">Price Chart</TabsTrigger>
                  <TabsTrigger value="confidence">Confidence Analysis</TabsTrigger>
                  <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    History
                  </Button>
                </div>
              </div>

              <TabsContent value="chart">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {predictions.symbol} Price Prediction
                    </CardTitle>
                    <CardDescription>
                      {predictionDays}-day forecast using {predictions.model} model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictions.predictions}>
                          <defs>
                            <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
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
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, "Predicted Price"]}
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <Area
                            type="monotone"
                            dataKey="predictedPrice"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#predictionGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="confidence">
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle>Confidence Analysis</CardTitle>
                    <CardDescription>Model confidence levels for each prediction</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={predictions.predictions}>
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
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Confidence"]}
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <Line
                            type="monotone"
                            dataKey="confidence"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Model Performance</CardTitle>
                      <CardDescription>Statistical metrics for the prediction model</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Model Accuracy</span>
                        <Badge variant="secondary" className="text-green-500">
                          {(predictions.accuracy * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Mean Confidence</span>
                        <Badge variant="secondary">
                          {(
                            (predictions.predictions.reduce((acc, p) => acc + p.confidence, 0) /
                              predictions.predictions.length) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Prediction Range</span>
                        <span className="text-sm">
                          ${Math.min(...predictions.predictions.map((p) => p.predictedPrice)).toFixed(2)} - $
                          {Math.max(...predictions.predictions.map((p) => p.predictedPrice)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Model Type</span>
                        <Badge variant="outline">{predictions.model}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                      <CardDescription>Investment risk analysis based on predictions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <h4 className="font-medium text-green-600">High Confidence</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Model shows {(predictions.accuracy * 100).toFixed(0)}% accuracy with consistent predictions
                        </p>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <h4 className="font-medium text-yellow-600">Market Volatility</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Consider market conditions and external factors that may affect predictions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="glass-effect">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Predict</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select a stock symbol, choose your prediction timeframe and AI model, then click "Generate Prediction"
                  to see future price forecasts.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
