"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { SECTIONS, SectionId } from "../scene/sceneConfig";

export function SectionIndicator() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [needleLeft, setNeedleLeft] = useState<number | null>(null);

  // Measure and align the needle to the EXACT center of the active section label
  const updateNeedle = useCallback(() => {
    const activeIndex = SECTIONS.findIndex((s) => s.id === activeSection);
    if (activeIndex !== -1 && labelRefs.current[activeIndex] && trackRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const labelRect = labelRefs.current[activeIndex]!.getBoundingClientRect();
      if (trackRect.width > 0 && labelRect.width > 0) {
        // Calculate exact horizontal center of the label relative to the ruler track
        const relativeCenter = labelRect.left - trackRect.left + labelRect.width / 2;
        setNeedleLeft(relativeCenter);
      }
    }
  }, [activeSection]);

  // Recalculate needle position on mount, font-loading, and window resize
  useEffect(() => {
    updateNeedle();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateNeedle();
      });
    }

    const raf = requestAnimationFrame(() => {
      updateNeedle();
    });

    const handleResize = () => updateNeedle();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateNeedle]);

  // Recalculate needle position whenever active section changes
  useEffect(() => {
    updateNeedle();
  }, [activeSection, updateNeedle]);

  // Scroll spy & event listener
  useEffect(() => {
    const onSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<SectionId>;
      if (customEvent.detail) {
        setActiveSection(customEvent.detail);
      }
    };
    window.addEventListener("orb-section-change", onSectionChange);

    const onScroll = () => {
      const scrollY = window.scrollY;
      // Top of page
      if (scrollY < 120) {
        setActiveSection("hero");
        return;
      }
      // Bottom of page
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 120) {
        setActiveSection("contact");
        return;
      }

      const sections = document.querySelectorAll<HTMLElement>("[data-orb]");
      if (sections.length === 0) return;

      const vCenter = window.innerHeight * 0.42;
      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= vCenter && rect.bottom >= vCenter) {
          const secId = el.getAttribute("data-orb") as SectionId;
          if (secId) {
            setActiveSection(secId);
          }
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("orb-section-change", onSectionChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const activeIndex = SECTIONS.findIndex((s) => s.id === id);
    if (activeIndex !== -1 && labelRefs.current[activeIndex] && trackRef.current) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const labelRect = labelRefs.current[activeIndex]!.getBoundingClientRect();
      setNeedleLeft(labelRect.left - trackRect.left + labelRect.width / 2);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("orb-section-change", { detail: id }));
    }
    const el = document.querySelector(`[data-orb="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - trackRect.left;

    let closestId: SectionId = activeSection;
    let minDistance = Infinity;
    SECTIONS.forEach((sec, idx) => {
      const spanEl = labelRefs.current[idx];
      if (spanEl) {
        const spanRect = spanEl.getBoundingClientRect();
        const center = spanRect.left - trackRect.left + spanRect.width / 2;
        const dist = Math.abs(clickX - center);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = sec.id;
        }
      }
    });
    scrollToSection(closestId);
  };

  const tickCount = 65;

  return (
    <nav
      aria-label="Section navigation"
<<<<<<< HEAD
      className="relative px-1.5 min-[380px]:px-2.5 sm:px-6 py-1 sm:py-2 rounded-xl bg-black/45 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center w-full max-w-xl select-none"
    >
      {/* Top row: Uppercase Section Labels */}
      <div className="flex items-center justify-between w-full gap-0.5 sm:gap-2 md:gap-4">
=======
      className="relative px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-black/45 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center w-full max-w-xl select-none"
    >
      {/* Top row: Uppercase Section Labels */}
      <div className="flex items-center justify-between w-full gap-1 sm:gap-3 md:gap-4">
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              onClick={() => scrollToSection(sec.id)}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Scroll to ${sec.label}`}
<<<<<<< HEAD
              className={`group flex items-center justify-center py-0.5 px-0.5 min-[380px]:px-1 sm:px-1.5 rounded transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
=======
              className={`group flex items-center justify-center py-0.5 px-1 sm:px-1.5 rounded transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                isActive
                  ? "text-white font-bold drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]"
                  : "text-zinc-400 hover:text-cyan-200"
              }`}
            >
              <span
                ref={(el) => {
                  labelRefs.current[idx] = el;
                }}
<<<<<<< HEAD
                className="font-mono text-[8.5px] min-[360px]:text-[9.5px] min-[400px]:text-[10px] sm:text-[11px] md:text-xs uppercase tracking-tight min-[380px]:tracking-wider sm:tracking-[0.16em] transition-colors"
=======
                className="font-mono text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider sm:tracking-[0.16em] transition-colors"
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
              >
                {sec.id === "hero" ? (
                  "HOME"
                ) : sec.id === "projects" ? (
                  <>
                    <span className="hidden sm:inline">PROJECTS</span>
                    <span className="sm:hidden">WORK</span>
                  </>
                ) : sec.id === "experience" ? (
                  <>
                    <span className="hidden sm:inline">EXPERIENCE</span>
                    <span className="sm:hidden">EXP</span>
                  </>
                ) : (
                  sec.label.toUpperCase()
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom row: Continuous Ruler Tick Marks & Sliding Indicator Needle */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative w-full h-3 sm:h-3.5 mt-1 sm:mt-1.5 flex items-end cursor-pointer"
      >
        {/* Continuous ruler tick marks across the full track */}
        <div className="flex items-end justify-between w-full h-full px-1 pointer-events-none">
          {Array.from({ length: tickCount }).map((_, i) => {
            const isMajor = i % 10 === 0;
            const isMedium = i % 5 === 0;
            return (
              <span
                key={i}
                className={`w-[1px] transition-colors duration-200 rounded-full ${
                  isMajor
                    ? "h-2.5 sm:h-3 bg-zinc-400/80"
                    : isMedium
                    ? "h-2 bg-zinc-500/50"
                    : "h-1 sm:h-1.5 bg-zinc-700/60"
                }`}
              />
            );
          })}
        </div>

        {/* Luminous Active Indicator Needle - Perfectly Centered */}
        {needleLeft !== null && (
          <div
            className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 ease-out z-10"
            style={{ left: `${needleLeft}px` }}
          >
            {/* Top glowing needle pip */}
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#22d3ee] -mb-0.5" />
            {/* Vertical needle line */}
            <span className="w-[2px] h-3.5 sm:h-4 bg-gradient-to-b from-cyan-300 via-cyan-400 to-indigo-500 shadow-[0_0_10px_#06b6d4,0_0_18px_rgba(6,182,212,0.85)] rounded-full" />
          </div>
        )}
      </div>
    </nav>
  );
}

export default SectionIndicator;
