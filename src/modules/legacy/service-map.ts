// Service map card (CODE-MIGRATION C16), ported as-is from the two
// `.seciton-code` Embeds in `.s-locations-section` (embeds.json 757bdbf293b4
// script, 022443a20ef3 styles; the styles are in legacy-b.css). On 28 pages:
// Home, the 17 services, the 10 service areas.
// A Mercator map masked from SVGs; the Canada / United States pills fly the
// view between regions (zoom out, travel, zoom in) with Web Animations.
// `/service-areas/united-states` opens on the US, every other page on Canada.
// Markup: `.cm-card` > `.cm-nav` > `button.cm-pill[data-region="canada|usa"]`,
// and `.cm-layer` > `.cm-land`, `.cm-hl.is-canada`, `.cm-hl.is-usa`.

type Region = 'canada' | 'usa';
type Box = { w: number; h: number; cardW: number; cardH: number };
type Frame = { zf: number; tx: number; ty: number };
type Centre = { cx: number; cy: number };

const MAP_W = 2039;
const MAP_H = 1344;
const DURATION = 1400;
const FLYOUT = 0.2;
const APEX = 0.5;

// ── Edit these ──────────────────────────────────────────────
const USA_URLS = ['/service-areas/united-states']; // pages that open on the US
const REGIONS: Record<Region, { lon: number; lat: number; zoom: number }> = {
  canada: { lon: -81, lat: 48, zoom: 6.2 }, // framed on Ontario + Montreal
  usa: { lon: -97, lat: 38.5, zoom: 3.8 },
};
// ────────────────────────────────────────────────────────────

// The Figma map is Mercator; fitted against its own Canada outline.
function project(lon: number, lat: number) {
  return {
    fx: (959.8 + ((lon * Math.PI) / 180) * 324.6) / MAP_W,
    fy: (936.1 - 324.6 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) / MAP_H,
  };
}

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const f = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const d = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const s = d(t, x1, x2);
      if (!s) break;
      t -= (f(t, x1, x2) - x) / s;
    }
    return f(t, y1, y2);
  };
}
const ease = bezier(0.5, 0, 0.35, 1);

function defaultRegion(): Region {
  const p = location.pathname.toLowerCase().replace(/\/$/, '');
  return USA_URLS.some((url) => {
    const u = url.replace(/\/$/, '');
    return p === u || p.indexOf(u + '/') === 0;
  })
    ? 'usa'
    : 'canada';
}

function setupCard(card: HTMLElement) {
  // Cap the mask raster to what the screen can actually show.
  const MAX_RASTER = Math.min(2560, Math.round(1600 * Math.min(2, window.devicePixelRatio || 1)));
  const layer = card.querySelector<HTMLElement>('.cm-layer');
  const pills = Array.from(card.querySelectorAll<HTMLElement>('.cm-pill'));
  const hls: Record<Region, HTMLElement | null> = {
    canada: card.querySelector<HTMLElement>('.cm-hl.is-canada'),
    usa: card.querySelector<HTMLElement>('.cm-hl.is-usa'),
  };
  if (!layer) return;

  let region: Region = defaultRegion();
  let anim: Animation | null = null;
  let flying = false;
  let sig = '';

  function box(): Box | null {
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const s = Math.max(r.width / MAP_W, r.height / MAP_H);
    return { w: MAP_W * s, h: MAP_H * s, cardW: r.width, cardH: r.height };
  }
  function frame(id: Region, b: Box): Frame {
    const R = REGIONS[id];
    const zf = Math.max(1, R.zoom);
    const c = project(R.lon, R.lat);
    return { zf, tx: 100 * (b.cardW / (2 * b.w) - c.fx * zf), ty: 100 * (b.cardH / (2 * b.h) - c.fy * zf) };
  }
  function css(f: Frame) {
    return 'translate(' + f.tx + '%,' + f.ty + '%) scale(' + f.zf + ')';
  }
  function centre(f: Frame, b: Box): Centre {
    return { cx: (b.cardW / (2 * b.w) - f.tx / 100) / f.zf, cy: (b.cardH / (2 * b.h) - f.ty / 100) / f.zf };
  }
  function atCentre(c: Centre, zf: number, b: Box): Frame {
    return { zf, tx: 100 * (b.cardW / (2 * b.w) - c.cx * zf), ty: 100 * (b.cardH / (2 * b.h) - c.cy * zf) };
  }
  function matrixOf(el: HTMLElement) {
    const m = /matrix\(([^)]+)\)/.exec(getComputedStyle(el).transform || '');
    if (!m) return null;
    const v = m[1].split(',').map(Number);
    return { a: v[0], e: v[4], f: v[5] };
  }

  // At rest the zoom is baked into the layout box so the masks rasterise
  // sharp; scale() is only used mid-flight.
  function paint() {
    const b = box();
    if (!b || !layer) return;
    const f = frame(region, b);
    if (flying) {
      layer.style.width = b.w + 'px';
      layer.style.height = b.h + 'px';
      layer.style.transform = css(f);
    } else {
      const want = b.w * f.zf;
      const W = Math.min(want, MAX_RASTER);
      const k = want / W;
      layer.style.width = W + 'px';
      layer.style.height = W / (MAP_W / MAP_H) + 'px';
      layer.style.transform = 'translate(' + (f.tx * k) / f.zf + '%,' + (f.ty * k) / f.zf + '%) scale(' + k + ')';
    }
    (Object.keys(hls) as Region[]).forEach((k) => {
      hls[k]?.classList.toggle('is-on', k === region);
    });
    pills.forEach((p) => {
      const on = p.getAttribute('data-region') === region;
      p.classList.toggle('is-on', on);
      p.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function land() {
    flying = false;
    anim = null;
    layer?.classList.remove('is-flying');
    paint();
  }

  function sync() {
    if (flying && (!anim || anim.playState === 'finished' || anim.playState === 'idle')) {
      land();
      return;
    }
    const b = box();
    const s = b ? Math.round(b.cardW) + 'x' + Math.round(b.cardH) : '';
    if (s && s !== sig) {
      sig = s;
      paint();
    }
  }

  // Zoom out, travel, zoom in — the arc a maps app draws when it recentres.
  function fly(fromId: Region, toId: Region) {
    const b = box();
    if (!b || !layer || !layer.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint();
      return;
    }
    const live = flying && anim && anim.playState === 'running' ? matrixOf(layer) : null;
    const canon = frame(fromId, b);
    const from: Frame = live ? { zf: live.a, tx: (100 * live.e) / b.w, ty: (100 * live.f) / b.h } : canon;
    const to = frame(toId, b);
    const a = centre(from, b);
    const c = centre(to, b);
    const near = Math.min(from.zf, to.zf);
    const midZf = Math.max(1, near - (near - 1) * FLYOUT);
    const la = Math.log(from.zf);
    const lb = Math.log(to.zf);
    const dip = Math.log(midZf) - (la + (lb - la) * ease(APEX));
    const warp = (t: number) => (t <= APEX ? (0.5 * t) / APEX : 0.5 + (0.5 * (t - APEX)) / (1 - APEX));
    const frames: Keyframe[] = [];
    const N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const e = ease(t);
      const zf = Math.exp(la + (lb - la) * e + dip * Math.pow(Math.sin(Math.PI * warp(t)), 2));
      frames.push({ offset: t, transform: css(atCentre({ cx: a.cx + (c.cx - a.cx) * e, cy: a.cy + (c.cy - a.cy) * e }, zf, b)) });
    }
    const whole = Math.hypot(c.cx - centre(canon, b).cx, c.cy - centre(canon, b).cy);
    const left = Math.hypot(c.cx - a.cx, c.cy - a.cy);
    const k = whole > 1e-4 ? Math.min(1, Math.max(0.45, left / whole)) : 1;

    if (anim) anim.cancel();
    flying = true;
    layer.classList.add('is-flying');
    paint(); // switch to the flight box first
    anim = layer.animate(frames, { duration: DURATION * k, easing: 'linear', fill: 'none' });
    anim.onfinish = land;
  }

  pills.forEach((p) => {
    p.addEventListener('click', () => {
      const next = p.getAttribute('data-region') as Region | null;
      if (!next || next === region) return;
      const prev = region;
      region = next;
      fly(prev, next);
    });
  });

  paint();
  if (window.ResizeObserver) new ResizeObserver(sync).observe(card);
  else {
    addEventListener('resize', sync);
    setInterval(sync, 500);
  }
  requestAnimationFrame(paint);
}

export function initServiceMap() {
  document.querySelectorAll<HTMLElement>('.cm-card').forEach(setupCard);
}
