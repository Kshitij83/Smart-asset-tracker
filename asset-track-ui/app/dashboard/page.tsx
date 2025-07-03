"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUpRight, Plus } from "lucide-react"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import { AllocationChart } from "@/components/charts/allocation-chart"

export default function DashboardPage() {
  const stats = [
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      </div>

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

      {/* Performance and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-slide-up glass-effect">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best performing assets today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
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

        <Card className="animate-slide-up glass-effect lg:col-span-2" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
      </div>
    </div>
  )
}
