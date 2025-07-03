"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  setIsOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-open")
    if (stored) {
      setIsOpen(JSON.parse(stored))
    }
  }, [])

  const toggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem("sidebar-open", JSON.stringify(newState))
  }

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open)
    localStorage.setItem("sidebar-open", JSON.stringify(open))
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setIsOpen: handleSetIsOpen }}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
