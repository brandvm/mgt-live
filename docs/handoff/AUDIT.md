# Audit — live site before the migration

Measured on www.michaelsglobaltrading.com, 2026-10-29, before any Webflow
change (webflow-audit §1). Each point says *measured* or *read from the
code*. Inventory of code and interactions: [CODE-MIGRATION.md](CODE-MIGRATION.md).

## Visual baselines and noise floor (measured)

`pnpm wf:baseline save --live` then `compare` straight away, 11 key pages at
1440, 820 and 390 (images in `.webflow-build/live-baselines/`, not in git).
Two untouched runs differ by **0.0–0.2 % of pixels**, same page heights:
the logo marquee, the hero slideshow and the testimonial slider. A change
inside 0.2 % on these pages is noise.

| Page | 1440 | 820 | 390 |
| --- | --- | --- | --- |
| `/` | 8576 px, 0.1 % | 11843, 0.1 % | 12276, 0.1 % |
| `/about-us` | 6383, 0.0 % | 7241, 0.0 % | 9268, 0.0 % |
| `/contact-us` | 3042, 0.1 % | 3580, 0.2 % | 3631, 0.2 % |
| `/offers` | 9374, 0.1 % | 12503, 0.0 % | 13916, 0.1 % |
| `/faq` | 4061, 0.1 % | 5335, 0.0 % | 7956, 0.1 % |
| `/blog` | 3723, 0.1 % | 5809, 0.0 % | 8526, 0.0 % |
| a blog post | 4648, 0.1 % | 5127, 0.0 % | 7124, 0.1 % |
| `/our-services` | 2220, 0.1 % | 3429, 0.0 % | 4334, 0.1 % |
| `/services/commercial-asset-liquidation` | 9011, 0.2 % | 12725, 0.1 % | 13807, 0.2 % |
| `/service-areas/toronto` | 9463, 0.1 % | 13088, 0.1 % | 14063, 0.2 % |
| `/auctions/ingram-micro` | 3021, 0.0 % | 2955, 0.1 % | 2891, 0.2 % |

## Published HTML (measured, `pnpm wf:html --live`)

- Home's service tabs are `<a>` without `href` (Webflow Tabs): not
  focusable as buttons. Not changed by the migration.
- One console error on Home: a resource on a host that doesn't resolve
  (`ERR_NAME_NOT_RESOLVED`).
- Classes with no styles (script hooks or leftovers), e.g. `next-slide`,
  `prev-slide`, `hero-image`, `faqs-plus-line vert`: several are the hooks
  the ported modules use, so they must stay.

## Found while porting (read from the code)

- BeerSlider (C13) loads on Home but no page has its markup: dead.
- weblocks `library.js` (C7) defines helpers nothing calls; its
  `script-66-529.js` is the only Swiper init (testimonials, 30 pages).
- gclid capture (C4) stores the click id but no page has `#gclid_field`:
  it fills nothing.
- The video on 11 pages (C20) is a WordPress URL that returns 404.
- IX2 X12 (Main CTA scale) and X11 (cookie closer) have no markup on any
  page; X8 targets an unpublished page.
- `/blog` runs Finsweet v1 filter/sort next to v2 load-more; v1 probably
  only sees the first page of posts.

## Speed

Not measured yet: `pnpm wf:perf --live` (median of 5, mobile and desktop)
on `/`, `/contact-us` and a service page before W1 goes live.
