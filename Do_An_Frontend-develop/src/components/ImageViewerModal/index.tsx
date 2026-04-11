import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

interface ImageFile {
  id: string;
  url: string;
  name: string;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageFile[];
  initialIndex?: number;
}

export function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      resetZoom();
    }
  }, [isOpen, initialIndex]);
  useEffect(() => {
    resetZoom();
  }, [currentIndex]);
  const resetZoom = () => {
    setScale(1);
    setPosition({
      x: 0,
      y: 0,
    });
  };
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };
  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1)
        setPosition({
          x: 0,
          y: 0,
        });
      return newScale;
    });
  };
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);
  if (!isOpen) return null;
  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
          <h3 className="text-lg font-medium">{currentImage?.name}</h3>
          <p className="text-sm text-gray-300">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
      >
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Image Container */}
        <div
          className={`relative transition-transform duration-100 ease-out ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={currentImage?.url}
            alt={currentImage?.name}
            className="max-h-[85vh] max-w-[90vw] object-contain select-none pointer-events-none"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/60 px-6 py-3 rounded-full backdrop-blur-md z-10">
        <button
          onClick={handleZoomOut}
          disabled={scale <= 1}
          className="p-2 rounded-full hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        <span className="text-white font-medium min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={scale >= 4}
          className="p-2 rounded-full hover:bg-white/20 text-white disabled:opacity-50 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        <button
          onClick={resetZoom}
          className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
