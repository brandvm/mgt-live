// Testimonials slider (CODE-MIGRATION C6 + C7), ported as-is. Live loads
// Swiper 14.3.0 from unpkg (unpinned) and inits it in weblocks.io's
// `script-66-529.js`; that file is the only Swiper init on the site, and
// weblocks' `library.js` only defines unused helpers (not ported).
// On 30 pages: Home, About, /offers, the 17 services, the 10 service areas.
// The styles it injected on init are in legacy-b.css, with Swiper's CSS.
// Markup: `.slider-wrapper` (Collection List Wrapper) > `.slider-list` >
// `.slider-item`, arrows `.next-slide` / `.prev-slide` outside it.
// The full bundle, as live loads it: its default modules (A11y adds the
// live region `span.swiper-notification`) are part of what live renders.
import Swiper from 'swiper/bundle';

export function initSwiper() {
  document.querySelectorAll<HTMLElement>('.slider-wrapper').forEach((el) => {
    new Swiper(el, {
      wrapperClass: 'slider-list',
      slideClass: 'slider-item',
      navigation: {
        nextEl: '.next-slide',
        prevEl: '.prev-slide',
      },
      // No `.pagination` element exists on any page; kept for parity.
      pagination: {
        type: 'bullets',
        el: '.pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      speed: 700,
      slidesPerView: 'auto',
      loop: true,
      on: {
        init() {
          // Hover zoom on `.slide-image` / fade on `.slide-content` inside
          // any slide (none on live today). jQuery mouseover/mouseout bubble,
          // so these do too.
          document.querySelectorAll<HTMLElement>('.slider-item').forEach((item) => {
            const set = (transform: string, opacity: string) => {
              item.querySelectorAll<HTMLElement>('.slide-image').forEach((img) => (img.style.transform = transform));
              item.querySelectorAll<HTMLElement>('.slide-content').forEach((c) => (c.style.opacity = opacity));
            };
            item.addEventListener('mouseover', () => set('scale(1.1)', '.8'));
            item.addEventListener('mouseout', () => set('scale(1)', '1'));
          });
        },
      },
    });
  });
}
