// Step 3 of gsap.ts: give Webflow's GSAP globals back once the bundled
// plugins have evaluated (see gsap-hide.ts).
import { saved } from './gsap-hide';

const w = window as unknown as { gsap?: unknown; ScrollTrigger?: unknown };

if (saved.hadGsap) w.gsap = saved.gsap;
if (saved.hadScrollTrigger) w.ScrollTrigger = saved.ScrollTrigger;
