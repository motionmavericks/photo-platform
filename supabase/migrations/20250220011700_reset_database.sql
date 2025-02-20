-- Delete all objects from storage buckets
DELETE FROM storage.objects WHERE bucket_id = 'photos';

-- Delete all data from tables
TRUNCATE photos_tags CASCADE;
TRUNCATE face_detections CASCADE;
TRUNCATE photos CASCADE;
TRUNCATE tags CASCADE;
TRUNCATE albums_tags CASCADE;
TRUNCATE albums CASCADE;
TRUNCATE downloads CASCADE;

-- Reset all sequences
ALTER SEQUENCE IF EXISTS photos_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS tags_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS albums_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS downloads_id_seq RESTART WITH 1;
