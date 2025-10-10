"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Alert } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface AlertCardProps {
  alert: Alert & { land_areas: { name: string } }
}

export function AlertCard({ alert }: AlertCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "high":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "critical":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  const getAlertIcon = (severity: string) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="h-5 w-5 text-orange-500" />
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const handleMarkAsRead = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("alerts").update({ is_read: true }).eq("id", alert.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error marking alert as read:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("alerts").delete().eq("id", alert.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting alert:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={alert.is_read ? "opacity-60" : ""}>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">{getAlertIcon(alert.severity)}</div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{alert.title}</h3>
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.land_areas.name}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm">{alert.message}</p>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
              </p>
              {!alert.is_read && (
                <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={loading}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
