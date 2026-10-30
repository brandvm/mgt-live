// Shared pieces for the IX2/IX3 ports in this folder (CODE-MIGRATION
// "Interactions"). Start states and the non-height transitions are in
// legacy-ix-accordions.css and legacy-ix-nav.css, which src/live/styles.css
// imports only from the batch that removes those IX2 interactions; the
// run() lines in src/live/index.ts go in with them. Groups: accordions
// (accordion.ts, expand.ts), scroll-motion (logo-marquee.ts,
// before-after.ts; no CSS), nav (legacy-nav.ts).

// IX2 easing names → CSS / Web Animations easings.
// IX2 uses bezier-easing with the CSS keyword curves, so the first four are
// exact; "inOutQuad" is Penner's quad in-out, given here as its standard
// cubic-bezier fit (GSAP equivalent: power1.inOut).
export const EASE = {
  none: 'linear', // IX2 "" (no easing) is linear
  ease: 'ease', // cubic-bezier(0.25, 0.1, 0.25, 1)
  easeIn: 'ease-in', // cubic-bezier(0.42, 0, 1, 1)
  easeInOut: 'ease-in-out', // cubic-bezier(0.42, 0, 0.58, 1)
  inOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  nav: 'cubic-bezier(0.64, 0.05, 0, 1)', // IX2 custom bezier [0.64, 0.05, 0, 1]
} as const;

export interface Timing {
  duration: number;
  delay: number;
  easing: string;
}

const running = new WeakMap<HTMLElement, Animation>();

// IX2's STYLE_SIZE "height: AUTO" ⇄ "height: 0px". CSS holds the settled
// height (auto when open, 0 when closed); this animates between the two in
// px and then lets the CSS value take over. `fill: backwards` holds the
// start height through the delay, as IX2 does. A new call starts from the
// height on screen, so reversing mid-way doesn't jump.
// For a list hidden with display:none when closed, set display before
// calling with open = false, or the start height measures 0.
export function animateHeight(el: HTMLElement, open: boolean, t: Timing) {
  if (typeof el.animate !== 'function') return;
  const prev = running.get(el);
  const from = prev ? el.getBoundingClientRect().height : open ? 0 : el.scrollHeight;
  if (prev) prev.cancel();
  const to = open ? el.scrollHeight : 0;
  const anim = el.animate([{ height: `${from}px` }, { height: `${to}px` }], {
    duration: t.duration,
    delay: t.delay,
    easing: t.easing,
    fill: 'backwards',
  });
  running.set(el, anim);
  const clear = () => {
    if (running.get(el) === anim) running.delete(el);
  };
  anim.onfinish = clear;
  anim.oncancel = clear;
}

// The opening fade of content inside a list that was display:none while
// closed. A CSS transition can't start from display:none (the element had no
// computed style to transition from), so the open rules in the legacy-ix CSS
// would jump to opacity 1; IX2 animated it. The settled value stays in CSS;
// `fill: backwards` holds opacity 0 through the delay. Closing fades still
// run as CSS transitions, as the list stays displayed until they end.
export function fadeIn(els: Iterable<HTMLElement>, t: Timing) {
  for (const el of els) {
    if (typeof el.animate !== 'function') continue;
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: t.duration,
      delay: t.delay,
      easing: t.easing,
      fill: 'backwards',
    });
  }
}

// Calls back when webflow.js adds or removes `w--open` on a Dropdown List.
// Webflow's Dropdown stays in charge of opening and closing (click, keyboard,
// aria-expanded, closing the others and closing on an outside click); IX2's
// DROPDOWN_OPEN / DROPDOWN_CLOSE fire on the same change.
export function onDropdownToggle(list: HTMLElement, callback: (open: boolean) => void) {
  let wasOpen = list.classList.contains('w--open');
  new MutationObserver(() => {
    const isOpen = list.classList.contains('w--open');
    if (isOpen === wasOpen) return;
    wasOpen = isOpen;
    callback(isOpen);
  }).observe(list, { attributes: true, attributeFilter: ['class'] });
}

// A Dropdown List hidden with display:none when closed (IX2 GENERAL_DISPLAY):
// keeps it displayed while it closes, then hands display back to CSS once
// the close group has finished (IX2 runs its "display: none" group after the
// longest action of the group before it).
export function holdDisplay(list: HTMLElement) {
  let timer = 0;
  return {
    open() {
      window.clearTimeout(timer);
      list.style.removeProperty('display');
    },
    close(holdMs: number) {
      window.clearTimeout(timer);
      list.style.display = 'block';
      timer = window.setTimeout(() => list.style.removeProperty('display'), holdMs);
    },
  };
}
