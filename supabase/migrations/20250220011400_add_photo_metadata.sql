-- Add new metadata columns to photos table
ALTER TABLE public.photos
-- File Information
ADD COLUMN color_depth INTEGER,
ADD COLUMN has_palette BOOLEAN,
ADD COLUMN compression_type TEXT,

-- Dates
ADD COLUMN date_created TIMESTAMP WITH TIME ZONE,
ADD COLUMN date_modified TIMESTAMP WITH TIME ZONE,
ADD COLUMN date_taken TIMESTAMP WITH TIME ZONE,
ADD COLUMN expiration_date TIMESTAMP WITH TIME ZONE,

-- Camera/Technical
ADD COLUMN camera_make TEXT,
ADD COLUMN camera_model TEXT,
ADD COLUMN exposure_time TEXT,
ADD COLUMN f_number TEXT,
ADD COLUMN iso TEXT,
ADD COLUMN focal_length TEXT,
ADD COLUMN flash TEXT,
ADD COLUMN white_balance TEXT,

-- Rights Management
ADD COLUMN copyright TEXT,
ADD COLUMN artist TEXT,
ADD COLUMN license TEXT,
ADD COLUMN usage_restrictions TEXT,
ADD COLUMN rights_status TEXT,

-- Content Management
ADD COLUMN keywords TEXT[], -- Array of keywords/tags
ADD COLUMN uploader TEXT,
ADD COLUMN software TEXT;

-- Create indexes for commonly queried metadata fields
CREATE INDEX idx_photos_date_taken ON public.photos(date_taken);
CREATE INDEX idx_photos_camera_make ON public.photos(camera_make);
CREATE INDEX idx_photos_camera_model ON public.photos(camera_model);
CREATE INDEX idx_photos_keywords ON public.photos USING GIN(keywords);

-- Update RLS policies to include new columns
-- No changes needed as existing policies are column-agnostic

COMMENT ON COLUMN public.photos.color_depth IS 'Bits per pixel';
COMMENT ON COLUMN public.photos.has_palette IS 'Whether image has a color palette';
COMMENT ON COLUMN public.photos.compression_type IS 'Type of compression used';
COMMENT ON COLUMN public.photos.date_created IS 'File creation date';
COMMENT ON COLUMN public.photos.date_modified IS 'File modification date';
COMMENT ON COLUMN public.photos.date_taken IS 'Photo capture date from EXIF';
COMMENT ON COLUMN public.photos.expiration_date IS 'Content expiration date if applicable';
COMMENT ON COLUMN public.photos.camera_make IS 'Camera manufacturer';
COMMENT ON COLUMN public.photos.camera_model IS 'Camera model';
COMMENT ON COLUMN public.photos.exposure_time IS 'Exposure time/shutter speed';
COMMENT ON COLUMN public.photos.f_number IS 'Aperture f-number';
COMMENT ON COLUMN public.photos.iso IS 'ISO speed';
COMMENT ON COLUMN public.photos.focal_length IS 'Lens focal length';
COMMENT ON COLUMN public.photos.flash IS 'Flash settings';
COMMENT ON COLUMN public.photos.white_balance IS 'White balance settings';
COMMENT ON COLUMN public.photos.copyright IS 'Copyright information';
COMMENT ON COLUMN public.photos.artist IS 'Creator/photographer';
COMMENT ON COLUMN public.photos.license IS 'License type';
COMMENT ON COLUMN public.photos.usage_restrictions IS 'Usage restriction details';
COMMENT ON COLUMN public.photos.rights_status IS 'Rights management status';
COMMENT ON COLUMN public.photos.keywords IS 'Array of keywords/tags';
COMMENT ON COLUMN public.photos.uploader IS 'Person who uploaded the photo';
COMMENT ON COLUMN public.photos.software IS 'Software used to create/edit';
