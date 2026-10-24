import * as THREE from "three";

interface RibbonParam {
  /** Center latitude Y (-1.0 to 1.0) */
  lat: number;
  /** Starting azimuth angle (radians) */
  angleStart: number;
  /** Azimuth angle span (radians) */
  angleSpan: number;
  /** Vertical undulating wave amplitude */
  tilt: number;
  /** Phase offset for the vertical wave */
  tiltPhase: number;
  /** Sphere radius for the ribbon */
  radius: number;
  /** Maximum ribbon width (height along sphere surface) */
  maxWidth: number;
  /** Physical 3D thickness (radial depth) */
  thickness: number;
  /** Skew along length */
  twistRate?: number;
}

const RIBBON_DEFS: RibbonParam[] = [
  // 1. Top cap crest
  {
    lat: 0.90,
    angleStart: -0.4 * Math.PI,
    angleSpan: 0.95 * Math.PI,
    tilt: 0.06,
    tiltPhase: 0.0,
    radius: 1.20,
    maxWidth: 0.11,
    thickness: 0.045,
  },
  // 2. High northern swooping banner
  {
    lat: 0.72,
    angleStart: -0.75 * Math.PI,
    angleSpan: 1.4 * Math.PI,
    tilt: 0.15,
    tiltPhase: 0.3,
    radius: 1.22,
    maxWidth: 0.16,
    thickness: 0.05,
  },
  // 3. Upper-mid latitude ribbon (tapers into blade on right)
  {
    lat: 0.48,
    angleStart: -0.95 * Math.PI,
    angleSpan: 1.55 * Math.PI,
    tilt: 0.20,
    tiltPhase: 0.2,
    radius: 1.23,
    maxWidth: 0.19,
    thickness: 0.055,
  },
  // 4. Equatorial main swooping wing
  {
    lat: 0.22,
    angleStart: -1.15 * Math.PI,
    angleSpan: 1.65 * Math.PI,
    tilt: 0.24,
    tiltPhase: 0.1,
    radius: 1.24,
    maxWidth: 0.22,
    thickness: 0.058,
  },
  // 5. Lower-mid sweeping blade
  {
    lat: -0.08,
    angleStart: -1.25 * Math.PI,
    angleSpan: 1.6 * Math.PI,
    tilt: 0.22,
    tiltPhase: -0.1,
    radius: 1.23,
    maxWidth: 0.20,
    thickness: 0.055,
  },
  // 6. Southern mid ribbon
  {
    lat: -0.36,
    angleStart: -1.15 * Math.PI,
    angleSpan: 1.5 * Math.PI,
    tilt: 0.19,
    tiltPhase: -0.2,
    radius: 1.22,
    maxWidth: 0.18,
    thickness: 0.05,
  },
  // 7. Southern cradle strand
  {
    lat: -0.64,
    angleStart: -1.0 * Math.PI,
    angleSpan: 1.4 * Math.PI,
    tilt: 0.15,
    tiltPhase: -0.1,
    radius: 1.21,
    maxWidth: 0.16,
    thickness: 0.048,
  },
  // 8. South polar cradle basket
  {
    lat: -0.86,
    angleStart: -0.7 * Math.PI,
    angleSpan: 1.25 * Math.PI,
    tilt: 0.10,
    tiltPhase: 0.0,
    radius: 1.19,
    maxWidth: 0.14,
    thickness: 0.044,
  },
];

/**
 * Procedural 3D Ribbon Shell Geometry Builder
 * Creates genuine 3D extruded ribbon strips with rounded bevel cross-sections,
 * aerodynamic tapered blade tips, and smooth curvature matching the reference image.
 */
export function createRibbonShellGeometry(): THREE.BufferGeometry {
  const allPositions: number[] = [];
  const allNormals: number[] = [];
  const allUvs: number[] = [];
  const allIndices: number[] = [];

  let indexOffset = 0;

  // Number of longitudinal slices along each ribbon
  const LENGTH_SEGMENTS = 56;
  // Number of cross-sectional profile vertices (8-sided rounded oval)
  const PROFILE_VERTICES = 8;

  // Precompute 8-sided rounded profile unit angles
  // Creates a crowned oval cross-section with smooth bevels
  const profileAngles: number[] = [];
  for (let p = 0; p < PROFILE_VERTICES; p++) {
    profileAngles.push((p / PROFILE_VERTICES) * Math.PI * 2);
  }

  for (let r = 0; r < RIBBON_DEFS.length; r++) {
    const def = RIBBON_DEFS[r];
    const ribbonStartIdx = indexOffset;

    // 1. Generate center-line path points and frames
    const pathPoints: THREE.Vector3[] = [];
    const pathNormals: THREE.Vector3[] = [];
    const pathBinormals: THREE.Vector3[] = [];
    const widths: number[] = [];
    const thicknesses: number[] = [];

    for (let i = 0; i <= LENGTH_SEGMENTS; i++) {
      const u = i / LENGTH_SEGMENTS;

      // Azimuth angle sweeping around the sphere
      const azimuth = def.angleStart + u * def.angleSpan;

      // Latitude with undulating wave slope
      const wave = Math.sin(u * Math.PI + def.tiltPhase) * def.tilt;
      // Slight downward pitch from left to right as seen in reference
      const latPitch = -0.08 * (u - 0.5);
      const rawLat = def.lat + wave + latPitch;
      const clampedLat = Math.max(-0.95, Math.min(0.95, rawLat));

      // Spherical coordinate mapping to 3D position
      const cosLat = Math.sqrt(Math.max(0.001, 1.0 - clampedLat * clampedLat));
      const px = Math.cos(azimuth) * cosLat * def.radius;
      const py = clampedLat * def.radius;
      const pz = Math.sin(azimuth) * cosLat * def.radius;

      const pt = new THREE.Vector3(px, py, pz);
      pathPoints.push(pt);

      // Radial outward normal from sphere center
      const nSurf = pt.clone().normalize();
      pathNormals.push(nSurf);

      // Width and thickness profiles:
      // - Start: rounded aerodynamic nose
      // - Middle: full maximum width
      // - End: sleek tapering blade tip (pow(1.0 - u, 0.65))
      const startTaper = Math.min(1.0, u / 0.12);
      const smoothStart = Math.sin((startTaper * Math.PI) / 2);
      const endTaper = Math.pow(Math.max(0.0, 1.0 - u), 0.65);
      const widthFactor = smoothStart * endTaper;

      widths.push(Math.max(0.002, def.maxWidth * widthFactor));
      thicknesses.push(Math.max(0.003, def.thickness * (0.25 + 0.75 * widthFactor)));
    }

    // Compute binormals perpendicular to tangent and surface normal
    for (let i = 0; i <= LENGTH_SEGMENTS; i++) {
      const tangent = new THREE.Vector3();
      if (i === 0) {
        tangent.subVectors(pathPoints[1], pathPoints[0]);
      } else if (i === LENGTH_SEGMENTS) {
        tangent.subVectors(pathPoints[LENGTH_SEGMENTS], pathPoints[LENGTH_SEGMENTS - 1]);
      } else {
        tangent.subVectors(pathPoints[i + 1], pathPoints[i - 1]);
      }
      tangent.normalize();

      const binormal = new THREE.Vector3().crossVectors(pathNormals[i], tangent).normalize();
      pathBinormals.push(binormal);
    }

    // 2. Generate 3D cross-section rings
    // Ring vertices for each slice i: 8 vertices per slice
    for (let i = 0; i <= LENGTH_SEGMENTS; i++) {
      const pt = pathPoints[i];
      const nSurf = pathNormals[i];
      const binormal = pathBinormals[i];
      const w = widths[i] * 0.5;
      const t = thicknesses[i] * 0.5;
      const uCoord = i / LENGTH_SEGMENTS;

      for (let p = 0; p < PROFILE_VERTICES; p++) {
        const ang = profileAngles[p];
        const cosA = Math.cos(ang);
        const sinA = Math.sin(ang);

        // Rounded cross-section offset:
        // cosA along binormal (width), sinA along radial normal (thickness)
        // Add subtle crown on upper surface for rich specular sheen
        const crown = sinA > 0 ? 1.08 : 1.0;
        const offsetX = binormal.x * (cosA * w) + nSurf.x * (sinA * t * crown);
        const offsetY = binormal.y * (cosA * w) + nSurf.y * (sinA * t * crown);
        const offsetZ = binormal.z * (cosA * w) + nSurf.z * (sinA * t * crown);

        const vx = pt.x + offsetX;
        const vy = pt.y + offsetY;
        const vz = pt.z + offsetZ;

        allPositions.push(vx, vy, vz);

        // Smooth outward normal from the cross-section center
        const norm = new THREE.Vector3(offsetX, offsetY, offsetZ).normalize();
        allNormals.push(norm.x, norm.y, norm.z);

        // UV coordinates: X is length u, Y is cross-section p
        allUvs.push(uCoord, p / PROFILE_VERTICES);
      }
    }

    // 3. Connect cross-section rings with quad triangles
    for (let i = 0; i < LENGTH_SEGMENTS; i++) {
      const ring1 = ribbonStartIdx + i * PROFILE_VERTICES;
      const ring2 = ribbonStartIdx + (i + 1) * PROFILE_VERTICES;

      for (let p = 0; p < PROFILE_VERTICES; p++) {
        const nextP = (p + 1) % PROFILE_VERTICES;

        const a = ring1 + p;
        const b = ring2 + p;
        const c = ring2 + nextP;
        const d = ring1 + nextP;

        // Two triangles for each quad
        allIndices.push(a, b, c);
        allIndices.push(a, c, d);
      }
    }

    // 4. Cap the start of the ribbon (rounded tip)
    const startCenterIdx = allPositions.length / 3;
    const startPt = pathPoints[0];
    const startNormal = pathPoints[0].clone().sub(pathPoints[1]).normalize();
    allPositions.push(startPt.x, startPt.y, startPt.z);
    allNormals.push(startNormal.x, startNormal.y, startNormal.z);
    allUvs.push(0, 0.5);

    for (let p = 0; p < PROFILE_VERTICES; p++) {
      const nextP = (p + 1) % PROFILE_VERTICES;
      const ring1 = ribbonStartIdx;
      allIndices.push(startCenterIdx, ring1 + nextP, ring1 + p);
    }

    // 5. Cap the end of the ribbon (sharp blade point)
    const endCenterIdx = (allPositions.length / 3);
    const endPt = pathPoints[LENGTH_SEGMENTS];
    const endNormal = pathPoints[LENGTH_SEGMENTS].clone().sub(pathPoints[LENGTH_SEGMENTS - 1]).normalize();
    allPositions.push(endPt.x, endPt.y, endPt.z);
    allNormals.push(endNormal.x, endNormal.y, endNormal.z);
    allUvs.push(1, 0.5);

    for (let p = 0; p < PROFILE_VERTICES; p++) {
      const nextP = (p + 1) % PROFILE_VERTICES;
      const ringLast = ribbonStartIdx + LENGTH_SEGMENTS * PROFILE_VERTICES;
      allIndices.push(endCenterIdx, ringLast + p, ringLast + nextP);
    }

    // Update global offset to include ring vertices and the 2 cap vertices
    indexOffset += (LENGTH_SEGMENTS + 1) * PROFILE_VERTICES + 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(allPositions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(allNormals, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(allUvs, 2));
  geometry.setIndex(allIndices);

  return geometry;
}
