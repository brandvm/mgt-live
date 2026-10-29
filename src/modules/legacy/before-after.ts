// Before/after wipe (CODE-MIGRATION X30), ported from IX3 interaction
// i-08e8b417 / timeline t-7681e9c2: on each `section.s-baf`, its
// `.image-one-w` (within the trigger) goes width 100% → 0% (fromTo, ease
// index 0 = "none"), scrubbed 0.8 s from the section's top at the viewport
// top to its bottom at the viewport bottom, clamped (IX3 clamp: true).
//
// IX3's pre-style — `html.w-mod-js:not(.w-mod-ix3) .section.s-baf
// .image-one-w {visibility:hidden !important}`, written into <head> by
// Webflow while the interaction exists — has no replacement on purpose: the
// timeline's start (width 100%) is the element's own CSS width, and the
// fromTo renders the scroll-correct width synchronously when the module
// runs, so there is nothing to hide. It goes away by itself when the IX3
// interaction is deleted in Webflow (that also stops `w-mod-ix3`).
import { gsap } from './gsap';

export function initBeforeAfter() {
  const sections = document.querySelectorAll<HTMLElement>('section.s-baf');
  if (!sections.length) return;

  sections.forEach((section) => {
    const wipes = section.querySelectorAll<HTMLElement>('.image-one-w');
    if (!wipes.length) return;
    gsap.fromTo(
      wipes,
      { width: '100%' },
      {
        width: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'clamp(top top)',
          end: 'clamp(bottom bottom)',
          scrub: 0.8,
        },
      },
    );
  });
}
