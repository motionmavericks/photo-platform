import type { Photo } from "../types"

export async function fetchPhotos(): Promise<Photo[]> {
  try {
    // In a real application, this would be an API call
    const response = await new Promise<Photo[]>((resolve) => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 50 }, (_, i) => ({
            id: `photo-${i + 1}`,
            title: `Photo ${i + 1}`,
            description: `This is photo ${i + 1}`,
            src: `https://picsum.photos/seed/${i + 100}/800/800`,
            userId: `user-${Math.floor(Math.random() * 10) + 1}`,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: Math.random() > 0.5,
            tags: ["tag1", "tag2"],
          })),
        )
      }, 500)
    })
    return response
  } catch (error) {
    console.error("Error fetching photos:", error)
    throw new Error("Failed to fetch photos")
  }
}

