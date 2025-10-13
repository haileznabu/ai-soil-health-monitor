import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Droplets, Leaf, Thermometer, FlaskConical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { SoilHealthData } from "@/lib/types/database"

interface HealthDataCardProps {
  data: SoilHealthData & { land_areas: { name: string } }
}

export function HealthDataCard({ data }: HealthDataCardProps) {
  const getRiskColor = (risk: string | null) => {
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
            <CardTitle className="text-lg">{data.land_areas.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(data.analysis_date), { addSuffix: true })}
            </p>
          </div>
          {data.erosion_risk && (
            <Badge variant="outline" className={getRiskColor(data.erosion_risk)}>
              {data.erosion_risk} risk
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-muted">
          <img
            src={data.satellite_image_url || "/placeholder.svg"}
            alt="Satellite imagery"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          {data.degradation_level !== null && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Degradation Level</span>
                <span className="font-medium">{data.degradation_level.toFixed(1)}%</span>
              </div>
              <Progress value={data.degradation_level} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {data.soil_moisture !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Moisture</p>
                  <p className="font-medium">{data.soil_moisture.toFixed(1)}%</p>
                </div>
              </div>
            )}

            {data.vegetation_index !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Leaf className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">NDVI</p>
                  <p className="font-medium">{data.vegetation_index.toFixed(3)}</p>
                </div>
              </div>
            )}

            {data.temperature !== null && (
              <div className="flex items-center gap-2 text-sm">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Temp</p>
                  <p className="font-medium">{data.temperature.toFixed(1)}°C</p>
                </div>
              </div>
            )}

            {data.soil_ph !== null && (
              <div className="flex items-center gap-2 text-sm">
                <FlaskConical className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">pH</p>
                  <p className="font-medium">{data.soil_ph.toFixed(1)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {data.ai_analysis_summary && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1">AI Analysis</p>
            <p className="text-sm">{data.ai_analysis_summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
