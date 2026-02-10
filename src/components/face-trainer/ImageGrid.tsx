"use client";

import type { CroppedImage } from "@/types";
import { ImageCell } from "./ImageCell";

interface ImageGridProps {
  images: CroppedImage[];
  onToggle: (imageId: string) => void;
}

export function ImageGrid({ images, onToggle }: ImageGridProps) {
  const selectedCount = images.filter((img) => img.selected).length;

  return (
    <div className="space-y-3">
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
      <p className="text-center text-sm text-muted-foreground">
        {selectedCount} of {images.length} selected — tap to
        eliminate bad ones
      </p>
    </div>
  );
}
