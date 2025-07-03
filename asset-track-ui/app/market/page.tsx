"use client"

import { RealTimeQuotes } from "@/components/market/real-time-quotes"

export default function MarketPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Market Data</h1>
        <p className="text-muted-foreground">Real-time quotes and market information</p>
      </div>

      <RealTimeQuotes />
    </div>
  )
}
