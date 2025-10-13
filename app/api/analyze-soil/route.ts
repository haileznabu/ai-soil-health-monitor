import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { analyzeSoilHealth } from "@/lib/ai/analyze-soil-health"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { land_area_id, image_base64 } = body

    // Fetch land area details
    const { data: landArea, error: landAreaError } = await supabase
      .from("land_areas")
      .select("*")
      .eq("id", land_area_id)
      .eq("user_id", user.id)
      .single()

    if (landAreaError || !landArea) {
      return NextResponse.json({ error: "Land area not found" }, { status: 404 })
    }

    // Get previous analysis for context
    const { data: previousAnalysis } = await supabase
      .from("soil_health_data")
      .select("degradation_level, erosion_risk")
      .eq("land_area_id", land_area_id)
      .order("analysis_date", { ascending: false })
      .limit(1)
      .single()

    // Perform AI analysis
    const analysis = await analyzeSoilHealth({
      imageBase64: image_base64,
      location: {
        lat: landArea.location_lat,
        lng: landArea.location_lng,
      },
      landType: landArea.land_type || undefined,
      previousData: previousAnalysis || undefined,
    })

    // Store soil health data
    const { data: soilHealthData, error: soilHealthError } = await supabase
      .from("soil_health_data")
      .insert({
        land_area_id: land_area_id,
        soil_moisture: analysis.soil_moisture,
        vegetation_index: analysis.vegetation_index,
        erosion_risk: analysis.erosion_risk,
        degradation_level: analysis.degradation_level,
        soil_ph: analysis.soil_ph,
        organic_matter: analysis.organic_matter,
        temperature: analysis.temperature,
        ai_analysis_summary: analysis.ai_analysis_summary,
        // Store the actual provided image data URL so the UI can render it
        satellite_image_url: typeof image_base64 === "string" ? image_base64 : null,
      })
      .select()
      .single()

    if (soilHealthError) {
      console.error("[v0] Error storing soil health data:", soilHealthError)
      return NextResponse.json({ error: "Failed to store analysis" }, { status: 500 })
    }

    // Create alert if degradation is significant
    if (analysis.degradation_level > 60 || analysis.erosion_risk === "critical" || analysis.erosion_risk === "high") {
      await supabase.from("alerts").insert({
        land_area_id: land_area_id,
        user_id: user.id,
        alert_type:
          analysis.erosion_risk === "critical" || analysis.erosion_risk === "high" ? "erosion" : "degradation",
        severity: analysis.degradation_level > 80 || analysis.erosion_risk === "critical" ? "critical" : "high",
        title:
          analysis.erosion_risk === "critical" || analysis.erosion_risk === "high"
            ? "High Erosion Risk Detected"
            : "Significant Degradation Detected",
        message: `${landArea.name} shows ${analysis.degradation_level.toFixed(1)}% degradation with ${analysis.erosion_risk} erosion risk. ${analysis.ai_analysis_summary}`,
      })
    }

    // Store recommendations
    if (analysis.recommendations && analysis.recommendations.length > 0) {
      await supabase.from("recommendations").insert(
        analysis.recommendations.map((rec) => ({
          land_area_id: land_area_id,
          soil_health_data_id: soilHealthData.id,
          recommendation_type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
        })),
      )
    }

    return NextResponse.json({
      success: true,
      analysis: analysis,
      soil_health_id: soilHealthData.id,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
