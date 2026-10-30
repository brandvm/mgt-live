// Entry point of the LIVE site's bundle (dist/live.js): the current
// michaelsglobaltrading.com's custom code and interactions, ported as they
// were (CODE-MIGRATION.md). The 2026 redesign's entry is src/index.ts; at
// its launch the loader switches BUNDLE and this folder and
// src/modules/legacy/ are deleted. Keep this file a manifest, like that one.
import { initEnvironmentSwitcher } from '../modules/environment-switcher';
import { initFinsweet } from '../modules/finsweet';
import { initAccordions } from '../modules/legacy/accordion';
import { initBeforeAfter } from '../modules/legacy/before-after';
import { initExpand } from '../modules/legacy/expand';
import { initGclid } from '../modules/legacy/gclid';
import { initHeroSlideshow } from '../modules/legacy/hero-slideshow';
import { initHubspotForm } from '../modules/legacy/hubspot-form';
import { initLegacyNav } from '../modules/legacy/legacy-nav';
import { initLogoMarquee } from '../modules/legacy/logo-marquee';
import { initReveal } from '../modules/legacy/reveal';
import { initServiceMap } from '../modules/legacy/service-map';
import { initSwiper } from '../modules/legacy/swiper';
import { initTitleReveal } from '../modules/legacy/title-reveal';
import { initVideoPlayer } from '../modules/legacy/video-player';

// Each module runs in isolation: one that throws is logged and skipped,
// and every module after it still initializes.
function run(name: string, init: () => void) {
  try {
    init();
  } catch (error) {
    console.error(`[wfc] ${name} failed to initialize`, error);
  }
}

function boot() {
  // Release the pre-paint scroll lock set by loader.html first.
  document.documentElement.classList.remove('is-loading');

  run('environment-switcher', initEnvironmentSwitcher);
  // Custom code (batch W1).
  run('gclid', initGclid);
  run('reveal', initReveal);
  run('hero-slideshow', initHeroSlideshow);
  run('hubspot-form', initHubspotForm);
  run('swiper', initSwiper);
  run('service-map', initServiceMap);
  // Interactions: each group ships with the Webflow batch that deletes its
  // IX2/IX3 interactions (both would animate otherwise), and reaches live
  // only through a RELEASE published together with that deletion.
  // W2 click (+ legacy-ix-accordions.css, legacy-ix-hover.css).
  run('accordions', initAccordions);
  run('expand', initExpand);
  run('video-player', initVideoPlayer);
  // W3 scroll (+ legacy-ix-scroll.css).
  run('title-reveal', initTitleReveal);
  run('logo-marquee', initLogoMarquee);
  run('before-after', initBeforeAfter);
  // W4 nav (+ legacy-ix-nav.css).
  run('legacy-nav', initLegacyNav);
  // W5: Finsweet Attributes v2 List on /blog (search, sort, load more;
  // C15), bundled instead of the three CDN tags in the page head. Last, so
  // attributes set by the modules above are seen.
  run('finsweet', initFinsweet);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
