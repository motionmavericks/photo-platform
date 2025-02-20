-- Dump all data
SELECT 'PHOTOS TABLE:' as section;
SELECT * FROM photos;

SELECT 'FACE DETECTIONS TABLE:' as section;
SELECT * FROM face_detections;

SELECT 'TAGS TABLE:' as section;
SELECT * FROM tags;

SELECT 'PHOTO TAGS TABLE:' as section;
SELECT * FROM photos_tags;

SELECT 'FULL DATA WITH RELATIONSHIPS:' as section;
SELECT 
    p.*,
    json_agg(DISTINCT fd.*) as face_detections,
    json_agg(DISTINCT jsonb_build_object(
        'tag_id', t.id,
        'tag_name', t.name
    )) as tags
FROM photos p
LEFT JOIN face_detections fd ON p.id = fd.photo_id
LEFT JOIN photos_tags pt ON p.id = pt.photo_id
LEFT JOIN tags t ON pt.tag_id = t.id
