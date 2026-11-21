import type { GlassSettings, ComponentType, SceneType } from '../types';
import { BUILT_IN_PRESETS } from '../constants';
import type { UserPreset } from '../types';

interface ControlsPanelProps {
  settings: GlassSettings;
  onChange: (patch: Partial<GlassSettings>) => void;
  onReset: () => void;
  advancedOpen: boolean;
  onAdvancedToggle: () => void;
  activePresetId: string | null;
  onPresetSelect: (id: string) => void;
  userPresets: UserPreset[];
  onSavePreset: () => void;
  onDeleteUserPreset: (id: string) => void;
  customBg?: string;
  onCustomBgChange: (url: string | undefined) => void;
}

const COMPONENTS: { id: ComponentType; label: string }[] = [
  { id: 'profile', label: 'Profile card' },
  { id: 'dock', label: 'Floating dock' },
  { id: 'modal', label: 'Modal dialog' },
  { id: 'player', label: 'Media player' },
  { id: 'navbar', label: 'Navigation bar' },
];

const SCENES: { id: SceneType; label: string }[] = [
  { id: 'gradient', label: 'Gradient' },
  { id: 'light', label: 'Bright' },
  { id: 'dark', label: 'Dark' },
  { id: 'photo', label: 'Custom image' },
];

export default function ControlsPanel({
  settings, onChange, onReset, advancedOpen, onAdvancedToggle,
  activePresetId, onPresetSelect, userPresets, onSavePreset,
  onDeleteUserPreset, customBg, onCustomBgChange,
}: ControlsPanelProps) {
  const uploadRef = { current: null as HTMLInputElement | null };
  const objectUrlRef = { current: '' };

  const handleImageUpload = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10 MB.');
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    onCustomBgChange(url);
  };

  const modes: { id: GlassSettings['mode']; label: string; badge?: string }[] = [
    { id: 'liquid', label: 'Liquid Glass', badge: 'new' },
    { id: 'glassmorphism', label: 'Glassmorphism' },
    { id: 'neumorphism', label: 'Neumorphism' },
  ];

  const modeDescription: Record<GlassSettings['mode'], string> = {
    liquid: 'Blur + SVG fractal distortion. Full distortion in Chromium desktop; edge-only elsewhere.',
    glassmorphism: 'Blur + tint only. Broad browser support.',
    neumorphism: 'Opaque surface with soft dual shadows. No backdrop-filter required.',
  };

  return (
    <aside className="luma-panel luma-controls-panel" aria-label="Controls">
      <div className="luma-panel-header">
        <div className="luma-panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Controls
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="luma-toggle-label" id="adv-label">Advanced</span>
          <button
            role="switch"
            aria-checked={advancedOpen}
            aria-labelledby="adv-label"
            aria-controls="settings-panel"
            className={`luma-toggle${advancedOpen ? ' luma-toggle--on' : ''}`}
            onClick={onAdvancedToggle}
          >
            <span className="luma-toggle-thumb"/>
          </button>
          <button className="luma-icon-btn" onClick={onReset} aria-label="Reset all settings to defaults">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="luma-section">
        <div className="luma-segment" role="group" aria-label="Glass mode">
          {modes.map(m => (
            <button
              key={m.id}
              className={`luma-segment-btn${settings.mode === m.id ? ' luma-segment-btn--active' : ''}`}
              onClick={() => onChange({ mode: m.id })}
              aria-pressed={settings.mode === m.id}
            >
              {m.label}
              {m.badge && <span className="luma-badge-pill">{m.badge}</span>}
            </button>
          ))}
        </div>
        <p className="luma-compat-note luma-mode-desc">{modeDescription[settings.mode]}</p>
      </div>

      {/* Component selector */}
      <div className="luma-section">
        <div className="luma-section-label">Component</div>
        <div className="luma-segment" role="group" aria-label="Component">
          {COMPONENTS.map(c => (
            <button
              key={c.id}
              className={`luma-segment-btn${settings.component === c.id ? ' luma-segment-btn--active' : ''}`}
              onClick={() => onChange({ component: c.id })}
              aria-pressed={settings.component === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scene selector */}
      <div className="luma-section">
        <div className="luma-section-label">Background scene</div>
        <div className="luma-segment" role="group" aria-label="Scene">
          {SCENES.map(s => (
            <button
              key={s.id}
              className={`luma-segment-btn${settings.scene === s.id ? ' luma-segment-btn--active' : ''}`}
              onClick={() => onChange({ scene: s.id })}
              aria-pressed={settings.scene === s.id}
            >
              {s.label}
            </button>
          ))}
        </div>
        {settings.scene === 'photo' && (
          <div className="luma-upload-zone"
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleImageUpload(e.dataTransfer.files[0]); }}
            onClick={() => uploadRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload custom background image"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') uploadRef.current?.click(); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="20" height="20" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>{customBg ? 'Replace image' : 'Upload image (≤ 10 MB)'}</span>
            <input
              ref={el => { uploadRef.current = el; }}
              type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleImageUpload(e.target.files?.[0] ?? null)}
              aria-hidden="true"
            />
          </div>
        )}
        {settings.scene === 'photo' && customBg && (
          <p className="luma-compat-note">Your image stays in this browser session and is never uploaded.</p>
        )}
      </div>

      {/* Zoom */}
      <div className="luma-section">
        <div className="luma-section-label">Preview zoom</div>
        <div className="luma-zoom-row">
          <button className="luma-icon-btn" onClick={() => onChange({ zoom: Math.max(50, settings.zoom - 10) })} aria-label="Zoom out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M5 12h14"/></svg>
          </button>
          <span className="luma-zoom-val" aria-live="polite" aria-label={`Zoom ${settings.zoom}%`}>{settings.zoom}%</span>
          <button className="luma-icon-btn" onClick={() => onChange({ zoom: Math.min(200, settings.zoom + 10) })} aria-label="Zoom in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <button className="luma-icon-btn" onClick={() => onChange({ zoom: 100 })} aria-label="Reset zoom to 100%">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="luma-section">
        <div className="luma-presets-header">
          <div className="luma-section-label">Presets</div>
          <button className="luma-save-preset-btn" onClick={onSavePreset} aria-label="Save current settings as a preset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save
          </button>
        </div>
        <div className="luma-presets-grid">
          {BUILT_IN_PRESETS.map(preset => {
            const active = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                className={`luma-preset-tile${active ? ' luma-preset-tile--active' : ''}`}
                onClick={() => onPresetSelect(preset.id)}
                aria-pressed={active}
                aria-label={`Apply ${preset.name} preset`}
              >
                <div
                  className="luma-preset-swatch"
                  style={{
                    background: `conic-gradient(hsl(${preset.hue},55%,55%) 0%, hsl(${preset.hue},40%,38%) 60%, hsl(${(preset.hue+40)%360},30%,25%) 100%)`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                  }}
                  aria-hidden="true"
                >
                  {active && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="luma-preset-name">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {userPresets.length > 0 && (
          <>
            <div className="luma-section-label" style={{ marginTop: 12 }}>Saved</div>
            <div className="luma-presets-grid">
              {userPresets.map(up => {
                const active = activePresetId === up.id;
                return (
                  <button
                    key={up.id}
                    className={`luma-preset-tile${active ? ' luma-preset-tile--active' : ''}`}
                    onClick={() => onPresetSelect(up.id)}
                    aria-pressed={active}
                    aria-label={`Apply ${up.name} preset`}
                  >
                    <div className="luma-preset-swatch luma-preset-swatch--user" aria-hidden="true">
                      {active && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="luma-preset-name" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{up.name}</span>
                      <button
                        className="luma-preset-delete"
                        onClick={e => { e.stopPropagation(); onDeleteUserPreset(up.id); }}
                        aria-label={`Delete ${up.name} preset`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="10" height="10" aria-hidden="true">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
