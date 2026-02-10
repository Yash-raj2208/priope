"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { CircularProgress } from "@/components/circular-progress"
import {
  Plus,
  Trash2,
  IndianRupee,
  Coffee,
  Car,
  ShoppingBag,
  Utensils,
  Zap,
  Film,
  HeartPulse,
  MoreHorizontal,
} from "lucide-react"

const CATEGORIES = [
  { value: "food", label: "Food", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "entertainment", label: "Entertainment", icon: Film },
  { value: "utilities", label: "Utilities", icon: Zap },
  { value: "health", label: "Health", icon: HeartPulse },
  { value: "other", label: "Other", icon: MoreHorizontal },
]

function getCategoryIcon(categoryValue: string) {
  const cat = CATEGORIES.find((c) => c.value === categoryValue)
  return cat ? cat.icon : MoreHorizontal
}

function getCategoryLabel(categoryValue: string) {
  const cat = CATEGORIES.find((c) => c.value === categoryValue)
  return cat ? cat.label : categoryValue
}

function formatRupee(value: number): string {
  if (Number.isInteger(value)) return value.toLocaleString("en-IN")
  return value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getDailyFor(spendable: number, days: number): string {
  return formatRupee(parseFloat((spendable / days).toFixed(2)))
}

export function BudgetTracker() {
  const { isLoggedIn, dailyBudget, todaySpent, todayExpenses, addExpense, deleteExpense, daysInCurrentMonth, spendableAmount } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const remaining = dailyBudget - todaySpent
  const isOverBudget = remaining < 0

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    addExpense(Number(amount), category, description)
    setAmount("")
    setCategory("")
    setDescription("")
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setTimeout(() => {
      deleteExpense(id)
      setDeletingId(null)
    }, 300)
  }

  if (!isLoggedIn) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <IndianRupee className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Daily Budget Tracker
          </h3>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Sign in to start tracking your daily expenses and build your saving habits.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg font-bold text-foreground">
          Daily Budget Tracker
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Expense</DialogTitle>
              <DialogDescription>
                Add your expense to track your daily budget.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expense-amount">Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="expense-amount"
                    type="number"
                    placeholder="150"
                    className="pl-9"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="expense-desc">Description (optional)</Label>
                <Input
                  id="expense-desc"
                  placeholder="e.g. Lunch at canteen"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" className="mt-2 w-full">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Circular progress and stats */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
          <CircularProgress value={todaySpent} max={dailyBudget} />

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Daily Budget ({daysInCurrentMonth} days)
              </span>
              <span className="font-display text-2xl font-bold text-foreground">
                {"₹"}{formatRupee(dailyBudget)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Spent Today
              </span>
              <span className="font-display text-2xl font-bold text-foreground">
                {"₹"}{formatRupee(todaySpent)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Remaining
              </span>
              <span
                className={`font-display text-2xl font-bold ${
                  isOverBudget ? "text-destructive" : "text-success"
                }`}
              >
                {isOverBudget ? "-" : ""}{"₹"}
                {formatRupee(Math.abs(remaining))}
              </span>
            </div>
          </div>
        </div>

        {/* Per-month breakdown */}
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Spendable: {"₹"}{formatRupee(spendableAmount)} / month
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[28, 30, 31].map((d) => (
              <div
                key={d}
                className={`rounded-lg px-2 py-2 ${
                  d === daysInCurrentMonth
                    ? "bg-primary/10 ring-1 ring-primary"
                    : "bg-card"
                }`}
              >
                <span className="block text-xs text-muted-foreground">{d} days</span>
                <span className={`block font-display text-sm font-bold ${d === daysInCurrentMonth ? "text-primary" : "text-foreground"}`}>
                  {"₹"}{getDailyFor(spendableAmount, d)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            This month has {daysInCurrentMonth} days (highlighted above).
          </p>
        </div>

        {/* Today's expenses */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-foreground">
            {"Today's Expenses"}
          </h4>
          {todayExpenses.length === 0 ? (
            <p className="rounded-lg bg-secondary px-4 py-6 text-center text-sm text-muted-foreground">
              No expenses logged yet today. Start by clicking "Add Expense" above.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {todayExpenses.map((expense) => {
                const Icon = getCategoryIcon(expense.category)
                return (
                  <div
                    key={expense.id}
                    className={`flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3 transition-all duration-300 ${
                      deletingId === expense.id
                        ? "translate-x-full opacity-0"
                        : "translate-x-0 opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {getCategoryLabel(expense.category)}
                        </span>
                        {expense.description && (
                          <span className="text-xs text-muted-foreground">
                            {expense.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {"₹"}{expense.amount.toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete expense: ${getCategoryLabel(expense.category)}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
