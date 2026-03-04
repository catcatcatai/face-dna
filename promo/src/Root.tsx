import React from "react";
import { registerRoot, Composition, delayRender, continueRender } from "remotion";
import { PromoVideo } from "./PromoVideo";
import {
  GridLoaderComposition,
  TOTAL_FRAMES as GRID_LOADER_FRAMES,
} from "@/components/ui/grid-loader-composition";

// Load Roboto Mono font before rendering (with 5s timeout fallback)
const fontHandle = delayRender("Loading Roboto Mono font");
const resolveFontOnce = (() => {
  let resolved = false;
  return () => {
    if (!resolved) {
      resolved = true;
      continueRender(fontHandle);
    }
  };
})();

const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap";
link.rel = "stylesheet";
link.onload = () => {
  document.fonts.ready.then(resolveFontOnce);
};
link.onerror = () => {
  console.warn("Failed to load Roboto Mono font, using fallback");
  resolveFontOnce();
};
document.head.appendChild(link);
setTimeout(resolveFontOnce, 5000);

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="GridLoader"
        component={GridLoaderComposition}
        durationInFrames={GRID_LOADER_FRAMES}
        fps={120}
        width={600}
        height={600}
      />
    </>
  );
};

registerRoot(RemotionRoot);
