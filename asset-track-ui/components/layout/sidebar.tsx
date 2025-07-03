"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, TrendingUp, PieChart, Settings, HelpCircle, Brain, BarChart3 } from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    name: "Asset Lifecycle",
    href: "/lifecycle",
    icon: TrendingUp,
  },
  {
    name: "Price Prediction",
    href: "/prediction",
    icon: Brain,
  },
  {
    name: "Market Data",
    href: "/market",
    icon: BarChart3,
  },
  {
    name: "Market Comparison",
    href: "/comparison",
    icon: TrendingUp,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-black/40 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ease-in-out">
      <div className="flex h-full w-full flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-6 mt-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AT</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AssetTrackr
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200",
                    isActive && "bg-primary/10 text-primary border-primary/20",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
