"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PortfolioChart } from "@/components/charts/portfolio-chart"
import { AllocationChart } from "@/components/charts/allocation-chart"
import { PerformanceChart } from "@/components/charts/performance-chart"
import { TrendingUp, TrendingDown, Award } from "lucide-react"

export default function AnalyticsPage() {
  const metrics = [
    {
      title: "Sharpe Ratio",
      value: "1.42",
      description: "Risk-adjusted return",
      status: "good" as const,
    },
    {
      title: "Beta",
      value: "0.85",
      description: "Market correlation",
      status: "neutral" as const,
    },
    {
      title: "Max Drawdown",
      value: "-8.2%",
      description: "Largest peak-to-trough decline",
      status: "warning" as const,
    },
    {
      title: "Volatility",
      value: "12.4%",
      description: "Standard deviation of returns",
      status: "neutral" as const,
    },
  ]

  const sectors = [
    { name: "Technology", allocation: 45, target: 40, performance: 18.5 },
    { name: "Healthcare", allocation: 20, target: 25, performance: 12.3 },
    { name: "Finance", allocation: 15, target: 15, performance: 8.7 },
    { name: "Consumer", allocation: 12, target: 10, performance: 15.2 },
    { name: "Energy", allocation: 8, target: 10, performance: -2.1 },
  ]

  // Add sector performance data
  const sectorPerformance = [
    { sector: "Technology", allocation: 45, performance: 18.5, assets: 5 },
    { sector: "Healthcare", allocation: 20, performance: 12.3, assets: 2 },
    { sector: "Finance", allocation: 15, performance: 8.7, assets: 3 },
    { sector: "Consumer", allocation: 12, performance: 15.2, assets: 2 },
    { sector: "Energy", allocation: 5, performance: -2.1, assets: 1 },
    { sector: "Metals", allocation: 3, performance: 22.4, assets: 1 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Deep insights into your investment performance</p>
      </div>

      {/* Risk Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.title}
            className="animate-slide-up glass-effect"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {metric.title}
                {metric.status === "good" && <Award className="h-4 w-4 text-green-500" />}
                {metric.status === "warning" && <TrendingDown className="h-4 w-4 text-yellow-500" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Portfolio Growth</CardTitle>
                <CardDescription>Historical performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioChart />
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>Individual asset returns</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Current Allocation</CardTitle>
                <CardDescription>Distribution by asset class</CardDescription>
              </CardHeader>
              <CardContent>
                <AllocationChart />
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Allocation Details</CardTitle>
                <CardDescription>Breakdown with target allocations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Stocks", current: 65, target: 60, color: "hsl(var(--primary))" },
                  { name: "Mutual Funds", current: 20, target: 25, color: "hsl(var(--secondary))" },
                  { name: "Crypto", current: 10, target: 10, color: "#8b5cf6" },
                  { name: "Bonds", current: 5, target: 5, color: "#06b6d4" },
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>
                        {item.current}% (Target: {item.target}%)
                      </span>
                    </div>
                    <Progress value={item.current} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Update the sectors tab content to show more detailed sector analysis */}
        <TabsContent value="sectors" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
                <CardDescription>Performance and allocation by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectorPerformance.map((sector) => (
                    <div key={sector.sector} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{sector.sector}</span>
                          <Badge variant="outline" className="text-xs">
                            {sector.assets} assets
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={sector.allocation > 20 ? "secondary" : "outline"}>{sector.allocation}%</Badge>
                          <div
                            className={`flex items-center text-sm ${sector.performance >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {sector.performance >= 0 ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            )}
                            {sector.performance >= 0 ? "+" : ""}
                            {sector.performance}%
                          </div>
                        </div>
                      </div>
                      <Progress value={sector.allocation} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Sector Diversification</CardTitle>
                <CardDescription>Risk distribution across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <h4 className="font-medium text-yellow-600 mb-2">High Tech Concentration</h4>
                    <p className="text-sm text-muted-foreground">
                      45% allocation in technology sector may increase volatility
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-medium text-green-600 mb-2">Strong Metals Performance</h4>
                    <p className="text-sm text-muted-foreground">Metals sector showing +22.4% returns this period</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-medium text-blue-600 mb-2">Diversification Opportunity</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider adding more healthcare and utilities exposure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Portfolio risk breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: "Market Risk", level: 65, color: "bg-red-500" },
                  { category: "Sector Risk", level: 45, color: "bg-yellow-500" },
                  { category: "Currency Risk", level: 25, color: "bg-blue-500" },
                  { category: "Liquidity Risk", level: 15, color: "bg-green-500" },
                ].map((risk) => (
                  <div key={risk.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{risk.category}</span>
                      <span>{risk.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${risk.color}`} style={{ width: `${risk.level}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Risk Recommendations</CardTitle>
                <CardDescription>Suggestions to optimize your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <h4 className="font-medium text-yellow-600 mb-2">High Tech Concentration</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider reducing technology allocation from 45% to target 40%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-medium text-blue-600 mb-2">Diversification Opportunity</h4>
                  <p className="text-sm text-muted-foreground">Increase healthcare allocation to reach 25% target</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-medium text-green-600 mb-2">Good Risk-Return Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Your Sharpe ratio of 1.42 indicates efficient risk management
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
