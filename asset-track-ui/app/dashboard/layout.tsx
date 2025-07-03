import type React from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { SidebarToggle } from "@/components/layout/sidebar-toggle"
import { SidebarProvider } from "@/hooks/use-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen shiny-black">
        <Header />
        <SidebarToggle />
        <Sidebar />
        <main className="p-6 pt-20">{children}</main>
      </div>
    </SidebarProvider>
  )
}
