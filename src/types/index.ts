import { Database } from "./database"

export type DatabasePhoto = Database["public"]["Tables"]["photos"]["Row"]

interface PhotoTag {
  tags: {
    id: string
    name: string
  }
}

export interface Photo extends DatabasePhoto {
  isFavorite?: boolean
  tags?: string[]
  photos_tags?: PhotoTag[]
  faceDetections?: {
    id: string
    bounding_box: {
      x: number
      y: number
      width: number
      height: number
    }
    confidence_score: number
    tag_id: string | null
  }[]
}

export type PhotoStatus = Database["public"]["Enums"]["photo_status"]

export interface Tag {
  id: string
  name: string
  type?: "person" | "general"
}
