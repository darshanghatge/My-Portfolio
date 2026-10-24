"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export interface SatelliteLightProps {
  orbitRadius?: number;
  orbitSpeed?: number;
  inclination?: [number, number, number];
  initialAngle?: number;
  glowColor?: string;
  coronaColor?: string;
  lightColor?: string;
  lightIntensity?: number;
  trailRgbStart?: [number, number, number]; // [r, g, b] 0..1
  trailRgbEnd?: [number, number, number];   // [r, g, b] 0..1
}

/**
 * SatelliteLight Component:
 * A realistic, glowing 3D satellite / starlight orbiter rotating around the Earth.
 * Configurable for multiple orbits (diagonal, polar up-to-down, retrograde, etc.)
 */
export function SatelliteLight({
  orbitRadius = 1.36,
  orbitSpeed = 0.42,
  inclination = [0.42, 0.25, 0.58],
  initialAngle = 0.8,
  glowColor = "#38bdf8",
  coronaColor = "#0ea5e9",
  lightColor = "#67e8f9",
  lightIntensity = 1.8,
  trailRgbStart = [0.08, 0.55, 0.95],
  trailRgbEnd = [1.0, 1.0, 1.0],
}: SatelliteLightProps) {
  const satelliteRef = useRef<THREE.Group>(null);
  const strobeRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
<<<<<<< HEAD
  const trailLineRef = useRef<THREE.Line>(null);
=======
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
  const angleRef = useRef<number>(initialAngle);

  // 1. Orbital Trajectory Guide Ring (Subtle glowing circle)
  const trajectoryGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitRadius]);

  const trajectoryLineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(glowColor),
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(trajectoryGeometry, mat);
  }, [trajectoryGeometry, glowColor]);

  // 2. Trailing Starlight Beam (Fading light trail behind the satellite)
  const TRAIL_POINTS = 36;
  const trailGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(TRAIL_POINTS * 3);
    const colors = new Float32Array(TRAIL_POINTS * 3);

    for (let i = 0; i < TRAIL_POINTS; i++) {
      const alpha = i / (TRAIL_POINTS - 1); // 0 at tail tip, 1 at satellite nose
      // Gradient from trailRgbStart to trailRgbEnd
      colors[i * 3]     = THREE.MathUtils.lerp(trailRgbStart[0], trailRgbEnd[0], Math.pow(alpha, 1.8));
      colors[i * 3 + 1] = THREE.MathUtils.lerp(trailRgbStart[1], trailRgbEnd[1], Math.pow(alpha, 1.8));
      colors[i * 3 + 2] = THREE.MathUtils.lerp(trailRgbStart[2], trailRgbEnd[2], Math.pow(alpha, 1.8));
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [trailRgbStart, trailRgbEnd]);

  const trailLineObject = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(trailGeometry, mat);
  }, [trailGeometry]);

  // 3. Frame Loop: Update orbital position, orientation, trail, and blinking strobe
  useFrame((state, delta) => {
    // Advance orbit angle
    angleRef.current += delta * orbitSpeed;
    const a = angleRef.current;

    // Current satellite position in orbital plane
    const x = Math.cos(a) * orbitRadius;
    const z = Math.sin(a) * orbitRadius;

    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, 0, z);

      // Tangent vector along trajectory for flight alignment
      const nextX = Math.cos(a + 0.05) * orbitRadius;
      const nextZ = Math.sin(a + 0.05) * orbitRadius;
      satelliteRef.current.lookAt(nextX, 0, nextZ);
    }

    // Update trailing starlight points
<<<<<<< HEAD
    const posAttr = trailLineRef.current?.geometry.attributes
      .position as THREE.BufferAttribute | undefined;
    if (posAttr) {
      const trailSpan = 0.45; // Length of the glowing trail in radians (~25 degrees of orbit)

      for (let i = 0; i < TRAIL_POINTS; i++) {
        const t = i / (TRAIL_POINTS - 1);
        const trailAngle = a - (1.0 - t) * trailSpan;
        posAttr.setXYZ(
          i,
          Math.cos(trailAngle) * orbitRadius,
          0,
          Math.sin(trailAngle) * orbitRadius
        );
      }
      posAttr.needsUpdate = true;
    }
=======
    const posAttr = trailGeometry.attributes.position as THREE.BufferAttribute;
    const trailSpan = 0.45; // Length of the glowing trail in radians (~25 degrees of orbit)

    for (let i = 0; i < TRAIL_POINTS; i++) {
      const t = (i / (TRAIL_POINTS - 1));
      const trailAngle = a - (1.0 - t) * trailSpan;
      posAttr.setXYZ(
        i,
        Math.cos(trailAngle) * orbitRadius,
        0,
        Math.sin(trailAngle) * orbitRadius
      );
    }
    posAttr.needsUpdate = true;
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540

    // Blinking navigation beacon (periodic strobe flash every 1.2s)
    const time = state.clock.getElapsedTime();
    const strobeCycle = (time * 1.8) % 1.0;
    const isFlash = strobeCycle < 0.18; // Sharp flash window

    if (strobeRef.current) {
      const scale = isFlash ? 2.4 : 1.0;
      strobeRef.current.scale.set(scale, scale, scale);
    }

    if (pointLightRef.current) {
      // Dynamic light intensity: base gentle glow + sharp pulse during strobe flash
      pointLightRef.current.intensity = isFlash ? lightIntensity * 1.8 : lightIntensity;
    }
  });

  return (
    <group rotation={inclination}>
      {/* ── Orbital Trajectory Ring ── */}
      <primitive object={trajectoryLineObject} />

      {/* ── Streaming Starlight Trail ── */}
<<<<<<< HEAD
      <primitive ref={trailLineRef} object={trailLineObject} />
=======
      <primitive object={trailLineObject} />
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540

      {/* ── 3D Satellite Vehicle ── */}
      <group ref={satelliteRef}>
        {/* Dynamic Point Light: Casts traveling illumination onto the Earth and ribbons below */}
        <pointLight
          ref={pointLightRef}
          color={lightColor}
          intensity={lightIntensity}
          distance={2.4}
          decay={2}
        />

        {/* Central Satellite Body (Gold Thermal Insulation Foil) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.034, 0.034, 0.052]} />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.92}
            roughness={0.25}
          />
        </mesh>

        {/* Silver Equipment Deck */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.028, 0.028, 0.016]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Earth-Facing Parabolic Communications Dish (Points towards globe at origin) */}
        <mesh position={[0, -0.024, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.022, 0.012, 16, 1, true]} />
          <meshStandardMaterial
            color="#f1f5f9"
            metalness={0.8}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.028, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.012]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>

        {/* Solar Array Boom Truss */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.003, 0.003, 0.28, 8]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Left Solar Panel Array (Photovoltaic Cells) */}
        <group position={[-0.095, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.11, 0.042, 0.004]} />
            <meshStandardMaterial
              color="#0369a1"
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>
          {/* Gold Solar Panel Frame */}
          <mesh>
            <boxGeometry args={[0.114, 0.046, 0.002]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
          {/* Red Port Navigation LED */}
          <mesh position={[-0.058, 0, 0]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Right Solar Panel Array (Photovoltaic Cells) */}
        <group position={[0.095, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.11, 0.042, 0.004]} />
            <meshStandardMaterial
              color="#0369a1"
              metalness={0.75}
              roughness={0.2}
            />
          </mesh>
          {/* Gold Solar Panel Frame */}
          <mesh>
            <boxGeometry args={[0.114, 0.046, 0.002]} />
            <meshStandardMaterial
              color="#d97706"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
          {/* Green Starboard Navigation LED */}
          <mesh position={[0.058, 0, 0]}>
            <sphereGeometry args={[0.005, 8, 8]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* ── Glowing Starlight Flare / Navigation Strobe Beacon ── */}
        {/* Pulsing Core */}
        <mesh ref={strobeRef} position={[0, 0.024, 0]}>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Luminous Starlight Glow Aura (Additive Glow) */}
        <mesh position={[0, 0.024, 0]}>
          <sphereGeometry args={[0.038, 16, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Outer Starlight Corona Halo */}
        <mesh position={[0, 0.024, 0]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial
            color={coronaColor}
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 4-Point Starlight Diffraction Flare Spikes */}
        <group position={[0, 0.024, 0]}>
          {/* Horizontal Flare Spike */}
          <mesh>
            <planeGeometry args={[0.16, 0.008]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Vertical Flare Spike */}
          <mesh>
            <planeGeometry args={[0.008, 0.16]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
