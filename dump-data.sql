-- Dump photos table
SELECT * FROM photos;

-- Dump face detections
SELECT * FROM face_detections;

-- Dump tags
SELECT * FROM tags;

-- Dump photo tags
SELECT * FROM photos_tags;

-- Dump photos with their face detections and tags
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
GROUP BY p.id;
