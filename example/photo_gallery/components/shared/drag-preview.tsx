import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface DragPreviewProps {
  photos: { id: number; src: string; title: string }[]
  isDragging: boolean
  position: { x: number; y: number }
  selectedPhotoIds: number[]
}

const DragPreview: React.FC<DragPreviewProps> = ({ photos, isDragging, position, selectedPhotoIds }) => {
  const selectedPhotos = photos.filter((photo) => selectedPhotoIds.includes(photo.id))

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {selectedPhotos.slice(0, 3).map((photo, index) => (
            <motion.div
              key={photo.id}
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: 8,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${index * 5 - 5}deg) translateY(${index * -10}px)`,
              }}
            >
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.title}
                width={90}
                height={90}
                className="rounded-md object-cover"
              />
            </motion.div>
          ))}
          {selectedPhotos.length > 3 && (
            <motion.div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                backgroundColor: "black",
                color: "white",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              +{selectedPhotos.length - 3}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DragPreview

