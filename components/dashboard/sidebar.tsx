"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Map, Leaf, Bell, Settings, LogOut, Plus, Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

function SidebarContent() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-primary",
    },
    {
      label: "Land Areas",
      icon: Map,
      href: "/dashboard/land-areas",
      color: "text-primary",
    },
    {
      label: "Soil Health",
      icon: Leaf,
      href: "/dashboard/soil-health",
      color: "text-primary",
    },
    {
      label: "Alerts",
      icon: Bell,
      href: "/dashboard/alerts",
      color: "text-primary",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      color: "text-primary",
    },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-lg">Land ReGen</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start", pathname === route.href && "bg-secondary")}
              >
                <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
        <div className="mt-6 px-3">
          <Link href="/dashboard/land-areas">
            <Button className="w-full" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Land Area
            </Button>
          </Link>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </>
  )
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full flex-col border-r bg-card", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex h-full flex-col">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
