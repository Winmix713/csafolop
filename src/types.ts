export type GlassMode = 'liquid' | 'glassmorphism' | 'neumorphism';
export type TintTone = 'clear' | 'smoke' | 'emerald' | 'deepblue' | 'champagne';
export type SceneType = 'gradient' | 'light' | 'dark' | 'photo';
export type ComponentType = 'profile' | 'dock' | 'modal' | 'player' | 'navbar';
export type ExportFormat = 'css' | 'cssvars' | 'tailwind' | 'react';

export interface GlassSettings {
  mode: GlassMode;
  noiseFreq: number;      // 1-25
  distortion: number;     // 0-200
  blur: number;           // 0-30
  saturation: number;     // 100-200
  tintGrayscale: number;  // 0-255
  tintOpacity: number;    // 0-100
  rimOpacity: number;     // 0-100
  shadowSpread: number;   // -20 to 18
  shadowBlur: number;     // 0-48
  shadowGrayscale: number;// 0-255
  spotlightOn: boolean;
  spotlightIntensity: number; // 0-100
  tiltOn: boolean;
  tintTone: TintTone;
  scene: SceneType;
  component: ComponentType;
  zoom: number;           // 50-200
}

export interface Preset {
  id: string;
  name: string;
  hue: number;
  settings: Partial<GlassSettings>;
}

export interface UserPreset {
  id: string;
  name: string;
  settings: GlassSettings;
  createdAt: number;
}
