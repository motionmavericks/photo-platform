import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const supabase = createClient(
  env().SUPABASE_URL,
  env().SUPABASE_BASE_KEY
);

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/albums - Start');
    const body = await request.json();
    console.log('Request body:', body);
    const { name, description, is_public } = body;

    console.log('Creating album with:', { name, description, is_public });
    const { data: album, error } = await supabase
      .from("albums")
      .insert({
        name,
        description,
        is_public,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating album:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      return NextResponse.json(
        { error: "Failed to create album" },
        { status: 500 }
      );
    }

    console.log('Album created successfully:', album);
    return NextResponse.json(album);
  } catch (error) {
    console.error("Error processing request:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: albums, error } = await supabase
      .from("albums")
      .select(`
        *,
        cover_photo:photos!cover_photo_id (
          id,
          title,
          storage_path
        ),
        photos_albums (
          position,
          photos (
            id,
            title,
            storage_path
          )
        ),
        albums_tags (
          tags (
            id,
            name
          )
        )
      `);

    if (error) {
      console.error("Error fetching albums:", error);
      return NextResponse.json(
        { error: "Failed to fetch albums" },
        { status: 500 }
      );
    }

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
