"use client"

import { useEffect, useRef } from "react"
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)

  // Initialize Leaflet map once on client
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const L = (await import("leaflet")).default as any
      if (!isMounted || mapRef.current || !mapContainerRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 2,
        worldCopyJump: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
      markersLayerRef.current = L.layerGroup().addTo(map)
    })()

    return () => {
      isMounted = false
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      markersLayerRef.current = null
    }
  }, [])

  // Sync markers with provided land areas
  useEffect(() => {
    const syncMarkers = async () => {
      const map = mapRef.current
      const markersLayer = markersLayerRef.current
      if (!map || !markersLayer) return

      const L = (await import("leaflet")).default as any

      markersLayer.clearLayers()

      const validPoints = landAreas.filter(
        (a) =>
          typeof a.location_lat === "number" &&
          !Number.isNaN(a.location_lat) &&
          typeof a.location_lng === "number" &&
          !Number.isNaN(a.location_lng),
      )

      validPoints.forEach((area) => {
        const color = area.degradation_level != null && area.degradation_level >= 70 ? "#ef4444" : "#2563eb"
        const fillColor = area.degradation_level != null && area.degradation_level >= 70 ? "#f87171" : "#3b82f6"

        L.circleMarker([area.location_lat, area.location_lng], {
          radius: 6,
          color,
          weight: 2,
          fillColor,
          fillOpacity: 0.9,
        })
          .bindPopup(
            `<strong>${area.name ?? "Land Area"}</strong>$${
              area.degradation_level != null ? ` <br/>Degradation: ${area.degradation_level}` : ""
            }`,
          )
          .addTo(markersLayer)
      })

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map((a: any) => [a.location_lat, a.location_lng]))
        map.fitBounds(bounds, { padding: [20, 20] })
      } else {
        map.setView([0, 0], 2)
      }
    }

    syncMarkers()
  }, [landAreas])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Land Areas Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full rounded-lg overflow-hidden">
          <div ref={mapContainerRef} className="absolute inset-0" />
        </div>
      </CardContent>
    </Card>
  )
}
