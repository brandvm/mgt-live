# Before: the live site on 29 Oct 2026

The baseline every optimization round is measured against:
www.michaelsglobaltrading.com before any change. Presented in Figma,
[Michaels Global Trading | Optimization](https://www.figma.com/design/gBKl7xd0nXqrVgJzS1aXHT/Michaels-Global-Trading-%7C-Optimization?node-id=0-1)
› page "01 · Before — 2026-10-29". Compact data in
[before-2026-10-29/](before-2026-10-29/); full Lighthouse reports and the
per-page crawl in `.webflow-build/before-2026-10-29/` (not in git; large).

## How it was measured

- **PageSpeed:** Lighthouse 12 run locally against the live domain (the
  PageSpeed Insights API is rate-limited without a key), all four
  categories, mobile and desktop, 3 runs per page, median kept. 13 key pages.
  Lab data only: field data (CrUX) needs an API key or Search Console.
- **Crawl:** all 278 sitemap URLs in Chromium at 1440 px: tags from the
  HTML as served; images and weight after scripts ran and the page was
  scrolled. GTM, GA, illow and HubSpot tracking were blocked, so page weight
  here excludes ~0.9 MB of tags (Lighthouse includes them).
- **Accessibility:** axe-core (`pnpm wf:a11y --live --all-widths`), 13 key pages.
- **Links:** `pnpm wf:links / --live --external` (53 pages followed, 124 external links).
- **Site and Webflow:** curl (redirects, headers, TLS), Webflow MCP read-only (pages, CMS, assets).
- The 78 Lighthouse runs load pages normally: GA may show ~78 extra visits on 29 Oct 2026.

## Summary

| Measure | Before |
| --- | --- |
| Performance, mobile (median of 13) | **51** (43 /offers – 73 service page) |
| Performance, desktop (median) | **93** (67 /offers – 97) |
| LCP, mobile (median) | **15.5 s** (3.7–26.7 s); 0 of 13 under 2.5 s |
| LCP, desktop | 12 of 13 under 2.5 s (/blog 4.7 s) |
| CLS, desktop | poor on /offers (0.59) and /contact-us (0.40) |
| Accessibility score | 83–96; every key page fails colour contrast |
| Best practices | 74–75 everywhere (third-party cookies, console errors, Issues panel) |
| SEO score | 92–100 |
| Median page weight (crawl, no tags) | 3.6 MB; service areas 10.8 MB, /offers 10.4 MB, Home 9.7 MB, services 8.3 MB |
| Images | 4.3 MB per page; 160 files > 500 KB; 1,458 shown at < 40% of size; 98% without width/height |
| Asset library | 256 assets, 82 MB; 252 of 253 images without alt text; 24 files > 1 MB |

## PageSpeed by page (Lighthouse, median of 3)

| Page | Device | Perf | A11y | BP | SEO | LCP | FCP | TBT | CLS | SI | Weight | Requests |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | mobile | 48 | 83 | 75 | 92 | 26.7 s | 9.5 s | 345 ms | 0 | 9.5 s | 5.1 MB | 96 |
| `/` | desktop | 90 | 87 | 74 | 92 | 1.4 s | 1.1 s | 0 ms | 0.01 | 2.1 s | 9.3 MB | 101 |
| `/about-us` | mobile | 55 | 91 | 75 | 100 | 15.8 s | 4.3 s | 275 ms | 0 | 5.8 s | 1.8 MB | 78 |
| `/about-us` | desktop | 93 | 91 | 74 | 100 | 1.4 s | 0.8 s | 0 ms | 0.072 | 1.4 s | 2.4 MB | 87 |
| `/contact-us` | mobile | 46 | 96 | 75 | 100 | 19.2 s | 13.5 s | 380 ms | 0.001 | 13.5 s | 2.2 MB | 100 |
| `/contact-us` | desktop | 71 | 96 | 74 | 100 | 1.5 s | 1.2 s | 0 ms | 0.4 | 1.5 s | 2.3 MB | 100 |
| `/offers` | mobile | 43 | 87 | 75 | 92 | 22.7 s | 14.6 s | 462 ms | 0 | 14.6 s | 6.5 MB | 114 |
| `/offers` | desktop | 67 | 87 | 74 | 92 | 1.6 s | 1.0 s | 0 ms | 0.59 | 1.9 s | 8.9 MB | 120 |
| `/faq` | mobile | 48 | 96 | 75 | 100 | 15.4 s | 5.8 s | 501 ms | 0 | 5.8 s | 1.5 MB | 70 |
| `/faq` | desktop | 93 | 96 | 74 | 100 | 1.3 s | 1.0 s | 5 ms | 0.086 | 1.2 s | 1.6 MB | 70 |
| `/blog` | mobile | 46 | 88 | 75 | 100 | 20.1 s | 9.1 s | 273 ms | 0.131 | 9.1 s | 3.0 MB | 137 |
| `/blog` | desktop | 72 | 88 | 74 | 100 | 4.7 s | 1.2 s | 0 ms | 0.022 | 2.0 s | 6.0 MB | 143 |
| `/blog/3-reasons-to-sell-assets-with-a-liquidation-auction` | mobile | 51 | 95 | 75 | 100 | 13.9 s | 5.8 s | 399 ms | 0 | 5.8 s | 1.5 MB | 70 |
| `/blog/3-reasons-to-sell-assets-with-a-liquidation-auction` | desktop | 96 | 95 | 74 | 100 | 1.1 s | 1.0 s | 0 ms | 0.005 | 1.3 s | 4.1 MB | 73 |
| `/our-services` | mobile | 59 | 96 | 75 | 100 | 5.0 s | 2.8 s | 384 ms | 0.001 | 4.1 s | 1.7 MB | 75 |
| `/our-services` | desktop | 94 | 96 | 74 | 100 | 1.4 s | 0.8 s | 0 ms | 0.001 | 1.4 s | 1.9 MB | 75 |
| `/services/commercial-asset-liquidation` | mobile | 73 | 90 | 75 | 100 | 3.7 s | 3.4 s | 232 ms | 0.001 | 6.2 s | 3.1 MB | 85 |
| `/services/commercial-asset-liquidation` | desktop | 97 | 90 | 74 | 100 | 1.0 s | 0.9 s | 0 ms | 0.013 | 1.2 s | 7.8 MB | 87 |
| `/service-areas/toronto` | mobile | 53 | 87 | 75 | 92 | 17.9 s | 9.2 s | 228 ms | 0 | 9.2 s | 3.8 MB | 88 |
| `/service-areas/toronto` | desktop | 96 | 87 | 74 | 92 | 1.2 s | 0.8 s | 0 ms | 0.01 | 1.5 s | 8.7 MB | 96 |
| `/auctions` | mobile | 50 | 96 | 75 | 100 | 15.5 s | 9.1 s | 314 ms | 0 | 9.1 s | 1.5 MB | 72 |
| `/auctions` | desktop | 95 | 96 | 74 | 100 | 1.2 s | 1.0 s | 0 ms | 0.001 | 1.3 s | 1.6 MB | 72 |
| `/auctions/ingram-micro` | mobile | 57 | 96 | 75 | 92 | 6.4 s | 4.5 s | 336 ms | 0 | 5.2 s | 1.6 MB | 71 |
| `/auctions/ingram-micro` | desktop | 92 | 96 | 74 | 92 | 1.5 s | 1.0 s | 0 ms | 0.076 | 1.4 s | 1.6 MB | 71 |
| `/privacy-policy` | mobile | 53 | 96 | 75 | 92 | 15.2 s | 5.8 s | 360 ms | 0.001 | 5.8 s | 1.5 MB | 70 |
| `/privacy-policy` | desktop | 95 | 96 | 74 | 92 | 1.2 s | 1.1 s | 0 ms | 0.001 | 1.2 s | 1.5 MB | 70 |

Biggest savings (mobile, median across pages): render-blocking resources
3.5 s (13 pages, up to 10.9 s on /offers); unused JavaScript 2.3 s (12 pages,
390–750 KB); image sizing 2.4 s on Home (1.37 MB). Largest paint is the H1
text on Home and service areas, the hero video on /offers, and a lazy-loaded
hero image on 8 pages. Third parties per page: GTM 687 KB / 330 ms blocking,
unpkg 403 KB (BeerSlider unused), HubSpot 136 KB / 101 ms.

## SEO (278 pages)

- All 200, all with a self-referencing canonical, none noindex; /thank-you
  correctly out of the sitemap. JSON-LD valid on 277 (BreadcrumbList 276,
  WebPage 273, BlogPosting 241, Service 17, …).
- Titles: 119 over 60 characters (101 blog, 17 services, Home); 11 under 30;
  1 duplicate pair ("Why DIY Machinery Removal Is a Liability Nightmare…").
- Descriptions: missing on /offers, /privacy-policy, /auctions/ingram-micro;
  219 over 160 characters; /auctions has a 31-character placeholder.
- og:image missing on 26 pages (all 17 services + 9 static); Home's is an SVG.
- Headings: 275 pages with one H1; none on /blog and /auctions/ingram-micro;
  two on /blog/steps-to-liquidating-your-business-equipment; 181 pages skip levels.
- Thin pages (< 300 words): /auctions, /contact-us, /auctions/ingram-micro.

## Accessibility (13 key pages)

Colour contrast on all 13 (6–22 elements each; footer labels everywhere);
slider wrapper missing required ARIA children on 5 pages; links without
text on Home, Toronto and /offers; /blog pagination missing an ARIA
attribute and an unlabelled sort select; nav toggles under 24 px on phones.

## Links and technical

- No broken internal links; 2 external 404s (Durham fees PDF, Miller
  Thomson article); 12 sites refuse automated checks (check by hand).
- `#` links: nav menu/close icons on every page; share icons and "See all
  blogs" on every blog post; two words in service-page copy.
- revised-MGT-1.mp4 (old WordPress URL) 404 on 8 pages; 2 broken images on
  /blog/auction-vs-liquidation and /blog/online-auction.
- Cloudflare + HTTP/2, cached, TTFB ~0.06 s. HSTS without includeSubDomains;
  no CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy or
  Permissions-Policy. /index.html serves a duplicate of Home; /favicon.ico
  404; robots.txt lists the sitemap twice; uppercase URLs 404.

## Webflow

40 pages (3 drafts). CMS: Blogs 247, Sub-Services 170, FAQs 117,
Testimonials 50, Customers 13, Service Areas 10, Blog Tags 8, Blog
Categories 6, Infographics 2, Auctions 1. ~40 Embeds, 29 IX2 action lists,
1 IX3 interaction (inventory in [CODE-MIGRATION.md](CODE-MIGRATION.md)).
