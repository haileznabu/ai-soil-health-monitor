import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { AlertCard } from "@/components/alerts/alert-card"
import { Bell, CheckCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AlertsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all alerts
  const { data: allAlerts } = await supabase
    .from("alerts")
    .select(
      `
      *,
      land_areas!inner(name)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const unreadAlerts = allAlerts?.filter((alert) => !alert.is_read) || []
  const readAlerts = allAlerts?.filter((alert) => alert.is_read) || []

  const { count: unreadCount } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  return (
    <>
      <Header title="Alerts" unreadAlerts={unreadCount || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Alerts & Notifications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Stay informed about critical land degradation and soil health issues
            </p>
          </div>
        </div>

        <Tabs defaultValue="unread" className="space-y-6">
          <TabsList>
            <TabsTrigger value="unread" className="gap-2">
              <Bell className="h-4 w-4" />
              Unread ({unreadAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <CheckCheck className="h-4 w-4" />
              All Alerts ({allAlerts?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="space-y-4">
            {unreadAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No unread alerts</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  You're all caught up! New alerts will appear here when critical issues are detected.
                </p>
              </div>
            ) : (
              unreadAlerts.map((alert) => <AlertCard key={alert.id} alert={alert as any} />)
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allAlerts && allAlerts.length > 0 ? (
              allAlerts.map((alert) => <AlertCard key={alert.id} alert={alert as any} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Alerts will be generated automatically when soil health analysis detects critical issues.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
