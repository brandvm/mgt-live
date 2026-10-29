// Entry point of the LIVE site's bundle (dist/live.js): the current
// michaelsglobaltrading.com's custom code and interactions, ported as they
// were (CODE-MIGRATION.md). The 2026 redesign's entry is src/index.ts; at
// its launch the loader switches BUNDLE and this folder and
// src/modules/legacy/ are deleted. Keep this file a manifest, like that one.
import { initEnvironmentSwitcher } from '../modules/environment-switcher';
import { initGclid } from '../modules/legacy/gclid';
import { initHeroSlideshow } from '../modules/legacy/hero-slideshow';
import { initHubspotForm } from '../modules/legacy/hubspot-form';
import { initReveal } from '../modules/legacy/reveal';
import { initServiceMap } from '../modules/legacy/service-map';
import { initSwiper } from '../modules/legacy/swiper';

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
  // Interactions: each group goes in with the Webflow batch that deletes
  // its IX2/IX3 interactions, never before (both would animate). Not even
  // imported until then: gsap.ts has load-time side effects. Per batch, add
  // the imports, these run() lines and the CSS import in styles.css:
  //   W2 click (legacy-ix-accordions.css): accordion.ts initAccordions,
  //      expand.ts initExpand, video-player.ts initVideoPlayer (IX2 a-19)
  //   W3 scroll (legacy-ix-scroll.css): title-reveal.ts initTitleReveal,
  //      logo-marquee.ts initLogoMarquee, before-after.ts initBeforeAfter
  //   W4 nav (legacy-ix-nav.css): legacy-nav.ts initLegacyNav
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
