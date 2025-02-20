export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      albums: {
        Row: {
          cover_photo_id: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          updated_at: string
        }
        Insert: {
          cover_photo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          cover_photo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_cover_photo_id_fkey"
            columns: ["cover_photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      albums_tags: {
        Row: {
          album_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          album_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          album_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_tags_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "albums_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          photo_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address: unknown
          photo_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          photo_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      face_detections: {
        Row: {
          bounding_box: Json
          confidence_score: number
          created_at: string
          id: string
          photo_id: string | null
          tag_id: string | null
        }
        Insert: {
          bounding_box: Json
          confidence_score: number
          created_at?: string
          id?: string
          photo_id?: string | null
          tag_id?: string | null
        }
        Update: {
          bounding_box?: Json
          confidence_score?: number
          created_at?: string
          id?: string
          photo_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "face_detections_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "face_detections_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          description: string | null
          height: number | null
          id: string
          mime_type: string
          original_filename: string
          size_bytes: number
          status: Database["public"]["Enums"]["photo_status"]
          storage_path: string
          title: string
          updated_at: string
          width: number | null
          // Basic Image Info
          format: string | null
          mode: string | null
          is_animated: boolean | null
          n_frames: number | null
          dpi_x: number | null
          dpi_y: number | null
          compression: string | null
          software: string | null
          comment: string | null
          color_depth: number | null
          has_palette: boolean | null
          // Camera and Exposure Info
          camera: string | null
          lens: string | null
          exposure_time: string | null
          aperture: string | null
          iso: string | null
          focal_length: string | null
          exposure_bias: string | null
          metering_mode: string | null
          white_balance: string | null
          // Color and Processing Info
          color_space: string | null
          contrast: string | null
          saturation: string | null
          sharpness: string | null
          // Dates and File Info
          date_created: string | null
          date_modified: string | null
          file_size: number | null
          // Rights Management and Usage
          keywords: string[] | null
          expiration_date: string | null
          license: string | null
          usage_restrictions: string | null
          rights_status: string | null
          uploader: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          mime_type: string
          original_filename: string
          size_bytes: number
          status?: Database["public"]["Enums"]["photo_status"]
          storage_path: string
          title: string
          updated_at?: string
          width?: number | null
          // Basic Image Info
          format?: string | null
          mode?: string | null
          is_animated?: boolean | null
          n_frames?: number | null
          dpi_x?: number | null
          dpi_y?: number | null
          compression?: string | null
          software?: string | null
          comment?: string | null
          color_depth?: number | null
          has_palette?: boolean | null
          // Camera and Exposure Info
          camera?: string | null
          lens?: string | null
          exposure_time?: string | null
          aperture?: string | null
          iso?: string | null
          focal_length?: string | null
          exposure_bias?: string | null
          metering_mode?: string | null
          white_balance?: string | null
          // Color and Processing Info
          color_space?: string | null
          contrast?: string | null
          saturation?: string | null
          sharpness?: string | null
          // Dates and File Info
          date_created?: string | null
          date_modified?: string | null
          file_size?: number | null
          // Rights Management and Usage
          keywords?: string[] | null
          expiration_date?: string | null
          license?: string | null
          usage_restrictions?: string | null
          rights_status?: string | null
          uploader?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          height?: number | null
          id?: string
          mime_type?: string
          original_filename?: string
          size_bytes?: number
          status?: Database["public"]["Enums"]["photo_status"]
          storage_path?: string
          title?: string
          updated_at?: string
          width?: number | null
          // Basic Image Info
          format?: string | null
          mode?: string | null
          is_animated?: boolean | null
          n_frames?: number | null
          dpi_x?: number | null
          dpi_y?: number | null
          compression?: string | null
          software?: string | null
          comment?: string | null
          color_depth?: number | null
          has_palette?: boolean | null
          // Camera and Exposure Info
          camera?: string | null
          lens?: string | null
          exposure_time?: string | null
          aperture?: string | null
          iso?: string | null
          focal_length?: string | null
          exposure_bias?: string | null
          metering_mode?: string | null
          white_balance?: string | null
          // Color and Processing Info
          color_space?: string | null
          contrast?: string | null
          saturation?: string | null
          sharpness?: string | null
          // Dates and File Info
          date_created?: string | null
          date_modified?: string | null
          file_size?: number | null
          // Rights Management and Usage
          keywords?: string[] | null
          expiration_date?: string | null
          license?: string | null
          usage_restrictions?: string | null
          rights_status?: string | null
          uploader?: string | null
        }
        Relationships: []
      }
      photos_albums: {
        Row: {
          album_id: string
          created_at: string
          photo_id: string
          position: number
        }
        Insert: {
          album_id: string
          created_at?: string
          photo_id: string
          position: number
        }
        Update: {
          album_id?: string
          created_at?: string
          photo_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "photos_albums_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_albums_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      photos_tags: {
        Row: {
          created_at: string
          photo_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          photo_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          photo_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_tags_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          created_at: string
          done: boolean | null
          id: number
          label: string | null
        }
        Insert: {
          created_at?: string
          done?: boolean | null
          id?: number
          label?: string | null
        }
        Update: {
          created_at?: string
          done?: boolean | null
          id?: number
          label?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      photo_status: "processing" | "active" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
