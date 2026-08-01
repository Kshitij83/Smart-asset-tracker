"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, TrendingUp, PieChart, Settings, HelpCircle, Brain, BarChart3, GitCompare } from "lucide-react"
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
    name: "Comparison",
    href: "/comparison",
    icon: GitCompare,
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
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ease-in-out">
      <div className="flex h-full w-full flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-6 mt-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-sm">AT</span>
            </div>
            <span className="font-bold text-lg gradient-text">AssetTrackr</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200 hover:translate-x-0.5",
                    isActive && "bg-primary/10 text-primary border-primary/20 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="rounded-xl bg-gradient-to-br from-primary/15 to-chart-2/10 border border-primary/20 p-4">
            <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
            <div className="font-bold text-lg gradient-text">$124,532.50</div>
            <div className="text-xs text-green-500 font-medium mt-1">+12.5% all time</div>
          </div>
        </div>
      </div>
    </div>
  )
}
