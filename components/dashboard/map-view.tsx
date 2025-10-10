"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface MapViewProps {
  landAreas?: Array<{
    id: string
    name: string
    location_lat: number
    location_lng: number
    degradation_level?: number
  }>
}

export function MapView({ landAreas = [] }: MapViewProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Land Areas Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full rounded-lg bg-muted overflow-hidden">
          {/* Placeholder for map - will integrate real map in next steps */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive map will display here</p>
              <p className="text-xs text-muted-foreground mt-1">
                {landAreas.length} land area{landAreas.length !== 1 ? "s" : ""} registered
              </p>
            </div>
          </div>
          {/* Simple visualization of land areas */}
          {landAreas.map((area, index) => (
            <div
              key={area.id}
              className="absolute w-3 h-3 rounded-full bg-primary animate-pulse"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + index * 10}%`,
              }}
              title={area.name}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
