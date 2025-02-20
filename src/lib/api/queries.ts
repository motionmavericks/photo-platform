import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addPhotoToAlbum,
  addTagToPhoto,
  deletePhoto,
  getPhoto,
  getPhotos,
  removePhotoFromAlbum,
  removeTagFromPhoto,
  trackDownload,
  updatePhoto,
  uploadPhoto,
} from './photos';
import {
  addTagToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbums,
  removeTagFromAlbum,
  reorderPhotosInAlbum,
  updateAlbum,
} from './albums';
import { Database } from '@/types/database';

type Photo = Database['public']['Tables']['photos']['Row'];
type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
type Album = Database['public']['Tables']['albums']['Row'];
type AlbumInsert = Database['public']['Tables']['albums']['Insert'];

// Photos
export function usePhotos(albumId?: string) {
  return useQuery({
    queryKey: ['photos', { albumId }],
    queryFn: () => getPhotos(albumId),
  });
}

export function usePhoto(id: string) {
  return useQuery({
    queryKey: ['photos', id],
    queryFn: () => getPhoto(id),
    enabled: !!id,
  });
}

export function useUploadPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, data }: { file: File; data: Omit<PhotoInsert, 'storage_path' | 'size_bytes' | 'mime_type'> }) =>
      uploadPhoto(file, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PhotoInsert> }) =>
      updatePhoto(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photos', id] });
    },
  });
}

export function useDeletePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });
}

// Album Operations
export function useAddPhotoToAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId, albumId, position }: { photoId: string; albumId: string; position: number }) =>
      addPhotoToAlbum(photoId, albumId, position),
    onSuccess: (_, { photoId, albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
      queryClient.invalidateQueries({ queryKey: ['albums', albumId] });
    },
  });
}

export function useRemovePhotoFromAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId, albumId }: { photoId: string; albumId: string }) =>
      removePhotoFromAlbum(photoId, albumId),
    onSuccess: (_, { photoId, albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
      queryClient.invalidateQueries({ queryKey: ['albums', albumId] });
    },
  });
}

// Tag Operations
export function useAddTagToPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId, tagName }: { photoId: string; tagName: string }) =>
      addTagToPhoto(photoId, tagName),
    onSuccess: (_, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
    },
  });
}

export function useRemoveTagFromPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photoId, tagId }: { photoId: string; tagId: string }) =>
      removeTagFromPhoto(photoId, tagId),
    onSuccess: (_, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
    },
  });
}

// Download Tracking
export function useTrackDownload() {
  return useMutation({
    mutationFn: trackDownload,
  });
}

// Albums
export function useAlbums(options?: { includePrivate?: boolean }) {
  return useQuery({
    queryKey: ['albums', options],
    queryFn: () => getAlbums(options),
  });
}

export function useAlbum(id: string) {
  return useQuery({
    queryKey: ['albums', id],
    queryFn: () => getAlbum(id),
    enabled: !!id,
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<AlbumInsert, 'created_at' | 'updated_at'>) =>
      createAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AlbumInsert> }) =>
      updateAlbum(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albums', id] });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useAddTagToAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, tagName }: { albumId: string; tagName: string }) =>
      addTagToAlbum(albumId, tagName),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albums', albumId] });
    },
  });
}

export function useRemoveTagFromAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, tagId }: { albumId: string; tagId: string }) =>
      removeTagFromAlbum(albumId, tagId),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albums', albumId] });
    },
  });
}

export function useReorderPhotosInAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ albumId, photoOrders }: { albumId: string; photoOrders: { photoId: string; position: number }[] }) =>
      reorderPhotosInAlbum(albumId, photoOrders),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['albums', albumId] });
    },
  });
}
