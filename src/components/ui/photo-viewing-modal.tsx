import React from 'react';

interface PhotoViewingModalProps {
  isOpen: boolean;
  photoUrl: string;
  onClose: () => void;
}

const PhotoViewingModal: React.FC<PhotoViewingModalProps> = ({ isOpen, photoUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times;
        </button>
        <img src={photoUrl} alt="Viewing" className="max-w-full max-h-full" />
      </div>
    </div>
  );
};

export default PhotoViewingModal;
