import * as THREE from "three";

/**
 * Loads authentic NASA satellite Earth textures:
 * 1. Day Surface: Genuine NASA Blue Marble high-res satellite photograph
 *    (/textures/earth-blue-marble.jpg) - crystal clear continents and oceans without any obscuring white layers.
 * 2. Night Lights: Genuine NASA Black Marble metropolitan city lights
 *    (/textures/earth-night.jpg) - golden city lights on dark hemisphere.
 */
export function buildRealEarthTextures(onLoad?: () => void): {
  dayTexture: THREE.Texture;
  nightTexture: THREE.Texture;
} {
  const loader = new THREE.TextureLoader();
  let remaining = 2;
  const onDone = () => {
    remaining--;
    if (remaining <= 0 && onLoad) {
      onLoad();
    }
  };

  // 1. NASA Blue Marble Day Texture (Continents, oceans, deserts, mountains, ice)
  const dayTexture = loader.load("/textures/earth-blue-marble.jpg", onDone);
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  dayTexture.wrapS = THREE.RepeatWrapping;
  dayTexture.wrapT = THREE.ClampToEdgeWrapping;
  dayTexture.minFilter = THREE.LinearMipmapLinearFilter;
  dayTexture.magFilter = THREE.LinearFilter;
  dayTexture.generateMipmaps = true;

  // 2. NASA Black Marble Night Lights
  const nightTexture = loader.load("/textures/earth-night.jpg", onDone);
  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.wrapS = THREE.RepeatWrapping;
  nightTexture.wrapT = THREE.ClampToEdgeWrapping;
  nightTexture.minFilter = THREE.LinearMipmapLinearFilter;
  nightTexture.magFilter = THREE.LinearFilter;
  nightTexture.generateMipmaps = true;

  return { dayTexture, nightTexture };
}

export const loadRealEarthTextures = buildRealEarthTextures;
