"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Mail, BookOpen, MessageSquare } from "lucide-react"

const faqs = [
  {
    question: "How do I add an asset to my portfolio?",
    answer:
      "Navigate to the Portfolio page and click 'Add Asset'. Fill in the symbol, quantity, purchase price and date. You can also import holdings in bulk via the Import CSV button.",
  },
  {
    question: "How does price prediction work?",
    answer:
      "The Prediction page runs machine learning models (LSTM, ARIMA, Linear Regression) to forecast future prices. Choose a symbol, timeframe and model, then click Generate Prediction.",
  },
  {
    question: "Where does market data come from?",
    answer:
      "Market data is fetched from free public APIs such as Yahoo Finance and CoinGecko with no API key required. Optional premium providers can be enabled by setting environment variables.",
  },
  {
    question: "How do I export my portfolio?",
    answer:
      "Go to the Portfolio page and click 'Export CSV'. A file containing all your holdings will be downloaded for use in spreadsheets.",
  },
  {
    question: "Is my data stored securely?",
    answer:
      "Yes. Authentication uses JWT tokens and the backend stores data in a PostgreSQL database. Never commit your .env files, and use separate secrets in production.",
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          Help Center
        </h1>
        <p className="text-muted-foreground">Answers to common questions about AssetTrackr</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/portfolio" className="group">
          <Card className="glass-effect h-full">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <CardDescription>Learn how to manage your portfolio</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/prediction" className="group">
          <Card className="glass-effect h-full">
            <CardHeader>
              <MessageSquare className="h-6 w-6 text-chart-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg">AI Predictions</CardTitle>
              <CardDescription>Understand forecasting models</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Card className="glass-effect h-full">
          <CardHeader>
            <Mail className="h-6 w-6 text-yellow-500" />
            <CardTitle className="text-lg">Contact Support</CardTitle>
            <CardDescription>Reach out to our team for help</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to the most common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Badge variant="secondary">Version 1.0.0</Badge>
        <Badge variant="outline">Smart Asset Tracker</Badge>
      </div>
    </div>
  )
}
