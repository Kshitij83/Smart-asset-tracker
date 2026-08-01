"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Palette, KeyRound, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    priceAlerts: true,
    weeklyReport: false,
    reduceMotion: false,
  })

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Kshitij Choudhary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="kshitij@example.com" />
            </div>
          </div>
          <Button
            onClick={() =>
              toast({ title: "Profile Updated", description: "Your profile has been saved." })
            }
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "emailAlerts" as const, label: "Email Alerts", desc: "Receive important alerts via email" },
            { key: "priceAlerts" as const, label: "Price Alerts", desc: "Notify me when assets hit target prices" },
            { key: "weeklyReport" as const, label: "Weekly Report", desc: "Weekly portfolio performance summary" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
              <Switch checked={preferences[item.key]} onCheckedChange={() => toggle(item.key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">Reduce Motion</div>
              <div className="text-sm text-muted-foreground">Minimize animations throughout the app</div>
            </div>
            <Switch checked={preferences.reduceMotion} onCheckedChange={() => toggle("reduceMotion")} />
          </div>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1.5 items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Emerald accent
            </Badge>
            <Badge variant="secondary" className="gap-1.5 items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Blue accents
            </Badge>
            <Badge variant="outline" className="gap-1.5 items-center">
              Dark theme
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            API & Security
          </CardTitle>
          <CardDescription>Market data providers and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                Market Data Provider
                <Badge variant="secondary">Yahoo Finance (free)</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                No API key required. Optional keys can be set via environment variables.
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                JWT Authentication
              </div>
              <div className="text-sm text-muted-foreground">Configured via the backend service</div>
            </div>
            <Badge variant="secondary" className="text-green-500">
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
