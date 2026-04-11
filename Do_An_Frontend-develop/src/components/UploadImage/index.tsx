import React, { useRef, useState } from 'react';

interface UploadImageProps {
  onChange?: (file: File) => void;
  initImageUrl?: string;
}

const UploadImage: React.FC<UploadImageProps> = ({
  onChange,
  initImageUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(initImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onChange?.(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onChange?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      className="relative w-48 h-48 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 group"
    >
      {/* Ảnh preview */}
      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm text-center px-2">
          Kéo & thả hoặc tải ảnh lên
        </div>
      )}

      {/* Overlay khi hover */}
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-sm transition-opacity">
        <span>Tải lên ⬆️</span>
      </div>

      {/* Input ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadImage;
