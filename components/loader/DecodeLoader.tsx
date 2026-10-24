"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * Default name displayed and decoded in the intro loader.
 * Change this constant to customize the decoded name.
 */
export const TARGET_NAME = "DARSHAN GHATGE";

/**
 * Glitch character pool used for the cybernetic flicker effect.
 */
export const GLITCH_CHARS = "#$%@&*01<>";

/**
 * Set to true so the loader triggers every time on project start / refresh.
 * Change to false if you want once-per-session behavior in production.
 */
export const FORCE_SHOW_ON_RELOAD = true;

// Wire to drei: const { active, progress } = useProgress(); const extraReady = !active && progress === 100;

export interface DecodeLoaderProps {
  name?: string;
  extraReady?: boolean;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Cubic ease-in-out easing function:
 * x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2
 */
function cubicEaseInOut(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Normalized time value where cubicEaseInOut(x) === 0.92:
 * 1 - Math.pow(-2*x + 2, 3) / 2 = 0.92 => x = 1 - (0.16)^(1/3) / 2 ≈ 0.728558238
 */
const TIME_AT_92_PERCENT_CUBIC = 0.7285582383405094;

export function DecodeLoader({
  name = TARGET_NAME,
  extraReady = true,
}: DecodeLoaderProps) {
  const [phase, setPhase] = useState<"loading" | "done" | "gone">("loading");

  // Direct DOM references for 60fps rAF updates without React re-renders
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  // Latest extraReady prop reference for access in animation frame loop
  const extraReadyRef = useRef(extraReady);

  useEffect(() => {
    extraReadyRef.current = extraReady;
  }, [extraReady]);

  useIsomorphicLayoutEffect(() => {
    // 1. Session check: skip immediately if once-per-session is desired and already seen
    if (!FORCE_SHOW_ON_RELOAD) {
      try {
        if (sessionStorage.getItem("intro-seen") === "true") {
          setPhase("gone");
          window.dispatchEvent(new CustomEvent("intro-loader-gone"));
          return;
        }
      } catch {
        // Handle environments where sessionStorage might throw
      }
    }

    // 2. Lock page scroll while loader is visible
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // 3. Motion preference check
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Apply reduced motion styles if active
    if (isReducedMotion && starRef.current) {
      starRef.current.style.textShadow = "none";
    }

    // 4. Real readiness tracking
    let isWindowLoaded = document.readyState === "complete";
    let areFontsReady = false;
    let isSafetyTimeoutFired = false;

    const onWindowLoad = () => {
      isWindowLoaded = true;
    };

    if (!isWindowLoaded) {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    if ("fonts" in document) {
      document.fonts.ready
        .then(() => {
          areFontsReady = true;
        })
        .catch(() => {
          areFontsReady = true;
        });
    } else {
      areFontsReady = true;
    }

    // Safety timeout: force finish after 8s if readiness never arrives
    const safetyTimer = window.setTimeout(() => {
      isSafetyTimeoutFired = true;
    }, 8000);

    const checkIsReady = (): boolean => {
      return (
        isSafetyTimeoutFired ||
        (isWindowLoaded && areFontsReady && extraReadyRef.current)
      );
    };

    // 5. Timeline parameters
    const MIN_LOAD_DURATION = 2600; // ~2.6s minimum load phase
    const REDUCED_DURATION = 1200; // 1.2s linear fill for reduced motion
    const HOLD_DURATION = 1200; // 1.2s hold at 100%
    const EXIT_ANIM_DURATION = 1200; // 0.7s content + 0.5s overlay fade

    const loadDuration = isReducedMotion ? REDUCED_DURATION : MIN_LOAD_DURATION;
    const t92 = isReducedMotion
      ? 0.92 * loadDuration
      : TIME_AT_92_PERCENT_CUBIC * loadDuration;

    let rafId: number = 0;
    let lastTime = performance.now();
    let elapsedActiveTime = 0;
    let holdStartTime: number | null = null;
    let exitTimer: number | null = null;

    const runGlitchDecode = (currentProgress: number) => {
      if (!nameRef.current) return;
      if (isReducedMotion || currentProgress >= 100) {
        nameRef.current.textContent = name;
        return;
      }

      const k = Math.floor((currentProgress / 100) * name.length);
      let scrambled = "";
      for (let i = 0; i < name.length; i++) {
        const char = name[i];
        if (char === " ") {
          scrambled += " ";
        } else if (i < k) {
          scrambled += char;
        } else {
          const randIdx = Math.floor(Math.random() * GLITCH_CHARS.length);
          scrambled += GLITCH_CHARS[randIdx];
        }
      }
      nameRef.current.textContent = scrambled;
    };

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      const ready = checkIsReady();

      // Pause progress at 92% until readiness condition is satisfied
      if (elapsedActiveTime < t92) {
        elapsedActiveTime = Math.min(elapsedActiveTime + dt, t92);
      } else if (ready) {
        elapsedActiveTime = Math.min(elapsedActiveTime + dt, loadDuration);
      }
      // If not ready and elapsedActiveTime >= t92, elapsedActiveTime remains at t92

      const normTime = Math.min(elapsedActiveTime / loadDuration, 1);
      const rawProgress = isReducedMotion
        ? normTime * 100
        : cubicEaseInOut(normTime) * 100;

      const currentProgress = Math.min(Math.max(rawProgress, 0), 100);

      // Direct DOM writes: name glitch decode
      runGlitchDecode(currentProgress);

      // Direct DOM writes: line fill scaleX
      if (lineFillRef.current) {
        lineFillRef.current.style.transform = `scaleX(${currentProgress / 100})`;
      }

      // Direct DOM writes: star position
      if (starRef.current) {
        starRef.current.style.left = `${currentProgress}%`;
      }

      // Direct DOM writes: zero-padded counter (000 to 100)
      if (counterRef.current) {
        counterRef.current.textContent = String(
          Math.floor(currentProgress)
        ).padStart(3, "0");
      }

      // Check if progress reached 100%
      if (currentProgress >= 100) {
        if (holdStartTime === null) {
          holdStartTime = now;
        }

        const holdElapsed = now - holdStartTime;
        if (holdElapsed >= HOLD_DURATION) {
          // Enter "done" state: triggers content fade and line collapse transitions
          setPhase("done");
          window.dispatchEvent(new CustomEvent("intro-loader-done"));

          // Transition to "gone" after exit transitions conclude
          exitTimer = window.setTimeout(() => {
            try {
              sessionStorage.setItem("intro-seen", "true");
            } catch {
              // Ignore storage errors
            }
            document.documentElement.style.overflow = originalOverflow;
            setPhase("gone");
            window.dispatchEvent(new CustomEvent("intro-loader-gone"));
          }, EXIT_ANIM_DURATION);

          return; // Stop animation loop
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame((timestamp) => {
      lastTime = timestamp;
      loop(timestamp);
    });

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onWindowLoad);
      window.clearTimeout(safetyTimer);
      if (exitTimer !== null) {
        window.clearTimeout(exitTimer);
      }
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [name]);

  // When phase is "gone", remove completely from DOM
  if (phase === "gone") {
    return null;
  }

  const isDone = phase === "done";

  return (
    <div
      ref={overlayRef}
      id="decode-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#070b1f",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isDone ? 0 : 1,
        pointerEvents: isDone ? "none" : "auto",
        transition: "opacity 0.5s ease 0.7s",
      }}
    >
      {/* Visually hidden screen reader announcement */}
      <span
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        Loading
      </span>

      {/* Centered vertical block: Name, Line, Counter with 20px gap */}
      <div
        ref={contentRef}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "stretch",
          rowGap: "20px",
          gap: "20px",
          opacity: isDone ? 0 : 1,
          transition: "opacity 0.7s ease",
        }}
      >
        {/* Row 1: Name with glitch decode */}
        <div
          ref={nameRef}
          aria-hidden="true"
          style={{
            fontFamily:
              'var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontWeight: 700,
            color: "#22d3ee",
            fontSize: "clamp(14px, 4.4vw, 26px)",
            letterSpacing: "0.12em",
            whiteSpace: "pre",
            textAlign: "center",
            lineHeight: 1.2,
            userSelect: "none",
          }}
        >
          {name}
        </div>

        {/* Row 2: 2px Line exactly matching name width with fill and glowing star */}
        <div
          ref={lineTrackRef}
          style={{
            position: "relative",
            height: "2px",
            width: "100%",
            backgroundColor: "rgba(34, 211, 238, 0.18)",
            overflow: "visible",
            transformOrigin: "center",
            transform: isDone ? "scaleX(0)" : "scaleX(1)",
            transition: "transform 0.6s ease 0.1s",
          }}
        >
          {/* Animated Fill */}
          <div
            ref={lineFillRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              backgroundColor: "#22d3ee",
              transform: "scaleX(0)",
              transformOrigin: "left",
            }}
          />

          {/* Glowing Star Glyph riding the head of the fill */}
          <span
            ref={starRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "0%",
              transform: "translate(-50%, -50%)",
              color: "#ffffff",
              fontSize: "18px",
              lineHeight: 1,
              textShadow: "0 0 8px #22d3ee, 0 0 16px #22d3ee",
              pointerEvents: "none",
              userSelect: "none",
              opacity: isDone ? 0 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            ✦
          </span>
        </div>

        {/* Row 3: Zero-padded counter (000 to 100) */}
        <div
          ref={counterRef}
          aria-hidden="true"
          style={{
            fontFamily:
              'var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: "12px",
            letterSpacing: "0.15em",
            color: "#5fc5d6",
            textAlign: "center",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          000
        </div>
      </div>
    </div>
  );
}
