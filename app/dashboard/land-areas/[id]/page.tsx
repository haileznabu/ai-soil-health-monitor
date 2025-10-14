import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { LandArea } from "@/lib/types/database"
import { HealthDataCard } from "@/components/soil-health/health-data-card"
import { AnalyzeImageDialog } from "@/components/soil-health/analyze-image-dialog"

function getLandTypeColor(type: string | null) {
  switch (type) {
    case "agricultural":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400"
    case "forest":
      return "bg-green-500/10 text-green-700 dark:text-green-400"
    case "grassland":
      return "bg-lime-500/10 text-lime-700 dark:text-lime-400"
    case "urban":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    case "mixed":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
  }
}

export default async function LandAreaDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: landArea } = await supabase
    .from("land_areas")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!landArea) {
    notFound()
  }

  const { data: recentHealth } = await supabase
    .from("soil_health_data")
    .select(`*, land_areas!inner(name)`) // join to reuse HealthDataCard
    .eq("land_area_id", params.id)
    .order("analysis_date", { ascending: false })
    .limit(5)

  const { count: unreadAlerts } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  const landAreaTyped = landArea as LandArea

  return (
    <>
      <Header title={landAreaTyped.name} unreadAlerts={unreadAlerts || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/land-areas">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <h2 className="text-2xl font-semibold">Land Area Details</h2>
          </div>
          <AnalyzeImageDialog landAreas={[landAreaTyped]} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{landAreaTyped.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {landAreaTyped.location_lat.toFixed(4)}, {landAreaTyped.location_lng.toFixed(4)}
                  </CardDescription>
                </div>
                {landAreaTyped.land_type && (
                  <Badge variant="outline" className={getLandTypeColor(landAreaTyped.land_type)}>
                    {landAreaTyped.land_type}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {landAreaTyped.description && (
                <p className="text-sm text-muted-foreground">{landAreaTyped.description}</p>
              )}
              {landAreaTyped.area_size !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-medium">{landAreaTyped.area_size} hectares</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Updated {formatDistanceToNow(new Date(landAreaTyped.updated_at), { addSuffix: true })}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Analyses</h3>
              {(!recentHealth || recentHealth.length === 0) && (
                <p className="text-sm text-muted-foreground">No analysis data yet</p>
              )}
            </div>
            {recentHealth && recentHealth.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {recentHealth.map((d) => (
                  <HealthDataCard key={d.id} data={d as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
