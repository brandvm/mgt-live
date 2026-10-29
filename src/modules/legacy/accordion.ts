// Accordions built from Webflow Dropdowns (CODE-MIGRATION X3, X13, X14, X15),
// ported from IX2:
//   faqs      a-4 / a-5    FAQs // Accordion (Open / Close)
//   serwhy    a-28 / a-29  SerWhy Accordion Open / Close
//   serintro  a-30 / a-31  SerIntro Accordion Open / Close
//   service   a-32 / a-33  Main Service Accordion Open / Open 2
//
// Webflow's Dropdown keeps opening and closing them (click, keyboard,
// aria-expanded, one open at a time, close on an outside click — all live
// behaviour); this module only watches the `w--open` class webflow.js sets,
// the same change IX2's DROPDOWN_OPEN/CLOSE events listen to. Replacing the
// Dropdown would mean re-implementing that and drifting from live.
//
// Split of the work: legacy-ix.css holds the start state and the
// transitions of opacity, transform and colours (CSS transitions on the
// open/closed state give IX2's per-direction durations and delays exactly);
// here: the height (IX2 "auto"), and for the lists IX2 sets to display:none
// when closed, keeping them displayed until the close group ends.
//
// Markup: `.<prefix>-accordion.w-dropdown` > `.<prefix>-accordion-list`.
import { animateHeight, EASE, holdDisplay, onDropdownToggle, Timing } from './ix-shared';

export type AccordionPrefix = 'faqs' | 'serwhy' | 'serintro' | 'service';

interface AccordionSpec {
  open: Timing; // the list's height, 0 → auto
  close: Timing; // the list's height, auto → 0
  // ms after closing starts when IX2 sets the list to display:none (the end
  // of the close group); undefined: the list is never hidden (FAQ).
  hideAfter?: number;
}

export const ACCORDIONS: Record<AccordionPrefix, AccordionSpec> = {
  // a-4: 400ms ease. a-5: 400ms ease after 240ms (the answer fades first).
  faqs: {
    open: { duration: 400, delay: 0, easing: EASE.ease },
    close: { duration: 400, delay: 240, easing: EASE.ease },
  },
  // a-28: 240ms inOutQuad. a-29: 400ms inOutQuad; icon 500ms → display none at 500.
  serwhy: {
    open: { duration: 240, delay: 0, easing: EASE.inOutQuad },
    close: { duration: 400, delay: 0, easing: EASE.inOutQuad },
    hideAfter: 500,
  },
  // a-30: 240ms inOutQuad. a-31: 400ms inOutQuad → display none at 400.
  serintro: {
    open: { duration: 240, delay: 0, easing: EASE.inOutQuad },
    close: { duration: 400, delay: 0, easing: EASE.inOutQuad },
    hideAfter: 400,
  },
  // a-32: 320ms inOutQuad. a-33: 400ms inOutQuad → display none at 400.
  service: {
    open: { duration: 320, delay: 0, easing: EASE.inOutQuad },
    close: { duration: 400, delay: 0, easing: EASE.inOutQuad },
    hideAfter: 400,
  },
};

export function initAccordion(prefix: AccordionPrefix) {
  const spec = ACCORDIONS[prefix];
  const roots = document.querySelectorAll<HTMLElement>(`.${prefix}-accordion.w-dropdown`);
  if (!roots.length) return;

  roots.forEach((root) => {
    const list = root.querySelector<HTMLElement>(`:scope > .${prefix}-accordion-list`);
    if (!list) return;
    const display = spec.hideAfter === undefined ? null : holdDisplay(list);
    onDropdownToggle(list, (open) => {
      if (open) {
        if (display) display.open();
        animateHeight(list, true, spec.open);
      } else {
        if (display && spec.hideAfter !== undefined) display.close(spec.hideAfter);
        animateHeight(list, false, spec.close);
      }
    });
  });
}

export function initAccordions() {
  (Object.keys(ACCORDIONS) as AccordionPrefix[]).forEach(initAccordion);
}
