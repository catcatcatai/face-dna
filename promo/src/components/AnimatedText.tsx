import React from "react";
import { useCurrentFrame } from "remotion";

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  framesPerChar?: number;
  style?: React.CSSProperties;
  cursorColor?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame,
  framesPerChar = 2,
  style,
  cursorColor = "#8BE83B",
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charsToShow = Math.min(
    Math.floor(elapsed / framesPerChar),
    text.length,
  );
  const displayText = text.slice(0, charsToShow);
  const typingDone = charsToShow >= text.length;
  const framesSinceTypingDone = typingDone
    ? elapsed - text.length * framesPerChar
    : 0;

  // Cursor: blinks while typing, blinks slower when done, disappears after 1s
  const showCursor = elapsed > 0 && (!typingDone || framesSinceTypingDone < 30);
  const cursorBlink = typingDone
    ? Math.floor(frame / 10) % 2 === 0
    : Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: "'Roboto Mono', monospace",
        fontWeight: 500,
        whiteSpace: "pre",
        ...style,
      }}
    >
      {displayText}
      {showCursor && (
        <span style={{ color: cursorColor, opacity: cursorBlink ? 1 : 0 }}>
          ▌
        </span>
      )}
    </div>
  );
};
