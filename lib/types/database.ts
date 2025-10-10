export type UserRole = "farmer" | "policymaker" | "researcher" | "ngo" | "admin"
export type LandType = "agricultural" | "forest" | "grassland" | "urban" | "mixed"
export type ErosionRisk = "low" | "moderate" | "high" | "critical"
export type AlertType = "erosion" | "vegetation_loss" | "moisture_deficit" | "degradation" | "general"
export type Severity = "low" | "medium" | "high" | "critical"
export type RecommendationType =
  | "reforestation"
  | "soil_conservation"
  | "irrigation"
  | "crop_rotation"
  | "fertilization"
  | "general"
export type Priority = "low" | "medium" | "high"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  organization: string | null
  role: UserRole | null
  created_at: string
  updated_at: string
}

export interface LandArea {
  id: string
  user_id: string
  name: string
  description: string | null
  location_lat: number
  location_lng: number
  area_size: number | null
  land_type: LandType | null
  created_at: string
  updated_at: string
}

export interface SoilHealthData {
  id: string
  land_area_id: string
  analysis_date: string
  soil_moisture: number | null
  vegetation_index: number | null
  erosion_risk: ErosionRisk | null
  degradation_level: number | null
  soil_ph: number | null
  organic_matter: number | null
  temperature: number | null
  ai_analysis_summary: string | null
  satellite_image_url: string | null
  created_at: string
}

export interface Alert {
  id: string
  land_area_id: string
  user_id: string
  alert_type: AlertType
  severity: Severity
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Recommendation {
  id: string
  land_area_id: string
  soil_health_data_id: string
  recommendation_type: RecommendationType
  title: string
  description: string
  priority: Priority
  estimated_impact: string | null
  created_at: string
}
