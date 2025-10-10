import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { MapView } from "@/components/dashboard/map-view"
import { RecentAnalysis } from "@/components/dashboard/recent-analysis"
import { Map, Leaf, AlertTriangle, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
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

  // Fetch recent soil health data
  const { data: recentAnalyses } = await supabase
    .from("soil_health_data")
    .select(
      `
      id,
      analysis_date,
      erosion_risk,
      degradation_level,
      land_areas!inner(name)
    `,
    )
    .order("analysis_date", { ascending: false })
    .limit(5)

  // Fetch unread alerts count
  const { count: unreadAlerts } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  // Calculate stats
  const totalLandAreas = landAreas?.length || 0
  const criticalAreas =
    landAreas?.filter((area) => {
      // This would need to be joined with soil_health_data in a real query
      return false
    }).length || 0

  const formattedAnalyses =
    recentAnalyses?.map((analysis) => ({
      id: analysis.id,
      land_area_name: (analysis.land_areas as any).name,
      analysis_date: analysis.analysis_date,
      erosion_risk: analysis.erosion_risk || "unknown",
      degradation_level: analysis.degradation_level || 0,
    })) || []

  return (
    <>
      <Header title="Dashboard" unreadAlerts={unreadAlerts || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard title="Total Land Areas" value={totalLandAreas} icon={Map} description="Monitored zones" />
          <StatsCard
            title="Healthy Areas"
            value={totalLandAreas - criticalAreas}
            icon={Leaf}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard title="Critical Areas" value={criticalAreas} icon={AlertTriangle} description="Needs attention" />
          <StatsCard title="Avg. Health Score" value="78%" icon={TrendingUp} trend={{ value: 5, isPositive: true }} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <MapView landAreas={landAreas || []} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentAnalysis analyses={formattedAnalyses} />
        </div>
      </main>
    </>
  )
}
