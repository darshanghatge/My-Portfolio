"use client";

import React, { useState, useEffect, useRef } from "react";

export function ScreenshotHeading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLSpanElement>(null);

  // States
  const [isOpened, setIsOpened] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [typedLine1, setTypedLine1] = useState(0);
  const [typedLine2, setTypedLine2] = useState(0);
  const [activeLine, setActiveLine] = useState<1 | 2>(1);
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const targetDimsRef = useRef({ width: 672, height: 160 });
  const [targetDimensions, setTargetDimensions] = useState({ width: 672, height: 160 });

<<<<<<< HEAD


  const LINE_1 = "Hi, I'm";
=======
  const LINE_1 = "Hi, Im";
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
  const LINE_2 = "Darshan Ghatge.";

  // Measure container dimensions for accurate Figma-style size badge
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const dims = {
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
          targetDimsRef.current = dims;
          setTargetDimensions(dims);
        }
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // 1. BUTTERY-SMOOTH GPU EXPANSION SEQUENCE (Zero React re-renders during drag)
  const runSequence = () => {
<<<<<<< HEAD
    // Initial short pause before snipping begins (350ms)
=======
    setIsOpened(false);
    setIsCompleted(false);
    setTypedLine1(0);
    setTypedLine2(0);
    setActiveLine(1);
    setIsTyping(false);

    // Initial short pause before snipping begins (200ms)
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
    const openTimer = setTimeout(() => {
      setIsOpened(true);

      // Direct-DOM real-time dimension update (no React re-renders!)
      const start = performance.now();
<<<<<<< HEAD
      const duration = 1250;
=======
      const duration = 900;
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
      const targetW = targetDimsRef.current.width;
      const targetH = targetDimsRef.current.height;

      const updateCounter = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - p, 3);

        if (dimRef.current) {
          const w = Math.max(16, Math.round(ease * targetW));
          const h = Math.max(12, Math.round(ease * targetH));
          dimRef.current.innerText = `${w} × ${h}`;
        }

        if (p < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
<<<<<<< HEAD
    }, 350);

    // Box completes opening after 1250ms transition (350ms + 1250ms = 1600ms)
=======
    }, 200);

    // Box completes opening after 900ms transition
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
    const completeTimer = setTimeout(() => {
      setIsCompleted(true);
      // Start typewriter immediately after the box completely opens
      startTypewriter();
<<<<<<< HEAD
    }, 1600);
=======
    }, 1150);
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540

    return () => {
      clearTimeout(openTimer);
      clearTimeout(completeTimer);
    };
  };

  // 2. TWO-STAGE TYPEWRITER EFFECT:
  // First types Line 1 ("Hi, Im"), then moves to Line 2 and types "Darshan Ghatge."
  const startTypewriter = () => {
    setIsTyping(true);
    setActiveLine(1);
    let count1 = 0;

<<<<<<< HEAD
    // Type Line 1 ("Hi, Im") at a natural, readable pace (75ms/char)
=======
    // Type Line 1 ("Hi, Im")
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
    const timer1 = setInterval(() => {
      count1++;
      setTypedLine1(count1);

      if (count1 >= LINE_1.length) {
        clearInterval(timer1);

<<<<<<< HEAD
        // Pause naturally before jumping to Line 2 (320ms)
=======
        // Pause naturally before jumping to Line 2
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
        setTimeout(() => {
          setActiveLine(2);
          let count2 = 0;

<<<<<<< HEAD
          // Type Line 2 ("Darshan Ghatge.") at a smooth pace (68ms/char)
=======
          // Type Line 2 ("Darshan Ghatge.")
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
          const timer2 = setInterval(() => {
            count2++;
            setTypedLine2(count2);

            if (count2 >= LINE_2.length) {
              clearInterval(timer2);
              // Let cursor blink gently after completing then settle cleanly
              setTimeout(() => {
                setIsTyping(false);
<<<<<<< HEAD
              }, 1800);
            }
          }, 68);
        }, 320);
      }
    }, 75);
=======
              }, 1500);
            }
          }, 42);
        }, 150);
      }
    }, 45);
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
  };

  useEffect(() => {
    // Reduced motion support
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
<<<<<<< HEAD
      const raf = requestAnimationFrame(() => {
        setIsOpened(true);
        setIsCompleted(true);
        setTypedLine1(LINE_1.length);
        setTypedLine2(LINE_2.length);
      });
      return () => cancelAnimationFrame(raf);
    }

    let cancelSequence: (() => void) | undefined;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      cancelSequence = runSequence();
    };

    // If DecodeLoader is active, wait for it to complete so the marked animation plays on the homepage
    const loaderEl =
      typeof document !== "undefined"
        ? document.getElementById("decode-loader")
        : null;

    if (loaderEl) {
      const onLoaderDone = () => {
        // Smooth 200ms pause as overlay dissolves to reveal the hero
        setTimeout(start, 200);
      };

      window.addEventListener("intro-loader-done", onLoaderDone, { once: true });
      window.addEventListener("intro-loader-gone", onLoaderDone, { once: true });

      // Fallback timer: ensure heading starts even if loader completes abnormally
      const fallbackTimer = setTimeout(start, 6000);

      return () => {
        clearTimeout(fallbackTimer);
        window.removeEventListener("intro-loader-done", onLoaderDone);
        window.removeEventListener("intro-loader-gone", onLoaderDone);
        if (cancelSequence) cancelSequence();
      };
    } else {
      start();
      return () => {
        if (cancelSequence) cancelSequence();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
      setIsOpened(true);
      setIsCompleted(true);
      setTypedLine1(LINE_1.length);
      setTypedLine2(LINE_2.length);
      return;
    }

    const cancel = runSequence();
    return cancel;
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
  }, []);

  // Line 1 string breakdown ("Hi, " in white, "Im" in cyan)
  const line1Prefix = LINE_1.slice(0, Math.min(typedLine1, 4));
  const line1Suffix = typedLine1 > 4 ? LINE_1.slice(4, typedLine1) : "";
  const line2Typed = LINE_2.slice(0, typedLine2);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative block w-fit mb-3 sm:mb-4 select-none group"
    >
      {/* ── Invisible Template: Locks exact height and 2-line layout without shifts ── */}
<<<<<<< HEAD
      <div className="p-3 sm:p-5 opacity-0 pointer-events-none select-none aria-hidden:true">
        <h1 className="text-2xl min-[360px]:text-[1.75rem] min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15]">
=======
      <div className="p-4 sm:p-5 opacity-0 pointer-events-none select-none aria-hidden:true">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15]">
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
          <div className="whitespace-nowrap flex items-center">Hi, Im</div>
          <div className="whitespace-nowrap flex items-center">Darshan Ghatge.</div>
        </h1>
      </div>

      {/* ── Visible Typewriter Layer ────────────────────────────────────────────── */}
<<<<<<< HEAD
      <div className="absolute inset-0 p-3 sm:p-5 z-10 flex flex-col justify-center">
        <h1 className="text-2xl min-[360px]:text-[1.75rem] min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15]">
=======
      <div className="absolute inset-0 p-4 sm:p-5 z-10 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15]">
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
          {/* First Line: "Hi, Im" */}
          <div className="text-white whitespace-nowrap flex items-center min-h-[1.15em]">
            <span>{line1Prefix}</span>
            {line1Suffix && (
              <span className="text-cyan-400 font-extrabold">
                {line1Suffix}
              </span>
            )}
            {/* Blinking cursor on Line 1 while Line 1 is typing */}
            {isTyping && activeLine === 1 && (
              <span className="shrink-0 inline-block w-[3px] h-[0.8em] ml-1 bg-cyan-400 align-middle animate-pulse shadow-[0_0_10px_#22d3ee]" />
            )}
          </div>

          {/* Second Line: "Darshan Ghatge." */}
          <div className="whitespace-nowrap flex items-center min-h-[1.15em]">
            {typedLine2 > 0 ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                {line2Typed}
              </span>
            ) : (
              <span className="opacity-0 select-none pointer-events-none">&nbsp;</span>
            )}
            {/* Blinking cursor on Line 2 while Line 2 is typing */}
            {isTyping && activeLine === 2 && (
              <span className="shrink-0 inline-block w-[3px] h-[0.8em] ml-1.5 bg-cyan-400 align-middle animate-pulse shadow-[0_0_10px_#22d3ee]" />
            )}
          </div>
        </h1>
      </div>

      {/* ── GPU-Accelerated Expanding Snipping Box (Zero re-render lag) ─────────── */}
      <div
<<<<<<< HEAD
        className={`absolute top-0 left-0 pointer-events-none transition-all duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpened ? "w-full h-full opacity-100" : "w-0 h-0 opacity-0"
          }`}
      >
        {/* Selection Box Border & Highlight Tint */}
        <div
          className={`w-full h-full border-2 rounded-sm transition-all duration-300 ${isCompleted
            ? "border-blue-500/90 bg-blue-500/[0.04] shadow-[0_0_25px_rgba(59,130,246,0.18)]"
            : "border-blue-500 border-dashed bg-blue-500/[0.06] shadow-[0_0_15px_rgba(59,130,246,0.25)]"
            }`}
=======
        className={`absolute top-0 left-0 pointer-events-none transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpened ? "w-full h-full opacity-100" : "w-0 h-0 opacity-0"
        }`}
      >
        {/* Selection Box Border & Highlight Tint */}
        <div
          className={`w-full h-full border-2 rounded-sm transition-all duration-300 ${
            isCompleted
              ? "border-blue-500/90 bg-blue-500/[0.04] shadow-[0_0_25px_rgba(59,130,246,0.18)]"
              : "border-blue-500 border-dashed bg-blue-500/[0.06] shadow-[0_0_15px_rgba(59,130,246,0.25)]"
          }`}
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
        />

        {/* ── Dimension Badge ─────────────────────────────────────────────────── */}
        <div
<<<<<<< HEAD
          className={`absolute font-mono text-[10px] font-semibold px-2 py-0.5 rounded shadow-md pointer-events-none tracking-wider select-none flex items-center gap-1 z-30 transition-all duration-300 ${isCompleted
            ? "-top-3.5 right-3 sm:right-5 bg-blue-500 text-white"
            : "-top-3.5 right-1 sm:right-2 bg-blue-600 text-white ring-1 ring-white/20 animate-pulse"
            }`}
=======
          className={`absolute font-mono text-[10px] font-semibold px-2 py-0.5 rounded shadow-md pointer-events-none tracking-wider select-none flex items-center gap-1 z-30 transition-all duration-300 ${
            isCompleted
              ? "-top-3.5 right-3 sm:right-5 bg-blue-500 text-white"
              : "-top-3.5 right-1 sm:right-2 bg-blue-600 text-white ring-1 ring-white/20 animate-pulse"
          }`}
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
        >
          <span ref={dimRef}>
            {isCompleted
              ? `${targetDimensions.width} × ${targetDimensions.height}`
              : `0 × 0`}
          </span>
        </div>

        {/* ── 8 Resize Handles: Pop in with spring bounce after box completes ─── */}
        {isCompleted && (
          <>
            {/* 4 Corner Handles */}
            <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />

            {/* 4 Edge Midpoint Handles */}
            <span className="hidden sm:block absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="hidden sm:block absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="hidden sm:block absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
            <span className="hidden sm:block absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-[1px] shadow-sm animate-[scaleIn_0.25s_ease-out]" />
          </>
        )}

        {/* ── Snipping Cursor & "Darshan" Name Tag ────────────────────────────── */}
        <div
<<<<<<< HEAD
          className={`absolute flex items-start pointer-events-none z-40 transition-transform duration-200 ${isCompleted
            ? "-bottom-4 -right-3 sm:-bottom-5 sm:-right-4 group-hover:scale-110"
            : "-bottom-2 -right-2 scale-95"
            }`}
        >
          {/* Vector Pointer Arrow */}
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)] transform -rotate-12 translate-y-0.5 transition-all ${!isCompleted ? "scale-90 opacity-90" : "scale-100 opacity-100"
              }`}
=======
          className={`absolute flex items-start pointer-events-none z-40 transition-transform duration-200 ${
            isCompleted
              ? "-bottom-4 -right-3 sm:-bottom-5 sm:-right-4 group-hover:scale-110"
              : "-bottom-2 -right-2 scale-95"
          }`}
        >
          {/* Vector Pointer Arrow */}
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-500 drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)] transform -rotate-12 translate-y-0.5 transition-all ${
              !isCompleted ? "scale-90 opacity-90" : "scale-100 opacity-100"
            }`}
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4 2l16 10-7 2-3 8z" />
          </svg>

          {/* User Name Badge */}
          <div
<<<<<<< HEAD
            className={`bg-blue-500 text-white font-medium text-xs sm:text-[13px] px-2.5 py-0.5 rounded-r-md rounded-bl-md shadow-lg shadow-blue-500/30 flex items-center gap-1 -ml-1 transition-all duration-300 ${isCompleted
              ? "opacity-100 scale-100 translate-x-0"
              : "opacity-0 scale-75 -translate-x-2"
              }`}
=======
            className={`bg-blue-500 text-white font-medium text-xs sm:text-[13px] px-2.5 py-0.5 rounded-r-md rounded-bl-md shadow-lg shadow-blue-500/30 flex items-center gap-1 -ml-1 transition-all duration-300 ${
              isCompleted
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-75 -translate-x-2"
            }`}
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
          >
            <span></span>
          </div>
        </div>
      </div>

      {/* ── Interactive "Re-snip" Trigger (Hover when complete) ─────────────────── */}
      {isCompleted && isHovered && (
        <button
          onClick={runSequence}
          className="absolute -top-3 left-4 bg-white/10 hover:bg-blue-600 hover:text-white border border-white/20 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-lg z-30"
          title="Re-run snipping & typing animation"
        >
          <svg
            className="w-2.5 h-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          <span>Re-snip</span>
        </button>
      )}
    </div>
  );
}
