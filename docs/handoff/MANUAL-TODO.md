# Manual Designer steps

Everything the Webflow MCP can't do, for a person to do in the Designer.
Claude adds a row the moment it hits a limit, with *why* the API can't;
the person marks it done; Claude then reads the result back (or checks it on
the canvas when the API can't read it) and says so.

Common reasons, so they don't need re-explaining (see the skill's
`lessons/mcp.md`):
- a value mixing a variable with `calc()`, a gradient or a shadow;
- conditional visibility on a CMS field; a list sourced from a
  multi-reference or multi-image field; "exclude current item";
- a link to the current CMS item, in a list or a component prop;
- tag styles that have never been set; reserved class names;
- placeholders, slot names, variant props exposed from nested instances.

How to enter a value with variables: select the class, switch to the
breakpoint, type `calc(` in the field and insert variables with the
variable picker. Gradients: Backgrounds → gradient, pick each stop from the
variables.

Letters run A, B, C… then AA, AB… and are never reused, so a letter
mentioned in GOTCHAS or a commit stays unambiguous. The next free letter is
also kept in `REVIEW.md` once the review phase starts.

Rows that change something visible on a page also get a marker there, so
the step is found on the canvas and nobody mistakes the unfinished state
for the design: a small Caption next to the element (on the style guide,
next to its specimen) with the attribute `data-manual-todo="<letter>"` and
the text "Manual step <letter>: <what>". When the row is done, Claude
removes the marker in the same batch that ticks the row. Before the build
handoff and before launch, no `data-manual-todo` may be left on any
published page (search the published HTML for it).

Categories to expect on every build. Go through them at the start and
again at each gate, so the steps are found early and not at the end:

1. **Values with variables in a calc, gradient or shadow** (negative
   section padding, nav height + padding, gradient stops).
2. **Reserved class names** (Label, Form) and **tag styles** never set
   before (All H1–H6 Headings, All Paragraphs, All Links): one property
   set by hand, then the API can do the rest.
3. **CMS bindings:** lists from a multi-reference or multi-image field,
   "exclude current item", links to the current item, conditional
   visibility, decimal number formats, date bindings.
4. **Component wiring:** slots made and named, variant props exposed from
   a nested instance, variant styles on an element with a combo class,
   conditional classes (typed text: check the published class list).
5. **Forms:** field names (type a value that differs from the one shown),
   placeholders, the notification address, the success and error states.
6. **Page settings:** sitemap and search exclusion, the 404 and password
   pages (the API can't reach utility pages), Open Graph images for CMS
   templates.
7. **Site settings:** fonts uploaded, head and footer code pasted, the
   staging password.

| ID | Where (page › element or class) | Breakpoint | Set | Why the API can't | Done |
| --- | --- | --- | --- | --- | --- |
| A | All pages › Body (tag style) › Variable modes › Layout | Tablet, Mobile Landscape, Mobile | Layout = Tablet at Tablet, Mobile Landscape at Mobile Landscape, Mobile at Mobile (Typography Role is already automatic there) | `set_style_variable_mode` on `body` at a breakpoint fails with "[Conflict] … style block store" (2026-10-30), and breakpoint modes don't read back through the API. Done 2026-10-30 after the backup restore: the user linked Typography Role and Layout to Tablet / Mobile (L) / Mobile in the Designer (auto-modes); read back on Body at medium/small/tiny | ☑ |
| B | Component C \| Mega Areas › Collection List (Service Areas) | all | Bind Nav Drop Text to Name; the item's N26 \| Nav Drop Link to Current Service Area; order: Curated items in the prototype's order (Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville, Burlington, Ottawa, Montreal, United States), or Sort Name A–Z | Inside a component definition the API answers "Element is not inside a CMS context" for every field binding, and a curated-items write conflicts ("[Conflict] … component map"; the list was put back to dynamic). Source is set through the API  Done 2026-10-30 by the user (fields bound); checked on staging: 10 areas, same pages and order as the live nav (CMS default order, as live) | ☑ |
| C | Component C \| Mega Services › the four Collection Lists (Sub-Services) | all | Each list: Filter Category = its column (Office Furniture / Warehouse & Commercial / IT Equipment & Electronics / Sustainability & ESG) and Service Area = Toronto; Sort Order ascending; Show all (remove the temporary limits 5/4/4/4). Item: Nav Drop Text → Name, N26 \| Nav Drop Link → Link (field). Note: the CMS names differ from the prototype's labels ("Landfill Diversion Services", "E-Waste Recycling Services"…): edit the items or accept | Same as B: filters and bindings can't be written inside a component (lessons/mcp.md 2026-10-14)  Update 2026-10-30: Name and Link bound by the user (destinations match live); filters and sort still missing (read back empty; every column shows the first items of Sub-Services). The API refuses them inside a component ("No source connected") | ☐ |
| D | Component C \| Mega Resources › Collection List (Blogs) | all | Sort Blog Date descending (limit 2 is set). Item: Nav Post Image → Thumbnail, Badge → Category › Name, Nav Post Title → Name, Nav Post Excerpt → Description, the date caption → Blog Date (format "MMM D"), Nav Post link → Current Blog | Same as B  Update 2026-10-30: fields bound by the user; sort still missing. Live nav: Sort Published On, newest first (not Blog Date), limit 2 | ☐ |
| E | Classes N26 \| Nav Drop Link, Nav Mega Head, Nav Mega Head Icon (radius); Badge (padding L/R); Nav Mega Panel and Nav Menu (height at every breakpoint); Nav Mega (max-width at 1280); Nav Mega Panel (shadow colour at 1280) | as listed | Re-enter with the variable picker: radius `calc(Radius/6 * 16 / 15)` (Head: Radius/8); Badge padding `calc(Spacing/12 * 16 / 11)`; heights `calc(100dvh - Layout/Nav/Height)`; max-width `calc(80em + 2 * Layout/Nav/Padding H)`; shadow colour Navy Tint/Navy 12. They hold the same values as literals now (heights per breakpoint: 5.3125 / 4.5 / 4 / 4em) | A value mixing a variable with calc or a shadow is stored as a single binding by the API (lessons/mcp.md 2026-10-05), so literals were written | ☐ |
| F | Page Design › Mega Menus | — | Page settings › SEO: exclude from search results and the sitemap (noindex meta is in its head code) | Sitemap/search exclusion has no API on this plan (lessons/mcp.md 2026-10-13) | ☐ |
| G | Page Design › Logo Marquee (`/design/logo-marquee`) › Page settings › SEO | — | Exclude from search results and the sitemap (the noindex meta is already in its head code) | Sitemap/search exclusion has no API on this plan (same as step F for Mega Menus) <!-- bench: claude --> | ☐ |
| H | Classes Chip, Tag (`/design/contact-us`, later every 2026 page) | all | Re-enter with the variable picker: Chip padding `calc(Spacing/8 * 16 / 13)` top/bottom and `calc(Spacing/16 * 16 / 13)` left/right, shadow `inset 0 0 0 1px` Chip/Border; Tag gap `calc(Spacing/8 * 16 / 15)`, padding-right `calc(Spacing/16 * 16 / 15)`, shadow `inset 0 0 0 1px` Border/Subtle (hover: Text/Accent). They hold literals now (0.6154/1.2308em, 0.5333/1.0667em, #ebf0fa, #e2e6ed, #002e75), so the hero's glass chip on navy shows the light tint ring until this is done | A variable inside calc() or a shadow is stored as one binding by the API (lessons/mcp.md 2026-10-05, 2026-10-09) | ☐ |
| I | Combos N26 \| Section › Is Hero, and › Is Hero › Is Short | Desktop, Tablet, Mobile Landscape, Mobile | Padding top: Is Hero `calc(Layout/Nav/Height + Layout/Section/Padding V)`, Is Short `calc(Layout/Nav/Height + Spacing/64)`, on the base breakpoint only (then remove the per-breakpoint literals: Is Hero 12.1875 / 10.5 / 9 / 8em, Is Short 9.3125 / 8.5 / 8 / 8em) | Same as H | ☐ |
| J | Page Design › Contact Us 2026 (`/design/contact-us`) › Page settings › SEO | — | Exclude from search results and the sitemap (the noindex meta is in its head code) | Sitemap/search exclusion has no API on this plan (same as F, G) | ☐ |
