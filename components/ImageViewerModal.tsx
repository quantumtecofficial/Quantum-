
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomOutIcon } from './icons/ZoomOutIcon';
import { ResetZoomIcon } from './icons/ResetZoomIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import type { Artwork } from '../types';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  artwork: Artwork;
}

const ZOOM_SPEED_MULTIPLIER = 1.5;
const MAX_ZOOM = 8;
const MIN_ZOOM = 1;

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ isOpen, onClose, artwork }) => {
  const { imageUrl, title, artist } = artwork;
  const [scale, setScale] = useState(MIN_ZOOM);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const startPointRef = useRef({ x: 0, y: 0 });

  const resetState = useCallback(() => {
    setScale(MIN_ZOOM);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen, imageUrl, resetState]);

  const handleZoomIn = useCallback(() => setScale(s => Math.min(s * ZOOM_SPEED_MULTIPLIER, MAX_ZOOM)), []);
  const handleZoomOut = useCallback(() => setScale(s => Math.max(s / ZOOM_SPEED_MULTIPLIER, MIN_ZOOM)), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleZoomIn, handleZoomOut]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (scale <= MIN_ZOOM) return;
    e.preventDefault();
    setIsPanning(true);
    startPointRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [scale, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPointRef.current.x,
      y: e.clientY - startPointRef.current.y,
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const fileExtension = blob.type.split('/')[1] || 'jpg';
      
      const sanitize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const sanitizedTitle = sanitize(title);
      const sanitizedArtist = artist ? `by-${sanitize(artist)}` : '';

      const filename = `${sanitizedTitle}${sanitizedArtist ? `-${sanitizedArtist}` : ''}.${fileExtension}`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback for cross-origin or other issues: open in new tab
      window.open(imageUrl, '_blank');
    }
  }, [imageUrl, title, artist]);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isPanning, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100] p-4 animate-fade-in"
      onClick={onClose}
      onWheel={handleWheel}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer for ${title}`}
    >
      <style>{`.animate-fade-in { animation: fadeIn 0.2s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors" aria-label="Close image viewer">
          <CloseIcon className="h-8 w-8" />
        </button>
      </div>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isPanning ? 'grabbing' : scale > MIN_ZOOM ? 'grab' : 'default',
            touchAction: 'none',
          }}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full p-2 flex items-center gap-2 text-white z-10" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleZoomOut} disabled={scale <= MIN_ZOOM} className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Zoom out">
            <ZoomOutIcon className="h-6 w-6" />
        </button>
        <button onClick={resetState} disabled={scale <= MIN_ZOOM && position.x === 0 && position.y === 0} className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Reset zoom">
            <ResetZoomIcon className="h-6 w-6" />
        </button>
        <button onClick={handleZoomIn} disabled={scale >= MAX_ZOOM} className="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="Zoom in">
            <ZoomInIcon className="h-6 w-6" />
        </button>
        <div className="w-px h-6 bg-white/20"></div>
        <button onClick={handleDownload} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Download image">
            <DownloadIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};