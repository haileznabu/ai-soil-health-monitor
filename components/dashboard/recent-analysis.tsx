import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AnalysisItem {
  id: string
  land_area_name: string
  analysis_date: string
  erosion_risk: string
  degradation_level: number
}

interface RecentAnalysisProps {
  analyses: AnalysisItem[]
}

export function RecentAnalysis({ analyses }: RecentAnalysisProps) {
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
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No analysis data yet</p>
          ) : (
            analyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{analysis.land_area_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(analysis.analysis_date), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getRiskColor(analysis.erosion_risk)}>
                    {analysis.erosion_risk}
                  </Badge>
                  <span className="text-sm font-medium">{analysis.degradation_level}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
