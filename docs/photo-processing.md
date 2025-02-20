# Photo Processing Integration Guide

## Connection Details
```
URL: https://rthnpitxydzbjssrqbpz.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0aG5waXR4eWR6Ympzc3JxYnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDk1MjMsImV4cCI6MjA1NTU4NTUyM30.JeNRfrB8E58KxqAbSZF77XxeZ4vKYSjdt_Mouno13MY
```

## Database Schema

### Photos Table
```sql
CREATE TABLE public.photos (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,                 -- Use filename
    description text,                    -- Optional description
    storage_path text NOT NULL,          -- Format: photos/{uuid}-{filename}
    original_filename text NOT NULL,     -- Original filename
    mime_type text NOT NULL,            -- e.g., 'image/jpeg'
    size_bytes bigint NOT NULL,         -- File size
    width integer,                      -- Optional image dimensions
    height integer,                     -- Optional image dimensions
    status photo_status NOT NULL,       -- Enum: 'processing', 'active', 'archived'
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
```

### Face Detections Table
```sql
CREATE TABLE public.face_detections (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,  -- Optional: link to person tag
    confidence_score float NOT NULL,                          -- Between 0 and 1
    bounding_box jsonb NOT NULL,                             -- Format below
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Bounding box format:
{
    "x": 0.1,       -- Percentage from left (0-1)
    "y": 0.2,       -- Percentage from top (0-1)
    "width": 0.3,   -- Percentage of image width (0-1)
    "height": 0.4   -- Percentage of image height (0-1)
}
```

### Tags Table
```sql
CREATE TABLE public.tags (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL UNIQUE,          -- For people: "person:{name}"
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Link photos to tags
CREATE TABLE public.photos_tags (
    photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (photo_id, tag_id)
);
```

## Processing Flow

1. Upload Photo to Storage:
```python
storage_path = f"photos/{uuid.uuid4()}-{original_filename}"
result = supabase.storage.from_('photos').upload(
    path=storage_path,
    file=photo_data
)
```

2. Create Photo Record:
```sql
INSERT INTO photos (
    title,
    storage_path,
    original_filename,
    mime_type,
    size_bytes,
    width,
    height,
    status
) VALUES (
    'DSC01562.jpg',
    'photos/123e4567-e89b-12d3-a456-426614174000-DSC01562.jpg',
    'DSC01562.jpg',
    'image/jpeg',
    1234567,
    3000,
    2000,
    'processing'
) RETURNING id;
```

3. For Each Detected Face:
   
   a. Create/Get Person Tag if Face is Recognized:
   ```sql
   INSERT INTO tags (name)
   VALUES ('person:julie')
   ON CONFLICT (name) DO UPDATE 
   SET name = EXCLUDED.name
   RETURNING id;
   ```

   b. Link Tag to Photo:
   ```sql
   INSERT INTO photos_tags (photo_id, tag_id)
   VALUES ('photo-uuid', 'tag-uuid');
   ```

   c. Store Face Detection Data:
   ```sql
   INSERT INTO face_detections (
       photo_id,
       tag_id,           -- Optional: only if face recognized
       confidence_score,
       bounding_box
   ) VALUES (
       'photo-uuid',
       'tag-uuid',
       0.98,
       '{"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4}'
   );
   ```

4. Mark Photo as Active:
```sql
UPDATE photos 
SET status = 'active'
WHERE id = 'photo-uuid';
```

## Important Notes

1. Required Fields:
   - When creating a photo record, ALL non-null fields must be provided
   - Bounding boxes must use percentages (0-1) not pixels
   - Person tags must be prefixed with "person:"

2. Status Flow:
   - Set status = 'processing' when creating photo
   - Update to 'active' after processing complete
   - Use 'archived' for deleted/hidden photos

3. Storage:
   - All files must be in 'photos' bucket
   - Use UUID-filename format for storage_path
   - Keep original filename in database

4. Face Detections:
   - Store confidence scores as floats between 0-1
   - Bounding boxes must be valid JSON
   - Link to person tags when face is recognized

No authentication is required - all operations can be performed with the anon key.
