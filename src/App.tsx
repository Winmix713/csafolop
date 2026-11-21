import { useState, useEffect, useRef, useCallback } from 'react';
import type { GlassSettings, UserPreset } from './types';
import { DEFAULT_SETTINGS, BUILT_IN_PRESETS, USER_PRESETS_KEY } from './constants';
import { encodeHash, decodeHash } from './lib/glassUtils';
import GlassPreview from './components/GlassPreview';
import ControlsPanel from './components/ControlsPanel';
import SettingsPanel from './components/SettingsPanel';

function loadUserPresets(): UserPreset[] {
  try {
    const raw = localStorage.getItem(USER_PRESETS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((p): p is UserPreset =>
      typeof p === 'object' && p !== null &&
      typeof p.id === 'string' &&
      typeof p.name === 'string' &&
      typeof p.settings === 'object' &&
      typeof p.createdAt === 'number'
    );
  } catch {
    return [];
  }
}

function saveUserPresets(presets: UserPreset[]) {
  try {
    localStorage.setItem(USER_PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // storage unavailable
  }
}

function initSettings(): GlassSettings {
  const hash = window.location.hash.slice(1);
  if (hash) return decodeHash(hash, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS };
}

export default function App() {
  const [settings, setSettings] = useState<GlassSettings>(initSettings);
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [activePresetId, setActivePresetId] = useState<string | null>('liquid-crystal');
  const [userPresets, setUserPresets] = useState<UserPreset[]>(loadUserPresets);
  const [customBg, setCustomBg] = useState<string | undefined>();
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hashDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);

  // Sync URL hash
  useEffect(() => {
    if (hashDebounce.current) clearTimeout(hashDebounce.current);
    hashDebounce.current = setTimeout(() => {
      const hash = encodeHash(settings);
      history.replaceState(null, '', `#${hash}`);
    }, 500);
    return () => { if (hashDebounce.current) clearTimeout(hashDebounce.current); };
  }, [settings]);

  const onChangeAndMarkCustom = useCallback((patch: Partial<GlassSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setActivePresetId('custom');
  }, []);

  const onReset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    setActivePresetId('liquid-crystal');
    setCustomBg(undefined);
  }, []);

  const onPresetSelect = useCallback((id: string) => {
    const builtIn = BUILT_IN_PRESETS.find(p => p.id === id);
    if (builtIn) {
      setSettings(prev => ({ ...prev, ...builtIn.settings }));
      setActivePresetId(id);
      return;
    }
    const user = userPresets.find(p => p.id === id);
    if (user) {
      setSettings({ ...user.settings });
      setActivePresetId(id);
    }
  }, [userPresets]);

  const onSavePreset = useCallback(() => {
    const name = window.prompt('Preset name:');
    if (!name?.trim()) return;
    const preset: UserPreset = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      settings: { ...settings },
      createdAt: Date.now(),
    };
    setUserPresets(prev => {
      const next = [...prev, preset];
      saveUserPresets(next);
      return next;
    });
    setActivePresetId(preset.id);
  }, [settings]);

  const onDeleteUserPreset = useCallback((id: string) => {
    setUserPresets(prev => {
      const next = prev.filter(p => p.id !== id);
      saveUserPresets(next);
      return next;
    });
    setActivePresetId(prev => prev === id ? null : prev);
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Luma Glass Studio', url });
        return;
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
      }
    }
    if (!navigator.clipboard) {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('success');
    } catch {
      setShareStatus('error');
    }
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('click', handleClick); document.removeEventListener('keydown', handleKey); };
  }, [mobileMenuOpen]);

  return (
    <div className="luma-root">
      <a href="#studio" className="luma-skip-link">Skip to studio</a>

      {/* Header */}
      <header className="luma-header">
        <div className="luma-header-left">
          <a href="#" className="luma-brand" aria-label="Luma Glass Studio home">
            <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" width="22" height="22">
              <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M14 2v24M4 8l10 6 10-6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity=".6"/>
            </svg>
            <span>luma</span>
          </a>
          <nav className="luma-nav" aria-label="Primary">
            <a href="#studio">Studio</a>
            <a href="#">Materials</a>
            <a href="#">About</a>
          </nav>
        </div>
        <div className="luma-header-right">
          <button className="luma-btn luma-btn--ghost" onClick={handleShare} aria-label="Share this configuration">
            {shareStatus === 'success' ? 'Copied!' : shareStatus === 'error' ? 'Failed' : 'Share'}
          </button>
          <a href="#studio" className="luma-btn luma-btn--primary">Explore the studio</a>
          {/* Mobile menu */}
          <details
            ref={menuRef}
            className="luma-mobile-menu"
            open={mobileMenuOpen}
            onToggle={e => setMobileMenuOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary aria-label="Navigation menu">
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="18" height="18" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="18" height="18" aria-hidden="true">
                  <path d="M4 8h16M4 16h16"/>
                </svg>
              )}
            </summary>
            <nav className="luma-mobile-menu-panel" aria-label="Primary navigation">
              <a href="#studio" onClick={() => setMobileMenuOpen(false)}>Studio</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Materials</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>About</a>
            </nav>
          </details>
        </div>
      </header>

      {/* Hero eyebrow */}
      <div className="luma-hero-eyebrow" aria-hidden="true">LIGHT, SHAPED INTO SOMETHING MORE</div>
      <h1 className="luma-hero-h1">
        <span>A clearer way to see the world.</span>
        <span className="luma-hero-h1--soft">Meet the next dimension of glass.</span>
      </h1>

      {/* Main studio */}
      <main className="luma-studio" id="studio" aria-label="Glass material studio">
        <ControlsPanel
          settings={settings}
          onChange={onChangeAndMarkCustom}
          onReset={onReset}
          advancedOpen={advancedOpen}
          onAdvancedToggle={() => setAdvancedOpen(v => !v)}
          activePresetId={activePresetId}
          onPresetSelect={onPresetSelect}
          userPresets={userPresets}
          onSavePreset={onSavePreset}
          onDeleteUserPreset={onDeleteUserPreset}
          customBg={customBg}
          onCustomBgChange={setCustomBg}
        />

        <GlassPreview settings={settings} customBg={customBg} />

        {advancedOpen && (
          <SettingsPanel settings={settings} onChange={onChangeAndMarkCustom} />
        )}
      </main>

      {/* Footline */}
      <div className="luma-footline">
        <span>Engineered for a world that never stands still.</span>
        <div className="luma-discover">
          <span>Discover Luma</span>
          <button className="luma-discover-btn" aria-label="Discover Luma">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="luma-footer">
        <span>© 2026 Luma Glass</span>
        <span className="luma-footer-mid">Precision in every perspective.</span>
        <a href="mailto:hello@luma.glass" className="luma-footer-link">
          Get in touch
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </a>
      </footer>

      {/* Live status region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="luma-sr-status">
        {shareStatus === 'success' ? 'Share link copied to clipboard.' : ''}
        {shareStatus === 'error' ? 'Could not copy to clipboard.' : ''}
      </div>
    </div>
  );
}
