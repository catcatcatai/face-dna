import React, { useState } from "react";
import { staticFile } from "remotion";

interface PromoImageProps {
  src: string;
  label?: string;
  style?: React.CSSProperties;
}

/**
 * Image component with graceful fallback for missing assets.
 * Uses staticFile() to resolve from public/ directory.
 * Shows a labeled placeholder if the image fails to load.
 */
export const PromoImage: React.FC<PromoImageProps> = ({
  src,
  label,
  style,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(139, 232, 59, 0.4)",
          fontSize: 13,
          fontFamily: "'Roboto Mono', monospace",
          textAlign: "center",
          padding: 8,
          ...style,
        }}
      >
        {label || src.split("/").pop()}
      </div>
    );
  }

  return (
    <img
      src={staticFile(src)}
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...style,
      }}
    />
  );
};
