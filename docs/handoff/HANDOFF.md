# MGT — design handoff → Webflow build

The brief every build session starts from. Written when the design is
approved (by the designer, or at the end of the prototype phase) and kept
current during the build. Agents read it after `AGENTS.md` and `GOTCHAS.md`.

## Read first

1. `AGENTS.md`, `GOTCHAS.md`, and the skill's `conventions.md`.
2. This file, then `MANUAL-TODO.md` and `BUILD-NOTES.md` in this folder;
   after the build handoff, `REVIEW.md` (feedback rounds until launch) and
   `SEO-PLAN.md`.
3. The design: Figma, page **2026** (https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1645-2); the design system is the frame
   **09 · Design System** (https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1692-68). The live site is reference only: its
   local copy is `live-copy/` (`pnpm dev` there, http://127.0.0.1:5965).

## Status

2026-10-29 — Planning phase, prototype. The style guide is built in the
prototype (`prototype/`, `pnpm dev`, http://127.0.0.1:5964 ›
`/design/style-guide`) from the Figma design system: approved 2026-10-29.
Shell, nav and footer built 2026-10-29 (`partials/nav.html`,
`partials/footer.html`), waiting for review. Homepage built 2026-10-29
(`prototype/index.html`, every section of Figma 02 · Homepage, compared at
1440, checked at 820 and 390), in review; the variable changes it needs, P1–P3 in
`prototype/src/css/proposed.css`, were approved 2026-10-29. Next: the other
pages, one at a time. The whole site is prototyped locally before any
2026 work goes into Webflow (user, 2026-10-29); how it goes in is decided
then (see Open decisions). Nothing from the live site is ported: its copy in
`live-copy/` and the inventory in [CODE-MIGRATION.md](CODE-MIGRATION.md) are
reference only.

2026-10-30 — The 2026 nav is in Webflow (staging): components N26 | Nav W, C | Mega Services, C | Mega Areas, C | Mega Resources on `/design/mega-menus` (noindex), 84 classes from the snapshot, CMS lists sourced (Sub-Services ×4, Service Areas, Blogs limit 2) with their filters, sort and bindings as Designer steps (MANUAL-TODO B–E). Checked against the prototype at 1440/820/390 (closed, each menu open, the menu below 1280 and a view sliding in): same geometry. The nav module reaches webflow.io once the repo change is pushed. The style guide at `/design/style-guide` is not rebuilt yet.

## Ground rules for this project

- **No writes to Webflow during planning** — no styles, pages, CMS, custom code, site settings or publishes, staging included. Reading through the MCP is fine. Writes start only when the user says so in chat, and the staging password and noindex are not to be set.
- <Anything that differs from conventions.md, agreed with the designer.>
- <Which repo or folders are read-only, if any.>

## Pages

Figma page **2026** has one frame per page, at 1440 only. Live pages from
the sitemap and the Webflow page list (2026-10-29).

| URL (live) | Design source | Webflow page | Notes |
| --- | --- | --- | --- |
| `/design/style-guide` | approved 2026-10-29 · [09 · Design System](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1692-68) | Style guide (folder `design`) | built in the prototype; excluded from search |
| `/design/mega-menus` | the nav's mega menus | Mega Menus (folder `design`) | the three mega menu components laid out open, to edit them; noindex, excluded from search |
| `/` | [02 · Homepage](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-863) | Home | built in the prototype 2026-10-29, waiting for review; Figma section screenshots in `Assets/figma/home-*-1440.png` |
| `/about-us` | [03 · About Us](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-1573) | About | |
| `/services/*` (17 static pages) | [01 · Service Page (Google Ads landing) — Approved](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-240)? | Services folder | which pages this design is for is open |
| `/service-areas/*` (10 items) | [04 · Location Page (Toronto template)](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-1979) | Service Areas template | CMS template |
| `/faq` | [05 · FAQs](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-2763) | FAQs | |
| `/contact-us` | [06 · Contact Us](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-3028) | Contact Us | |
| `/blog` | [07 · Blog](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1689-3390) | Blogs | |
| — (new) | [08 · Case Study Template](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1725-17805) | new CMS template | no case studies on the live site; needs a collection |
| — (new) | [09 · Case Studies page](https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1715-16821) (two options, https://www.figma.com/design/mRsQ8WQJeWKEm3N7J0OmCN/Michaels-Global-Trading--Website-?node-id=1734-595) | new page | plus three "Case studies" section options above the pages |
| `/our-services` | **no design** | Services | |
| `/auctions` | **no design** | Auctions & Liquidations | |
| `/auctions/*` (1 item) | **no design** | Auctions template | CMS template |
| `/blog/*` (241 posts) | **no design** | Blogs template | CMS template |
| `/offers` | **no design** (unless 01 is this page) | Get a Quote | Google Ads landing on live |
| `/privacy-policy` | **no design** | Privacy Policy | |
| `/thank-you` | **no design** | Thank You | form success page, noindex |
| 404 | **no design** | utility page | |

Breakpoints: 991 (tablet), 767 (mobile landscape), 479 (mobile). **Figma has
desktop frames only (1440)**: tablet and mobile designs are missing for every
page. Checked at 1440, 820 and 390.

## Variables and classes

- The prototype's `webflow-snapshot/` holds the **planned 2026 system**, not
  MGT's current Webflow (which has 13 ad-hoc variables in one collection and
  1,013 legacy classes): the template's collections and starter classes,
  with the values of Figma's design system. See Decisions, 2026-10-29.
- Figma → variables: colours `brand/*` → Colors › Brand, `text/*`, `bg/*`,
  `border/default`, `base/white` → Colors › Neutral, `state/*` → Colors ›
  State; roles in Colors Semantic (Base = light, Dark = navy 900). Text
  styles `MGT/*` → Typography Role modes (Display, H1–H6, Stat, Body, Body
  Large/Small/XS, Label, Button, Link, Chip, Tab, Caption, Form Label, Form
  Input). `space-*` → Spacing, `radius/*` → Radius (px names), layout rules →
  Layout (section padding 110/100, container 1240, button 44).
- Classes added to the starter's: Badge (+ Is Accent), Tag, Link Arrow, Icon
  Circle (+ Is Strong), Button Row, Form Grid, Form Field Is Full, Form Input
  Is Select, Button Is Disabled, Button Is Full, Body XS, Stat, Caption, Link Text, Tab Text;
  variants Button Color · Light, · Ghost, Button Size · Icon Lead, Icon Button
  Box · Social, Icon · 14px, · 18px. Their variant ids are placeholders until
  they exist in Webflow.
- Translucent fills measured from the Figma renders (the code export drops
  layer opacity): circles black 12% / 16% on light, white 16% on dark; social
  circle 8%; Glass chip white 12% fill and stroke.
- Classes with their own type size (Chip 13, Badge 11, Tag 15, Form Input 12)
  hold their spacing as `calc(var(--x) * 16 / <size>)` (conventions §6), and
  the Chip and Tag strokes are inset shadows (Figma strokes are inside). Both
  are Designer manual steps in Webflow (a variable inside calc() or a shadow).
- The style guide shows hover and focus states through Sg State classes and
  the prototype module `style-guide-states.ts` (GOTCHAS 2026-10-29).
- Figma's layout rules are Layout variables: Heading/Gap 24, Button Row/Gap
  16, Grid/Gap 24, Card/Padding 32, Card/Gap 16, Panel/Padding 24.
- Icon Circle Is Button: the circle in a primary phone button is a 16% black shade with the icon in the button's text colour on any section (Figma Button / Phone); Is Strong follows the section's theme (Ghost on dark: white 16%, white icon).
- Phosphor fill weight is used (phone icon): the repo bundle needs
  `pnpm phosphor regular fill`.
- Approval state: **style guide approved** by the user, 2026-10-29
  (prototype, `/design/style-guide`); homepage variable changes **P1–P3
  approved** 2026-10-29 (in `proposed.css`, made in Webflow at build time).
- Homepage classes (2026-10-29, in the snapshot's `styles.json`; each has
  its style guide row: the page's sections are `sg:start` blocks, four
  components (Before After, Carousel › Card, Faq Grid, Cta Band) and eight
  page sections):
  - Section combos: Is Surface (Background/Surface), Is Compact (padding
    V 64), Is Strip (no padding), Is Ruled (line under). Every section's
    content is in the container (1240); only the logo strip under the hero
    is full width (S Wrapper Is Wide), as in Figma.
  - Layout: Heading Row (+ Heading Row Text), Section Head Is Center,
    Button Row Is Center, Split (+ Is Top; Split Copy + Is Wide, Is Tight;
    Split Media), Card Grid (+ Is Four), Divider.
  - Card (+ Is Media, Is Link), Card Media, Card Body, Card Meta, Card Meta
    Text, Card Foot, Card Icon, Case Stat (+ Value, Bar), Step Top, Step
    Number (+ Is Accent), Step Line; Chip Is Small, Chip Is Accent, Link
    Arrow Is Small, Icon Circle Is Tint, Circle Arrow (+ Is Control), Pill,
    Pill Row, Callout, Callout Text, Tag Row.
  - Hero: Hero Grid, Hero Copy, Hero Card (+ Head, Image, Text); S Bg
    Overlay Is Gradient and Is Side, S Bg Media Is Faded.
  - Logo Marquee (+ Track, List, Logo); Logo Row, Logo Tile, Trusted Box,
    Trusted Logos; Photo Card (+ Image), Photo Stats, Photo Stat (+ Number,
    Plus, Label, Title, Sub); Expand (+ Toggle, Icon), Collapse (+ Inner).
  - Service Tabs (Webflow Tabs: + Menu, Content), Service Tab (Current
    state), Service Tab Icon, Text, Count, Service Pane (+ Body), Service
    Intro (+ Text, Image), Service List, Service Row (+ Number, Text).
  - Before After (+ Image, Image Is Before, Clip, Line, Handle), Media Tag
    (+ Is Start, Is End); Carousel (+ Track, Item, Controls); Faq Grid, Faq
    Item, Faq Heading, Faq Question, Faq Toggle, Faq Toggle Line (+ Is
    Vertical), Faq Answer; Cta Band (Dark mode; + Copy, Actions).
  - Service Tabs Menu (review): 8 between the tab links (Spacing/8), down
    the side and in the sideways row below 991; Figma has them touching.
    Service Tab Icon (review): white with a 1px Border/Subtle inset line
    (Figma: tint, too faint on the Surface panel), navy fill on the open
    tab; Service Tab hover: Paper 64 (half white), lighter than the open
    tab's white.
  - Logo Marquee (review): 20 above and below the logos (12 below 767).
  - S Bg Media Is Parallax (review, hero photo): moves down at a third of
    the scroll speed as the hero scrolls away; CSS scroll-driven animation
    (repo CSS, `view-timeline` on S Bg), still where unsupported and under
    reduced motion.
  - Post Item (review): the Collection Item around each blog card on the
    homepage (flex column; the Card inside fills it, Card `flex-grow: 1`).
    Its Last item state is hidden at Tablet (768–991) and shown again at
    Mobile Landscape, so the tablet shows two posts and none sits alone on
    a row; desktop and phones show all three.
  - FAQ grid (review): three columns from 1440, two below, one below
    767; every closed box is the same height through Faq Question's
    min-height per breakpoint (7.39em ≥1440, 8.67em 992–1439, 9.94em
    768–991, 7.39em 480–767, 8.61em ≤479: the tallest question at each,
    in em at its 18px). A longer question added later needs a new value.
  - Classes with their own type size hold their spacing in em at that size
    (Service Tab 14, Chip Is Small 13, Pill 14, Media Tag 13, Faq Question
    18, Step Number 15, Circle Arrow 12, Service Row Number 12); the ones
    with `calc(var(--x) * 16 / <size>)`, gradients or shadows with a
    variable are Designer manual steps.
  - Repo CSS (`prototype/src/css/new-classes.css`, end): marquee keyframes
    and edge mask, a tab's icon on the Current tab, carousel scroll-snap
    and hidden scrollbar, `:disabled` arrows, the before/after cut
    (`--before-after`), the Collapse fold and the FAQ toggle's open state.
- Variable changes for the homepage (`proposed.css`, approved
  2026-10-29, made in Webflow at build time): **P1** headings navy (All H1–H6 colour Text/Accent; Figma's
  headings are all navy, body copy ink); **P2** smaller type below 991
  (every Typography Role breakpoint mode held the desktop size, so H1 60
  and H2 45 reached the phone; adds Size/28 and Size/32); **P3** Section
  Is Hero bottom padding 80 (Figma).
- Text wrap (review 2026-10-29): D0–D6, Stat, Link Text, Faq Heading and
  All H1–H6 `text-wrap: balance`; Body L/S/XS, Caption and All Paragraphs
  `pretty`, so no word is left alone on a line (snapshot, Designer
  typography setting).

## CMS

| Collection | Fields | Used on |
| --- | --- | --- |
| <Name> | <field (type)…> | <pages, lists, limits and sort> |

## Components to make

| Component | Used on | Props | Behaviour inside |
| --- | --- | --- | --- |
| G | Nav W | every page | — | `nav` module. Figma 1689:1539 for the bar. Holds Nav Overlay, Nav Bg and one shared Nav Mega Panel with three views; while a menu is open G | Nav W Is Open puts the bar in the Base theme (white, faint line, navy logo) |
| C | Mega Services | in G | Nav W's panel; `/design/mega-menus` (its style guide rows are Page sections, a half-size 1440 screen: the menus are 1280 wide) | — | four categories (tint headers, icons) and a full-width CTA band (Dark theme) |
| C | Mega Areas | in G | Nav W's panel; `/design/mega-menus` | — | ten areas in two columns and a photo card with three stats (photo: live site's, stand-in) |
| C | Mega Resources | in G | Nav W's panel; `/design/mega-menus` | — | four links and the two newest posts: a Collection List of Blogs, limit 2, in Webflow (stand-ins here) |
| G | Footer W | every page | — | `[data-year]`, `footer-reveal` (Is Reveal; G | Main sits above it). Figma "Footer — site" 1738:2924 |
| Service Tabs (Webflow Tabs element, not a component) | `/` | — | Webflow's own Tabs: the open link's Current state styles it; its icon box needs repo CSS. Panes: one per service group, rows link to the service pages |
| C | Card (case study, blog post) | `/`, later the blog and case-study listings | image, chip, meta, title, text, link | whole card is the link; in Collection Lists (Blogs limit 3; Case Studies) |
| C | Faq Item | `/`, later `/faq` and service pages | question, answer | `disclosure` module; `aria-controls` → the Collapse's id (unique per item: in a Collection List, set from the slug) |
| C | Cta Band | `/`, likely every page above the footer | heading, text | none |
| Before After (component if reused) | `/` | before image, after image | `before-after` module |

## Modules

| Module | `data-*` hooks | What it does |
| --- | --- | --- |
| nav | `data-nav`, `-overlay`, `-logo`, `-menu`, `-toggle`, `-toggle-icon`, `-drop-toggle=<key>`, `-caret`, `-panel`, `-view=<key>`, `-back` | one shared mega panel: content slides between the menus and its height eases to fit; the bar turns light and the overlay dims the page while one is open; click, keyboard, hover; <1280 the menu panel with each mega menu sliding in over it (Back); opening or closing the whole menu is one 250ms motion (the bar's colour eases while the menu and open view fade; they stay white: Nav Menu Is Open and Nav Mega W are in the Base mode, Nav Mega Panel, Nav Mega View and Nav Mega Back use Neutral/White, Ink, Brand/Navy and Neutral/Border directly); the bar is fixed once the module runs (G | Nav W stays absolute, conventions §1; the module adds Is Fixed, so the canvas and style guide keep it in place) and hides on scroll down past two bar heights, back on scroll up (8px tolerance; never while a menu is open or focus is in it; G | Nav W Is Hidden); Escape, overlay or outside click closes; safe triangle on hover |
| smooth-scroll (recipe) | — | Lenis on GSAP's ticker; off under reduced motion; the nav stops it while its menu panel is open |
| anchor-scroll (recipe) | — | same-page anchors glide through Lenis and clear any sticky bar |
| transition (recipe barba) | `data-barba="wrapper"` on G \| Page W, `data-barba="container"` + `data-barba-namespace` on G \| Main W (footer inside), `data-barba-prevent` | page transitions: Osmo-style cross-fade (old page out 0.5s power1.in, new page fixed on top in 0.75s power1.inOut, its H1 rising 25% with expo.out from 0.3s), then the recipe's head, current-link, Webflow, focus and page-view sync; `/design` pages load in full; instant under reduced motion |
| pages (recipe barba) | — | page modules (year, footer-reveal, forms, style guide) start on every page and are torn down when it leaves; nav, Lenis and anchor-scroll are global |
| footer-reveal | `data-footer-reveal`, `-content` | only when the element before the footer covers it (positioned and opaque, as G | Main is; the generated style guide's plain `<main>` keeps a normal footer); while the footer fits the window: pinned behind the page (Is Reveal) and uncovered as the page scrolls past, content rising from 30% of its height below into place and fading in (GSAP ScrollTrigger scrub; Is Reveal clips the overshoot); taller footers stay normal; no rise or fade under reduced motion |
| form-select | `data-select`, `-native`, `-toggle`, `-value`, `-list`, `-option` | custom select list over a hidden native select; full keyboard |
| form-datepicker | `data-datepicker` (`-min="today"`), `-input`, `-popover` | month calendar for a read-only field; full keyboard |
| form-validate | `form[data-validate]` | errors in the site's style; stops Webflow's submit until valid |
| (prototype only) form-choice, form-file | Webflow's own markup | stand-ins for what webflow.js does with custom checkboxes, radios and File Upload |
| disclosure | `data-disclosure` (+ `-open`), `-toggle` (a button with `aria-expanded`, `aria-controls` → the panel) | FAQ answers (all closed at first) and the overview's "Learn more": toggles `.is-closed` on the item (folded content hidden from keyboard and screen readers, repo CSS); opening animates the panel's measured height and the margin the FAQ panel tucks under its question in one motion (420ms ease-out, closing 320ms), the content fading and settling; the question row never changes height. Reduced motion: instant. Ships open, so without JS everything shows |
| carousel | `data-carousel`, `-track`, `-prev`, `-next` | case studies: buttons step one card (smooth, instant under reduced motion), disabled at the ends with focus handed to the other arrow; swipe and Tab scroll natively (scroll-snap, repo CSS) |
| before-after | `data-before-after`, `-clip`, `-handle` | sets `--before-after` from pointer drag anywhere on the photos (vertical page scroll still works on touch); the handle becomes a slider (arrows, Page Up/Down, Home, End); rests at 50% without JS |
| logo-marquee | `data-logo-marquee`, `-track` | (review) the logos drift left at rest (2.75em/s), turn right while the page scrolls up and back left on scroll down (eased turn), run faster with scroll speed and the wheel's first notch, then coast back to rest over about a second (inertia); GSAP ticker, em-based speeds, hover slows to a stop, not moved off screen, still under reduced motion. Without it the CSS loop runs (`@keyframes` −50% over 60 s; `.is-driven` turns it off). The list twice, the copy `aria-hidden` |
| (prototype only) webflow-tabs | Webflow Tabs markup | stand-in for webflow.js Tabs: roles, roving tabindex, arrow keys, the 300ms pane fade |
| (prototype only) style-guide-states | Sg State classes | shows hover and focus states on the style guide |

## Decisions

- 2026-10-29 · The live site is reference only; nothing is ported. Its copy
  moved to `live-copy/` (port 5965); `prototype/` is the template's starter,
  on port 5964.
- 2026-10-29 · Prototype first: the style guide, then the homepage, built
  locally before any Webflow work.
- 2026-10-29 · The prototype's snapshot is the planned 2026 system (template
  collections, Figma values), because none of it exists in Webflow yet and the
  style guide is generated from the snapshot. `proposed.css` and
  `new-classes.css` start empty; `pnpm check:drift` applies once the system
  exists in Webflow.
- 2026-10-29 · Form type larger than Figma (asked for in review): Form Label
  11 → 14 semibold, Form Input 12 → 16 (16 also stops iOS zooming into a
  focused field). Fields grow with it: 48 high (Figma 40), padding 16, label
  gap 8, textarea 96, chevron 16. Form spacing as Figma's form panel: 24
  between the fields and the button, which is full width (Button Is Full).
  Tell the designer, so the Figma text styles Form/Label and Form/Input
  follow.
- 2026-10-29 · No browser-default form controls anywhere (asked for in
  review). Select: custom list (`form-select.ts`, the native select hidden in
  the form). Date: custom calendar (`form-datepicker.ts`, read-only field,
  `data-datepicker-min="today"`). Checkbox and radio: Webflow's custom style
  (Checked and Focused states). File: Webflow File Upload restyled as a drop
  area (needs a site plan with file uploads). Errors: `form-validate.ts` on
  `form[data-validate]` replaces the browser's tooltips. Autofill colours are
  overridden in repo CSS. Only the field and the select are in Figma; the
  rest is designed from the 2026 system and waits for the designer.
- 2026-10-29 · Nav: full-width mega menus (asked for in review, after the
  live site's; the live site is reference only). One shared white panel
  whose content slides between menus; the bar turns light while one is
  open; dark overlay behind; CTA band full width at the panel's bottom;
  panel content aligned with the bar (logo to button, 1280 max). Menu
  links: no side padding at rest, a line between them, padding and tint ease
  in on hover; post titles and excerpts cut to two lines. Button Color ·
  Light is the inverse button: white on dark, navy on light.
- 2026-10-29 · Nav order: Home, Services, Service Areas, Resources, About
  Us, Contact Us (the three menus together). Menu links: the line is its own
  element (Nav Drop Item, 4 above and below, straight); the hover block
  keeps radius 6. The panel has no bottom border; the CTA band has a faint light
  line under it, for when a navy section sits behind. Hover switching uses
  a safe triangle (menu aim): crossing another menu's button on the way down
  to the panel doesn't switch.
- 2026-10-29 · Nav breakpoints: the full bar only fits from 1280 (logo,
  six links and the button need about 1,260 px). Below 1280 (small desktop,
  tablet, phone) the menu button and slide-in menu; 1280–1439 the bar with
  links 28 apart; 1440 and up 40 apart (Figma). In Webflow the collapsed
  menu is the base style and the bar is set at the 1280 breakpoint.
- 2026-10-29 · Lenis smooth scrolling (asked for), from the template's
  smooth-scroll recipe with GSAP 3.15 and Lenis 1.3.27; anchor-scroll for
  same-page links. Lenis's CSS is the installed version's (newer than the
  recipe's), in the prototype's `src/css/repo.css` (GOTCHAS 2026-10-29).
- 2026-10-29 · Nav hides on scroll (asked for): G | Nav W is fixed; it slides up (Is Hidden) once scrolled down past two bar heights and comes back on any scroll up (8 px tolerance). Mega content slides only when switching menus; opening or closing the panel only fades (a slide uncovered white beside the full-width CTA band).
- 2026-10-29 · Page transitions (asked for, Osmo's "Cross Fade" resource): built on the template's Barba recipe, not Osmo's boilerplate. Libraries bundled (`@barba/core` 2.10.3, the site's GSAP 3.15 and Lenis), no CDN tags; Osmo's CustomEase "osmo" default isn't needed, the cross-fade sets its own eases. In Webflow: the Barba attributes on G | Page W and G | Main W, and nothing on IX3 (no re-init after a swap).
- 2026-10-29 · Footer reveal with parallax (asked for): the page covers the
  footer and slides off it; the footer's content drifts into place. Only
  while the footer fits the window (at 390 × 844 and 1024 × 768 it doesn't,
  and stays a normal footer).

- 2026-10-29 · The current live site moves onto wf-template now, code and
  interactions (asked for; reverses "nothing is ported" for the live site
  only, the redesign is unchanged). Parity: nothing a visitor sees changes.
  Separate bundle `src/live/` → `dist/live/` (loader `BUNDLE = "live/"`);
  ported modules in `src/modules/legacy/`. C11 global styles move verbatim
  as `override-webflow` (approved). Webflow batches W1–W5 (plan in
  CODE-MIGRATION.md), each on the user's go-ahead and "publish".
- 2026-10-29 · Homepage built in the prototype from Figma 02 · Homepage.
  Choices made where Figma is silent or uneven: services is Webflow's own
  Tabs element (no custom module in the repo); Figma's section rhythm
  (69/59 on services and overview, 64 on locations) is Is Compact (64);
  How it works
  keeps the wrapper gap 48 (Figma 64); the logo strips run as a CSS
  marquee (Figma shows a still strip with faded edges); case studies are a
  carousel with Figma's arrows (vertical wheel over it scrolls the page:
  the track is `overflow-y: hidden`, see GOTCHAS); FAQs open and close, all
  closed at first (review); "Learn more" in the overview opens more text (chevron down in
  Figma, like the live site's expander); below 767 the hero overlay is
  stronger so the copy stays readable over the photo.
- 2026-10-29 · The whole 2026 site is built in the prototype first; no 2026 work goes into Webflow until every page is done locally (user). The live-site migration (W1–W5) is separate and unaffected.
- 2026-10-30 · Exception (user): the 2026 **variables** go into this Webflow site now, from `prototype/webflow-snapshot/variables.json` (8 collections, 250 variables; Typography Role gets breakpoint auto-modes). They change nothing on the live pages: no CSS name is shared with the live site's 13 variables, its global styles or the live bundle (checked). This leans the open "where the 2026 system is built" decision towards this site. Not yet in: P2 (approved type changes, `proposed.css`), Layout's breakpoint modes on the Body tag style, the classes. Same day: creating Typography Role's breakpoint auto-modes through the API left three entries on the Body tag style (Tablet, Mobile L, Mobile) that neither the API nor the Designer can change or remove (GOTCHAS 2026-10-30). The user then deleted Typography Role and Typography Styles; the Body entries remain, orphaned. Both rebuilt the same day from the snapshot (100 + 5 variables, Styles' 95 mode values, read back with 0 mismatches), with **no breakpoint links**: Typography Role's Tablet/Mobile Landscape/Mobile modes are manual, like Layout's, until Webflow support clears Body; then link them in the Designer, never through the API.
- 2026-10-29 · Homepage review (user): **P1** headings navy, **P2**
  smaller type below 991 (values in `proposed.css`) and **P3** hero bottom
  padding 80 approved. "Learn more" in the overview stays as built (opens
  a second paragraph; its text is still a stand-in). Eyebrow chips and
  small type keep the system values (Chip 13 medium, overview stats
  14/11 px, services card radius 16): **for the designer**, Figma's light
  eyebrows (Caption 13 regular), stats (13.7/9.4) and services card radius
  (20.6) follow the system. Blog at tablet (768–991) shows two posts.

- 2026-10-30 · The 2026 nav goes into this Webflow site now, sandboxed (user: "This site, prefixed"; a new site was recommended). Only on `/design/*` pages, never on live pages. Class names that already exist on the live site get an `N26 | ` prefix (G | Nav W → N26 | Nav W, Button, Icon, Nav Drop Link; later Section, S Wrapper, D6, Icon Color as they are needed), renamed back at launch; the other 2026 classes keep their names. No 2026 tag styles (they would restyle all live pages): the design pages' content sits in a wrapper with N26 | Body (2026 body type and colours; 16px, as the prototype renders). The nav module and its repo CSS ship in the live bundle (`src/modules/nav.ts`, `nav.css`, `src/live/design-pages.css`), inert without `[data-nav]`. Component variants are combos for now (Icon · 12/14/20 → N26 | Icon Is Size 12/14/20; Button Color · Light → Is Light; Button Size · Icon Lead → Is Icon Lead). Icons come from the live bundle's Phosphor (regular, bold, fill); no CDN, no icon Embed. "Body Fuild" (`.body-fuild`, on 36 live pages: font-size 1em of the fluid root, line-height 1.56em, colour black) stays: deleting it changes those pages. The `/design/*` pages reach the live domain with the next live publish (noindex).
- 2026-10-30 · Mega menus match the live nav (user: "match live; pages that don't exist yet disabled with a soon badge"): Resources = Blog & Insights, Case Studies (no link, greyed: N26 | Nav Drop Link Is Disabled, `aria-disabled`, Badge "Soon"), FAQs; Auctions & Liquidations dropped. Services CTA phone = live's 647-496-6362 (Figma 647-317-0860). The Service Areas stats card links to the Google reviews (new tab), as live. Service Areas list in the CMS default order, as live. Any later menu item whose page doesn't exist yet gets the same disabled + Soon treatment.
- 2026-10-30 · Services menu category headings are links (user; on live they are plain text): each Nav Mega Head in C | Mega Services is a Link Block to `/our-services`, the Services overview (no category pages exist, and `/our-services` has no per-category sections to anchor to). Hover: the tint deepens to Navy Tint/Navy 12; focus ring as the menu links. The prototype's `partials/mega-services.html` has the links; its snapshot doesn't have the hover yet.
- 2026-10-30 · Nav bar phone button, as on live (user): `Nav Actions` holds a phone button (Button Color default, Button Size Is Icon Lead, Icon Circle Is Button, Phosphor fill phone; tel +1 647-496-6362, `aria-label` "Call 647-496-6362") and Get a Quote. Below 1280 (menu) a full-width column with the number shown; from 1280 the bar shows it as a round icon button (`Nav Phone Text` hidden, Button Size Is Icon Lead Is Icon Only): with the number the bar overflowed at 1280 and 1440 (links wrapped to two lines); icon-only it fits on one line (gaps 10px at 1280, 60px at 1440). `N26 | Button` Is Bar Phone holds its display. On webflow.io and live, CallRail (GTM) swaps the shown number for tracking. Mega menu links keep 1.6em on the right at rest (N26 | Nav Drop Link padding-right; hover 0.8 / 0.8 unchanged), so the text column is the same width at rest and on hover: no name re-wraps on hover (checked: 60 links, 0 re-wraps at 1440) (user). The prototype (`partials/nav.html`, snapshot) doesn't have either change yet.

## Open decisions

| Item | Now | Options |
| --- | --- | --- |
| Where the 2026 system is built in Webflow | decided once the whole site is prototyped locally (user, 2026-10-29) | a new Webflow site (recommended: the template's site-wide tag styles, body type modes and scaling would restyle the 279 live pages, and a live-site publish is site-wide; CMS, domain and integrations move at launch), or the existing site with prefixed classes and the site-wide styles switched on launch day. Only 8 prototype class names exist on the live site (Section, S Wrapper, Button, Icon, D6, Nav Drop Link, Is Active, Icon Color) |
| Tablet and mobile designs | none in Figma | designer adds frames; until then type and layout keep the starter's smaller-breakpoint values |
| H1 style | Figma has none; H1 = Display (60) | designer picks an H1 style |
| Which pages 01 · Service Page is for | unknown | the 17 `/services/*` pages, `/offers`, or both |
| Pages without a design | `/our-services`, `/auctions`, auction item, blog post, `/offers`, privacy, thank you, 404 | design them, or build them from the system without a frame |
| Dark theme roles | proposed (navy 900 page, white text and accent, yellow link hover); Figma shows only "on dark" samples | designer confirms |
| Icon in the location tag | 13.1px: Icon sizes are named at 16px text and the tag's text is 15px (Figma: 14) | accept, or a one-off size |
| Custom form controls | date picker, checkbox, radio, upload and error state designed from the system | designer reviews them; Figma adds them to 09 · Design System |
| Mega menus | not in Figma: full-width, after the live site's (Services categories + CTA band; areas + stats card; resources + latest posts), in the 2026 system; edited on `/design/mega-menus` | designer reviews; the live site is reference and can change |
| Nav open state | not in Figma: the bar turns white with a faint line and a navy logo (`mgt-logo-navy.svg`, the wordmark recoloured), dark overlay behind | designer confirms |
| Nav below 1280 | not in Figma: white full-height menu, each mega menu slides in over it with Back (small desktops, tablets, phones) | designer designs it (or approves) |
| Resources menu | decided 2026-10-30: as live (Blog & Insights, FAQs) + Case Studies (Soon) + the two newest posts | — |
| Nav and footer details off by a hair | Figma nav button padding 25.7 (system 24); link text #F1F6F9 and bar line 12% (built: white, 16% like the footer dividers); caret circle 6% (built: 8%) | accept, or make Figma match the system |
| Fluid scaling frame | template default 1680 (1440–1680); design frame is 1440 | set ideal 1440 and the range |
| Case studies | new: template, listing, three section options | CMS fields and which option |
| Homepage: services panes 2–4 | Figma shows Office Furniture only; the other three use the live service pages' titles and descriptions, intros written as stand-ins, photos reused | designer and client supply copy and photos |
| Homepage: case-study cards | Figma's SNC-Lavalin stand-in four times; arrows need more than three to move on desktop | real case studies (collection) |
| Homepage: FAQ 9 | "Which locations do you serve?" has no answer in Figma or on the live site; a stand-in is built from the locations list | client confirms |

## Stand-in assets and placeholders

- Homepage (`prototype/public/assets/home/`): photos exported from Figma
  (hero, services, overview, before/after, case study, blog), WebP. The
  marquee's 13 client logos are the live site's (`logos/`); the Trusted
  Box logos (Toys R Us, Rogers, TELUS) are Figma's. Owner: designer.
- Homepage copy stand-ins: services panes 2–4, the "Learn more" paragraph,
  FAQ 9, the case-study cards. Owner: client.
- Homepage links to pages not built yet: `/case-studies`,
  `/case-studies/snc-lavalin`, `/blog/<slug>` (slugs guessed from the
  titles), `/services/*`, `/service-areas/*`.
