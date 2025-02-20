-- Create face detections table
CREATE TABLE public.face_detections (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    photo_id uuid REFERENCES public.photos(id) ON DELETE CASCADE,
    tag_id uuid REFERENCES public.tags(id) ON DELETE CASCADE,
    confidence_score float NOT NULL,
    bounding_box jsonb NOT NULL, -- {x, y, width, height}
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX idx_face_detections_photo_id ON public.face_detections(photo_id);
CREATE INDEX idx_face_detections_tag_id ON public.face_detections(tag_id);

-- Enable RLS
ALTER TABLE public.face_detections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Face detections are viewable by everyone" ON public.face_detections
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage face detections" ON public.face_detections
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- Grant permissions
GRANT SELECT ON public.face_detections TO anon;
GRANT ALL ON public.face_detections TO authenticated;
