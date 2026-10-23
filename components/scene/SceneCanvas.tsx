"use client";

import dynamic from "next/dynamic";
import React from "react";

// Client-only dynamic import with ssr: false
const DynamicScene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

/**
 * SceneCanvas
 * Fixed full-screen 3D scene layer mounted ONCE in app/layout.tsx:
 * position: fixed; inset: 0; z-index: 0; pointer-events: none;
 * Never unmounts or resets across routes or scroll positions.
 */
export function SceneCanvas() {
  return (
    <div
      id="scene-canvas-root"
      className="fixed inset-0 pointer-events-none overflow-hidden bg-[#050816]"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#050816",
      }}
      aria-hidden="true"
    >
      <DynamicScene />
    </div>
  );
}

export default SceneCanvas;
