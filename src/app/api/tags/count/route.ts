import createClient from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { count } = await supabase
      .from("tags")
      .select("*", { count: "exact", head: true })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching tags count:", error)
    return NextResponse.json({ count: 0 })
  }
}
