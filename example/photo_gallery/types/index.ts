export interface User {
  id: string
  username: string
  email: string
  avatarUrl: string
}

export interface Photo {
  id: string
  title: string
  description: string
  src: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Album {
  id: string
  title: string
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
}

export interface Favorite {
  userId: string
  photoId: string
  createdAt: string
}

export interface PhotoAlbum {
  photoId: string
  albumId: string
}

export interface PhotoTag {
  photoId: string
  tagId: string
}

