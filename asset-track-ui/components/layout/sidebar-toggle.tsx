"use client"

import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"

export function SidebarToggle() {
  const { isOpen, toggle } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30 transition-all duration-200"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  )
}
