/**
 * Simplex 3D Noise GLSL Chunk
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
 * PLANET CORE SHADER
 * Faithfully matches the reference image:
 * - Stepped 3D terrain elevation:
 *     Deep oceanic navy (#091f3d) ->
 *     Vibrant coastal azure (#1b6bb8) ->
 *     Crisp golden-peach sand coastline contour (#eed4a4) ->
 *     Lush emerald green continent plains (#129b48) ->
 *     Deep highland forest plateau (#084f22)
 * - 3D vertex extrusion & finite-difference cliff relief normals
 * - Realistic cast ribbon shadow bands across the continents
 * - Glowing intricate golden-amber night city light network on the dark hemisphere
 * - Water specular highlights & blue atmospheric rim glow
 */
export const PlanetCoreShader = {
  uniforms: {
    uTime: { value: 0 },
    uLightDir: { value: [-1.15, 0.75, 1.0] },
  },
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vWorldPosition;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;
    varying float vElevation;

    ${simplexNoiseGLSL}

    // Fractal noise for organic, continent-scale terrain matching reference image
    float fbmTerrain(vec3 p) {
      float f = 0.0;
      f += 0.58 * (snoise(p) * 0.5 + 0.5);
      f += 0.28 * (snoise(p * 2.1 + vec3(1.3, 2.7, 0.4)) * 0.5 + 0.5);
      f += 0.10 * (snoise(p * 4.2 + vec3(2.1, 0.8, 3.2)) * 0.5 + 0.5);
      f += 0.04 * (snoise(p * 8.4) * 0.5 + 0.5);
      return f;
    }

    // Stepped 3D relief elevation matching reference image contours
    float getElevation(vec3 pos) {
      vec3 p = pos * 1.65;
      float h = fbmTerrain(p);
      if (h < 0.39) {
        // Deep ocean (recessed basin)
        return -0.024;
      } else if (h < 0.50) {
        // Coastal shelf waters
        return -0.008;
      } else if (h < 0.542) {
        // Raised sandy beach coastline ridge
        return 0.012;
      } else if (h < 0.69) {
        // Elevated emerald continent plateau
        return 0.046;
      } else {
        // High mountain forest plateau
        return 0.072;
      }
    }

    void main() {
      vModelPosition = position;
      float elev = getElevation(position);
      vElevation = elev;

      // Physically displace vertex outward along its radial normal
      vec3 displacedPos = position + normal * elev;

      // Compute 3D relief normal via finite differences for cliff shading
      float eps = 0.015;
      vec3 t1 = abs(normal.y) < 0.99 ? cross(normal, vec3(0.0, 1.0, 0.0)) : cross(normal, vec3(1.0, 0.0, 0.0));
      t1 = normalize(t1);
      vec3 t2 = normalize(cross(normal, t1));

      float e1 = getElevation(position + t1 * eps);
      float e2 = getElevation(position + t2 * eps);

      vec3 v1 = t1 * eps + normal * (e1 - elev);
      vec3 v2 = t2 * eps + normal * (e2 - elev);
      vec3 localNormal = normalize(cross(v1, v2));

      // World-space coordinates for physically accurate directional lighting
      vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
      vWorldPosition = worldPos.xyz;
      vWorldNormal = normalize(mat3(modelMatrix) * localNormal);

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
    varying float vElevation;

    ${simplexNoiseGLSL}

    float fbmTerrain(vec3 p) {
      float f = 0.0;
      f += 0.58 * (snoise(p) * 0.5 + 0.5);
      f += 0.28 * (snoise(p * 2.1 + vec3(1.3, 2.7, 0.4)) * 0.5 + 0.5);
      f += 0.10 * (snoise(p * 4.2 + vec3(2.1, 0.8, 3.2)) * 0.5 + 0.5);
      f += 0.04 * (snoise(p * 8.4) * 0.5 + 0.5);
      return f;
    }

    void main() {
      vec3 N = normalize(vWorldNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(cameraPosition - vWorldPosition);
      vec3 H = normalize(L + V);

      // Quantized contour terrain height
      vec3 p = vModelPosition * 1.65;
      float h = fbmTerrain(p);

      vec3 terrainCol;
      bool isLand = false;
      float isWater = 0.0;

      // Color palette exact to reference image:
      if (h < 0.39) {
        // Deep ocean (midnight navy)
        terrainCol = vec3(0.035, 0.12, 0.25);
        isWater = 1.0;
      } else if (h < 0.50) {
        // Vibrant coastal shelf waters (brilliant cobalt/cyan)
        terrainCol = vec3(0.10, 0.42, 0.75);
        isWater = 0.75;
      } else if (h < 0.542) {
        // Crisp golden-peach sand coastline contour
        terrainCol = vec3(0.95, 0.85, 0.62);
      } else if (h < 0.69) {
        // Lush emerald green continent plains
        terrainCol = vec3(0.07, 0.61, 0.27);
        isLand = true;
      } else {
        // Deep highland forest plateau
        terrainCol = vec3(0.03, 0.33, 0.13);
        isLand = true;
      }

      // 3D Directional lighting
      float NdotL = dot(N, L);
      float day = smoothstep(-0.15, 0.22, NdotL);

      // Golden sunset / twilight glow on the day-night terminator
      float terminator = smoothstep(-0.25, 0.05, NdotL) * (1.0 - smoothstep(0.05, 0.35, NdotL));
      vec3 twilight = vec3(1.0, 0.54, 0.22) * terminator * 0.55;

      // Ribbon shadow cast onto the Earth (swirling dark band matching image)
      vec3 shadowPos = vModelPosition + L * 0.30;
      float ribbonBand1 = sin(shadowPos.y * 11.0 + atan(shadowPos.z, shadowPos.x) * 2.5 - uTime * 0.15);
      float ribbonBand2 = sin(shadowPos.y * 7.5 - atan(shadowPos.z, shadowPos.x) * 3.2);
      float ribbonShadow = smoothstep(0.50, 0.88, ribbonBand1) * 0.72 + smoothstep(0.58, 0.90, ribbonBand2) * 0.38;
      ribbonShadow = clamp(ribbonShadow, 0.0, 0.85) * smoothstep(-0.05, 0.35, NdotL);

      // Realistic water specular gloss on oceans and coastal waters
      float waterSpec = pow(max(0.0, dot(N, H)), 38.0) * isWater * 0.85 * day * (1.0 - ribbonShadow);

      // Night-side intricate golden city lights network (bright filaments + cluster hubs)
      vec3 cityCol = vec3(0.0);
      if ((isLand || h >= 0.50) && NdotL < 0.25) {
        float n1 = snoise(vModelPosition * 18.0);
        float n2 = snoise(vModelPosition * 30.0 + vec3(4.8, 1.5, 3.2));
        float filaments = 1.0 - smoothstep(0.0, 0.11, abs(n2));
        float clusters = smoothstep(0.55, 0.82, n1);
        float fineNodes = smoothstep(0.65, 0.92, snoise(vModelPosition * 46.0));
        float cityIntensity = max(clusters * 1.5, filaments * 0.85 + fineNodes * 0.6);

        float nightFactor = clamp((0.18 - NdotL) / 0.36, 0.0, 1.0);
        vec3 cityGold = mix(vec3(1.0, 0.65, 0.20), vec3(1.0, 0.96, 0.76), clusters);
        cityCol = cityGold * (cityIntensity * 4.4 * nightFactor);
      }

      // Atmospheric limb glow
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.8);
      vec3 atmosphere = vec3(0.18, 0.55, 1.0) * fresnel * 0.72 * (0.15 + 0.85 * day);

      // Combine lit terrain with shadow, twilight, specular, city lights, and atmosphere
      vec3 litTerrain = terrainCol * (0.04 + 0.96 * day * (1.0 - ribbonShadow)) + twilight;
      vec3 finalCol = litTerrain + vec3(0.85, 0.92, 1.0) * waterSpec + cityCol + atmosphere;

      gl_FragColor = vec4(finalCol, 1.0);
    }
  `,
};

/**
 * RIBBON SHELL SHADER
 * Real 3D Extruded Ribbons with satin specular gloss, latitude gradient,
 * inward ambient occlusion self-shadowing, and dynamic scroll-driven twist.
 * Color: Pastel Pink (#fac7d1) -> Soft Lavender (#dcc2de) -> Periwinkle Blue (#4d73d9).
 */
export const RibbonShellShader = {
  uniforms: {
    uTime: { value: 0 },
    uTwist: { value: 0.0 },
    uLightDir: { value: [1.2, 0.6, 1.0] },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uTwist;

    varying vec3 vNormal;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;
    varying float vLat;

    void main() {
      vModelPosition = position;

      // Dynamic scroll twist deformation along latitude
      float angle = position.y * uTwist * 0.22;
      float cosA = cos(angle);
      float sinA = sin(angle);

      vec3 twistedPos = vec3(
        position.x * cosA - position.z * sinA,
        position.y,
        position.x * sinA + position.z * cosA
      );

      vec3 twistedNorm = vec3(
        normal.x * cosA - normal.z * sinA,
        normal.y,
        normal.x * sinA + normal.z * cosA
      );

      vNormal = normalize(normalMatrix * twistedNorm);
      vLat = clamp((twistedPos.y + 1.25) * 0.40, 0.0, 1.0);

      vec4 mvPosition = modelViewMatrix * vec4(twistedPos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uLightDir;

    varying vec3 vNormal;
    varying vec3 vModelPosition;
    varying vec3 vViewPosition;
    varying float vLat;

    void main() {
      vec3 N = normalize(vNormal);
      vec3 L = normalize(uLightDir);
      vec3 V = normalize(vViewPosition);

      // Latitudinal color transition matching the reference image:
      // Top: Pastel Cream-Pink (#f8d8e2)
      // Mid: Soft Mauve-Lavender (#dfc5e0)
      // Bottom: Periwinkle Slate Blue (#5270ba / #4866b0)
      vec3 pink = vec3(0.97, 0.83, 0.88);
      vec3 lavender = vec3(0.86, 0.77, 0.89);
      vec3 periwinkle = vec3(0.30, 0.44, 0.76);

      vec3 ribbonColor;
      if (vLat > 0.5) {
        ribbonColor = mix(lavender, pink, (vLat - 0.5) * 2.0);
      } else {
        ribbonColor = mix(periwinkle, lavender, vLat * 2.0);
      }

      // Soft diffuse Lambert lighting
      float NdotL = max(0.0, dot(N, L));
      float diffuse = mix(0.38, 1.0, NdotL);

      // Inward ambient occlusion / self-shadowing for surfaces facing the planet
      float inwardFacing = dot(N, normalize(vModelPosition));
      float ao = smoothstep(-0.6, 0.8, inwardFacing) * 0.38 + 0.62;

      // Specular highlight on upper curved ridge
      vec3 H = normalize(L + V);
      float spec = pow(max(0.0, dot(N, H)), 26.0) * 0.50;

      // Satin Fresnel rim sheen
      float fresnel = pow(1.0 - max(0.0, dot(N, V)), 2.6) * 0.35;

      vec3 finalColor = (ribbonColor * diffuse * ao) + vec3(1.0, 0.94, 0.97) * (spec + fresnel);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};
