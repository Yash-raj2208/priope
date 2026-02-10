"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Flame,
  Target,
  TrendingUp,
  IndianRupee,
  Save,
  Calendar,
  Award,
  HeartPulse,
} from "lucide-react"

function Confetti() {
  const [pieces, setPieces] = useState<
    { id: number; left: number; color: string; delay: number; size: number }[]
  >([])

  useEffect(() => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--success))",
      "hsl(var(--warning))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ]
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4,
    }))
    setPieces(newPieces)

    const timer = setTimeout(() => setPieces([]), 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </>
  )
}

export function UserProfile() {
  const {
    user,
    streak,
    dayRecords,
    dailyBudget,
    daysInCurrentMonth,
    spendableAmount,
    updateBudgetSettings,
  } = useAuth()

  const [editMode, setEditMode] = useState(false)
  const [income, setIncome] = useState("")
  const [expenses, setExpenses] = useState("")
  const [editEnableEmergency, setEditEnableEmergency] = useState(false)
  const [emergencySavings, setEmergencySavings] = useState("")
  const [goal, setGoal] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [prevGoalProgress, setPrevGoalProgress] = useState(0)

  const monthlySavings = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    let totalSpent = 0
    let daysTracked = 0

    dayRecords.forEach((record) => {
      const date = new Date(record.date)
      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        totalSpent += record.totalSpent
        daysTracked++
      }
    })

    const totalBudgetUsed = daysTracked * dailyBudget
    return totalBudgetUsed - totalSpent
  }, [dayRecords, dailyBudget])

  const savingsGoal = user?.savingsGoal || 0
  const goalProgress = savingsGoal > 0
    ? Math.min(Math.round((Math.max(monthlySavings, 0) / savingsGoal) * 100), 100)
    : 0

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3500)
  }, [])

  useEffect(() => {
    if (goalProgress >= 100 && prevGoalProgress < 100 && savingsGoal > 0) {
      triggerConfetti()
    }
    setPrevGoalProgress(goalProgress)
  }, [goalProgress, prevGoalProgress, savingsGoal, triggerConfetti])

  const totalDaysTracked = dayRecords.length
  const savingDays = dayRecords.filter((r) => r.saved).length
  const savingRate =
    totalDaysTracked > 0 ? Math.round((savingDays / totalDaysTracked) * 100) : 0

  const handleSaveSettings = () => {
    updateBudgetSettings(
      Number(income) || user!.monthlyIncome,
      Number(expenses) || user!.fixedExpenses,
      editEnableEmergency ? Number(emergencySavings) || 0 : 0,
      Number(goal) || user!.savingsGoal
    )
    setEditMode(false)
  }

  const getStreakBadge = () => {
    if (streak >= 30) return { label: "Legend", color: "bg-chart-5 text-primary-foreground" }
    if (streak >= 14) return { label: "Committed", color: "bg-primary text-primary-foreground" }
    if (streak >= 7) return { label: "On Fire", color: "bg-warning text-warning-foreground" }
    if (streak >= 3) return { label: "Getting Started", color: "bg-success text-success-foreground" }
    return { label: "Beginner", color: "bg-muted text-muted-foreground" }
  }

  const streakBadge = getStreakBadge()

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      {showConfetti && <Confetti />}

      {/* Streak Card */}
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 animate-pulse-ring">
            <Flame className="h-10 w-10 text-chart-4" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-4xl font-bold text-foreground">
              {streak}
            </span>
            <span className="text-sm text-muted-foreground">Day Saving Streak</span>
          </div>
          <Badge className={streakBadge.color}>
            <Award className="mr-1 h-3 w-3" />
            {streakBadge.label}
          </Badge>
        </CardContent>
      </Card>

      {/* Savings Progress */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Monthly Savings Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Saved This Month
              </span>
              <span className="font-display text-2xl font-bold text-success">
                {"₹"}{Math.max(monthlySavings, 0).toLocaleString("en-IN")}
              </span>
            </div>
            {savingsGoal > 0 && (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-medium text-muted-foreground">Goal</span>
                <span className="font-display text-lg font-semibold text-foreground">
                  {"₹"}{savingsGoal.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
          {savingsGoal > 0 && (
            <div className="flex flex-col gap-1.5">
              <Progress value={goalProgress} className="h-3" />
              <span className="text-xs text-muted-foreground text-right">
                {goalProgress}% of goal reached
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center gap-1 p-4">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              {totalDaysTracked}
            </span>
            <span className="text-xs text-muted-foreground">Days Tracked</span>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center gap-1 p-4">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="font-display text-xl font-bold text-foreground">
              {savingRate}%
            </span>
            <span className="text-xs text-muted-foreground">Saving Rate</span>
          </CardContent>
        </Card>
      </div>

      {/* Budget Settings */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-foreground">
            Budget Settings
          </CardTitle>
          {!editMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIncome(String(user.monthlyIncome))
                setExpenses(String(user.fixedExpenses))
                setEditEnableEmergency(user.emergencyMedicalSavings > 0)
                setEmergencySavings(String(user.emergencyMedicalSavings))
                setGoal(String(user.savingsGoal))
                setEditMode(true)
              }}
            >
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editMode ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Monthly Income</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fixed Expenses</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit-enable-emergency"
                    checked={editEnableEmergency}
                    onCheckedChange={(checked) => {
                      setEditEnableEmergency(checked === true)
                      if (!checked) setEmergencySavings("0")
                    }}
                  />
                  <Label htmlFor="edit-enable-emergency" className="flex cursor-pointer items-center gap-1.5 text-sm">
                    <HeartPulse className="h-4 w-4 text-destructive" />
                    Emergency Medical Savings
                  </Label>
                </div>
                <div className={`mt-3 transition-opacity ${editEnableEmergency ? "opacity-100" : "pointer-events-none opacity-40"}`}>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      className="pl-9"
                      value={emergencySavings}
                      onChange={(e) => setEmergencySavings(e.target.value)}
                      disabled={!editEnableEmergency}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Savings Goal</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="font-medium text-foreground">
                  {"₹"}{user.monthlyIncome.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Fixed Expenses</span>
                <span className="font-medium text-foreground">
                  {"₹"}{user.fixedExpenses.toLocaleString("en-IN")}
                </span>
              </div>
              {user.emergencyMedicalSavings > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-destructive/5 px-4 py-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <HeartPulse className="h-3.5 w-3.5 text-destructive" />
                    Emergency Medical
                  </span>
                  <span className="font-medium text-foreground">
                    {"₹"}{user.emergencyMedicalSavings.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Savings Goal</span>
                <span className="font-medium text-foreground">
                  {"₹"}{user.savingsGoal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex flex-col gap-2 rounded-lg bg-primary/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Daily Budget ({daysInCurrentMonth} days)</span>
                  <span className="font-display text-lg font-bold text-primary">
                    {"₹"}{dailyBudget.toLocaleString("en-IN", { minimumFractionDigits: Number.isInteger(dailyBudget) ? 0 : 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>28d: {"₹"}{(spendableAmount / 28).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>30d: {"₹"}{(spendableAmount / 30).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span>31d: {"₹"}{(spendableAmount / 31).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}