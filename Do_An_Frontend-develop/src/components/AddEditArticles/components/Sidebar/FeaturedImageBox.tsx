import React, { memo, useEffect, useRef, useState } from 'react';
import { Image, X } from 'lucide-react';

interface FeaturedImageBoxProps {
  image: File | string | null;
  onChange: (file: File | null) => void;
}

function FeaturedImageBoxComponent({ image, onChange }: FeaturedImageBoxProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    if (typeof image === 'string') {
      setPreview(image);
      return;
    }

    if (image instanceof File) {
      setPreview(URL.createObjectURL(image));
    }
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleRemoveImage = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium">
          Ảnh đại diện <span className="text-red-600">*</span>
        </h2>
      </div>
      <div className="p-4">
        {preview ? (
          <div className="space-y-3">
            <div className="relative">
              <img
                src={preview}
                alt="Ảnh đại diện"
                className="w-full h-auto rounded-md border border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                title="Xóa ảnh"
              >
                <X size={16} />
              </button>
            </div>
            <button
              onClick={handleRemoveImage}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Xóa ảnh đại diện
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Image size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">Chưa có ảnh đại diện</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
            >
              Đặt ảnh đại diện
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">
          Ảnh đại diện sẽ được hiển thị ở trang chủ và các trang danh sách bài
          viết.
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

const FeaturedImageBox = memo(FeaturedImageBoxComponent);

export default FeaturedImageBox;
