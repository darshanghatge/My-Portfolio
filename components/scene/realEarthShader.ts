import * as THREE from "three";

/**
 * Photorealistic Real Earth Shader
 * --------------------------------
 * Day & Night Split:
 *  - Front face: Sunlit DAY with crystal-clear NASA Blue Marble continents,
 *    rich vegetation, golden deserts, white ice caps, and vibrant royal blue oceans.
 *  - Side: Smooth transition through a golden twilight terminator into NIGHT,
 *    revealing NASA Black Marble city lights glowing in the dark.
 *  - Electric-blue Rayleigh scattering atmospheric halo hugging the planet limb.
 */
export const RealEarthShader = {
  uniforms: {
    uDayMap:   { value: null as THREE.Texture | null },
    uNightMap: { value: null as THREE.Texture | null },
    uTime:     { value: 0 },
    uLightDir: { value: [-0.40, 0.40, 1.10] },
  },

  vertexShader: /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D uDayMap;
    uniform sampler2D uNightMap;
    uniform float uTime;
    uniform vec3  uLightDir;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    varying vec2 vUv;

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(cameraPosition - vWorldPosition);

      // 1. Crystal-clear NASA Blue Marble Day Surface
      vec3 surfaceAlbedo = texture2D(uDayMap, vUv).rgb;

      // Enhance ocean blue so it doesn't look black in daytime
      // Water pixels have higher blue than red/green
      float isWater = step(0.015, surfaceAlbedo.b - max(surfaceAlbedo.r, surfaceAlbedo.g * 0.92));
      vec3 dayAlbedo = surfaceAlbedo * 1.18 + vec3(0.015, 0.045, 0.12) * isWater;

      // 2. NASA Night City Lights (warm golden city clusters on dark hemisphere)
      vec3 nightLights = texture2D(uNightMap, vUv).rgb;

      // ── Directional Sunlight & Day/Night Transition ───────────────────────
      // Light is placed in front (+Z) and slightly to one side,
      // so front face is in DAY and side transitions into NIGHT
      float NdotL = dot(N, L);
      float day = smoothstep(-0.08, 0.22, NdotL);
      float night = 1.0 - smoothstep(-0.15, 0.08, NdotL);

      // Sunset / twilight terminator glow (warm golden-orange boundary line)
      float terminator = smoothstep(-0.16, 0.02, NdotL) * (1.0 - smoothstep(0.02, 0.24, NdotL));
      vec3 sunsetGlow = vec3(1.0, 0.54, 0.20) * terminator * 0.65;

      // Surface daytime lighting: smooth natural diffuse
      float groundLight = 0.08 + 0.92 * day;
      vec3 litGround = dayAlbedo * groundLight + sunsetGlow;

      // City lights on the night hemisphere
      vec3 activeCityLights = nightLights * night * 3.4;

      // Composite day surface + night lights (NO specular white hotspot, NO white cloud layer)
      vec3 composite = litGround + activeCityLights;

      // ── Atmospheric Rayleigh Scattering (Electric Blue Horizon Rim Glow) ──
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8);
      vec3 rayleighBlue = vec3(0.18, 0.60, 1.0) * fresnel * 0.75 * (0.35 + 0.65 * day);
      composite += rayleighBlue;

      gl_FragColor = vec4(composite, 1.0);
    }
  `,
};

/**
 * Atmospheric Outer Glow Shell Shader
 * Encircles the Earth with the iconic thin electric-blue Rayleigh halo
 */
export const EarthAtmosphereHaloShader = {
  uniforms: {
    uLightDir: { value: [-0.40, 0.40, 1.10] },
  },

  vertexShader: /* glsl */ `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform vec3 uLightDir;
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 L = normalize(uLightDir);

      // Inverted Fresnel: strongest at grazing edge
      float fresnel = pow(1.0 - abs(dot(N, V)), 3.5);

      // Stronger on the sun-lit side
      float sunBias = smoothstep(-0.3, 0.5, dot(N, L)) * 0.65 + 0.35;

      vec3 atmosCyan = vec3(0.18, 0.70, 1.0);
      vec3 color = atmosCyan * fresnel * sunBias * 1.8;

      gl_FragColor = vec4(color, fresnel * sunBias * 0.88);
    }
  `,
};
