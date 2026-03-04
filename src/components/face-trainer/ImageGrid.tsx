"use client";

import type { CroppedImage } from "@/types";
import { ImageCell } from "./ImageCell";

interface ImageGridProps {
  images: CroppedImage[];
  onToggle: (imageId: string) => void;
}

export function ImageGrid({ images, onToggle }: ImageGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {images.map((image) => (
        <ImageCell
          key={image.id}
          imageUrl={image.blobUrl}
          selected={image.selected}
          onToggle={() => onToggle(image.id)}
        />
      ))}
    </div>
  );
}
