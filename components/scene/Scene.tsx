"use client";

<<<<<<< HEAD
import React, { useRef, useEffect, useMemo, useState, useSyncExternalStore } from "react";
=======
import React, { useRef, useEffect, useMemo, useSyncExternalStore } from "react";
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { sceneConfig, SectionId } from "./sceneConfig";
import { RibbonShellShader } from "./shaders";
import { RealEarthShader, EarthAtmosphereHaloShader } from "./realEarthShader";
import { buildRealEarthTextures } from "./realEarthTextures";
import { createRibbonShellGeometry } from "./ribbonGeometry";
import { SatelliteLight } from "./SatelliteLight";

// Safe WebGL detection
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

// React 19 external store subscribers
function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
}

function subscribeToVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// Deterministic pseudo-random generator for React 19 purity compliance
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Shining Starfield Shader:
 * - Dynamic size variation (small background pinpricks, medium stars, large hero stars)
 * - Per-star twinkling animation with varying speeds and phases
 * - 4-point cross diffraction flare (lens sparkle spikes) for prominent stars that make them truly shine!
 */
const ShiningStarShader = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    attribute float aSize;
    attribute float aTwinklePhase;
    attribute float aTwinkleSpeed;
    attribute float aFlare;
    attribute vec3  color;

    uniform float uTime;

    varying vec3  vColor;
    varying float vTwinkle;
    varying float vFlare;

    void main() {
      vColor = color;
      vFlare = aFlare;

      // Harmonic twinkling: primary wave + secondary overtone
      float tw1 = sin(uTime * aTwinkleSpeed + aTwinklePhase);
      float tw2 = cos(uTime * (aTwinkleSpeed * 0.73) + aTwinklePhase * 2.1);
      vTwinkle = clamp(0.70 + 0.45 * tw1 + 0.20 * tw2, 0.2, 1.4);

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      // Point size attenuation with subtle breathing size variation
      float sizeFactor = aSize * (0.85 + 0.25 * tw1);
      gl_PointSize = sizeFactor * (210.0 / -mvPosition.z);
      gl_PointSize = max(1.8, min(gl_PointSize, 72.0));

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3  vColor;
    varying float vTwinkle;
    varying float vFlare;

    void main() {
      vec2 coord = gl_PointCoord * 2.0 - 1.0;
      float dist = length(coord);

      if (dist > 1.0) discard;

      // 1. Brilliant white-hot center core
      float core = smoothstep(0.18, 0.0, dist);

      // 2. Soft luminous circular halo
      float halo = exp(-dist * 3.5);

      // 3. Shining 4-point diffraction cross flare spikes (for shining bright stars!)
      float rayW = 0.07;
      float rayH = max(0.0, 1.0 - abs(coord.y) / rayW) * max(0.0, 1.0 - abs(coord.x));
      float rayV = max(0.0, 1.0 - abs(coord.x) / rayW) * max(0.0, 1.0 - abs(coord.y));
      float crossFlare = (rayH + rayV) * vFlare * 1.8;

      // Total light intensity
      float light = core * 1.6 + halo * 0.85 + crossFlare;

      // Color composition: white hot center, celestial tint at rim
      vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.8) * light * vTwinkle;
      float alpha = clamp(light * vTwinkle, 0.0, 1.0);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

/**
 * Distant Celestial Starfield: Background cosmos with ~1400 stars
 */
function DistantStarfield({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const count = isMobile ? 600 : 1500;

  const { positions, colors, sizes, twinklePhases, twinkleSpeeds, flares } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    const tp  = new Float32Array(count);
    const ts  = new Float32Array(count);
    const fl  = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Celestial sphere distribution
      const theta = seededRandom(i * 3 + 1) * Math.PI * 2;
      const phi = Math.acos(seededRandom(i * 3 + 2) * 2 - 1);
      const r = 30 + seededRandom(i * 3 + 3) * 22;

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const sizeRoll = seededRandom(i * 11 + 7);
      if (sizeRoll < 0.72) {
        sz[i] = 1.0 + seededRandom(i * 13 + 3) * 0.9;
        fl[i] = 0.0;
      } else if (sizeRoll < 0.92) {
        sz[i] = 2.6 + seededRandom(i * 17 + 5) * 1.8;
        fl[i] = 0.35 + seededRandom(i * 19 + 2) * 0.35;
      } else {
        sz[i] = 6.5 + seededRandom(i * 23 + 9) * 4.5;
        fl[i] = 0.90 + seededRandom(i * 29 + 4) * 0.35;
      }

      tp[i] = seededRandom(i * 31 + 1) * Math.PI * 2;
      ts[i] = 1.4 + seededRandom(i * 37 + 5) * 3.2;

      const tint = seededRandom(i * 41 + 13);
      if (tint < 0.55) {
        col[i * 3]     = 0.92;
        col[i * 3 + 1] = 0.96;
        col[i * 3 + 2] = 1.0;
      } else if (tint < 0.78) {
        col[i * 3]     = 0.65;
        col[i * 3 + 1] = 0.88;
        col[i * 3 + 2] = 1.0;
      } else if (tint < 0.92) {
        col[i * 3]     = 1.0;
        col[i * 3 + 1] = 0.90;
        col[i * 3 + 2] = 0.70;
      } else {
        col[i * 3]     = 1.0;
        col[i * 3 + 1] = 0.82;
        col[i * 3 + 2] = 0.95;
      }
    }

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      twinklePhases: tp,
      twinkleSpeeds: ts,
      flares: fl,
    };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.02;
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aFlare" args={[flares, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        args={[ShiningStarShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * CloseStarfield Component:
 * Near-field foreground stars positioned close to the camera and floating around the Earth.
 * Features dynamic parallax, individual twinkling, varied sizes, and 4-point shining cross flares.
 */
function CloseStars({ isMobile }: { isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const count = isMobile ? 90 : 240;

  const { positions, colors, sizes, twinklePhases, twinkleSpeeds, flares } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    const tp  = new Float32Array(count);
    const ts  = new Float32Array(count);
    const fl  = new Float32Array(count);

    let placed = 0;
    let seedIdx = 2000;

    while (placed < count) {
      seedIdx += 7;
      // Close 3D volume in front of and around the camera (camera is at [0, 0, 5.8])
      const x = (seededRandom(seedIdx + 1) * 2 - 1) * 5.6;
      const y = (seededRandom(seedIdx + 2) * 2 - 1) * 3.6;
      const z = -1.2 + seededRandom(seedIdx + 3) * 5.6; // Z from -1.2 to 4.4

      // Keep out of Earth core at [1.95, 0.25, 0]
      const distToPlanet = Math.hypot(x - 1.95, y - 0.25, z);
      if (distToPlanet < 1.9) continue;

      pos[placed * 3]     = x;
      pos[placed * 3 + 1] = y;
      pos[placed * 3 + 2] = z;

      // Close star sizes:
      // ~60% small delicate close sparkles
      // ~25% medium glowing diamond stars
      // ~15% large radiant hero stars with 4-point cross diffraction rays!
      const sizeRoll = seededRandom(seedIdx + 4);
      if (sizeRoll < 0.60) {
        sz[placed] = 1.8 + seededRandom(seedIdx + 5) * 1.5;
        fl[placed] = 0.0;
      } else if (sizeRoll < 0.85) {
        sz[placed] = 4.2 + seededRandom(seedIdx + 5) * 2.8;
        fl[placed] = 0.45 + seededRandom(seedIdx + 6) * 0.35;
      } else {
        sz[placed] = 8.5 + seededRandom(seedIdx + 5) * 6.0;
        fl[placed] = 0.95 + seededRandom(seedIdx + 6) * 0.35;
      }

      tp[placed] = seededRandom(seedIdx + 7) * Math.PI * 2;
      ts[placed] = 1.6 + seededRandom(seedIdx + 8) * 3.6;

      const tint = seededRandom(seedIdx + 9);
      if (tint < 0.50) {
        // Diamond blue-white
        col[placed * 3]     = 0.95;
        col[placed * 3 + 1] = 0.98;
        col[placed * 3 + 2] = 1.0;
      } else if (tint < 0.75) {
        // Electric cyan
        col[placed * 3]     = 0.60;
        col[placed * 3 + 1] = 0.90;
        col[placed * 3 + 2] = 1.0;
      } else if (tint < 0.90) {
        // Warm golden star
        col[placed * 3]     = 1.0;
        col[placed * 3 + 1] = 0.92;
        col[placed * 3 + 2] = 0.72;
      } else {
        // Radiant pink nebula star
        col[placed * 3]     = 1.0;
        col[placed * 3 + 1] = 0.84;
        col[placed * 3 + 2] = 0.96;
      }

      placed++;
    }

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      twinklePhases: tp,
      twinkleSpeeds: ts,
      flares: fl,
    };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Gentle harmonic floating drift in the foreground
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.16) * 0.07;
      pointsRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.12) * 0.06;
      pointsRef.current.rotation.z += delta * 0.003;
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aFlare" args={[flares, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        args={[ShiningStarShader]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Combined Starfield: Both distant celestial field and near-field close stars
 */
function Starfield({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <DistantStarfield isMobile={isMobile} />
      <CloseStars isMobile={isMobile} />
    </>
  );
}

/**
 * 3D World Scene: Planet Core, Ribbon Shell, Starfield, and Lights
 */
function World({
  isMobile,
  prefersReducedMotion,
  isTabVisible,
}: {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isTabVisible: boolean;
}) {
  const systemGroupRef = useRef<THREE.Group>(null);
  const planetCoreRef = useRef<THREE.Mesh>(null);
  const planetShaderRef = useRef<THREE.ShaderMaterial>(null);
  const ribbonShellRef = useRef<THREE.Mesh>(null);
  const ribbonShaderRef = useRef<THREE.ShaderMaterial>(null);

  // Deterministic 3D Ribbon Shell Geometry matching reference image
  const ribbonGeometry = useMemo(() => createRibbonShellGeometry(), []);

  // Photorealistic Real Earth Textures (Genuine NASA Satellite Imagery)
<<<<<<< HEAD
  const [earthTextures, setEarthTextures] = useState<ReturnType<
    typeof buildRealEarthTextures
  > | null>(null);

  useEffect(() => {
    const textures = buildRealEarthTextures(() => {
=======
  const earthTextures = useMemo(() => {
    if (typeof document === "undefined") return null;
    return buildRealEarthTextures(() => {
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
      if (planetShaderRef.current) {
        planetShaderRef.current.needsUpdate = true;
      }
    });
<<<<<<< HEAD
    setEarthTextures(textures);

    return () => {
      textures.dayTexture.dispose();
      textures.nightTexture.dispose();
    };
  }, []);

  useEffect(() => {
=======
  }, []);

  useEffect(() => {
    return () => {
      if (earthTextures) {
        earthTextures.dayTexture.dispose();
        earthTextures.nightTexture.dispose();
      }
    };
  }, [earthTextures]);

  useEffect(() => {
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
    if (planetShaderRef.current && earthTextures) {
      planetShaderRef.current.uniforms.uDayMap.value = earthTextures.dayTexture;
      planetShaderRef.current.uniforms.uNightMap.value = earthTextures.nightTexture;
    }
  }, [earthTextures]);

  // Physics & Animation refs (NO React state re-renders)
  const scrollDeltaRef = useRef(0);
  const rotVelocityRef = useRef(0.12);
  const timeAccumRef = useRef(0);
  const activeSectionRef = useRef<SectionId>("hero");
  const currentPosRef = useRef(new THREE.Vector3(2.12, 0.22, 0));
  const currentScaleRef = useRef(1.98);
  const currentTwistRef = useRef(1.7);
  const currentLightAngleRef = useRef(0.6);
  const pointerRef = useRef({ x: 0, y: 0 });
  const touchDeltaRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTouchX = 0;
    let lastTouchY = 0;

    // Viewport center section detection
    const updateActiveSection = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-orb]");
      if (sections.length === 0) return;

      const vCenter = window.innerHeight * 0.45;
      let bestId: SectionId = activeSectionRef.current;
      let minDistance = Infinity;

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= vCenter && rect.bottom >= vCenter) {
          bestId = (el.getAttribute("data-orb") as SectionId) || bestId;
          break;
        }
        const mid = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(mid - vCenter);
        if (dist < minDistance) {
          minDistance = dist;
          bestId = (el.getAttribute("data-orb") as SectionId) || bestId;
        }
      }
      activeSectionRef.current = bestId;
    };

    // 1. Single passive scroll listener
    const onScroll = () => {
      const curY = window.scrollY;
      const delta = curY - lastScrollY;
      scrollDeltaRef.current = delta;
      lastScrollY = curY;
      updateActiveSection();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 2. Custom event listener for instant tab change response
    const onSectionChange = (e: Event) => {
      const customEvent = e as CustomEvent<SectionId>;
      if (customEvent.detail) {
        activeSectionRef.current = customEvent.detail;
      }
    };
    window.addEventListener("orb-section-change", onSectionChange);

    // 3. Desktop pointer listener for subtle parallax
    const onPointerMove = (e: PointerEvent) => {
      if (isMobile) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      pointerRef.current.x = (e.clientX - halfW) / halfW;
      pointerRef.current.y = (e.clientY - halfH) / halfH;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // 4. Touch listeners for gentle drag tilt
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const curX = e.touches[0].clientX;
        const curY = e.touches[0].clientY;
        touchDeltaRef.current.x = curX - lastTouchX;
        touchDeltaRef.current.y = curY - lastTouchY;
        lastTouchX = curX;
        lastTouchY = curY;
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Initial evaluation
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orb-section-change", onSectionChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [isMobile]);

  useEffect(() => {
    return () => {
      ribbonGeometry.dispose();
    };
  }, [ribbonGeometry]);

  useFrame((state, delta) => {
    if (!isTabVisible) return;

    const systemGroup = systemGroupRef.current;
    const planetCore = planetCoreRef.current;
    const ribbonShell = ribbonShellRef.current;
    if (!systemGroup || !planetCore || !ribbonShell) return;

    const config = isMobile ? sceneConfig.mobile : sceneConfig.desktop;
    const target = config[activeSectionRef.current] || config.hero;

    // 1. Reduced motion: static position & scale, no scroll spin, no tilt
    if (prefersReducedMotion) {
      systemGroup.position.x = THREE.MathUtils.damp(systemGroup.position.x, target.position[0], 2.5, delta);
      systemGroup.position.y = THREE.MathUtils.damp(systemGroup.position.y, target.position[1], 2.5, delta);
      systemGroup.position.z = THREE.MathUtils.damp(systemGroup.position.z, target.position[2], 2.5, delta);
      currentScaleRef.current = THREE.MathUtils.damp(currentScaleRef.current, target.scale, 2.5, delta);
      systemGroup.scale.setScalar(currentScaleRef.current);
      systemGroup.rotation.set(0.15, 0, 0);
      planetCore.rotation.set(0, 0, 0);
      ribbonShell.rotation.set(0, 0, 0);
      return;
    }

    // 2. Scroll velocity & rotation:
    // Scroll down (positive delta) -> positive Y rotation (clockwise / rotates right)
    // Scroll up (negative delta) -> negative Y rotation (counter-clockwise / rotates left)
    const scrollDelta = scrollDeltaRef.current;
    scrollDeltaRef.current = 0; // Consume scroll delta

    const scrollImpulse = THREE.MathUtils.clamp(scrollDelta * 0.045, -8.0, 8.0);
    const idleSpin = 0.12; // Slow base idle spin

    rotVelocityRef.current = THREE.MathUtils.damp(
      rotVelocityRef.current,
      idleSpin + scrollImpulse,
      3.5,
      delta
    );

    // Shell rotates faster than core (parallax between layers!)
    planetCore.rotation.y += rotVelocityRef.current * delta;
    ribbonShell.rotation.y += rotVelocityRef.current * 1.55 * delta;

    // 3. Twist dynamics: uTwist increases with scroll speed and relaxes back when stopped
    const targetTwist = target.twist + (isMobile ? 0 : Math.abs(scrollImpulse) * 0.65);
    currentTwistRef.current = THREE.MathUtils.damp(
      currentTwistRef.current,
      targetTwist,
      3.0,
      delta
    );
    if (ribbonShaderRef.current) {
      ribbonShaderRef.current.uniforms.uTwist.value = currentTwistRef.current;
    }

    // 4. Directional light: Front face is in DAY, side edge transitions into NIGHT
    currentLightAngleRef.current = THREE.MathUtils.damp(
      currentLightAngleRef.current,
      target.lightAngle,
      2.8,
      delta
    );
    // Light comes from front (+Z) and slightly to one side (X),
    // illuminating the front of the screen with DAY and leaving the side edge in NIGHT
    const lightX = Math.sin(currentLightAngleRef.current) * 0.40 - 0.40;
    const lightY = 0.35;
    const lightZ = 1.15;
    const lightDirArr = [lightX, lightY, lightZ];

    if (planetShaderRef.current) {
      planetShaderRef.current.uniforms.uLightDir.value = lightDirArr;
      planetShaderRef.current.uniforms.uTime.value = timeAccumRef.current;
    }

    if (ribbonShaderRef.current) {
      ribbonShaderRef.current.uniforms.uLightDir.value = lightDirArr;
      ribbonShaderRef.current.uniforms.uTime.value = timeAccumRef.current;
    }

    // 5. Damp spatial position and uniform scale
    currentPosRef.current.x = THREE.MathUtils.damp(currentPosRef.current.x, target.position[0], 3.6, delta);
    currentPosRef.current.y = THREE.MathUtils.damp(currentPosRef.current.y, target.position[1], 3.6, delta);
    currentPosRef.current.z = THREE.MathUtils.damp(currentPosRef.current.z, target.position[2], 3.6, delta);
    currentScaleRef.current = THREE.MathUtils.damp(currentScaleRef.current, target.scale, 3.6, delta);

    systemGroup.position.set(
      currentPosRef.current.x,
      currentPosRef.current.y,
      currentPosRef.current.z
    );
    systemGroup.scale.setScalar(currentScaleRef.current);

    // 6. Pointer parallax tilt (desktop) & gentle touch drag tilt (mobile)
    if (!isMobile) {
      systemGroup.rotation.x = THREE.MathUtils.damp(
        systemGroup.rotation.x,
        0.18 + pointerRef.current.y * 0.25,
        3.5,
        delta
      );
      systemGroup.rotation.z = THREE.MathUtils.damp(
        systemGroup.rotation.z,
        -pointerRef.current.x * 0.22,
        3.5,
        delta
      );
    } else {
      const touchTiltX = touchDeltaRef.current.y * 0.005;
      const touchTiltZ = -touchDeltaRef.current.x * 0.005;
      touchDeltaRef.current.x = 0;
      touchDeltaRef.current.y = 0;
      systemGroup.rotation.x = THREE.MathUtils.damp(systemGroup.rotation.x, 0.15 + touchTiltX, 3.0, delta);
      systemGroup.rotation.z = THREE.MathUtils.damp(systemGroup.rotation.z, touchTiltZ, 3.0, delta);
    }

    // 7. Time uniform accumulation for shaders
    timeAccumRef.current += delta * 0.5;
  });

  return (
    <>
      {/* Starfield across deep space */}
      <Starfield isMobile={isMobile} />

      {/* Lighting */}
      <directionalLight position={[-3, 2.5, 3]} intensity={1.3} />
      {/* Boosted ambient so dark-side of the globe is never pitch-black */}
      <ambientLight color="#ffffff" intensity={0.25} />

      {/* Planet & Ribbon Shell Combined Group */}
      <group ref={systemGroupRef} position={[2.05, 0.25, 0.0]}>
        {/* Real Photorealistic Earth Sphere (Continents, Ocean Glint, Night Lights, Clouds) */}
        <mesh ref={planetCoreRef}>
          <sphereGeometry args={[1.0, isMobile ? 64 : 128, isMobile ? 64 : 128]} />
          <shaderMaterial
            ref={planetShaderRef}
            args={[
              {
                ...RealEarthShader,
                uniforms: {
                  uDayMap:   { value: earthTextures?.dayTexture ?? null },
                  uNightMap: { value: earthTextures?.nightTexture ?? null },
                  uTime:     { value: 0 },
                  uLightDir: { value: [-0.40, 0.35, 1.15] },
                },
              },
            ]}
            transparent={false}
          />
        </mesh>

        {/* Atmospheric Rayleigh Blue Halo Shell */}
        <mesh scale={1.025}>
          <sphereGeometry args={[1.0, 64, 64]} />
          <shaderMaterial
            args={[
              {
                ...EarthAtmosphereHaloShader,
                uniforms: {
                  uLightDir: { value: [-0.40, 0.35, 1.15] },
                },
              },
            ]}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Ribbon Shell (Genuine 3D Extruded Ribbons matching reference image) */}
        <mesh ref={ribbonShellRef} geometry={ribbonGeometry}>
          <shaderMaterial
            ref={ribbonShaderRef}
            args={[RibbonShellShader]}
            transparent={false}
            depthWrite={true}
          />
        </mesh>

        {/* Satellite 1: Diagonal Cyan Starlight Orbiter */}
        <SatelliteLight
          orbitRadius={1.36}
          orbitSpeed={0.42}
          inclination={[0.42, 0.25, 0.58]}
          initialAngle={0.8}
          glowColor="#38bdf8"
          coronaColor="#0ea5e9"
          lightColor="#67e8f9"
          trailRgbStart={[0.08, 0.55, 0.95]}
          trailRgbEnd={[1.0, 1.0, 1.0]}
        />

        {/* Satellite 2: Polar Descending Starlight Orbiter (From Up to Down across the other side) */}
        <SatelliteLight
          orbitRadius={1.46}
          orbitSpeed={0.38}
          inclination={[1.2, 0.5, 0.4]}
          initialAngle={5.2}
          glowColor="#c084fc"
          coronaColor="#a855f7"
          lightColor="#e879f9"
          trailRgbStart={[0.55, 0.2, 0.95]}
          trailRgbEnd={[1.0, 0.9, 1.0]}
        />
      </group>
    </>
  );
}

/**
 * Lightweight CSS fallback with radial-gradient blue/green planet, pink-blue conic ring,
 * and CSS starfield on deep navy background
 */
export function CssPlanetFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050816]">
      {/* Background Star field dots */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20px 30px, #ffffff, transparent), radial-gradient(1.5px 1.5px at 150px 80px, #93c5fd, transparent), radial-gradient(1px 1px at 280px 220px, #ffffff, transparent), radial-gradient(1.5px 1.5px at 400px 350px, #fef08a, transparent), radial-gradient(1px 1px at 600px 140px, #ffffff, transparent), radial-gradient(2px 2px at 800px 290px, #93c5fd, transparent), radial-gradient(1px 1px at 950px 420px, #ffffff, transparent)",
          backgroundSize: "600px 600px",
        }}
      />

      {/* Planet & Ribbon Fallback Container */}
      <div className="absolute top-[32%] right-[12%] w-[340px] h-[340px] transform -translate-y-1/2">
        {/* Procedural Blue/Green Planet */}
        <div
          className="absolute inset-[15%] rounded-full shadow-[0_0_50px_rgba(37,99,235,0.4)]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #22c55e 0%, #15803d 30%, #2563eb 55%, #0a1428 85%)",
          }}
        />

        {/* Pink-Blue Swirling Conic Ribbon Shell */}
        <div
          className="absolute inset-0 rounded-full border-[14px] border-transparent transform rotate-[-25deg] animate-[spin_25s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 120deg, #fac7d1, #818cf8 35%, #4d73d9 70%, transparent 85%, #fac7d1)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 16px), black calc(100% - 15px))",
            mask:
              "radial-gradient(farthest-side, transparent calc(100% - 16px), black calc(100% - 15px))",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Scene Client Component
 */
export default function Scene() {
  const isMobile = useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth < 768,
    () => false
  );

  const isTabVisible = useSyncExternalStore(
    subscribeToVisibility,
    () => !document.hidden,
    () => true
  );

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const hasWebGL = useSyncExternalStore(
    () => () => {},
    () => checkWebGLSupport(),
    () => true
  );

  if (!hasWebGL) {
    return <CssPlanetFallback />;
  }

  return (
    <div className="w-full h-full relative pointer-events-none bg-[#050816]">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 42, near: 0.1, far: 80 }}
        dpr={[1, 1.5]}
        frameloop={isTabVisible ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
        className="w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <World
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
          isTabVisible={isTabVisible}
        />
      </Canvas>
    </div>
  );
}
