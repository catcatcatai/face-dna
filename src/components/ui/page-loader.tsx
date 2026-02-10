"use client";

/**
 * PageLoader — full-page loading state for route transitions.
 * Three pulsing dots with staggered animation. Centered in the content area.
 * Use as a Suspense fallback or conditional render while data loads.
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center pt-32">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              animation: "pulse 1s ease-in-out infinite",
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
