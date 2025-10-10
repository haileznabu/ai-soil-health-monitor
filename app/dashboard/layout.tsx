import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex w-64" />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
