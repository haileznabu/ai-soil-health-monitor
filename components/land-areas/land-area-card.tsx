import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import type { LandArea } from "@/lib/types/database"
import { formatDistanceToNow } from "date-fns"

interface LandAreaCardProps {
  landArea: LandArea
  latestHealth?: {
    degradation_level: number
    erosion_risk: string
    analysis_date: string
  }
}

export function LandAreaCard({ landArea, latestHealth }: LandAreaCardProps) {
  const getLandTypeColor = (type: string | null) => {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "moderate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "high":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{landArea.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {landArea.location_lat.toFixed(4)}, {landArea.location_lng.toFixed(4)}
            </CardDescription>
          </div>
          {landArea.land_type && (
            <Badge variant="outline" className={getLandTypeColor(landArea.land_type)}>
              {landArea.land_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {landArea.description && <p className="text-sm text-muted-foreground">{landArea.description}</p>}
          {landArea.area_size && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Area:</span>
              <span className="font-medium">{landArea.area_size} hectares</span>
            </div>
          )}
          {latestHealth ? (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latest Analysis</span>
                <Badge variant="outline" className={getRiskColor(latestHealth.erosion_risk)}>
                  {latestHealth.erosion_risk}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Degradation: {latestHealth.degradation_level}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(latestHealth.analysis_date), { addSuffix: true })}
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">No analysis data yet</p>
            </div>
          )}
          <Link href={`/dashboard/land-areas/${landArea.id}`}>
            <Button className="w-full bg-transparent" variant="outline">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
