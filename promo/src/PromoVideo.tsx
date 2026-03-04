import React from "react";
import { Sequence } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { MultiplicationScene } from "./scenes/MultiplicationScene";
import { PayoffScene } from "./scenes/PayoffScene";
import { CountScene } from "./scenes/CountScene";
import { BrandingScene } from "./scenes/BrandingScene";

export const PromoVideo: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#0A0A0A",
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      {/* 0-5s: Single source face + "One reference. Fifty-four variations." */}
      <Sequence from={0} durationInFrames={150}>
        <HookScene />
      </Sequence>

      {/* 5-14s: All 54 variations fill a 6x9 grid, round by round */}
      <Sequence from={150} durationInFrames={270}>
        <MultiplicationScene />
      </Sequence>

      {/* 14-22s: 4 LoRA output images + "Identity preserved." */}
      <Sequence from={420} durationInFrames={240}>
        <PayoffScene />
      </Sequence>

      {/* 22-26s: "54 images. One LoRA. Minutes." */}
      <Sequence from={660} durationInFrames={120}>
        <CountScene />
      </Sequence>

      {/* 26-30s: FaceDNA + tagline + GridLoader background */}
      <Sequence from={780} durationInFrames={120}>
        <BrandingScene />
      </Sequence>
    </div>
  );
};
