"use client";

import { useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

interface PhotoLightboxProps {
  photos: string[];
  initialIndex: number;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function PhotoLightbox({
  photos,
  initialIndex: _initialIndex,
  currentIndex,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const prev = useCallback(() => {
    if (hasPrev) onIndexChange(currentIndex - 1);
  }, [hasPrev, currentIndex, onIndexChange]);

  const next = useCallback(() => {
    if (hasNext) onIndexChange(currentIndex + 1);
  }, [hasNext, currentIndex, onIndexChange]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Fechar */}
      <button
        className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        onClick={onClose}
      >
        <XIcon className="size-6" />
      </button>

      {/* Contador */}
      {photos.length > 1 && (
        <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
          {currentIndex + 1} / {photos.length}
        </span>
      )}

      {/* Seta esquerda */}
      {hasPrev && (
        <button
          className="absolute left-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <ChevronLeftIcon className="size-8" />
        </button>
      )}

      {/* Imagem */}
      <img
        src={photos[currentIndex]}
        alt={`Foto ${currentIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Seta direita */}
      {hasNext && (
        <button
          className="absolute right-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <ChevronRightIcon className="size-8" />
        </button>
      )}

      {/* Miniaturas */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 flex gap-2">
          {photos.map((url, i) => (
            <button
              key={url}
              onClick={(e) => { e.stopPropagation(); onIndexChange(i); }}
              className={`size-12 overflow-hidden rounded border-2 transition-all ${
                i === currentIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
