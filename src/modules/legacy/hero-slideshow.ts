// Home hero background slideshow (CODE-MIGRATION C12), ported from the Home
// page footer code. The images in `.s-home-heroo .s-bg-w` cross-fade on a
// 12s CSS loop (keyframes and delays in legacy-a.css, keyed on `.hero-slide`).
// Image source: every <img> already in `.s-bg-w`. While the Designer holds
// only the one hero image, the two extra slides the live script hard-coded
// are added before `.s-bg-fader` as a fallback. Once the two images are
// Image elements in `.s-bg-w` (before the fader), the fallback is unused.
const ASSET_BASE = 'https://cdn.prod.website-files.com/658c5919dffd45bc022c9153/';
const FALLBACK_SLIDES: [string, string][] = [
  ['6aa428dbc6e72160fd27bbe1_MGT%20Image%202.webp', 'Commercial liquidation hero 2'],
  ['6aa428dbf2db72e27959a79c_MGT%20Image%201.webp', 'Commercial liquidation hero 3'],
];

// Home's Webflow page id: live ran this from Home's page code only, and
// the service pages share the `.s-home-heroo` hero markup.
const HOME_PAGE = '65b96bae53fc6d4a10dbe215';

export function initHeroSlideshow() {
  if (document.documentElement.dataset.wfPage !== HOME_PAGE) return;
  const container = document.querySelector<HTMLElement>('.s-home-heroo .s-bg-w');
  if (!container) return;
  // Already set up (e.g. the old Home footer code is still installed).
  if (container.querySelector('img.hero-slide')) return;

  const images = Array.from(container.querySelectorAll<HTMLImageElement>(':scope > img'));
  images.forEach((img) => {
    img.classList.add('hero-slide');
    img.removeAttribute('loading');
  });

  if (images.length > 1) return;

  const fader = container.querySelector('.s-bg-fader');
  FALLBACK_SLIDES.forEach(([file, alt]) => {
    const img = document.createElement('img');
    img.className = 'hero-slide';
    img.src = ASSET_BASE + file;
    img.alt = alt;
    container.insertBefore(img, fader);
  });
}
