// Hero client-logo loop (CODE-MIGRATION X1), ported from IX2 action list
// "a" — "Home Hero // Logo (Loop)", PAGE_FINISH, loop on. Every
// `.hero-customer-logo-wrapper` on the page (IX2 targeted the class, not
// one element) moves translateX 0 → -100% in 40000ms with no easing
// (linear), then snaps back to 0 and repeats. The home page has six lanes in
// a row, so -100% of each lands where the next began: a seamless loop.
//
// Starts on window `load`, like PAGE_FINISH. Its start state is translateX(0),
// the element's normal position, so it needs no start-state CSS.
// As on live, it ignores reduced motion and never pauses.
const DURATION = 40000;

export function initLogoMarquee() {
  const lanes = document.querySelectorAll<HTMLElement>('.hero-customer-logo-wrapper');
  if (!lanes.length) return;

  const start = () =>
    lanes.forEach((lane) => {
      if (typeof lane.animate !== 'function') return;
      lane.animate([{ transform: 'translate3d(0%, 0, 0)' }, { transform: 'translate3d(-100%, 0, 0)' }], {
        duration: DURATION,
        easing: 'linear',
        iterations: Infinity,
      });
    });

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
