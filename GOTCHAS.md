# Gotchas

A running log of things that cost time on this project. Agents read it at
the start of every session and add to it when they hit something new (see
the Session protocol in `AGENTS.md`). Never delete an entry — update its
`Status` instead.

Lessons from earlier builds are in the skill, not here:
`.claude/skills/webflow-build/lessons/` (one file per area). Read the file
for the area you work in. Entries tagged `Scope: template-candidate` are
collected from client repos into those files.

## Entry format

```md
### YYYY-MM-DD · Short title
- Area: designer | css | loader | release | mcp | ci | js | perf
- Scope: project | template-candidate
- Symptom: what was observed
- Cause: why it happened
- Fix: what was done, or the workaround
- Status: open | fixed <sha> | upstreamed wf-template <sha>
- Found by: claude | codex | human
```

## This project

<!-- Add new entries here, newest first. -->

### 2026-10-29 · Figma sizes come out small on classes with their own type size
- Area: css
- Scope: template-candidate
- Symptom: the style guide's inputs were 27.5px high instead of 40, and chips, badges and the location tag were smaller than in Figma, though every value was taken from it.
- Cause: em spacing is computed against the element's own font size (conventions §6). Spacing variables are em at 16px, so on a 12–15px class they shrink; and an input nested in its label took its 12px (0.75em) from the label's 11px.
- Fix: on those classes, variable-bound spacing is `calc(var(--x) * 16 / <font px>)` and plain Figma numbers are em at that size; label and control are siblings, as in a Webflow Form Field. Measure rendered px against Figma, not the CSS values.
- Status: fixed (prototype)
- Found by: claude

### 2026-10-29 · Style guide specimens can't show hover or focus
- Area: designer
- Scope: template-candidate
- Symptom: Figma's design system shows every button and field in Default, Hover, Focus and Disabled; the generated style guide could only show Default, since specimens are `inert` and nobody can hover them.
- Cause: the generator marks specimens inert and strips `data-*` from them, so a module can't find them by a data attribute.
- Fix: prototype module `src/modules/style-guide-states.ts`: an element with the Sg class `sg-state-hover`, `sg-state-focus` or `sg-state-focus-visible` gets the declarations of the real `:hover` / `:focus` rules copied onto it. The hook is a class, against the starter's data-* rule: a template change (keep `data-sg-state` in the generator) would remove that.
- Status: open (template)
- Found by: claude

### 2026-10-29 · A page capture misses scripts loaded at runtime
- Area: loader
- Scope: template-candidate
- Symptom: the local copy of `/blog` logged 12 failed requests for `@finsweet/attributes@2/dist/chunk-*.js`; every other page was clean.
- Cause: Finsweet Attributes v2 is an ES module that imports its features by relative path when they're needed, so they're in no `<script src>` the capture reads.
- Fix: `scripts/capture-live.mjs` follows relative `import`/`from` specifiers in every captured script until nothing new turns up (47 chunks on this site).
- Status: fixed (setup commit)
- Found by: claude

### 2026-10-29 · Library classes in new-classes.css fail the style guide check
- Area: css
- Scope: template-candidate
- Symptom: after adding Lenis's CSS at the end of `new-classes.css` (where the template puts rules the Designer can't express), `pnpm check:style-guide` failed: `lenis-stopped` and the combo `.lenis.lenis-stopped` "not on the style guide".
- Cause: the generator and the check read every class in `new-classes*.css` as a Webflow class to create; a library's own state classes are never Webflow classes.
- Fix: library rules live in the prototype's `src/css/repo.css` (linked after new-classes.css), which goes to the repo's `styles.css` as is. Template: give library CSS its own file, or let the generator skip `repo-css: third-party` blocks.
- Status: open (template)
- Found by: claude

### 2026-10-29 · Closing the mobile menu played its transitions one after another
- Area: js
- Scope: template-candidate
- Symptom: below 1280, closing the menu from inside a mega menu first slid back to the main list, then the panel went, then the bar faded from white to navy.
- Cause: each piece has its own transition (view slide 300ms, panel visibility 300ms, bar colour 250ms), meant for moving inside the open menu; closing the whole menu fires them all at once and they finish at different times. On phones the panel also kept intercepting taps while its visibility transition ran (a stale link opened).
- Fix: opening or closing the whole menu is one motion: the bar's colour eases while the menu and any open view fade together (Web Animations, 250ms), and the view is reset only after the fade, with no transitions (`.is-instant` on G | Nav W, repo CSS `js-state`). Nav Menu Is Open and Nav Mega Panel are pinned to the Base colour mode, so they stay white while the bar turns navy (first try made the switch instant: no animation at all, rejected in review). The cleanup also runs on a timer: animations don't advance in a background tab. Nav Mega Panel is `pointer-events: none` unless Is Open, and `overflow: clip` so focusing a link in a sliding view can't scroll it sideways.
- Status: fixed (prototype)
- Found by: claude

### 2026-10-29 · The template's base CSS would restyle the live site
- Area: css
- Scope: template-candidate
- Symptom: moving the live site's code onto the template, `src/styles.css` (already set up for the 2026 redesign: body-size scaling from 1440, margin resets, `img {display:block}`, `a {text-decoration:none}`) would have shipped to the live pages and changed how they look.
- Cause: the template has one bundle; a live-site migration and a redesign in the same repo need two stylesheets that never meet.
- Fix: a second entry, `src/live/` → `dist/live/index.js` + `dist/live/styles.css` (build.mjs), and `var BUNDLE = "live/"` in loader.html (also in 2a's href); the tests read BUNDLE like SITE. At the redesign's launch BUNDLE becomes "" and `src/live/` + `src/modules/legacy/` are deleted. Template: support a bundle folder in the loader.
- Status: fixed (W1 commit)
- Found by: claude

### 2026-10-29 · Live global styles in repo CSS (override-webflow, approved)
- Area: css
- Scope: project
- Symptom: the live site's "Brand Vision – Global Styles" Embed (C11) sets `:root` font-size and reads Webflow `--_colors---*` variables, both forbidden in repo CSS without approval.
- Cause: parity release: the rules move verbatim so nothing a visitor sees changes.
- Fix: approved by the user 2026-10-29. `src/live/global-styles.css`, tagged `override-webflow`, untouched. A renamed Webflow colour variable breaks these rules silently until they move to the Designer (later batches).
- Status: open
- Found by: claude

### 2026-10-29 · Breakpoint values in proposed.css did nothing on :root
- Area: css
- Scope: template-candidate
- Symptom: P2 (smaller Typography Role sizes below 991) was written as `:root { --_typography-role---size--h1: … }` in media queries; the variable changed on `:root` but the H1 stayed 60px at 390.
- Cause: Typography Role switches modes on the Body tag style (`variableModes` per breakpoint), so the generated `webflow.css` declares every role variable again on `body`, which beats anything inherited from `:root`. Each breakpoint's body rule also re-sets the roles a smaller breakpoint block leaves out.
- Fix: a proposed change to a breakpoint mode is set on `body`, with every changed role in every breakpoint block (`prototype/src/css/proposed.css` P2). Template: say so in the proposed.css header.
- Status: fixed (prototype)
- Found by: claude

### 2026-10-29 · A style guide component row that wraps a whole section squeezes the component
- Area: designer
- Scope: template-candidate
- Symptom: the Before After row on the style guide showed the section's copy and no photos.
- Cause: the `sg:start` block wrapped the whole Section, so the specimen was a two-column Split inside the narrow specimen frame; the copy took all the width and the flexible media column shrank to nothing.
- Fix: a `components` block wraps the component only; a block that needs the Section (its combos) is a `page-sections` row, shown at half size.
- Status: fixed (prototype)
- Found by: claude

### 2026-10-29 · A sideways carousel caught the page's vertical wheel under Lenis
- Area: js
- Scope: template-candidate
- Symptom: scrolling the page with the mouse over the case-study carousel hung there: the wheel went into the carousel instead of the page.
- Cause: Lenis runs with `allowNestedScroll: true` and hands the wheel to any element under the pointer that can scroll that way. The track had `overflow-x: auto`, which makes `overflow-y` compute to `auto` too; with fluid scaling its content can be a pixel taller than the box, so Lenis saw a vertically scrollable element.
- Fix: the track (and the Service Tabs Menu, which scrolls sideways below 991) is `overflow-x: auto` + `overflow-y: hidden`. Vertical wheel scrolls the page; horizontal wheel, swipe and the arrows move the carousel. No `data-lenis-prevent*` on it.
- Status: fixed (prototype)
- Found by: human

### 2026-10-29 · The Embed editor reformats pasted loader code
- Area: loader
- Scope: template-candidate
- Symptom: `pnpm wf:install` reported "Embed 2b differs from loader.html" right after a correct paste.
- Cause: the Designer's code editor (its Format action) rewrote the script: double quotes to single, a one-line function body split over three lines. Same behaviour, different text.
- Fix: compare the served 2b with the paste file ignoring quote style before re-pasting; the code is fine. Template: let install.mjs normalise quotes and whitespace inside scripts.
- Status: open (template)
- Found by: claude

### 2026-10-29 · Staging screenshots can't isolate a batch when live is older
- Area: release
- Scope: template-candidate
- Symptom: after W1, `wf:baseline compare` staging vs the live baselines showed 3–55 % pixel changes on every page.
- Cause: the live domain was last published Oct 13, webflow.io since then; staging carries those edits (new phone number, content) plus the batch, and scroll reveals, slideshow frames and lazy map tiles differ per capture.
- Fix: take staging baselines right before a batch, not only live ones; for W1, checked behaviour and computed sizes on live vs staging instead (identical).
- Status: open (template)
- Found by: claude

