// Live navbar interactions (CODE-MIGRATION X6, X7, X10), ported from IX2:
//
// X6  a-13 / a-14  Navbar // Dropdown (Open / Close), on every
//     `.navbar-drop` Dropdown (global nav and the /offers drawer). Open: list
//     displayed, height 0 → auto 740ms; `.s-wrapper.sw-nav-drop-content`
//     opacity 0 → 1 740ms after 240ms. Close: both back over 740ms, then
//     display none. Easing cubic-bezier(0.64, 0.05, 0, 1). Webflow's
//     Dropdown still opens and closes it (see accordion.ts for why); the
//     fade and display states are in legacy-ix.css.
// X7  a-15 / a-16  Navbar // Menu (Open / Close), tablet and below only
//     (IX2 breakpoints medium/small/tiny, ≤ 991px): `.navbar-menu-opener`
//     slides every `.navbar-menu` in (translateX -101%), `.nav-closer-button`
//     back to 0; 400ms ease-in-out. The menu waits off screen through
//     Webflow's own `right: -101%`.
// X10 a-24 / a-25  Landing Page // Menu Drawer (/offers), all widths:
//     `.primary-button.menu` slides every `.l-menu-drawer` to translateX 0,
//     `.l-nav-drawer-closer` back to 101%; 400ms ease-in-out.
//
// X7 and X10 toggle `is-open`; the transforms and transitions are in
// legacy-ix.css. IX2 also cleared its inline styles whenever the page crossed
// one of its breakpoints; here only leaving ≤ 991 closes the X7 menu (IX2
// also closed it at 767 and 479, e.g. on rotating a phone).
// Added, not in IX2: aria-expanded on the openers.
import { animateHeight, EASE, fadeIn, holdDisplay, onDropdownToggle } from './ix-shared';

const DROP = { duration: 740, delay: 0, easing: EASE.nav };
const DROP_FADE = { duration: 740, delay: 240, easing: EASE.nav };

function initDropdowns() {
  document.querySelectorAll<HTMLElement>('.navbar-drop.w-dropdown').forEach((drop) => {
    const list = drop.querySelector<HTMLElement>(':scope > .nav-drop-list');
    if (!list) return;
    const display = holdDisplay(list);
    onDropdownToggle(list, (open) => {
      if (open) {
        display.open();
        animateHeight(list, true, DROP);
        fadeIn(list.querySelectorAll<HTMLElement>('.s-wrapper.sw-nav-drop-content'), DROP_FADE);
      } else {
        display.close(DROP.duration);
        animateHeight(list, false, DROP);
      }
    });
  });
}

function bindToggle(
  openers: NodeListOf<HTMLElement>,
  closers: NodeListOf<HTMLElement>,
  panels: NodeListOf<HTMLElement>,
  enabled: () => boolean,
) {
  const set = (open: boolean) => {
    panels.forEach((panel) => panel.classList.toggle('is-open', open));
    openers.forEach((opener) => opener.setAttribute('aria-expanded', String(open)));
  };
  openers.forEach((opener) => {
    opener.setAttribute('aria-expanded', 'false');
    opener.addEventListener('click', (event) => {
      event.preventDefault(); // href="#"
      if (enabled()) set(true);
    });
  });
  closers.forEach((closer) =>
    closer.addEventListener('click', (event) => {
      event.preventDefault();
      if (enabled()) set(false);
    }),
  );
  return set;
}

function initMenu() {
  const menus = document.querySelectorAll<HTMLElement>('.navbar-menu');
  if (!menus.length) return;
  const tablet = window.matchMedia('(max-width: 991px)');
  const set = bindToggle(
    document.querySelectorAll<HTMLElement>('.navbar-menu-opener'),
    document.querySelectorAll<HTMLElement>('.nav-closer-button'),
    menus,
    () => tablet.matches,
  );
  const reset = () => {
    if (!tablet.matches) set(false);
  };
  if (tablet.addEventListener) tablet.addEventListener('change', reset);
  else tablet.addListener(reset);
}

function initDrawer() {
  const drawers = document.querySelectorAll<HTMLElement>('.l-menu-drawer');
  if (!drawers.length) return;
  // IX2 publishes its start state (translate3d(101%)) inline; Webflow's own
  // class style is the same translate(101%), so dropping it changes nothing
  // and lets the is-open rule win.
  drawers.forEach((drawer) => {
    drawer.style.removeProperty('transform');
    drawer.style.removeProperty('-webkit-transform');
  });
  bindToggle(
    document.querySelectorAll<HTMLElement>('.primary-button.menu'),
    document.querySelectorAll<HTMLElement>('.l-nav-drawer-closer'),
    drawers,
    () => true,
  );
}

export function initLegacyNav() {
  if (!document.querySelector('.navbar-drop, .navbar-menu, .l-menu-drawer')) return;
  initDropdowns();
  initMenu();
  initDrawer();
}
