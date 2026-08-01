"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, Plus, Sparkles, Target, Activity, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import { AllocationChart } from "@/components/charts/allocation-chart"
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"

const sparklineData = [
  { v: 60 }, { v: 72 }, { v: 68 }, { v: 84 }, { v: 92 }, { v: 88 }, { v: 104 }, { v: 124 },
]

const indices = [
  { symbol: "S&P 500", value: 5, trend: "positive" as const },
  { symbol: "NASDAQ", value: 3.2, trend: "positive" as const },
  { symbol: "DOW", value: 1.4, trend: "positive" as const },
  { symbol: "VXF", value: -0.8, trend: "negative" as const },
]

export default function DashboardPage() {
  const stats: Array<{
    title: string
    value: string
    change: string
    changeType: "positive" | "negative" | "neutral"
    icon: LucideIcon
  }> = [
    {
      title: "Total Portfolio Value",
      value: "$124,532.50",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Today's Gain/Loss",
      value: "+$2,431.20",
      change: "+1.98%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Total Return",
      value: "+$24,532.50",
      change: "+24.5%",
      changeType: "positive" as const,
      icon: ArrowUpRight,
    },
    {
      title: "Active Assets",
      value: "23",
      change: "+3 this month",
      changeType: "neutral" as const,
      icon: PieChart,
    },
  ]

  const topPerformers = [
    { symbol: "AAPL", name: "Apple Inc.", change: "+5.2%", value: "$15,420" },
    { symbol: "TSLA", name: "Tesla Inc.", change: "+3.8%", value: "$8,950" },
    { symbol: "NVDA", name: "NVIDIA Corp.", change: "+7.1%", value: "$12,340" },
  ]

  const recentActivity = [
    { action: "Bought", asset: "MSFT", amount: "$2,500", time: "2 hours ago" },
    { action: "Sold", asset: "GOOGL", amount: "$1,800", time: "1 day ago" },
    { action: "Dividend", asset: "AAPL", amount: "$45.20", time: "3 days ago" },
  ]

  const insights = [
    {
      tone: "good" as const,
      title: "Rebalance opportunity",
      text: "Technology is 45% of holdings — consider trimming to your 40% target.",
    },
    {
      tone: "info" as const,
      title: "Prediction ready",
      text: "LSTM model forecasts +6.8% upside for AAPL over the next 30 days.",
    },
    {
      tone: "warn" as const,
      title: "Watch: market volatility",
      text: "Energy sector showing elevated volatility. Review your exposure.",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        <Link href="/portfolio">
          <Button className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </Link>
      </div>

      {/* Market Indices Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {indices.map((index) => (
          <div
            key={index.symbol}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-card/60 backdrop-blur px-4 py-3 hover:border-primary/30 transition-colors"
          >
            <div>
              <div className="text-xs text-muted-foreground">{index.symbol}</div>
              <div
                className={`font-semibold ${index.trend === "positive" ? "text-green-500" : "text-red-500"}`}
              >
                {index.trend === "positive" ? "+" : ""}
                {index.value}%
              </div>
            </div>
            {index.trend === "positive" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="animate-slide-up glass-effect group overflow-hidden"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="stat-icon-tile">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
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
              <div className="mt-2 -mx-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height={40}>
                  <AreaChart data={sparklineData}>
                    <defs>
                      <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<></>} />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="hsl(var(--primary))"
                      strokeWidth={1.5}
                      fill={`url(#spark-${index})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="animate-scale-in glass-effect">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your portfolio value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChart />
          </CardContent>
        </Card>

        <Card className="animate-scale-in glass-effect" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <AllocationChart />
          </CardContent>
        </Card>
      </div>

      {/* Performance, Activity and Smart Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-slide-up glass-effect">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best performing assets today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
              >
                <div>
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-sm text-muted-foreground">{asset.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{asset.value}</div>
                  <Badge variant="secondary" className="text-green-500">
                    {asset.change}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-up glass-effect lg:col-span-1" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.action === "Bought"
                        ? "bg-green-500"
                        : activity.action === "Sold"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <div className="font-medium">
                      {activity.action} {activity.asset}
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
                <div className="font-medium">{activity.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="animate-slide-up glass-effect" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>AI-generated portfolio suggestions</CardDescription>
            </div>
            <div className="stat-icon-tile">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className={`p-3 rounded-lg border ${
                  insight.tone === "good"
                    ? "bg-green-500/10 border-green-500/20"
                    : insight.tone === "warn"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-blue-500/10 border-blue-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target
                    className={`h-3.5 w-3.5 ${
                      insight.tone === "good"
                        ? "text-green-500"
                        : insight.tone === "warn"
                          ? "text-yellow-500"
                          : "text-blue-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      insight.tone === "good"
                        ? "text-green-600"
                        : insight.tone === "warn"
                          ? "text-yellow-600"
                          : "text-blue-600"
                    }`}
                  >
                    {insight.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
