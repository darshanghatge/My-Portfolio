/**
 * PHOTOREALISTIC EARTH SHADERS
 * 1. EarthSurfaceShader: Realistic continents (vegetation, deserts, mountains, ice caps),
 *    deep azure oceans with specular sun glint, cloud shadows, and day/night twilight.
 * 2. EarthCloudShader: Realistic floating volumetric cloud layer with organic weather fronts,
 *    storm spirals, forward sunlight scattering, and independent parallax rotation.
 * 3. EarthAtmosphereShader: Brilliant electric cyan Rayleigh limb glow halo.
 */

const simplexNoiseGLSL = `
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

/**
 * 1. EARTH SURFACE SHADER
 * Realistic Earth surface with continents, deserts, mountains, polar ice,
 * deep oceans with specular sun reflection, and cloud shadow interaction.
 */
export const EarthSurfaceShader = {
  uniforms: {
    uTime: { value: 0 },
    uLightDir: { value: [0.5, 0.4, 1.2] },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;

    void main() {
      vModelPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uLightDir;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;

    ${simplexNoiseGLSL}

    // Multi-octave FBM for Earth continental landmasses
    float fbmLand(vec3 p) {
      float f = 0.0;
      f += 0.50 * (snoise(p * 1.5) * 0.5 + 0.5);
      f += 0.28 * (snoise(p * 3.2) * 0.5 + 0.5);
      f += 0.14 * (snoise(p * 6.5) * 0.5 + 0.5);
      f += 0.08 * (snoise(p * 13.0) * 0.5 + 0.5);
      return f;
    }

    // Mountain detail noise
    float fbmDetail(vec3 p) {
      return snoise(p * 18.0) * 0.5 + 0.5;
    }

    // Cloud shadow evaluation
    float getCloudShadow(vec3 p) {
      float c = 0.0;
      c += 0.55 * (snoise(p * 2.5 + vec3(uTime * 0.02, 0.0, 0.0)) * 0.5 + 0.5);
      c += 0.30 * (snoise(p * 5.2 + vec3(uTime * 0.03, 0.0, 0.0)) * 0.5 + 0.5);
      c += 0.15 * (snoise(p * 11.0) * 0.5 + 0.5);
      return smoothstep(0.42, 0.75, c);
    }

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 H = normalize(L + V);

      vec3 p = vModelPosition;
      float land = fbmLand(p);
      float detail = fbmDetail(p);
      float lat = abs(p.y);

      // Continent & Ocean palette
      vec3 deepOcean   = vec3(0.015, 0.08, 0.24);  // Deep navy blue
      vec3 shelfOcean  = vec3(0.04,  0.22, 0.48);  // Coastal turquoise blue
      vec3 coastSand   = vec3(0.72,  0.64, 0.46);  // Beaches & arid coasts
      vec3 lushGreen   = vec3(0.10,  0.28, 0.12);  // Forests & vegetation
      vec3 drySavanna  = vec3(0.48,  0.42, 0.25);  // Plains & brush
      vec3 mountain    = vec3(0.32,  0.24, 0.18);  // Mountain ranges
      vec3 polarIce    = vec3(0.92,  0.96, 1.00);  // Ice caps

      vec3 surfaceCol;
      float isOcean = 0.0;

      // 1. Water vs Land classification
      if (land < 0.46) {
        // Deep to shelf ocean
        float t = smoothstep(0.32, 0.46, land);
        surfaceCol = mix(deepOcean, shelfOcean, t);
        isOcean = 1.0;
      } else if (land < 0.49) {
        // Coastal sandy transition
        float t = smoothstep(0.46, 0.49, land);
        surfaceCol = mix(shelfOcean, coastSand, t);
        isOcean = 0.3;
      } else {
        // Continents: vary by latitude and elevation
        float elev = land + detail * 0.15;
        if (elev < 0.62) {
          // Vegetation & forests
          surfaceCol = mix(lushGreen, drySavanna, lat * 0.8);
        } else if (elev < 0.78) {
          // High plains & plateaus
          surfaceCol = mix(drySavanna, mountain, (elev - 0.62) / 0.16);
        } else {
          // Rocky mountain peaks
          surfaceCol = mountain;
        }
      }

      // 2. Polar ice caps
      if (lat > 0.78) {
        float iceFactor = smoothstep(0.78, 0.92, lat + detail * 0.08);
        surfaceCol = mix(surfaceCol, polarIce, iceFactor);
        isOcean *= (1.0 - iceFactor);
      }

      // 3. Directional sun lighting
      float NdotL = dot(N, L);
      float day = smoothstep(-0.15, 0.20, NdotL);

      // Sunset twilight along terminator
      float terminator = smoothstep(-0.25, 0.05, NdotL) * (1.0 - smoothstep(0.05, 0.35, NdotL));
      vec3 twilight = vec3(1.0, 0.45, 0.15) * terminator * 0.45;

      // 4. Photorealistic Ocean Sun Glint (warm golden-white specular highlight)
      float specPower = 48.0;
      float sunGlint = pow(max(0.0, dot(N, H)), specPower) * isOcean * day;
      vec3 glintColor = vec3(1.0, 0.96, 0.88) * sunGlint * 2.2;

      // 5. Cloud shadows on terrain
      float cloudShadow = getCloudShadow(p + L * 0.03) * 0.45;
      float shadowFactor = (1.0 - cloudShadow);

      // 6. Atmospheric Rayleigh haze on daylight surface
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.5);
      vec3 surfaceHaze = vec3(0.18, 0.52, 0.95) * fresnel * 0.45 * day;

      // 7. Compose surface lighting
      vec3 litSurface = surfaceCol * (0.04 + 0.96 * day * shadowFactor) + twilight;
      vec3 finalCol = litSurface + glintColor + surfaceHaze;

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `,
};

/**
 * 2. EARTH CLOUD SHADER
 * Realistic swirling atmospheric cloud systems (storm fronts, wispy cirrus, weather patterns)
 * with forward sunlight scatter and soft shadows, floating over the globe.
 */
export const EarthCloudShader = {
  uniforms: {
    uTime: { value: 0 },
    uLightDir: { value: [0.5, 0.4, 1.2] },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;

    void main() {
      vModelPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uLightDir;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;

    ${simplexNoiseGLSL}

    // Multi-scale cloud noise
    float fbmClouds(vec3 p) {
      float f = 0.0;
      // Slow global cloud drift
      vec3 drift = vec3(uTime * 0.025, 0.0, 0.0);
      vec3 coord = p + drift;

      f += 0.52 * (snoise(coord * 2.4) * 0.5 + 0.5);
      f += 0.26 * (snoise(coord * 4.8) * 0.5 + 0.5);
      f += 0.14 * (snoise(coord * 9.6) * 0.5 + 0.5);
      f += 0.08 * (snoise(coord * 18.0) * 0.5 + 0.5);
      return f;
    }

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 H = normalize(L + V);

      // Cloud density evaluation
      float cloudVal = fbmClouds(vModelPosition);
      // Sharp, organic cloud formation threshold
      float alpha = smoothstep(0.44, 0.72, cloudVal);

      if (alpha < 0.01) {
        discard;
      }

      // Cloud directional lighting
      float NdotL = max(0.0, dot(N, L));
      float day = smoothstep(-0.15, 0.25, dot(N, L));

      // Forward scattering (silver lining where light shines through wispy clouds)
      float forwardScatter = pow(max(0.0, dot(L, -V)), 3.5) * 0.35;

      // Cloud tops catch bright diffuse light, underside is soft slate blue
      vec3 cloudLit = vec3(1.0, 0.98, 0.96);
      vec3 cloudShadow = vec3(0.55, 0.62, 0.75);
      vec3 cloudColor = mix(cloudShadow, cloudLit, 0.35 + 0.65 * NdotL) + forwardScatter;

      // Specular sheen on dense cloud ridges
      float spec = pow(max(0.0, dot(N, H)), 16.0) * 0.18 * day;

      vec3 finalCol = (cloudColor * (0.05 + 0.95 * day) + spec);

      gl_FragColor = vec4(finalCol, alpha * 0.94);
    }
  `,
};

/**
 * 3. EARTH ATMOSPHERE SHADER
 * Radiant electric cyan-blue Rayleigh limb glow encircling the entire planet,
 * fading smoothly into deep space.
 */
export const EarthAtmosphereShader = {
  uniforms: {
    uLightDir: { value: [0.5, 0.4, 1.2] },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vec4 mvPosition = viewMatrix * worldPos;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uLightDir;

    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 L = normalize(uLightDir);

      // Inverted Fresnel: highest intensity at the grazing limb of the sphere
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.2);

      // Subtle directional bias towards the illuminated sun side
      float sunBias = smoothstep(-0.4, 0.6, dot(N, L)) * 0.6 + 0.4;

      // Electric cyan / azure atmosphere color matching the reference image
      vec3 atmosColor = vec3(0.12, 0.68, 1.0);
      vec3 finalColor = atmosColor * fresnel * sunBias * 1.8;

      gl_FragColor = vec4(finalColor, fresnel * sunBias);
    }
  `,
};
