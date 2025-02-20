import React from 'react';

interface Album {
  id: string;
  title: string;
}

interface AlbumNavigationProps {
  albums: Album[];
  onSelectAlbum: (albumId: string) => void;
}

const AlbumNavigation: React.FC<AlbumNavigationProps> = ({ albums, onSelectAlbum }) => {
  return (
    <div className="flex space-x-4">
      {albums.map((album) => (
        <button
          key={album.id}
          onClick={() => onSelectAlbum(album.id)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          {album.title}
        </button>
      ))}
    </div>
  );
};

export default AlbumNavigation;
