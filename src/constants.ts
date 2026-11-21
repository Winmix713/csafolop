import type { GlassSettings, Preset, TintTone } from './types';

export const DEFAULT_SETTINGS: GlassSettings = {
  mode: 'liquid',
  noiseFreq: 11,
  distortion: 65,
  blur: 6,
  saturation: 180,
  tintGrayscale: 255,
  tintOpacity: 8,
  rimOpacity: 60,
  shadowSpread: -2,
  shadowBlur: 12,
  shadowGrayscale: 255,
  spotlightOn: true,
  spotlightIntensity: 50,
  tiltOn: true,
  tintTone: 'clear',
  scene: 'gradient',
  component: 'profile',
  zoom: 100,
};

export const TINT_TONES: Record<TintTone, { label: string; r: number; g: number; b: number }> = {
  clear:     { label: 'Clear',     r: 255, g: 255, b: 255 },
  smoke:     { label: 'Smoke',     r: 160, g: 160, b: 170 },
  emerald:   { label: 'Emerald',   r: 100, g: 200, b: 160 },
  deepblue:  { label: 'Deep Blue', r:  60, g: 110, b: 220 },
  champagne: { label: 'Champagne', r: 230, g: 200, b: 150 },
};

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: 'liquid-crystal',
    name: 'Liquid Crystal',
    hue: 205,
    settings: { mode: 'liquid', blur: 6, distortion: 65, tintOpacity: 0, noiseFreq: 11, saturation: 190, rimOpacity: 70, shadowBlur: 14, shadowSpread: -2 },
  },
  {
    id: 'fluid-amber',
    name: 'Fluid Amber',
    hue: 36,
    settings: { mode: 'liquid', blur: 9, distortion: 50, tintOpacity: 12, noiseFreq: 8, tintGrayscale: 230, saturation: 170, rimOpacity: 55, shadowBlur: 16 },
  },
  {
    id: 'ice-ripple',
    name: 'Ice Ripple',
    hue: 210,
    settings: { mode: 'liquid', blur: 12, distortion: 90, tintOpacity: 10, noiseFreq: 14, saturation: 160, rimOpacity: 65, shadowBlur: 20, shadowSpread: -4 },
  },
  {
    id: 'mercury-drop',
    name: 'Mercury Drop',
    hue: 230,
    settings: { mode: 'liquid', blur: 3, distortion: 100, tintOpacity: 5, noiseFreq: 6, saturation: 200, rimOpacity: 80, shadowBlur: 8, shadowSpread: 0 },
  },
  {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    hue: 200,
    settings: { mode: 'liquid', blur: 8, distortion: 120, tintOpacity: 10, noiseFreq: 10, saturation: 185, rimOpacity: 60, shadowBlur: 18, shadowSpread: -3 },
  },
  {
    id: 'crystal-mist',
    name: 'Crystal Mist',
    hue: 218,
    settings: { mode: 'glassmorphism', blur: 20, distortion: 30, tintOpacity: 13, noiseFreq: 18, saturation: 155, rimOpacity: 45, shadowBlur: 24, shadowSpread: -5 },
  },
  {
    id: 'molten-glass',
    name: 'Molten Glass',
    hue: 15,
    settings: { mode: 'liquid', blur: 5, distortion: 145, tintOpacity: 7, noiseFreq: 7, tintGrayscale: 220, saturation: 175, rimOpacity: 75, shadowBlur: 12 },
  },
  {
    id: 'silk-veil',
    name: 'Silk Veil',
    hue: 265,
    settings: { mode: 'glassmorphism', blur: 16, distortion: 18, tintOpacity: 17, noiseFreq: 20, saturation: 145, rimOpacity: 50, shadowBlur: 28, shadowSpread: -6 },
  },
  {
    id: 'plasma-flow',
    name: 'Plasma Flow',
    hue: 278,
    settings: { mode: 'liquid', blur: 8, distortion: 165, tintOpacity: 8, noiseFreq: 9, saturation: 195, rimOpacity: 68, shadowBlur: 16, shadowSpread: -2 },
  },
  {
    id: 'frost-lens',
    name: 'Frost Lens',
    hue: 190,
    settings: { mode: 'glassmorphism', blur: 25, distortion: 20, tintOpacity: 20, noiseFreq: 22, saturation: 140, rimOpacity: 40, shadowBlur: 32, shadowSpread: -8 },
  },
  {
    id: 'aurora-gel',
    name: 'Aurora Gel',
    hue: 158,
    settings: { mode: 'liquid', blur: 11, distortion: 115, tintOpacity: 15, noiseFreq: 12, tintGrayscale: 200, saturation: 180, rimOpacity: 62, shadowBlur: 20 },
  },
  {
    id: 'nebula-prism',
    name: 'Nebula Prism',
    hue: 248,
    settings: { mode: 'liquid', blur: 14, distortion: 130, tintOpacity: 12, noiseFreq: 15, saturation: 188, rimOpacity: 72, shadowBlur: 22, shadowSpread: -3 },
  },
];

export const USER_PRESETS_KEY = 'luma-glass:presets:v1';
