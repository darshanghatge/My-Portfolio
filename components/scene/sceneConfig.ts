export type SectionId =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export interface SceneSectionConfig {
  /** [x, y, z] target world position for the planet system */
  position: [number, number, number];
  /** Uniform scale multiplier */
  scale: number;
  /** Ribbon shell base twist factor */
  twist: number;
  /** Directional light angle around Y (radians) for day/night split */
  lightAngle: number;
}

export interface SectionIndicatorItem {
  id: SectionId;
  number: string;
  label: string;
}

export const SECTIONS: SectionIndicatorItem[] = [
  { id: "hero", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "skills", number: "04", label: "Skills" },
  { id: "experience", number: "05", label: "Experience" },
  { id: "contact", number: "06", label: "Contact" },
];

/**
 * 3D SCENE SPATIAL & SHADER CONFIGURATION PER SECTION
 *
 * Sits to the right / top-right so the planet and ribbons NEVER cover
 * headline text, buttons, body copy, or project cards.
 *
 * Easily tweakable coordinates:
 * - X: horizontal axis (positive = right, negative = left)
 * - Y: vertical axis (positive = up, negative = down)
 * - Z: depth axis (positive = closer, negative = deeper)
 * - scale: planet & ribbon scale multiplier
 * - twist: ribbon shell latitude rotation angle
 * - lightAngle: azimuthal direction of sun light (day/night terminator)
 */
export const sceneConfig: {
  desktop: Record<SectionId, SceneSectionConfig>;
  mobile: Record<SectionId, SceneSectionConfig>;
} = {
  desktop: {
    hero: {
      // Content on left -> Planet on right (tuned scale with balanced breathing room)
      position: [2.12, 0.22, 0.0],
      scale: 1.98,
      twist: 1.7,
      lightAngle: 0.6,
    },
    about: {
      // Content on right, spacer on left -> Planet glides to LEFT with clean clearance
      position: [-2.18, 0.16, -0.1],
      scale: 1.95,
      twist: 2.1,
      lightAngle: 2.2,
    },
    projects: {
      // Featured cards on left -> Planet glides to RIGHT
      position: [2.18, 0.25, -0.2],
      scale: 1.95,
      twist: 1.9,
      lightAngle: 0.8,
    },
    skills: {
      // Technical arsenal centered -> Planet sits centered deep as planetary backdrop
      position: [0.0, 0.15, -1.25],
      scale: 2.65,
      twist: 2.3,
      lightAngle: 1.5,
    },
    experience: {
      // Timeline on right, spacer on left -> Planet glides to LEFT
      position: [-2.1, 0.2, -0.1],
      scale: 1.98,
      twist: 1.8,
      lightAngle: 2.4,
    },
    contact: {
      // Contact form centered -> Planet frames on the right
      position: [2.05, 0.28, 0.0],
      scale: 1.98,
      twist: 2.0,
      lightAngle: 0.9,
    },
  },
  mobile: {
    hero: {
      // Centered in viewport, balanced scale & breathing room
      position: [0.0, 0.04, -0.2],
      scale: 1.65,
      twist: 1.7,
      lightAngle: 0.6,
    },
    about: {
      // Glides smoothly to the left, sun terminator shifts
      position: [-0.32, 0.05, -0.22],
      scale: 1.62,
      twist: 2.1,
      lightAngle: 2.2,
    },
    projects: {
      // Glides smoothly to the right
      position: [0.32, 0.05, -0.22],
      scale: 1.62,
      twist: 1.9,
      lightAngle: 0.8,
    },
    skills: {
      // Planetary backdrop: moves into deep space and expands, exactly like desktop
      position: [0.0, 0.04, -0.65],
      scale: 1.95,
      twist: 2.3,
      lightAngle: 1.5,
    },
    experience: {
      // Glides smoothly to the left
      position: [-0.3, 0.05, -0.22],
      scale: 1.62,
      twist: 1.8,
      lightAngle: 2.4,
    },
    contact: {
      // Glides smoothly to the right framing the contact card
      position: [0.3, 0.05, -0.2],
      scale: 1.65,
      twist: 2.0,
      lightAngle: 0.9,
    },
  },
};
