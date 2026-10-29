// The only entry point for GSAP in the legacy modules: the bundled core with
// ScrollTrigger registered on it, kept apart from Webflow's IX3 copy.
// Needs the `gsap` package (live runs GSAP 3.15). The import order below is
// load-bearing; don't let a formatter sort it.
import './gsap-hide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './gsap-restore';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
