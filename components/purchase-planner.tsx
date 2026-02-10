"use client"

import React from "react"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Lightbulb,
  TrendingDown,
} from "lucide-react"

const CATEGORIES = [
  "food",
  "transport",
  "shopping",
  "coffee",
  "entertainment",
  "utilities",
  "health",
  "other",
]

export function PurchasePlanner() {
  const { isLoggedIn, dailyBudget, todaySpent, dayRecords } = useAuth()
  const [itemName, setItemName] = useState("")
  const [itemCost, setItemCost] = useState("")
  const [itemCategory, setItemCategory] = useState("")
  const [isNeed, setIsNeed] = useState(true)
  const [showInsight, setShowInsight] = useState(false)

  const remaining = dailyBudget - todaySpent
  const cost = Number(itemCost) || 0
  const fitsInBudget = cost <= remaining

  const weeklyData = useMemo(() => {
    const days: { day: string; spent: number }[] = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const record = dayRecords.find((r) => r.date === dateStr)

      days.push({
        day: dayNames[date.getDay()],
        spent: record?.totalSpent || 0,
      })
    }

    return days
  }, [dayRecords])

  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {}
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    dayRecords.forEach((record) => {
      if (new Date(record.date) >= thirtyDaysAgo) {
        record.expenses.forEach((expense) => {
          spending[expense.category] =
            (spending[expense.category] || 0) + expense.amount
        })
      }
    })

    return spending
  }, [dayRecords])

  const topCategory = useMemo(() => {
    const entries = Object.entries(categorySpending)
    if (entries.length === 0) return null
    entries.sort((a, b) => b[1] - a[1])
    return { name: entries[0][0], amount: entries[0][1] }
  }, [categorySpending])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName || !itemCost) return
    setShowInsight(true)
  }

  if (!isLoggedIn) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Smart Purchase Planner
          </h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Sign in to get smart insights on your purchases and spending habits.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Should I Buy This? */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold text-foreground">
            Should I Buy This?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheck} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                placeholder="e.g. New headphones"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                  setShowInsight(false)
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="item-cost">Cost</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="item-cost"
                    type="number"
                    placeholder="500"
                    className="pl-9"
                    value={itemCost}
                    onChange={(e) => {
                      setItemCost(e.target.value)
                      setShowInsight(false)
                    }}
                    min="1"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select value={itemCategory} onValueChange={setItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
              <Label htmlFor="need-want" className="cursor-pointer text-sm">
                {isNeed ? "This is a Need" : "This is a Want"}
              </Label>
              <Switch
                id="need-want"
                checked={!isNeed}
                onCheckedChange={(checked) => setIsNeed(!checked)}
              />
            </div>

            <Button type="submit" className="w-full">
              Check My Budget
            </Button>
          </form>

          {/* Insight */}
          {showInsight && (
            <div
              className={`mt-4 rounded-lg border px-4 py-4 ${
                fitsInBudget
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-start gap-3">
                {fitsInBudget ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                )}
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground">
                    {fitsInBudget
                      ? `"${itemName}" fits your budget!`
                      : `"${itemName}" exceeds your remaining budget.`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {"You have ₹"}
                    {remaining.toLocaleString("en-IN")}
                    {" left today. This purchase costs ₹"}
                    {cost.toLocaleString("en-IN")}
                    {fitsInBudget
                      ? `. You'll still have ₹${(remaining - cost).toLocaleString("en-IN")} remaining.`
                      : `. You'd overspend by ₹${(cost - remaining).toLocaleString("en-IN")}.`}
                  </p>
                  {!isNeed && !fitsInBudget && (
                    <Badge
                      variant="outline"
                      className="mt-1 w-fit border-warning text-warning-foreground"
                    >
                      Consider saving for this want
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Spending Chart */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-display text-lg font-bold text-foreground">
            Weekly Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Spent",
                  ]}
                />
                <Bar
                  dataKey="spent"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      {topCategory && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">
                  Spending Insight
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {"You've spent ₹"}
                {topCategory.amount.toLocaleString("en-IN")}
                {" on "}
                {topCategory.name}
                {" this month. Reducing by 20% could save you ₹"}
                {Math.round(topCategory.amount * 0.2 * 12).toLocaleString(
                  "en-IN"
                )}
                {"/year!"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
