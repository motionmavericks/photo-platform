-- Update photos table with basic image info
ALTER TABLE photos ADD COLUMN IF NOT EXISTS format text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS mode text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS is_animated boolean DEFAULT false;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS n_frames integer DEFAULT 1;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS dpi_x float;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS dpi_y float;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS compression text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS software text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS comment text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS color_depth integer;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS has_palette boolean;

-- Add camera and exposure info
ALTER TABLE photos ADD COLUMN IF NOT EXISTS camera text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS lens text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS exposure_time text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS aperture text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS iso text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS focal_length text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS exposure_bias text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS metering_mode text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS white_balance text;

-- Add color and processing info
ALTER TABLE photos ADD COLUMN IF NOT EXISTS color_space text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS contrast text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS saturation text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS sharpness text;

-- Add dates and file info
ALTER TABLE photos ADD COLUMN IF NOT EXISTS date_created timestamptz;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS date_modified timestamptz;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS file_size bigint;

-- Add rights management and usage fields
ALTER TABLE photos ADD COLUMN IF NOT EXISTS keywords text[];
ALTER TABLE photos ADD COLUMN IF NOT EXISTS expiration_date timestamptz;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS license text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS usage_restrictions text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS rights_status text;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS uploader text;

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_photos_date_created ON photos(date_created);
CREATE INDEX IF NOT EXISTS idx_photos_date_modified ON photos(date_modified);
CREATE INDEX IF NOT EXISTS idx_photos_camera ON photos(camera);
CREATE INDEX IF NOT EXISTS idx_photos_lens ON photos(lens);

-- Add comments for documentation
COMMENT ON COLUMN photos.format IS 'Image format (e.g., JPEG, PNG)';
COMMENT ON COLUMN photos.mode IS 'Color mode (e.g., RGB, CMYK)';
COMMENT ON COLUMN photos.is_animated IS 'Whether the image is animated (e.g., GIF)';
COMMENT ON COLUMN photos.n_frames IS 'Number of frames for animated images';
COMMENT ON COLUMN photos.dpi_x IS 'Horizontal DPI';
COMMENT ON COLUMN photos.dpi_y IS 'Vertical DPI';
COMMENT ON COLUMN photos.compression IS 'Compression method used';
COMMENT ON COLUMN photos.software IS 'Software used to create/edit the image';
COMMENT ON COLUMN photos.comment IS 'Image comment/description';
COMMENT ON COLUMN photos.color_depth IS 'Bits per pixel';
COMMENT ON COLUMN photos.has_palette IS 'Whether image has a color palette';
COMMENT ON COLUMN photos.camera IS 'Camera model used';
COMMENT ON COLUMN photos.lens IS 'Lens model used';
COMMENT ON COLUMN photos.exposure_time IS 'Exposure time/shutter speed';
COMMENT ON COLUMN photos.aperture IS 'Aperture f-number';
COMMENT ON COLUMN photos.iso IS 'ISO speed';
COMMENT ON COLUMN photos.focal_length IS 'Lens focal length';
COMMENT ON COLUMN photos.exposure_bias IS 'Exposure bias/compensation';
COMMENT ON COLUMN photos.metering_mode IS 'Light metering mode';
COMMENT ON COLUMN photos.white_balance IS 'White balance setting';
COMMENT ON COLUMN photos.color_space IS 'Color space (e.g., sRGB)';
COMMENT ON COLUMN photos.contrast IS 'Contrast setting';
COMMENT ON COLUMN photos.saturation IS 'Saturation setting';
COMMENT ON COLUMN photos.sharpness IS 'Sharpness setting';
COMMENT ON COLUMN photos.date_created IS 'File creation date';
COMMENT ON COLUMN photos.date_modified IS 'File modification date';
COMMENT ON COLUMN photos.file_size IS 'File size in bytes';
COMMENT ON COLUMN photos.keywords IS 'Array of keywords/tags';
COMMENT ON COLUMN photos.expiration_date IS 'Content expiration date';
COMMENT ON COLUMN photos.license IS 'License type';
COMMENT ON COLUMN photos.usage_restrictions IS 'Usage restriction details';
COMMENT ON COLUMN photos.rights_status IS 'Rights management status';
COMMENT ON COLUMN photos.uploader IS 'Person who uploaded the photo';
