/**
 * Official BhooShanket AI Brand Identity Component
 * Renders high-precision scalable vector logo across all views:
 * - Sidebar brand
 * - Header brand
 * - Login screen
 * - Startup sequence
 * - Mobile navigation
 * - Collapsed sidebar
 * - Dynamic Favicon
 */

export function createBhooShanketLogoSvg(options = {}) {
  const {
    size = 40,
    showText = true,
    animated = true,
    theme = 'dark',
    className = 'bhooshanket-logo'
  } = options;

  const pulseClass = animated ? 'bhoo-pulse-beacon' : '';
  const scanClass = animated ? 'bhoo-radar-arc' : '';

  if (!showText) {
    return `
      <svg class="${className} ${animated ? 'animated' : ''}" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BhooShanket AI Emblem">
        <defs>
          <linearGradient id="bhooShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#102540" />
            <stop offset="50%" stop-color="#0a182b" />
            <stop offset="100%" stop-color="#050e1b" />
          </linearGradient>
          <linearGradient id="bhooRidgeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#42c4ff" />
            <stop offset="100%" stop-color="#1e70d4" />
          </linearGradient>
          <linearGradient id="bhooRidgeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff7b39" />
            <stop offset="100%" stop-color="#e8384f" />
          </linearGradient>
          <filter id="bhooGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Outer Hex Shield Boundary -->
        <path d="M24 3 L43 12 V34 L24 45 L5 34 V12 Z" fill="url(#bhooShieldGrad)" stroke="rgba(66, 196, 255, 0.42)" stroke-width="1.5" stroke-linejoin="round" />
        
        <!-- Geological Contour Strata Lines -->
        <path d="M7 22 Q16 26 24 23 T41 24" stroke="rgba(120, 175, 230, 0.22)" stroke-width="1.2" stroke-linecap="round" fill="none" />
        <path d="M8 29 Q17 34 24 30 T40 31" stroke="rgba(120, 175, 230, 0.18)" stroke-width="1.2" stroke-linecap="round" fill="none" />
        <path d="M12 37 Q18 40 24 38 T36 38" stroke="rgba(120, 175, 230, 0.14)" stroke-width="1.2" stroke-linecap="round" fill="none" />

        <!-- Mountain Ridge / Landslide Fault Geometry -->
        <path d="M9 34 L19 19 L26 27 L33 16 L39 26" stroke="url(#bhooRidgeGrad1)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        
        <!-- Seismic Fault Displacement Slip Vector -->
        <path d="M20 28 L27 22 L34 29" stroke="url(#bhooRidgeGrad2)" stroke-width="1.8" stroke-dasharray="2.5 1.5" fill="none" />

        <!-- Early Warning Telemetry Radar Beacon -->
        <circle cx="33" cy="16" r="3.2" fill="#ff4d5f" filter="url(#bhooGlow)" class="${pulseClass}" />
        <circle cx="33" cy="16" r="6.2" stroke="rgba(255, 77, 95, 0.6)" stroke-width="1" fill="none" class="${scanClass}" />

        <!-- Center Earth Signal Symbol: Stylized Devanagari 'भू' accent in core -->
        <path d="M14 13 H18 M16 13 V17 C16 18.5 17.5 18.5 19 17.5" stroke="rgba(235, 245, 255, 0.7)" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    `;
  }

  // Full Horizontal Lockup
  return `
    <div class="${className} bhooshanket-lockup" style="display: inline-flex; align-items: center; gap: 12px; vertical-align: middle;">
      ${createBhooShanketLogoSvg({ size, showText: false, animated, theme, className: 'bhoo-emblem' })}
      <div class="bhoo-brand-text" style="display: flex; flex-direction: column; line-height: 1.15; text-align: left;">
        <div class="bhoo-brand-title" style="display: flex; align-items: baseline; gap: 6px; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;">
          <span style="font-weight: 700; font-size: ${size * 0.44}px; letter-spacing: 0.04em; color: var(--text, #edf5ff);">BhooShanket</span>
          <span style="font-weight: 800; font-size: ${size * 0.32}px; letter-spacing: 0.14em; padding: 1px 5px; border-radius: 4px; background: linear-gradient(135deg, rgba(66, 196, 255, 0.25), rgba(30, 112, 212, 0.45)); border: 1px solid rgba(66, 196, 255, 0.5); color: #6be3ff;">AI</span>
        </div>
        <span class="bhoo-brand-tagline" style="font-family: 'IBM Plex Mono', monospace; font-size: ${Math.max(9, size * 0.2)}px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted, #8ea7c5); margin-top: 2px;">DISASTER INTELLIGENCE</span>
      </div>
    </div>
  `;
}

/**
 * Mounts official logo into a container element
 */
export function mountBhooShanketLogo(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  el.innerHTML = createBhooShanketLogoSvg(options);
}

/**
 * Injects the official BhooShanket favicon into document.head
 */
export function setupBhooShanketFavicon() {
  let favicon = document.querySelector("link[rel='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.type = 'image/svg+xml';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path d="M24 3 L43 12 V34 L24 45 L5 34 V12 Z" fill="#060e1b" stroke="#42c4ff" stroke-width="2"/>
    <path d="M9 34 L19 19 L26 27 L33 16 L39 26" stroke="#42c4ff" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="33" cy="16" r="4" fill="#ff4d5f"/>
  </svg>`;
  favicon.href = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
