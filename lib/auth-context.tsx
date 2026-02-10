"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface User {
  email: string
  monthlyIncome: number
  fixedExpenses: number
  savingsGoal: number
  createdAt: string
}

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  timestamp: number
}

export interface DayRecord {
  date: string
  expenses: Expense[]
  totalSpent: number
  saved: boolean
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  streak: number
  dayRecords: DayRecord[]
  todayExpenses: Expense[]
  todaySpent: number
  dailyBudget: number
  daysInCurrentMonth: number
  spendableAmount: number
  login: (email: string, password: string) => boolean
  signup: (email: string, password: string, monthlyIncome: number, fixedExpenses: number, savingsGoal: number) => boolean
  logout: () => void
  addExpense: (amount: number, category: string, description: string) => void
  deleteExpense: (id: string) => void
  updateBudgetSettings: (monthlyIncome: number, fixedExpenses: number, savingsGoal: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getTodayStr() {
  return new Date().toISOString().split("T")[0]
}

function getDaysInMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
}

function calculateStreak(records: DayRecord[]): number {
  if (records.length === 0) return 0

  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const today = getTodayStr()
  const todayRecord = sorted.find((r) => r.date === today)

  let streak = 0
  const startDate = new Date(today)

  if (!todayRecord) {
    startDate.setDate(startDate.getDate() - 1)
  }

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(startDate)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split("T")[0]
    const record = sorted.find((r) => r.date === dateStr)

    if (record) {
      streak++
    } else if (i === 0 && !todayRecord) {
      continue
    } else {
      break
    }
  }

  if (todayRecord) streak = Math.max(streak, 1)

  return streak
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dayRecords, setDayRecords] = useState<DayRecord[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const savedSession = localStorage.getItem("savewise_session")
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession)
        setUser(session.user)
        setIsLoggedIn(true)

        const savedRecords = localStorage.getItem(
          `savewise_records_${session.user.email}`
        )
        if (savedRecords) {
          setDayRecords(JSON.parse(savedRecords))
        }

        const today = getTodayStr()
        const existingRecords = savedRecords ? JSON.parse(savedRecords) : []
        const todayExists = existingRecords.some(
          (r: DayRecord) => r.date === today
        )
        if (!todayExists) {
          const newRecord: DayRecord = {
            date: today,
            expenses: [],
            totalSpent: 0,
            saved: true,
          }
          const updated = [...existingRecords, newRecord]
          setDayRecords(updated)
          localStorage.setItem(
            `savewise_records_${session.user.email}`,
            JSON.stringify(updated)
          )
        }
      } catch {
        localStorage.removeItem("savewise_session")
      }
    }
    setIsHydrated(true)
  }, [])

  const saveRecords = useCallback(
    (records: DayRecord[], email: string) => {
      localStorage.setItem(
        `savewise_records_${email}`,
        JSON.stringify(records)
      )
    },
    []
  )

  const spendableAmount = user
    ? user.monthlyIncome - user.fixedExpenses - user.savingsGoal
    : 15000

  const daysInCurrentMonth = getDaysInMonth()

  const dailyBudget = parseFloat((spendableAmount / daysInCurrentMonth).toFixed(2))

  const today = getTodayStr()
  const todayRecord = dayRecords.find((r) => r.date === today)
  const todayExpenses = todayRecord?.expenses || []
  const todaySpent = todayExpenses.reduce((sum, e) => sum + e.amount, 0)

  const streak = calculateStreak(dayRecords)

  const signup = (
    email: string,
    password: string,
    monthlyIncome: number,
    fixedExpenses: number,
    savingsGoal: number
  ): boolean => {
    const existingUsers = JSON.parse(
      localStorage.getItem("savewise_users") || "[]"
    )
    if (existingUsers.find((u: { email: string }) => u.email === email)) {
      return false
    }

    const newUser: User = {
      email,
      monthlyIncome,
      fixedExpenses,
      savingsGoal,
      createdAt: new Date().toISOString(),
    }

    existingUsers.push({ ...newUser, password })
    localStorage.setItem("savewise_users", JSON.stringify(existingUsers))
    localStorage.setItem("savewise_session", JSON.stringify({ user: newUser }))

    setUser(newUser)
    setIsLoggedIn(true)

    const todayStr = getTodayStr()
    const initialRecords: DayRecord[] = [
      { date: todayStr, expenses: [], totalSpent: 0, saved: true },
    ]
    setDayRecords(initialRecords)
    saveRecords(initialRecords, email)

    return true
  }

  const login = (email: string, password: string): boolean => {
    const existingUsers = JSON.parse(
      localStorage.getItem("savewise_users") || "[]"
    )
    const found = existingUsers.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password
    )
    if (!found) return false

    const { password: _, ...userData } = found
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem(
      "savewise_session",
      JSON.stringify({ user: userData })
    )

    const savedRecords = localStorage.getItem(`savewise_records_${email}`)
    const records = savedRecords ? JSON.parse(savedRecords) : []

    const todayStr = getTodayStr()
    const todayExists = records.some((r: DayRecord) => r.date === todayStr)
    if (!todayExists) {
      records.push({
        date: todayStr,
        expenses: [],
        totalSpent: 0,
        saved: true,
      })
    }
    setDayRecords(records)
    saveRecords(records, email)

    return true
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setDayRecords([])
    localStorage.removeItem("savewise_session")
  }

  const addExpense = (
    amount: number,
    category: string,
    description: string
  ) => {
    if (!user) return

    const todayStr = getTodayStr()
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount,
      category,
      description,
      date: todayStr,
      timestamp: Date.now(),
    }

    setDayRecords((prev) => {
      const todayIdx = prev.findIndex((r) => r.date === todayStr)
      let updated: DayRecord[]

      if (todayIdx >= 0) {
        updated = prev.map((r, i) => {
          if (i === todayIdx) {
            const expenses = [...r.expenses, newExpense]
            const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
            return { ...r, expenses, totalSpent, saved: totalSpent <= dailyBudget }
          }
          return r
        })
      } else {
        updated = [
          ...prev,
          {
            date: todayStr,
            expenses: [newExpense],
            totalSpent: amount,
            saved: amount <= dailyBudget,
          },
        ]
      }

      saveRecords(updated, user.email)
      return updated
    })
  }

  const deleteExpense = (id: string) => {
    if (!user) return

    setDayRecords((prev) => {
      const updated = prev.map((r) => {
        const newExpenses = r.expenses.filter((e) => e.id !== id)
        const totalSpent = newExpenses.reduce((s, e) => s + e.amount, 0)
        return {
          ...r,
          expenses: newExpenses,
          totalSpent,
          saved: totalSpent <= dailyBudget,
        }
      })
      saveRecords(updated, user.email)
      return updated
    })
  }

  const updateBudgetSettings = (
    monthlyIncome: number,
    fixedExpenses: number,
    savingsGoal: number
  ) => {
    if (!user) return

    const updatedUser = { ...user, monthlyIncome, fixedExpenses, savingsGoal }
    setUser(updatedUser)

    localStorage.setItem(
      "savewise_session",
      JSON.stringify({ user: updatedUser })
    )

    const existingUsers = JSON.parse(
      localStorage.getItem("savewise_users") || "[]"
    )
    const updatedUsers = existingUsers.map(
      (u: { email: string; password: string }) => {
        if (u.email === user.email) {
          return { ...u, monthlyIncome, fixedExpenses, savingsGoal }
        }
        return u
      }
    )
    localStorage.setItem("savewise_users", JSON.stringify(updatedUsers))
  }

  if (!isHydrated) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        streak,
        dayRecords,
        todayExpenses,
        todaySpent,
        dailyBudget,
        daysInCurrentMonth,
        spendableAmount,
        login,
        signup,
        logout,
        addExpense,
        deleteExpense,
        updateBudgetSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
