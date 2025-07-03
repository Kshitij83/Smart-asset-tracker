"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface AssetFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  selectedSector: string
  onSectorChange: (value: string) => void
  onClearFilters: () => void
}

const assetTypes = [
  { value: "all", label: "All Types" },
  { value: "stock", label: "Stocks" },
  { value: "mutual_fund", label: "Mutual Funds" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "bond", label: "Bonds" },
]

const sectors = [
  { value: "all", label: "All Sectors" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "consumer", label: "Consumer Goods" },
  { value: "energy", label: "Energy" },
  { value: "metals", label: "Metals & Mining" },
  { value: "real_estate", label: "Real Estate" },
  { value: "utilities", label: "Utilities" },
  { value: "telecommunications", label: "Telecommunications" },
]

export function AssetFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSector,
  onSectorChange,
  onClearFilters,
}: AssetFiltersProps) {
  const hasActiveFilters = searchTerm || selectedType !== "all" || selectedSector !== "all"

  return (
    <div className="space-y-4 p-4 rounded-lg glass-effect">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Assets</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by symbol or name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Asset Type */}
        <div className="space-y-2">
          <Label>Asset Type</Label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assetTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sector */}
        <div className="space-y-2">
          <Label>Sector</Label>
          <Select value={selectedSector} onValueChange={onSectorChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Type: {assetTypes.find((t) => t.value === selectedType)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onTypeChange("all")} />
            </Badge>
          )}
          {selectedSector !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sector: {sectors.find((s) => s.value === selectedSector)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => onSectorChange("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
