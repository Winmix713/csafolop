import { useRef, useEffect, useCallback, useState } from 'react';
import type { GlassSettings } from '../types';
import { buildBackdropFilter, buildBackground, buildBoxShadow, buildBorder, generateCSS } from '../lib/glassUtils';
import type { ExportFormat } from '../types';

interface GlassPreviewProps {
  settings: GlassSettings;
  customBg?: string;
}

function ProfileCard({ settings }: { settings: GlassSettings }) {
  const style: React.CSSProperties = {
    backdropFilter: buildBackdropFilter(settings),
    WebkitBackdropFilter: buildBackdropFilter(settings),
    background: buildBackground(settings),
    boxShadow: buildBoxShadow(settings),
    border: buildBorder(settings),
    borderRadius: '20px',
  };

  return (
    <div className="luma-card" style={style}>
      <div className="luma-card-inner">
        <div className="luma-avatar" aria-label="Alex Morgan avatar">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="avSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2d4a6e"/><stop offset="1" stopColor="#1a3050"/>
              </linearGradient>
              <linearGradient id="avGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3a4a5c"/><stop offset="1" stopColor="#1e2a38"/>
              </linearGradient>
              <radialGradient id="avSkin" cx=".5" cy=".35" r=".65">
                <stop offset="0" stopColor="#f5c5a0"/><stop offset=".6" stopColor="#d99070"/><stop offset="1" stopColor="#b06840"/>
              </radialGradient>
              <radialGradient id="avShirt" cx=".5" cy=".3" r=".7">
                <stop offset="0" stopColor="#4a90d9"/><stop offset="1" stopColor="#2860aa"/>
              </radialGradient>
            </defs>
            <rect width="200" height="200" fill="url(#avGrad)"/>
            <rect y="0" width="200" height="90" fill="url(#avSky)" opacity=".6"/>
            <ellipse cx="100" cy="195" rx="70" ry="40" fill="#0d1a28" opacity=".6"/>
            <ellipse cx="100" cy="130" rx="58" ry="30" fill="url(#avShirt)"/>
            <ellipse cx="100" cy="140" rx="80" ry="45" fill="url(#avShirt)" opacity=".7"/>
            <ellipse cx="100" cy="84" rx="34" ry="38" fill="url(#avSkin)"/>
            <ellipse cx="100" cy="68" rx="30" ry="10" fill="#8a5030" opacity=".7"/>
            <rect x="70" y="58" width="60" height="20" rx="10" fill="#4a2c18" opacity=".5"/>
            <circle cx="84" cy="84" r="4.5" fill="#2a1810"/>
            <circle cx="116" cy="84" r="4.5" fill="#2a1810"/>
            <circle cx="85.5" cy="82.5" r="1.5" fill="#fff" opacity=".6"/>
            <circle cx="117.5" cy="82.5" r="1.5" fill="#fff" opacity=".6"/>
            <path d="M89 96 Q100 104 111 96" stroke="#c07050" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div className="luma-card-info">
          <div className="luma-card-name">Alex Morgan</div>
          <div className="luma-card-role">Creative director</div>
          <div className="luma-card-stats">
            <div className="luma-stat">
              <span className="luma-stat-label">Projects</span>
              <strong className="luma-stat-value">24</strong>
            </div>
            <div className="luma-stat-divider" aria-hidden="true"/>
            <div className="luma-stat">
              <span className="luma-stat-label">Experience</span>
              <strong className="luma-stat-value">08 yrs</strong>
            </div>
            <div className="luma-stat-divider" aria-hidden="true"/>
            <div className="luma-stat">
              <span className="luma-stat-label">Focus</span>
              <strong className="luma-stat-value">Design</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DockWidget({ settings }: { settings: GlassSettings }) {
  const style: React.CSSProperties = {
    backdropFilter: buildBackdropFilter(settings),
    WebkitBackdropFilter: buildBackdropFilter(settings),
    background: buildBackground(settings),
    boxShadow: buildBoxShadow(settings),
    border: buildBorder(settings),
    borderRadius: '24px',
    padding: '12px 20px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  };
  const icons = [
    { label: 'Home', path: 'M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z' },
    { label: 'Search', path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35' },
    { label: 'Mail', path: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5' },
    { label: 'Settings', path: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v3m0-12V3m9 9h-3M3 12H0' },
    { label: 'User', path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  ];
  return (
    <div style={style} role="toolbar" aria-label="Floating dock">
      {icons.map(icon => (
        <button key={icon.label} className="luma-dock-btn" aria-label={icon.label}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" width="22" height="22">
            <path d={icon.path}/>
          </svg>
        </button>
      ))}
    </div>
  );
}

function ModalWidget({ settings }: { settings: GlassSettings }) {
  const style: React.CSSProperties = {
    backdropFilter: buildBackdropFilter(settings),
    WebkitBackdropFilter: buildBackdropFilter(settings),
    background: buildBackground(settings),
    boxShadow: buildBoxShadow(settings),
    border: buildBorder(settings),
    borderRadius: '20px',
    padding: '28px',
    maxWidth: '340px',
    width: '100%',
  };
  return (
    <div style={style} role="dialog" aria-modal="true" aria-label="Sample modal">
      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#f8f8fa', marginBottom: 8 }}>Confirm action</div>
      <p style={{ color: '#c5cdd9', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 20 }}>
        Are you sure you want to proceed? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="luma-modal-btn luma-modal-btn--cancel">Cancel</button>
        <button className="luma-modal-btn luma-modal-btn--confirm">Confirm</button>
      </div>
    </div>
  );
}

function PlayerWidget({ settings }: { settings: GlassSettings }) {
  const style: React.CSSProperties = {
    backdropFilter: buildBackdropFilter(settings),
    WebkitBackdropFilter: buildBackdropFilter(settings),
    background: buildBackground(settings),
    boxShadow: buildBoxShadow(settings),
    border: buildBorder(settings),
    borderRadius: '20px',
    padding: '20px 24px',
    minWidth: '280px',
  };
  return (
    <div style={style}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg,#4a90d9,#9b59b6)', flexShrink: 0 }}/>
        <div>
          <div style={{ fontWeight: 600, color: '#f8f8fa', fontSize: '0.9rem' }}>Chromatic Dreams</div>
          <div style={{ color: '#8b9ab0', fontSize: '0.78rem' }}>Luma Audio</div>
        </div>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.12)', marginBottom: 12 }}>
        <div style={{ width: '38%', height: '100%', borderRadius: 2, background: 'rgba(155,138,255,0.9)' }}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#8b9ab0', fontSize: '0.72rem' }}>1:24</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {['M19 20L9 12l10-8v16z','M10 15V9l6 3-6 3zM5 5v14','M19 5v14'].map((d, i) => (
            <button key={i} className="luma-player-btn" aria-label={['Rewind','Play','Forward'][i]}>
              <svg viewBox="0 0 24 24" fill={i===1?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" width={i===1?22:18} height={i===1?22:18} aria-hidden="true"><path d={d}/></svg>
            </button>
          ))}
        </div>
        <span style={{ color: '#8b9ab0', fontSize: '0.72rem' }}>3:48</span>
      </div>
    </div>
  );
}

function NavbarWidget({ settings }: { settings: GlassSettings }) {
  const style: React.CSSProperties = {
    backdropFilter: buildBackdropFilter(settings),
    WebkitBackdropFilter: buildBackdropFilter(settings),
    background: buildBackground(settings),
    boxShadow: buildBoxShadow(settings),
    border: buildBorder(settings),
    borderRadius: '16px',
    padding: '0 20px',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '320px',
    maxWidth: '480px',
    width: '100%',
  };
  return (
    <nav style={style} aria-label="Sample navbar">
      <span style={{ fontWeight: 600, color: '#f8f8fa', fontSize: '1rem', letterSpacing: '-.02em' }}>luma</span>
      <div style={{ display: 'flex', gap: 20 }}>
        {['Studio','Materials','About'].map(item => (
          <a key={item} href="#" style={{ color: '#8b9ab0', fontSize: '0.82rem', textDecoration: 'none' }}
            onClick={e => e.preventDefault()}>{item}</a>
        ))}
      </div>
      <button className="luma-nav-cta">Get started</button>
    </nav>
  );
}

export interface CodeExportProps {
  settings: GlassSettings;
}

export function CodeExportPanel({ settings }: CodeExportProps) {
  const [format, setFormat] = useState<ExportFormat>('css');
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const code = generateCSS(settings, format);
  const formats: { id: ExportFormat; label: string }[] = [
    { id: 'css', label: 'Plain CSS' },
    { id: 'cssvars', label: 'CSS Variables' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'react', label: 'React/JSX' },
  ];

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'react' ? 'jsx' : 'css';
    const mime = format === 'react' ? 'text/javascript' : 'text/css';
    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luma-glass.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="luma-code-panel">
      <div className="luma-code-formats" role="tablist" aria-label="Export format">
        {formats.map(f => (
          <button
            key={f.id}
            role="tab"
            aria-selected={format === f.id}
            className={`luma-code-tab${format === f.id ? ' luma-code-tab--active' : ''}`}
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <pre className="luma-code-block" tabIndex={0} aria-label="Generated code">
        <code>{code}</code>
      </pre>
      <div className="luma-code-actions">
        <button className="luma-code-btn" onClick={handleCopy} aria-label="Copy code to clipboard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {copyState === 'success' ? 'Copied!' : copyState === 'error' ? 'Failed' : 'Copy'}
        </button>
        <button className="luma-code-btn" onClick={handleDownload} aria-label="Download code file">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download
        </button>
      </div>
      <p className="luma-compat-note">
        backdrop-filter: Chrome 76+, Edge 79+, Safari 9+. SVG url() distortion: Chromium desktop only.
      </p>
    </div>
  );
}

interface GlassPreviewProps {
  settings: GlassSettings;
  customBg?: string;
}

export default function GlassPreview({ settings, customBg }: GlassPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const targetRef = useRef({ rx: 0, ry: 0, mx: 24, my: 14 });
  const currentRef = useRef({ rx: 0, ry: 0, mx: 24, my: 14 });
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });

  const noiseFreqStr = (settings.noiseFreq / 1000).toFixed(3);
  const noiseFreqStr2 = (settings.noiseFreq * 1.5 / 1000).toFixed(3);

  const sceneStyle: React.CSSProperties = (() => {
    if (customBg) return { background: `url(${customBg}) center/cover no-repeat` };
    switch (settings.scene) {
      case 'light': return { background: 'linear-gradient(135deg,#e8edf5 0%,#c8d4e8 50%,#dce4f0 100%)' };
      case 'dark': return { background: 'linear-gradient(135deg,#0d1117 0%,#161d2b 50%,#0a0f18 100%)' };
      case 'gradient': return { background: 'linear-gradient(135deg,#0f1b30 0%,#1a2d4a 25%,#0d2238 50%,#1f1035 75%,#0a1020 100%)' };
      default: return { background: 'linear-gradient(135deg,#0f1b30 0%,#1a2d4a 50%,#0a1020 100%)' };
    }
  })();

  const animate = useCallback(() => {
    rafRef.current = 0;
    let pending = false;
    const t = targetRef.current;
    const c = currentRef.current;
    for (const k of ['rx','ry','mx','my'] as const) {
      const diff = t[k] - c[k];
      if (Math.abs(diff) > 0.05) { c[k] += diff * 0.14; pending = true; }
      else c[k] = t[k];
    }
    if (tiltRef.current && settings.tiltOn) {
      tiltRef.current.style.transform = `perspective(900px) rotateX(${c.rx.toFixed(2)}deg) rotateY(${c.ry.toFixed(2)}deg) scale(${zoomScale})`;
    }
    if (pending) rafRef.current = requestAnimationFrame(animate);
  }, [settings.tiltOn]);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width));
    const y = Math.max(0, Math.min(1, (e.clientY - box.top) / box.height));
    setSpotPos({ x: x * 100, y: y * 100 });
    if (settings.tiltOn) {
      targetRef.current.rx = (0.5 - y) * 7;
      targetRef.current.ry = (x - 0.5) * 9;
      schedule();
    }
    targetRef.current.mx = 8 + 84 * x;
    targetRef.current.my = 4 + 68 * y;
  }, [settings.tiltOn, schedule]);

  const handlePointerLeave = useCallback(() => {
    Object.assign(targetRef.current, { rx: 0, ry: 0, mx: 24, my: 14 });
    setSpotPos({ x: 50, y: 50 });
    schedule();
  }, [schedule]);

  useEffect(() => {
    if (!settings.tiltOn && tiltRef.current) {
      tiltRef.current.style.transform = '';
    }
  }, [settings.tiltOn]);

  const zoomScale = settings.zoom / 100;

  const component = (() => {
    switch (settings.component) {
      case 'dock': return <DockWidget settings={settings} />;
      case 'modal': return <ModalWidget settings={settings} />;
      case 'player': return <PlayerWidget settings={settings} />;
      case 'navbar': return <NavbarWidget settings={settings} />;
      default: return <ProfileCard settings={settings} />;
    }
  })();

  return (
    <div className="luma-preview-wrap">
      <div className="luma-tabs" role="tablist" aria-label="Preview or code">
        <button role="tab" aria-selected={activeTab === 'preview'} className={`luma-tab${activeTab === 'preview' ? ' luma-tab--active' : ''}`} onClick={() => setActiveTab('preview')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          Preview
        </button>
        <button role="tab" aria-selected={activeTab === 'code'} className={`luma-tab${activeTab === 'code' ? ' luma-tab--active' : ''}`} onClick={() => setActiveTab('code')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Code
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div
          className="luma-stage"
          style={sceneStyle}
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerLeave}
        >
          <svg className="luma-scene-art" viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="scenePhone" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3f93b7" stopOpacity=".72"/>
                <stop offset=".45" stopColor="#174c67" stopOpacity=".55"/>
                <stop offset="1" stopColor="#07131f" stopOpacity="0"/>
              </linearGradient>
              <radialGradient id="sceneSkin" cx=".5" cy=".45" r=".65">
                <stop offset="0" stopColor="#d58f7f" stopOpacity=".58"/>
                <stop offset=".55" stopColor="#774b45" stopOpacity=".32"/>
                <stop offset="1" stopColor="#160e12" stopOpacity="0"/>
              </radialGradient>
              <filter id="sceneBlur"><feGaussianBlur stdDeviation="14"/></filter>
              <filter id="sceneGrain" x="0" y="0" width="100%" height="100%">
                <feTurbulence baseFrequency=".8" numOctaves="2" seed="11"/>
                <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .035 0"/>
              </filter>
            </defs>
            <ellipse cx="278" cy="370" rx="170" ry="155" fill="url(#sceneSkin)" filter="url(#sceneBlur)"/>
            <path d="M95 376C190 240 285 202 440 270c-76 44-135 124-160 218L95 376Z" fill="#7a8896" fillOpacity=".12" filter="url(#sceneBlur)"/>
            <path d="M420 10 320 548l28 5L462 28Z" fill="url(#scenePhone)" filter="url(#sceneBlur)"/>
            <path d="M426 18 326 540" stroke="#8be1ef" strokeOpacity=".52" strokeWidth="2"/>
            <path d="M410 32 333 506" stroke="#2e90b6" strokeOpacity=".6" strokeWidth="1"/>
            <rect x="110" y="18" width="620" height="520" filter="url(#sceneGrain)"/>
          </svg>

          {/* SVG liquid-glass filter */}
          <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" focusable="false">
            <defs>
              <filter id="liquid-glass" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency={`${noiseFreqStr} ${noiseFreqStr2}`} numOctaves={2} seed={7} result="noise"/>
                <feGaussianBlur in="noise" stdDeviation="3" result="softNoise"/>
                <feDisplacementMap in="SourceGraphic" in2="softNoise" scale={settings.distortion} xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
          </svg>

          {/* Spotlight overlay */}
          {settings.spotlightOn && (
            <div
              className="luma-spotlight"
              style={{
                background: `radial-gradient(circle at ${spotPos.x}% ${spotPos.y}%, rgba(155,138,255,${settings.spotlightIntensity / 500}) 0%, transparent 55%)`,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
          )}

          {/* Optical clarity badge */}
          <div className="luma-badge luma-badge--top-right" aria-label="Optical clarity 99.8%">
            <span className="luma-badge-dot" aria-hidden="true"/>
            <span>Optical clarity <strong>99.8%</strong></span>
          </div>

          <div
            ref={tiltRef}
            className="luma-tilt"
            style={{ transform: `scale(${zoomScale})` }}
          >
            {component}
          </div>

          <div className="luma-badge luma-badge--bottom-left" aria-label="Light, without limits">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13" aria-hidden="true">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            Light, without limits
          </div>

          <p className="luma-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="12" height="12" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Move your cursor to explore the light
          </p>
        </div>
      ) : (
        <CodeExportPanel settings={settings} />
      )}
    </div>
  );
}
