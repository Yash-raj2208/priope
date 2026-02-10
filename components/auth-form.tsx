"use client"

import React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, UserPlus, LogIn, IndianRupee, HeartPulse } from "lucide-react"

export function AuthForm() {
  const { login, signup } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("login")

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [fixedExpenses, setFixedExpenses] = useState("")
  const [enableEmergency, setEnableEmergency] = useState(false)
  const [emergencyMedicalSavings, setEmergencyMedicalSavings] = useState("")
  const [savingsGoal, setSavingsGoal] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 800))

    const success = login(loginEmail, loginPassword)
    if (!success) {
      setError("Invalid email or password. Please try again.")
    }
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signupEmail || !signupPassword || !monthlyIncome) {
      setError("Please fill in all required fields.")
      return
    }

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const success = signup(
      signupEmail,
      signupPassword,
      Number(monthlyIncome),
      Number(fixedExpenses) || 0,
      enableEmergency ? Number(emergencyMedicalSavings) || 0 : 0,
      Number(savingsGoal) || 0
    )

    if (!success) {
      setError("An account with this email already exists.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl font-bold text-foreground">
            Welcome to SaveWise
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to track your budget and build your saving streaks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                {error && activeTab === "login" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={isLoading} className="mt-2 w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="monthly-income">
                    Monthly Income (required)
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="monthly-income"
                      type="number"
                      placeholder="30000"
                      className="pl-9"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fixed-expenses">Fixed Expenses</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fixed-expenses"
                      type="number"
                      placeholder="10000"
                      className="pl-9"
                      value={fixedExpenses}
                      onChange={(e) => setFixedExpenses(e.target.value)}
                    />
                  </div>
                </div>

                {/* Emergency Medical Savings */}
                <div className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enable-emergency"
                      checked={enableEmergency}
                      onCheckedChange={(checked) => {
                        setEnableEmergency(checked === true)
                        if (!checked) setEmergencyMedicalSavings("")
                      }}
                    />
                    <Label htmlFor="enable-emergency" className="flex cursor-pointer items-center gap-1.5 text-sm">
                      <HeartPulse className="h-4 w-4 text-destructive" />
                      Emergency Medical Savings
                    </Label>
                  </div>
                  <div className={`mt-3 transition-opacity ${enableEmergency ? "opacity-100" : "pointer-events-none opacity-40"}`}>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="emergency-savings"
                        type="number"
                        placeholder="500"
                        className="pl-9"
                        value={emergencyMedicalSavings}
                        onChange={(e) => setEmergencyMedicalSavings(e.target.value)}
                        disabled={!enableEmergency}
                        min="0"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      This amount will be deducted from your daily budget for medical emergencies.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="savings-goal">Savings Goal</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="savings-goal"
                      type="number"
                      placeholder="5000"
                      className="pl-9"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                    />
                  </div>
                </div>

                {error && activeTab === "signup" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button type="submit" disabled={isLoading} className="mt-2 w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}