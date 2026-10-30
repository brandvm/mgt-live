# Live site code and interactions (reference)

What the live site runs today: every piece of custom code and every Webflow
interaction (IX2, IX3). **Update 2026-10-29:** the live site moves onto
wf-template as it is (HANDOFF Decisions): its code is ported to
`src/modules/legacy/` and ships in the separate live bundle (`src/live/` →
`dist/live/`), in batches W1–W5 below. The 2026 redesign still builds its
own behaviour; nothing here goes into its bundle. Use this list to make
sure the new site still does what it must (tracking, consent, forms, schema,
canonicals) and to know what each piece was for. The Plan column is a note
for that, not a task; Status is not used.

Source: the live capture of 2026-10-29 (`../capture/live-2026-10-29/`, made
with `pnpm capture:live`) and the Webflow MCP. The verbatim code is in
[ROLLBACK.md](ROLLBACK.md) and the capture's `code/` and `interactions/`.


## Custom code

| ID | What | Where in Webflow now | Pages | Plan | Status |
| --- | --- | --- | --- | --- | --- |
| C1 | Google Tag Manager (`GTM-NKPQBTX`) + noscript iframe | Site head + footer code | all | Stays in Webflow head code (tracking must load before the bundle) — confirm | todo |
| C2 | illow cookie banner (`platform.illow.io/banner.js`) | Site head code | all | Stays in Webflow head code (consent must run first) — confirm | todo |
| C3 | Ahrefs site verification `<meta>` | Site head code | all | Stays in Webflow head code (a meta tag, not code) | todo |
| C4 | gclid capture: stores `?gclid` 90 days, fills `#gclid_field` | Site head code | all | Module `gclid` | todo |
| C5 | `.animated-item` fade-up: CSS in head + IntersectionObserver in footer | Site head + footer code; **duplicated** in Home footer code | all | Module `reveal` + `repo-css: js-state`; remove the Home duplicate | todo |
| C6 | Swiper (`unpkg.com/swiper` CSS + JS, unpinned `@latest`) | Site head + footer code | all | `pnpm add swiper`; module for each slider that uses it — find which do | todo |
| C7 | weblocks.io `library.js` + `script-66-529.js` | Site footer code | all | Find what it drives (captured in `assets/weblocks.io/`); port or drop | todo |
| C8 | HubSpot on Webflow `form-121.js` | Loaded on every page (app) | all | Find what it does; port or keep the app | todo |
| C9 | Phosphor icon CSS (regular, bold, fill) from unpkg | Global Embed (`.global-embed`) | all | `pnpm phosphor regular bold fill` (bundle), drop the CDN links | todo |
| C10 | Font Awesome 6.6.0 CSS from cdnjs | Global Embed / head | all | Check which icons are used; bundle a subset or drop | todo |
| C11 | "Brand Vision – Global Styles" `<style>` | Global Embed | all | Sort rule by rule: Designer first, the rest to `src/styles.css` with tags | todo |
| C12 | Home hero background slideshow (adds 2 images, CSS keyframes) | Home footer code (also registered as `MGTHeroSlideshow` 1.0.0/1.0.1, not applied) | `/` | Module `hero-slideshow`; image URLs from markup, not hard-coded | todo |
| C13 | BeerSlider before/after (`unpkg.com/beerslider`, unpinned) | Home head + footer code | `/` | `pnpm add beerslider` or replace with C/IX3 port (see X30) | todo |
| C14 | HubSpot form `hbspt.forms.create` (portal 44243593) + `js.hsforms.net/forms/embed/v2.js` | Embeds | `/contact-us`, `/offers` | Module `hubspot-form` reading `data-*` (portal, form id) | todo |
| C15 | Finsweet Attributes v2 (`fs-list`) **and** v1 cmsfilter + cmssort | Blog page head code | `/blog` | webflow-build `recipes/finsweet/`; one version only (v2) | todo |
| C16 | Service map card: `.cm-card` styles + mask/map script | Embeds (`.seciton-code`) in the services component | 28 service pages | Module `service-map` + `repo-css: designer-cant` where needed | todo |
| C17 | Merge H1s inside `#Services-Area-Header` | Service Areas template head code | `/service-areas/*` | **Broken on live** (runs in head before the element exists: TypeError). Fix in Designer (one H1) and drop | todo |
| C18 | hreflang tag injection | Embed/inline script on service areas | `/service-areas/*` | **Adds nothing on live** (0 `hreflang` links). Decide: real hreflang via Webflow, or drop | todo |
| C19 | Canonical `<link>` with CMS slug | Blog, Auctions, Service Areas template head code | CMS templates | Stays in Webflow page settings (SEO, not code) | todo |
| C20 | Home video player (`<video id="homeVideo">`) | Embed `.home-video-embed` | 11 pages | Module `video-player` with X17 | todo |
| C21 | FAQPage JSON-LD (13 registered scripts, hosted JS) | Registered scripts applied per page | `/`, 10 service pages | JSON-LD belongs in page settings (`jsonLdSchema`) or CMS, not JS — decide | todo |
| C22 | Organization/LocalBusiness JSON-LD (`OrgLocalBusinessSchema` 1.0.0–1.0.2) | Registered, **not applied** anywhere | — | Check where org schema comes from now (277 pages have JSON-LD inline) | todo |
| C23 | `NoindexMetaTag` | Registered script on Thank You | `/thank-you` | Page setting (sitemap/search exclusion) instead of JS | todo |
| C24 | Unused registered scripts: `CALFAQPageSchema`, `ITELFAQPageSchema`, `OFRemFAQPageSchema`, `MGTHeroSlideshow` | Registered, not applied to any page read | — | Confirm unused (drafts not read yet), then drop | todo |
| C25 | jQuery 3.5.1 + `webflow.js` | Webflow | all | Stays (Webflow's own runtime) | — |

## Interactions

IX2: 42 events, 29 action lists (`interactions/ix2.json`). IX3: 1
interaction (`interactions/ix3.json`, GSAP 3.15 + ScrollTrigger from
Webflow's CDN). No legacy IX1 (`data-ix`) on any page.

| ID | Action list | Trigger | Targets | Plan | Status |
| --- | --- | --- | --- | --- | --- |
| X1 | a · Home Hero // Logo (Loop) | Page load (6 pages) | `.hero-customer-logo-wrapper` | Module `logo-marquee` (CSS keyframes or GSAP) | todo |
| X2 | a-2/a-3 · Services Card // Hover | Hover | `.services-card-image` scale | Designer hover transition on the class (no JS) | todo |
| X3 | a-4/a-5 · FAQs // Accordion | Dropdown open/close | `.faqs-accordion-*` | Module `accordion` (shared with X12–X14) | todo |
| X4 | a-6/a-7 · Service Area // Hover | Hover | `.service-area-*` colours, plus-line rotate | Designer hover states (no JS) | todo |
| X5 | a-8 · C // Title (In View) | Scroll into view | `.c-title-*`, `.primary-button` | Module `reveal` (with C5) | todo |
| X6 | a-13/a-14 · Navbar // Dropdown | Dropdown open/close | `.nav-drop-list`, `.sw-nav-drop-content` | Module `nav` | todo |
| X7 | a-15/a-16 · Navbar // Menu | Click | `.navbar-menu` slide | Module `nav` | todo |
| X8 | a-9–a-12 · Infographics // Card hover + Pop up | Hover, click | `.infographics-*` | Infographics page is a **draft**: confirm it's used before porting | todo |
| X9 | a-19 · Home Video Player | Click | `.home-video-play-button-w` | Module `video-player` (with C20) | todo |
| X10 | a-24/a-25 · Landing Page // Menu Drawer | Click | `.l-menu-drawer` | Module `nav` (landing variant on `/offers`) | todo |
| X11 | a-26 · Cookie Consent // Closer | Click | `.cookie-consent` | Check it's still used next to illow (C2); likely drop | todo |
| X12 | a-27 · Main CTA 1 // While Scrolling | Scrolling in view (continuous) | scale | Module `scroll-scale` (GSAP ScrollTrigger) | todo |
| X13 | a-28/a-29 · SerWhy Accordion | Dropdown open/close | `.serwhy-accordion-*` | Module `accordion` | todo |
| X14 | a-30/a-31 · SerIntro Accordion | Dropdown open/close | `.serintro-accordion-*` | Module `accordion` | todo |
| X15 | a-32/a-33 · Main Service Accordion | Dropdown open/close | `.service-accordion-*` | Module `accordion` | todo |
| X16 | a-34/a-35 · Expandable / Collapse Content | Click, second click | `.expand-info-*`, `.expand-menu-text`, `.collapse-menu-text` | Module `expand` | todo |
| X30 | IX3 `i-08e8b417` · before/after wipe | Scroll (scrub 0.8, `section.s-baf`, top→bottom) | `.image-one-w` width 100% → 0% | Module `before-after` (GSAP ScrollTrigger, bundled); also drop the IX3 `visibility:hidden` pre-style | todo |

Before an IX2 interaction is removed in Webflow, its module must reproduce
the start state too (IX2 sets initial styles on load, e.g. hidden dropdown
lists): check the canvas and the first paint (`pnpm wf:film`), not only the
settled page.

## Findings on the live site (read, not changed)

- C17 throws `TypeError: Cannot read properties of null` on every service
  area page, live and local alike.
- C18 adds no hreflang links on live.
- C20's video (`michaelsglobaltrading.com/wp-content/uploads/2023/02/revised-MGT-1.mp4`,
  a leftover WordPress URL) returns 404: the video embed on 11 pages plays
  nothing.
- Swiper and BeerSlider load from unpkg without a version: a new major
  release can break the site without anyone changing it.
- Two versions of Finsweet Attributes load on `/blog` (v2 `fs-list` and v1
  cmsfilter/cmssort).
- The `.animated-item` observer runs twice on the home page (site footer and
  home footer code).
- The illow banner script did not download from the capture script (status
  0); it loads in a browser. Not needed locally: the local copy switches it off.


## Migration batches

Each batch: repo ready → [Person] Webflow backup and the steps → publish to
**staging only** → checks on staging → [Person] confirms nothing else is
pending → types **publish** → live → same checks with `--live`. Parity is
checked first against the harness `migration-copy/` (port 5966: the
captured pages with the batch's old code removed and the loader pointed at
a local `dist/`; `node scripts/swap-code.mjs` there, then from wf-mgt
`node ../migration-copy/scripts/parity-local.mjs`).

| Batch | Contents | State |
| --- | --- | --- |
| W1 code | C4, C5, C6+C7, C9–C11, C12, C13 (dead, dropped), C14, C16; C17, C18, C24 dropped | repo ready; local parity 2026-10-29 on all 30 harness pages × 3 widths: no difference outside noise (logo marquee position; the two `.seciton-code` Embed wrappers gone, zero-size; HubSpot Embed without `w-script`; icon glyphs, because live-copy lacks the icon fonts — live and harness both 16px). On staging 2026-10-29 22:08 (steps 1–3, 6 and the G | Components wrapper through the MCP; Embed code and step 5 by hand). Staging vs live, 11 key pages at 1440: bundle loads from `live/`, scroll lock released, Swiper 1/1, hero 3 slides, HubSpot form 1398 px on /contact-us and /offers as live, service map, gclid stored, same root size; no new console errors; hero, logo and map sizes identical. Screenshot diffs against the live baselines are capture timing plus content published to webflow.io since Oct 13 (e.g. the phone number), not W1. **Live 2026-10-30 16:10 UTC** as release `1.0.0` (jsDelivr `@1.0.0/dist/live/`): checked on 11 live pages at 1440: bundle and fonts from the pinned release, scroll lock released, Swiper, hero 3 slides, HubSpot forms, gclid, Phosphor icons, root 13.71px; no new console errors (the only 404 is C20's old WordPress video, as before). The same publish took live everything published to webflow.io since Oct 13 and the 2026 variables (unused) |
| W2 click IX | X3, X13–X15 accordions, X16 expand, X9 video cover (a-19); X2/X4 hovers | modules written, off |
| W3 scroll IX | X5 title reveal (a-8), X1 logo marquee, X30 before/after (IX3) | modules written, off |
| W4 nav IX | X6, X7, X10 | module written, off |
| W5 cleanup | X8 (unpublished page), X11 (no markup), X12 (no markup): delete; C15 Finsweet v1 → v2 attributes | not started |

Stays in Webflow: C1 GTM, C2 illow, C3 Ahrefs, C8 HubSpot app, C15
Finsweet (until W5), C19 canonicals, C21–C23 JSON-LD / noindex, C25.

### W1 steps in Webflow

Steps 1–3 (site and page custom code) and 6 (deleting Embeds) can go
through the MCP (`data_scripts_tool` › `set_site_freeform_code` /
`set_page_freeform_code`; `data_element_tool` › `remove_element`). Steps 4
and 5 change an Embed's code, which the API can't: Designer only.

Paste from `loader.html` (with `RELEASE` set to the W1 tag, never `null`
on a custom domain). Verbatim old code is in `ROLLBACK.md`.

1. **Site settings › Custom code › Head:** keep illow, GTM and the Ahrefs
   meta; delete the Swiper `<link>`, the gclid `<script>` and the
   `.animated-item` `<style>`; add loader piece 1 at the end.
2. **Site settings › Custom code › Footer:** keep the GTM `<noscript>`;
   delete the Swiper, weblocks `library.js` and `script-66-529.js` tags and
   the `.animated-item` observer; add loader piece 3.
3. **Home › Page settings › Custom code:** delete the BeerSlider tags (head
   and footer), the second `.animated-item` observer and the hero slideshow
   script.
4. **G | Components** (component, group Global; class G | Components:
   fixed, 0×0, hidden, `aria-hidden="true"`; on all 33 pages that had the
   old Global Embed, first in the body; built through the MCP
   2026-10-29). Open it once and paste loader piece 2a into **Embed 2a ·
   loader CSS (link)** and piece 2b into **Embed 2b · loader script**
   (Embed code is Designer-only). The old **Global Embed** component
   (icons + C11 styles) now has 0 instances and stays registered for
   rollback: put it back first in the body and remove G | Components.
5. **/contact-us and /offers › `.hubspot-embed`:** replace the content with
   `<div data-hubspot-portal="44243593" data-hubspot-form="07684124-bff7-4657-8d8e-f485d95e757b" data-hubspot-region="na1"></div>`.
6. **Services component › `.s-locations-section`:** delete both
   `.seciton-code` Embeds (style and script).
7. Publish to staging only.

Not changed in W1 (later batches): every IX2/IX3 interaction, Finsweet on
`/blog`, page settings.
