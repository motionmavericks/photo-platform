import createClient from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: tags, error } = await supabase
      .from("tags")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json([])
  }
}
