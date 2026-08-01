"use client"

import { useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download, TrendingUp, TrendingDown, MoreHorizontal, Edit, Trash2, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface Asset {
  id: string
  symbol: string
  name: string
  type: "stock" | "mutual_fund" | "crypto" | "bond"
  sector: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
  value: number
  gain: number
  gainPercent: number
}

const typeStyles: Record<string, string> = {
  stock: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  mutual_fund: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  crypto: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  bond: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
}

export default function PortfolioPage() {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      symbol: "AAPL",
      name: "Apple Inc.",
      type: "stock",
      sector: "technology",
      quantity: 50,
      purchasePrice: 150.0,
      currentPrice: 175.5,
      purchaseDate: "2024-01-15",
      value: 8775,
      gain: 1275,
      gainPercent: 17.0,
    },
    {
      id: "2",
      symbol: "TSLA",
      name: "Tesla Inc.",
      type: "stock",
      sector: "consumer",
      quantity: 25,
      purchasePrice: 200.0,
      currentPrice: 245.8,
      purchaseDate: "2024-02-10",
      value: 6145,
      gain: 1145,
      gainPercent: 22.9,
    },
    {
      id: "3",
      symbol: "BTC",
      name: "Bitcoin",
      type: "crypto",
      sector: "crypto",
      quantity: 0.5,
      purchasePrice: 45000.0,
      currentPrice: 52000.0,
      purchaseDate: "2024-03-01",
      value: 26000,
      gain: 3500,
      gainPercent: 15.6,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newAsset, setNewAsset] = useState({
    symbol: "",
    name: "",
    type: "stock" as const,
    sector: "technology",
    quantity: "",
    purchasePrice: "",
    purchaseDate: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredAssets = useMemo(() => {
    const query = searchQuery.toLowerCase()
    if (!query) return assets
    return assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.sector.toLowerCase().includes(query),
    )
  }, [assets, searchQuery])

  const handleAddAsset = () => {
    if (!newAsset.symbol || !newAsset.quantity || !newAsset.purchasePrice) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const asset: Asset = {
      id: Date.now().toString(),
      symbol: newAsset.symbol.toUpperCase(),
      name: newAsset.name || newAsset.symbol,
      type: newAsset.type,
      sector: newAsset.sector,
      quantity: Number.parseFloat(newAsset.quantity),
      purchasePrice: Number.parseFloat(newAsset.purchasePrice),
      currentPrice: Number.parseFloat(newAsset.purchasePrice) * 1.1, // Mock current price
      purchaseDate: newAsset.purchaseDate,
      value: Number.parseFloat(newAsset.quantity) * Number.parseFloat(newAsset.purchasePrice) * 1.1,
      gain: Number.parseFloat(newAsset.quantity) * Number.parseFloat(newAsset.purchasePrice) * 0.1,
      gainPercent: 10,
    }

    setAssets([...assets, asset])
    setNewAsset({
      symbol: "",
      name: "",
      type: "stock",
      sector: "technology",
      quantity: "",
      purchasePrice: "",
      purchaseDate: "",
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Asset Added",
      description: `${asset.symbol} has been added to your portfolio.`,
    })
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id))
    toast({
      title: "Asset Removed",
      description: "Asset has been removed from your portfolio.",
    })
  }

  const handleExportCsv = () => {
    const header = ["Symbol", "Name", "Type", "Sector", "Quantity", "Purchase Price", "Current Price", "Purchase Date", "Market Value", "Gain", "Return %"]
    const rows = assets.map((a) => [
      a.symbol,
      `"${a.name}"`,
      a.type,
      a.sector,
      a.quantity,
      a.purchasePrice.toFixed(2),
      a.currentPrice.toFixed(2),
      a.purchaseDate,
      a.value.toFixed(2),
      a.gain.toFixed(2),
      a.gainPercent.toFixed(2),
    ])
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `assettrackr-portfolio-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({
      title: "Portfolio Exported",
      description: `${assets.length} holdings exported to CSV.`,
    })
  }

  const handleImportCsv = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result?.toString() || ""
      const lines = text.split(/\r?\n/).filter((l) => l.trim())
      if (lines.length < 2) {
        toast({
          title: "Empty CSV",
          description: "The file does not contain any holdings.",
          variant: "destructive",
        })
        return
      }
      const imported: Asset[] = []
      for (const line of lines.slice(1)) {
        const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""))
        if (cols.length < 4) continue
        const symbol = cols[0].toUpperCase()
        const name = cols[1] || symbol
        const type = (cols[2] || "stock").toLowerCase() as Asset["type"]
        const sector = (cols[3] || "other").toLowerCase()
        const quantity = Number.parseFloat(cols[4]) || 0
        const purchasePrice = Number.parseFloat(cols[5]) || 0
        const currentPrice = Number.parseFloat(cols[6]) || purchasePrice
        const purchaseDate = cols[7] || new Date().toISOString().split("T")[0]
        const value = quantity * currentPrice
        const gain = value - quantity * purchasePrice
        const gainPercent = purchasePrice > 0 ? (gain / (quantity * purchasePrice)) * 100 : 0
        imported.push({
          id: `${Date.now()}-${imported.length}`,
          symbol,
          name,
          type: ["stock", "mutual_fund", "crypto", "bond"].includes(type) ? type : "stock",
          sector,
          quantity,
          purchasePrice,
          currentPrice,
          purchaseDate,
          value,
          gain,
          gainPercent,
        })
      }
      if (imported.length === 0) {
        toast({
          title: "Import Failed",
          description: "No valid rows found in the CSV.",
          variant: "destructive",
        })
        return
      }
      setAssets((prev) => [...prev, ...imported])
      toast({
        title: "CSV Imported",
        description: `${imported.length} holdings added from ${file.name}.`,
      })
    }
    reader.readAsText(file)
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalGain = assets.reduce((sum, asset) => sum + asset.gain, 0)
  const totalGainPercent = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground">Manage your investment holdings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportCsv(file)
              e.target.value = ""
            }}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Download className="mr-2 h-4 w-4 rotate-180" />
            Import CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-chart-2 hover:opacity-90 shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>Add a new asset to your portfolio. Fill in the details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newAsset.type}
                    onValueChange={(value: any) => setNewAsset({ ...newAsset, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="bond">Bond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="symbol" className="text-right">
                    Symbol
                  </Label>
                  <Input
                    id="symbol"
                    value={newAsset.symbol}
                    onChange={(e) => setNewAsset({ ...newAsset, symbol: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., AAPL"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newAsset.name}
                    onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Apple Inc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newAsset.quantity}
                    onChange={(e) => setNewAsset({ ...newAsset, quantity: e.target.value })}
                    className="col-span-3"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Purchase Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newAsset.purchasePrice}
                    onChange={(e) => setNewAsset({ ...newAsset, purchasePrice: e.target.value })}
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Purchase Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAsset.purchaseDate}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sector" className="text-right">
                    Sector
                  </Label>
                  <Select
                    value={newAsset.sector}
                    onValueChange={(value) => setNewAsset({ ...newAsset, sector: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="consumer">Consumer Goods</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="metals">Metals & Mining</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddAsset}>
                  Add Asset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+${totalGain.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glass-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+{totalGainPercent.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Your current investment positions</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search holdings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No holdings match your search.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Avg. Cost</TableHead>
                  <TableHead className="text-right">Current Price</TableHead>
                  <TableHead className="text-right">Market Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead className="text-right">Return %</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className={`capitalize text-xs border ${typeStyles[asset.type] || ""}`}>
                          {asset.type.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {asset.sector}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{asset.quantity}</TableCell>
                    <TableCell className="text-right">${asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${asset.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${asset.value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end ${asset.gain >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {asset.gain >= 0 ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        ${Math.abs(asset.gain).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={asset.gainPercent >= 0 ? "secondary" : "destructive"}
                        className={asset.gainPercent >= 0 ? "text-green-500" : ""}
                      >
                        {asset.gainPercent >= 0 ? "+" : ""}
                        {asset.gainPercent.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAsset(asset.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
