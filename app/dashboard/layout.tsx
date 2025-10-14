import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoadingProvider } from "@/components/ui/loading-provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="hidden md:flex w-64" />
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </div>
    </LoadingProvider>
  )
}
