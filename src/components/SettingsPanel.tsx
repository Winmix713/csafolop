import type { GlassSettings, TintTone } from '../types';
import { TINT_TONES } from '../constants';

interface SettingsPanelProps {
  settings: GlassSettings;
  onChange: (patch: Partial<GlassSettings>) => void;
}

function toHex(grayscale: number): string {
  const h = Math.round(grayscale).toString(16).padStart(2, '0');
  return `#${h}${h}${h}`;
}

function fromHex(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return Math.round((r + g + b) / 3);
  }
  return 255;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  id: string;
}

function SliderRow({ label, value, min, max, step = 1, unit = '', onChange, id }: SliderRowProps) {
  return (
    <div className="luma-slider-row">
      <div className="luma-slider-header">
        <label htmlFor={id} className="luma-slider-label">{label}</label>
        <span className="luma-slider-chip" aria-label={`${label}: ${value}${unit}`}>{value}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="luma-slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
      />
    </div>
  );
}

interface ColorRowProps {
  label: string;
  grayscale: number;
  onChange: (v: number) => void;
  id: string;
}

function ColorRow({ label, grayscale, onChange, id }: ColorRowProps) {
  const hex = toHex(grayscale);
  return (
    <div className="luma-slider-row">
      <div className="luma-slider-header">
        <label htmlFor={id} className="luma-slider-label">{label}</label>
        <span className="luma-slider-chip" aria-label={`${label}: ${Math.round(grayscale)}`}>{Math.round(grayscale)}</span>
      </div>
      <div className="luma-color-row">
        <div className="luma-color-swatch" style={{ background: hex }} aria-hidden="true"/>
        <input
          type="text"
          value={hex}
          onChange={e => onChange(fromHex(e.target.value))}
          className="luma-hex-input"
          aria-label={`${label} hex color`}
          maxLength={7}
          spellCheck={false}
        />
        <input
          id={id}
          type="range"
          min={0} max={255} step={1}
          value={grayscale}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="luma-slider"
          style={{ flex: 1 }}
          aria-valuemin={0}
          aria-valuemax={255}
          aria-valuenow={grayscale}
          aria-label={`${label} grayscale value`}
        />
      </div>
    </div>
  );
}

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const tintTones = Object.entries(TINT_TONES) as [TintTone, typeof TINT_TONES[TintTone]][];

  return (
    <aside className="luma-panel luma-settings-panel" id="settings-panel" aria-label="Fine-tuning settings">

      {/* Noise Distortion */}
      <div className="luma-settings-group">
        <div className="luma-settings-group-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Noise Distortion
        </div>
        <SliderRow id="noise-freq" label="Noise Frequency" value={settings.noiseFreq} min={1} max={25} onChange={v => onChange({ noiseFreq: v })} />
        <SliderRow id="distortion" label="Distortion Strength" value={settings.distortion} min={0} max={200} onChange={v => onChange({ distortion: v })} />
      </div>

      <div className="luma-settings-divider" aria-hidden="true"/>

      {/* Glass Surface */}
      <div className="luma-settings-group">
        <div className="luma-settings-group-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
          Glass Surface
        </div>
        <SliderRow id="blur" label="Frost Blur" value={settings.blur} min={0} max={30} unit=" px" onChange={v => onChange({ blur: v })} />
        <SliderRow id="saturation" label="Saturation" value={settings.saturation} min={100} max={200} unit="%" onChange={v => onChange({ saturation: v })} />
        <ColorRow id="tint-color" label="Tint Color (Grayscale)" grayscale={settings.tintGrayscale} onChange={v => onChange({ tintGrayscale: v })} />
        <SliderRow id="tint-opacity" label="Tint Opacity" value={settings.tintOpacity} min={0} max={100} unit="%" onChange={v => onChange({ tintOpacity: v })} />
        <SliderRow id="rim-opacity" label="Border / Rim Opacity" value={settings.rimOpacity} min={0} max={100} unit="%" onChange={v => onChange({ rimOpacity: v })} />

        {/* Tint tone */}
        <div className="luma-slider-row">
          <div className="luma-slider-label" id="tint-tone-label">Tint Tone</div>
          <div className="luma-tint-tones" role="group" aria-labelledby="tint-tone-label">
            {tintTones.map(([id, tone]) => (
              <button
                key={id}
                className={`luma-tint-btn${settings.tintTone === id ? ' luma-tint-btn--active' : ''}`}
                onClick={() => onChange({ tintTone: id })}
                aria-pressed={settings.tintTone === id}
                aria-label={tone.label}
                style={{ '--tone-color': `rgb(${tone.r},${tone.g},${tone.b})` } as React.CSSProperties}
              >
                <span className="luma-tint-swatch" style={{ background: `rgb(${tone.r},${tone.g},${tone.b})` }} aria-hidden="true"/>
                <span>{tone.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="luma-settings-divider" aria-hidden="true"/>

      {/* Inner Shadow */}
      <div className="luma-settings-group">
        <div className="luma-settings-group-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          Inner Shadow
        </div>
        <SliderRow id="shadow-spread" label="Shadow Spread" value={settings.shadowSpread} min={-20} max={18} unit=" px" onChange={v => onChange({ shadowSpread: v })} />
        <SliderRow id="shadow-blur" label="Shadow Blur" value={settings.shadowBlur} min={0} max={48} unit=" px" onChange={v => onChange({ shadowBlur: v })} />
        <ColorRow id="shadow-color" label="Shadow Color (Grayscale)" grayscale={settings.shadowGrayscale} onChange={v => onChange({ shadowGrayscale: v })} />
      </div>

      <div className="luma-settings-divider" aria-hidden="true"/>

      {/* Lighting & Motion */}
      <div className="luma-settings-group">
        <div className="luma-settings-group-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          Lighting &amp; Motion
        </div>
        <div className="luma-toggle-row">
          <label className="luma-slider-label" id="spotlight-label">Spotlight</label>
          <button
            role="switch"
            aria-checked={settings.spotlightOn}
            aria-labelledby="spotlight-label"
            className={`luma-toggle${settings.spotlightOn ? ' luma-toggle--on' : ''}`}
            onClick={() => onChange({ spotlightOn: !settings.spotlightOn })}
          >
            <span className="luma-toggle-thumb"/>
          </button>
        </div>
        {settings.spotlightOn && (
          <SliderRow id="spotlight-intensity" label="Spotlight Intensity" value={settings.spotlightIntensity} min={0} max={100} unit="%" onChange={v => onChange({ spotlightIntensity: v })} />
        )}
        <div className="luma-toggle-row">
          <label className="luma-slider-label" id="tilt-label">3D Tilt</label>
          <button
            role="switch"
            aria-checked={settings.tiltOn}
            aria-labelledby="tilt-label"
            className={`luma-toggle${settings.tiltOn ? ' luma-toggle--on' : ''}`}
            onClick={() => onChange({ tiltOn: !settings.tiltOn })}
          >
            <span className="luma-toggle-thumb"/>
          </button>
        </div>
      </div>
    </aside>
  );
}
