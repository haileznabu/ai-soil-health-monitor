import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { AddLandAreaDialog } from "@/components/land-areas/add-land-area-dialog"
import { LandAreaCard } from "@/components/land-areas/land-area-card"
import { MapPin } from "lucide-react"

export default async function LandAreasPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user's land areas
  const { data: landAreas } = await supabase
    .from("land_areas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch latest health data for each land area
  const landAreasWithHealth = await Promise.all(
    (landAreas || []).map(async (area) => {
      const { data: latestHealth } = await supabase
        .from("soil_health_data")
        .select("degradation_level, erosion_risk, analysis_date")
        .eq("land_area_id", area.id)
        .order("analysis_date", { ascending: false })
        .limit(1)
        .single()

      return {
        ...area,
        latestHealth: latestHealth || undefined,
      }
    }),
  )

  // Fetch unread alerts count
  const { count: unreadAlerts } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  return (
    <>
      <Header title="Land Areas" unreadAlerts={unreadAlerts || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Your Land Areas</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and monitor your registered land areas for soil health analysis
            </p>
          </div>
          <AddLandAreaDialog />
        </div>

        {landAreasWithHealth.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No land areas yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Start by adding your first land area to begin monitoring soil health and detecting degradation.
            </p>
            <AddLandAreaDialog />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {landAreasWithHealth.map((area) => (
              <LandAreaCard key={area.id} landArea={area} latestHealth={area.latestHealth} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
