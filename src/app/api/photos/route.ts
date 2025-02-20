import createClient from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    console.log("Fetching photos from Supabase...")
    const { data: photos, error } = await supabase
      .from("photos")
      .select(`
        *,
        face_detections (
          id,
          bounding_box,
          confidence_score,
          tag_id
        ),
        photos_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching photos:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 })
    }

    console.log("Raw photos data:", JSON.stringify(photos, null, 2))
    
    // Transform the data to match our Photo type
    const transformedPhotos = (photos || []).map((photo) => ({
      ...photo,
      isFavorite: false, // TODO: Implement favorites
      faceDetections: photo.face_detections || [],
      tags: (photo.photos_tags || []).map((pt) => pt.tags),
    }))

    return NextResponse.json(transformedPhotos)
  } catch (error) {
    console.error("Error in photos API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
