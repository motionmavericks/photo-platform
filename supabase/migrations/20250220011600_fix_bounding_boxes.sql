-- First, let's see the current data
SELECT 'CURRENT FACE DETECTIONS:' as section;
SELECT * FROM face_detections;

-- Fix the bounding box format for all detections except DSC01574
UPDATE face_detections
SET bounding_box = jsonb_build_object(
  'x', (bounding_box->>'x')::float / 100,
  'y', (bounding_box->>'y')::float / 100,
  'width', (bounding_box->>'width')::float / 100,
  'height', (bounding_box->>'height')::float / 100
)
WHERE photo_id IN (
  SELECT id FROM photos 
  WHERE title LIKE 'Test Photo%'
);

-- Verify the changes
SELECT 'UPDATED FACE DETECTIONS:' as section;
SELECT * FROM face_detections;
