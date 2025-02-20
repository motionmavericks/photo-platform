import createClient from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

type Props = {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const id = await Promise.resolve(params.id)
    const supabase = await createClient()
    const { data: photo } = await supabase
      .from("photos")
      .select("storage_path, original_filename")
      .eq("id", id)
      .single()

    if (!photo) {
      return new NextResponse("Photo not found", { status: 404 })
    }

    const { data: file, error } = await supabase.storage
      .from("photos")
      .download(photo.storage_path)

    if (error || !file) {
      console.error("Error downloading photo:", error)
      return new NextResponse("Error downloading photo", { status: 500 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving photo:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}