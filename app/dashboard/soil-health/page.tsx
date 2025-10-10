import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { AnalyzeImageDialog } from "@/components/soil-health/analyze-image-dialog"
import { HealthDataCard } from "@/components/soil-health/health-data-card"
import { Leaf } from "lucide-react"

export default async function SoilHealthPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's land areas for the dialog
  const { data: landAreas } = await supabase
    .from("land_areas")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  // Fetch all soil health data with land area names
  const { data: healthData } = await supabase
    .from("soil_health_data")
    .select(
      `
      *,
      land_areas!inner(name, user_id)
    `,
    )
    .eq("land_areas.user_id", user.id)
    .order("analysis_date", { ascending: false })

  // Fetch unread alerts count
  const { count: unreadAlerts } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  return (
    <>
      <Header title="Soil Health Analysis" unreadAlerts={unreadAlerts || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Soil Health Monitoring</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Analyze satellite imagery to monitor soil health and detect degradation
            </p>
          </div>
          {landAreas && landAreas.length > 0 && <AnalyzeImageDialog landAreas={landAreas} />}
        </div>

        {!landAreas || landAreas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No land areas registered</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              You need to add land areas before you can analyze soil health. Go to Land Areas to get started.
            </p>
          </div>
        ) : healthData && healthData.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {healthData.map((data) => (
              <HealthDataCard key={data.id} data={data as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Leaf className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No analysis data yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Upload satellite imagery to start analyzing soil health and monitoring degradation.
            </p>
            <AnalyzeImageDialog landAreas={landAreas} />
          </div>
        )}
      </main>
    </>
  )
}
