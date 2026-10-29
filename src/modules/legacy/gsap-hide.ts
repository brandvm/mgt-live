// Step 1 of gsap.ts (ES module evaluation order: hide → gsap → plugins →
// restore). Webflow loads its own GSAP for IX3 as `window.gsap`; GSAP's ESM
// plugin files register themselves on `window.gsap` when it exists, which
// would put the bundled ScrollTrigger on Webflow's core and replace
// `window.ScrollTrigger` under IX3 (skill lessons/js.md, "Bundled GSAP
// plugins register themselves on Webflow's window.gsap"). Never import
// `gsap/…` outside gsap.ts.
type GsapGlobals = { gsap?: unknown; ScrollTrigger?: unknown };

const w = window as unknown as GsapGlobals;

export const saved: GsapGlobals & { hadGsap: boolean; hadScrollTrigger: boolean } = {
  gsap: w.gsap,
  ScrollTrigger: w.ScrollTrigger,
  hadGsap: w.gsap !== undefined,
  hadScrollTrigger: w.ScrollTrigger !== undefined,
};

if (saved.hadGsap) w.gsap = undefined;
