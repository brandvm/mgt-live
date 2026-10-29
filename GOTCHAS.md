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
- Status: fixed (uncommitted)
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
