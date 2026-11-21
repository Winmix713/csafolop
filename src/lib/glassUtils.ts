import type { GlassSettings, ExportFormat } from '../types';
import { TINT_TONES } from '../constants';

export function buildBackdropFilter(s: GlassSettings): string {
  const blurPart = `blur(${s.blur}px)`;
  const satPart = `saturate(${s.saturation}%)`;
  if (s.mode === 'liquid') {
    return `url(#liquid-glass) ${blurPart} ${satPart} contrast(1.05) brightness(1.02)`;
  }
  if (s.mode === 'glassmorphism') {
    return `${blurPart} ${satPart}`;
  }
  return 'none' as string;
}

export function buildBackground(s: GlassSettings): string {
  if (s.mode === 'neumorphism') {
    return '#252d38';
  }
  const tone = TINT_TONES[s.tintTone as keyof typeof TINT_TONES];
  const g = s.tintGrayscale;
  const alpha = (s.tintOpacity / 100).toFixed(3);
  if (s.tintTone === 'clear') {
    return `rgba(${g},${g},${g},${alpha})`;
  }
  return `rgba(${tone.r},${tone.g},${tone.b},${alpha})`;
}

export function buildBoxShadow(s: GlassSettings): string {
  if (s.mode === 'neumorphism') {
    return `6px 6px 16px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)`;
  }
  const sg = s.shadowGrayscale;
  const rimA = (s.rimOpacity / 100).toFixed(2);
  return [
    `0 1px 1px rgba(0,0,0,0.45)`,
    `0 4px 8px rgba(0,0,0,0.35)`,
    `0 12px 24px rgba(0,0,0,0.38)`,
    `inset 0 ${s.shadowSpread}px ${s.shadowBlur}px rgba(${sg},${sg},${sg},0.08)`,
    `inset 0 1px 0 rgba(255,255,255,${rimA})`,
  ].join(', ');
}

export function buildBorder(s: GlassSettings): string {
  if (s.mode === 'neumorphism') {
    return '1px solid rgba(255,255,255,0.06)';
  }
  const rimA = ((s.rimOpacity / 100) * 0.4).toFixed(2);
  return `1px solid rgba(255,255,255,${rimA})`;
}

export function generateCSS(s: GlassSettings, format: ExportFormat): string {
  const bf = buildBackdropFilter(s);
  const bg = buildBackground(s);
  const shadow = buildBoxShadow(s);
  const border = buildBorder(s);
  const radius = '20px';

  const liquidFilter = s.mode === 'liquid' ? `
/* Add this SVG filter to your HTML before closing </body> */
/* <svg style="position:absolute;width:0;height:0"><defs>
  <filter id="liquid-glass">
    <feTurbulence type="fractalNoise" baseFrequency="${(s.noiseFreq / 1000).toFixed(3)} ${(s.noiseFreq * 1.5 / 1000).toFixed(3)}" numOctaves="2" seed="7" result="noise"/>
    <feGaussianBlur in="noise" stdDeviation="3" result="softNoise"/>
    <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="${s.distortion}" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg> */\n` : '';

  if (format === 'css') {
    return `${liquidFilter}.glass-surface {
  /* backdrop-filter support: Chrome 76+, Edge 79+, Safari 9+ */
  /* Full liquid distortion: Chromium desktop only */
  -webkit-backdrop-filter: ${bf};
  backdrop-filter: ${bf};
  background: ${bg};
  border: ${border};
  border-radius: ${radius};
  box-shadow: ${shadow};
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass-surface {
    background: rgba(18, 24, 32, 0.92);
  }
}`;
  }

  if (format === 'cssvars') {
    return `${liquidFilter}:root {
  --glass-blur: ${s.blur}px;
  --glass-saturation: ${s.saturation}%;
  --glass-tint-opacity: ${(s.tintOpacity / 100).toFixed(2)};
  --glass-rim-opacity: ${(s.rimOpacity / 100).toFixed(2)};
  --glass-shadow-spread: ${s.shadowSpread}px;
  --glass-shadow-blur: ${s.shadowBlur}px;
  --glass-radius: ${radius};
}

.glass-surface {
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  background: ${bg};
  border: ${border};
  border-radius: var(--glass-radius);
  box-shadow: ${shadow};
}`;
  }

  if (format === 'tailwind') {
    return `${liquidFilter}/* Tailwind CSS — use arbitrary values for unsupported properties */
/* Add backdrop-filter via utility or @layer components */

<div class="rounded-[20px] border border-white/[${(s.rimOpacity / 100 * 0.4).toFixed(2)}]
  [backdrop-filter:blur(${s.blur}px)_saturate(${s.saturation}%)]
  [-webkit-backdrop-filter:blur(${s.blur}px)_saturate(${s.saturation}%)]">
</div>

/* Companion CSS for effects not covered by Tailwind utilities */
.glass-surface {
  background: ${bg};
  box-shadow: ${shadow};
}`;
  }

  // react
  return `${liquidFilter}// React / JSX snippet
// Note: backdrop-filter depends on browser support

const glassStyle = {
  backdropFilter: '${bf}',
  WebkitBackdropFilter: '${bf}',
  background: '${bg}',
  border: '${border}',
  borderRadius: '${radius}',
  boxShadow: '${shadow}',
};

export function GlassSurface({ children }) {
  return <div style={glassStyle}>{children}</div>;
}

/* Browser support note:
 * backdrop-filter: Chrome 76+, Edge 79+, Safari 9+ (with -webkit-)
 * SVG url() in backdrop-filter: Chromium desktop only
 * Firefox: backdrop-filter enabled by default since v103
 */`;
}

// URL hash encoding/decoding
const HASH_KEYS = [
  'mode','noiseFreq','distortion','blur','saturation',
  'tintGrayscale','tintOpacity','rimOpacity',
  'shadowSpread','shadowBlur','shadowGrayscale',
  'spotlightOn','spotlightIntensity','tiltOn',
  'tintTone','scene','component','zoom',
];

export function encodeHash(s: GlassSettings): string {
  const vals = HASH_KEYS.map((k: string) => {
    const v = (s as unknown as Record<string, unknown>)[k];
    if (typeof v === 'boolean') return v ? '1' : '0';
    return String(v);
  });
  return vals.join(',');
}

export function decodeHash(hash: string, defaults: GlassSettings): GlassSettings {
  try {
    const parts = hash.replace(/^#/, '').split(',');
    if (parts.length !== HASH_KEYS.length) return defaults;
    const result = { ...defaults };
    HASH_KEYS.forEach((k, i) => {
      const v = parts[i];
      const def = defaults[k as keyof GlassSettings];
      if (typeof def === 'boolean') {
        (result as Record<string, unknown>)[k] = v === '1';
      } else if (typeof def === 'number') {
        const n = parseFloat(v);
        if (!isNaN(n)) (result as Record<string, unknown>)[k] = n;
      } else {
        (result as Record<string, unknown>)[k] = v;
      }
    });
    return result;
  } catch {
    return defaults;
  }
}
