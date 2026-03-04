"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ImageCellProps {
  imageUrl: string;
  selected: boolean;
  onToggle: () => void;
}

export function ImageCell({ imageUrl, selected, onToggle }: ImageCellProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg transition-all",
        selected
          ? ""
          : "opacity-50 grayscale-[80%]"
      )}
    >
      <img
        src={imageUrl}
        alt="Generated face"
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />

      {/* Deselected overlay */}
      {!selected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <X className="h-8 w-8 text-white/80" />
        </div>
      )}

      {/* Hover hint */}
      <div
        className={cn(
          "absolute inset-0 transition-colors",
          selected
            ? "group-hover:bg-black/20"
            : "group-hover:bg-transparent"
        )}
      />
    </button>
  );
}
