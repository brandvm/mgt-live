// The 2026 Logo Marquee, driven by the page scroll: the logos drift left at
// a calm pace, turn to drift right while the page scrolls up and back left
// when it scrolls down, easing through the turn, and run faster the faster
// the page scrolls, coasting back to the calm pace when it stops (inertia).
// From the approved prototype (prototype/src/modules/logo-marquee.ts).
// Markup:
//   [data-logo-marquee]                 Logo Marquee (.is-driven while this module runs)
//     [data-logo-marquee-track]         Logo Marquee Track: the logos twice, the copy aria-hidden
//                                       (in Webflow two Collection Lists of Customers, Logo Marquee Set)
// - Without this module the CSS loop runs (logo-marquee.css); with it, the
//   loop is off and the track is moved here on GSAP's ticker.
// - Speeds are in em per second, so they follow the type scale.
// - The wheel itself also kicks it, so it answers the first notch rather
//   than waiting for a smoothed scroll to pick up speed.
// - Hover slows it to a stop; off screen it isn't moved.
// - Reduced motion: nothing moves (the CSS loop is off there too).
// Shipped in the live bundle for the /design pages (HANDOFF 2026-11-03),
// where the bundled GSAP is the legacy entry; at launch import from the
// 2026 bundle's './gsap' instead (src/modules/legacy/ is deleted then).
// Not to be confused with legacy/logo-marquee.ts (the live site's IX2 loop).
import { gsap } from './legacy/gsap';

const BASE = 2.75; // em/s at rest: one list (~165em) in about a minute
const BOOST = 0.35; // extra em/s per em/s of page scroll
const MAX_BOOST = 60; // em/s
const RISE = 20; // how fast it catches up with the scroll (per second): almost at once
const COAST = 1.6; // how slowly the extra speed fades: the inertia
const TURN = 8; // how fast it turns round: quick, but eased
const HOVER = 5; // how fast hover brings it to a stop and back
const WHEEL = 0.5; // em/s of extra speed per em of wheel input: reacts on the first notch

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initLogoMarquee() {
  const roots = [...document.querySelectorAll<HTMLElement>('[data-logo-marquee]')];
  if (!roots.length || reducedMotion()) return undefined;

  const marquees = roots.flatMap((root) => {
    const track = root.querySelector<HTMLElement>('[data-logo-marquee-track]');
    if (!track) return [];
    root.classList.add('is-driven');
    const m = { root, track, x: 0, visible: true, hover: false, play: 1 };
    root.addEventListener('pointerenter', () => { m.hover = true; });
    root.addEventListener('pointerleave', () => { m.hover = false; });
    return [m];
  });
  if (!marquees.length) return undefined;
  const seen = new IntersectionObserver((entries) => entries.forEach((e) => {
    const m = marquees.find((x) => x.root === e.target);
    if (m) m.visible = e.isIntersecting;
  }));
  marquees.forEach((m) => seen.observe(m.root));

  let lastY = window.scrollY;
  let direction = 1; // 1: logos move left (scrolling down), -1: right
  let turn = 1; // eases towards direction, so the turn is smooth
  let boost = 0;
  let wheel = 0; // speed asked for by the wheel, fading as the scroll takes over
  const onWheel = (event: WheelEvent) => {
    if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const em = parseFloat(getComputedStyle(marquees[0].root).fontSize) || 16;
    direction = Math.sign(event.deltaY);
    wheel = Math.min(Math.max(wheel, (Math.abs(event.deltaY) / em) * WHEEL * 10), MAX_BOOST);
  };
  window.addEventListener('wheel', onWheel, { passive: true });
  const ease = (from: number, to: number, rate: number, dt: number) => from + (to - from) * (1 - Math.exp(-rate * dt));

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 100) / 1000;
    if (!dt) return;
    const em = parseFloat(getComputedStyle(marquees[0].root).fontSize) || 16;
    const y = window.scrollY;
    const scrollSpeed = (y - lastY) / dt / em; // em/s, signed
    lastY = y;
    if (Math.abs(scrollSpeed) > 0.5) direction = Math.sign(scrollSpeed);
    wheel = ease(wheel, 0, RISE / 2, dt);
    const target = Math.min(Math.max(Math.abs(scrollSpeed) * BOOST, wheel), MAX_BOOST);
    boost = ease(boost, target, target > boost ? RISE : COAST, dt);
    turn = ease(turn, direction, TURN, dt);
    const speed = (BASE + boost) * turn * em; // px/s

    marquees.forEach((m) => {
      m.play = ease(m.play, m.hover ? 0 : 1, HOVER, dt);
      if (!m.visible) return;
      const loop = (m.track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      if (!loop) return;
      m.x -= speed * m.play * dt;
      m.x = ((m.x % loop) - loop) % loop; // keep within (-loop, 0]
      m.track.style.transform = `translate3d(${m.x}px, 0, 0)`;
    });
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('wheel', onWheel);
    seen.disconnect();
    marquees.forEach((m) => {
      m.root.classList.remove('is-driven');
      m.track.style.transform = '';
    });
  };
}
