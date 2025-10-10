"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { LandType } from "@/lib/types/database"

export function AddLandAreaDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location_lat: "",
    location_lng: "",
    area_size: "",
    land_type: "" as LandType,
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("land_areas").insert({
        user_id: user.id,
        name: formData.name,
        description: formData.description || null,
        location_lat: Number.parseFloat(formData.location_lat),
        location_lng: Number.parseFloat(formData.location_lng),
        area_size: formData.area_size ? Number.parseFloat(formData.area_size) : null,
        land_type: formData.land_type || null,
      })

      if (error) throw error

      setOpen(false)
      setFormData({
        name: "",
        description: "",
        location_lat: "",
        location_lng: "",
        area_size: "",
        land_type: "" as LandType,
      })
      router.refresh()
    } catch (error) {
      console.error("Error adding land area:", error)
      alert("Failed to add land area. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Land Area
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Land Area</DialogTitle>
            <DialogDescription>Register a new land area for monitoring soil health and degradation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="e.g., North Field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the land area"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g., -1.2921"
                  value={formData.location_lat}
                  onChange={(e) => setFormData({ ...formData, location_lat: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g., 36.8219"
                  value={formData.location_lng}
                  onChange={(e) => setFormData({ ...formData, location_lng: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area_size">Area Size (hectares)</Label>
                <Input
                  id="area_size"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 10.5"
                  value={formData.area_size}
                  onChange={(e) => setFormData({ ...formData, area_size: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="land_type">Land Type</Label>
                <Select
                  value={formData.land_type}
                  onValueChange={(value) => setFormData({ ...formData, land_type: value as LandType })}
                >
                  <SelectTrigger id="land_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="grassland">Grassland</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Land Area"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
