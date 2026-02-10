"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { BudgetTracker } from "@/components/budget-tracker"
import { PurchasePlanner } from "@/components/purchase-planner"
import { AuthForm } from "@/components/auth-form"
import { UserProfile } from "@/components/user-profile"

function DashboardContent() {
  const { isLoggedIn } = useAuth()
  const [activeSection, setActiveSection] = useState("budget")

  const currentSection = () => {
    if (activeSection === "auth" && isLoggedIn) return "profile"
    if (activeSection === "profile" && !isLoggedIn) return "auth"
    return activeSection
  }

  const section = currentSection()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar activeSection={section} onSectionChange={setActiveSection} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        {/* Desktop: Show all panels in a grid */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="flex flex-col gap-6">
            <BudgetTracker />
          </div>
          <div className="flex flex-col gap-6">
            <PurchasePlanner />
          </div>
          <div className="flex flex-col gap-6">
            {isLoggedIn ? <UserProfile /> : <AuthForm />}
          </div>
        </div>

        {/* Mobile/Tablet: Show one panel at a time */}
        <div className="lg:hidden">
          {section === "budget" && <BudgetTracker />}
          {section === "planner" && <PurchasePlanner />}
          {section === "auth" && !isLoggedIn && <AuthForm />}
          {section === "profile" && isLoggedIn && <UserProfile />}
        </div>
      </main>

      <footer className="border-t border-border bg-card px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          SaveWise - Your smart personal finance companion. Built with care for
          better saving habits.
        </p>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
