// The 2026 styles for the HubSpot form (repo-css: third-party). HubSpot
// renders the form inside a same-origin iframe, which the site's CSS and
// Webflow's variables don't reach, so hubspot-form.ts injects this sheet
// into it (only where the host has data-hubspot-style="2026"). Copied from
// the prototype's src/css/repo.css (HubSpot block) and its approved design;
// its --hs-* values are the 2026 variables' Base values, copied by hand: a
// variable changed in Webflow must be changed here too (GOTCHAS
// 2026-11-03). The @font-face is the Geist file uploaded in Webflow.
export const HUBSPOT_2026_CSS = `
@font-face { font-family: "Geist"; src: url("https://cdn.prod.website-files.com/658c5919dffd45bc022c9153/658c5fb0d3207b2ef997725e_GeistVariableVF.woff2") format("woff2"); font-weight: 100 900; font-style: normal; font-display: swap; }
html, body { margin: 0; background: transparent; }
.hs-form { font-feature-settings: "ss03" on, "ss08" on; }
.hs-form {
  --hs-font: "Geist", system-ui, sans-serif;
  --hs-ink: #00183d;          /* Neutral/Ink, Text/Primary */
  --hs-label: #34475e;        /* Neutral/Slate, Text/Label */
  --hs-grey: #617081;         /* Neutral/Grey, Text/Secondary, Form/Control Border */
  --hs-navy: #002e75;         /* Brand/Navy, Form/Border Focus */
  --hs-border: #e2e6ed;       /* Neutral/Border, Border/Subtle */
  --hs-field: #f8fafc;        /* Neutral/Field, Form/Background */
  --hs-tint: #ebf0fa;         /* Neutral/Tint, Background/Tint */
  --hs-surface: #f1f6f9;      /* Neutral/Surface */
  --hs-ring: #002e751f;       /* Navy Tint/Navy 12, Form/Focus Ring */
  --hs-focus: #4d8dff;        /* State/Focus */
  --hs-error: #c62828;        /* Status/Error */
  --hs-yellow: #ffbe00;       /* Brand/Yellow, Button/Background */
  --hs-yellow-hover: #f2b200; /* State/Yellow Hover */
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5em 1em;
  margin: 0;
  /* Room for the 3px focus rings: the iframe's edge clips anything past it.
     The host (Hubspot Form) has a -0.25em margin, so nothing moves. */
  padding: 0.25em;
  color: var(--hs-ink);
  font-family: var(--hs-font);
  font-size: 1em;
  line-height: 1.5;
}
.hs-form *,
.hs-form *::before,
.hs-form *::after { box-sizing: border-box; }
/* HubSpot's theme sets Arial through selectors that carry a per-load
   instance class (.hs-form-<id>_<instance> label…), which can't be
   targeted; the 2026 font wins with !important, inside this block only. */
.hs-form,
.hs-form * { font-family: var(--hs-font) !important; }
/* Every field full width, but name and company, email and phone in pairs. */
.hs-form > * { grid-column: 1 / -1; }
.hs-form > .hs_firstname,
.hs-form > .hs_company,
.hs-form > .hs_email,
.hs-form > .hs_phone { grid-column: auto; }
.hs-form .hs-form-field { display: flex; flex-direction: column; gap: 0.5em; margin: 0; }
.hs-form .hs-form-field > label {
  color: var(--hs-label);
  font-size: 0.875em;
  font-weight: 600;
  line-height: 1.28;
}
.hs-form .hs-form-required { margin-left: 0.125em; color: var(--hs-error); }
.hs-form .hs-field-desc { margin: -0.25em 0 0; padding: 0; color: var(--hs-grey); font-size: 0.8125em; line-height: 1.4; }
.hs-form .input { margin: 0; }

/* Text, email, phone and textarea: Form Input. */
.hs-form .hs-input:not([type="radio"], [type="checkbox"], [type="file"], [type="hidden"]) {
  display: block;
  width: 100%;
  height: 3em;
  margin: 0;
  padding: 0 1em;
  border: 1px solid var(--hs-border);
  border-radius: 0.375em;
  background-color: var(--hs-field);
  color: var(--hs-ink);
  font: inherit;
  font-size: 1em;
  appearance: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.hs-form textarea.hs-input { height: auto; min-height: 6em; padding-top: 0.75em; padding-bottom: 0.75em; resize: vertical; }
.hs-form .hs-input:not([type="radio"], [type="checkbox"], [type="file"]):focus {
  border-color: var(--hs-navy);
  box-shadow: 0 0 0 3px var(--hs-ring);
  outline: none;
}
.hs-form .hs-input.invalid.error:not([type="radio"], [type="checkbox"]) { border-color: var(--hs-error); }
.hs-form .hs-input:-webkit-autofill {
  -webkit-box-shadow: inset 0 0 0 100em var(--hs-field);
  -webkit-text-fill-color: var(--hs-ink);
  caret-color: var(--hs-ink);
}

/* Radio lists: Choice Group in two columns (one below 479), Radio. */
.hs-form .inputs-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75em 1.5em; margin: 0.25em 0 0; padding: 0; list-style: none; }
.hs-form .inputs-list > li { margin: 0; padding: 0; }
.hs-form .hs-form-radio-display { display: flex; align-items: center; gap: 0.625em; margin: 0; color: var(--hs-ink); font-weight: 400; cursor: pointer; }
.hs-form input[type="radio"] {
  flex-shrink: 0;
  width: 1.25em;
  height: 1.25em;
  margin: 0;
  border: 1px solid var(--hs-grey);
  border-radius: 999em;
  background-color: var(--hs-field);
  appearance: none;
  cursor: pointer;
  transition: border-width 150ms ease, border-color 150ms ease;
}
.hs-form input[type="radio"]:checked { border-width: 0.375em; border-color: var(--hs-navy); background-color: #fff; }
.hs-form input[type="radio"]:focus-visible { box-shadow: 0 0 0 3px var(--hs-ring); outline: none; }
.hs-form .hs-form-radio-display:hover input[type="radio"]:not(:checked) { border-color: var(--hs-navy); }
.hs-form .hs-form-field:has(.hs-error-msgs) input[type="radio"]:not(:checked) { border-color: var(--hs-error); }

/* File: the native input drawn as the File Upload drop area (files can be
   dropped on it); its button as a light pill. */
.hs-form input[type="file"] {
  width: 100%;
  height: auto; /* HubSpot's theme sets one height on every .hs-input */
  max-width: none;
  padding: 1.5em;
  border: 1px dashed var(--hs-border);
  border-radius: 0.75em;
  background-color: var(--hs-field);
  color: var(--hs-grey);
  font: inherit;
  font-size: 0.9375em;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}
.hs-form input[type="file"]:hover { border-color: var(--hs-navy); background-color: var(--hs-tint); }
.hs-form input[type="file"]:focus-visible { border-color: var(--hs-navy); box-shadow: 0 0 0 3px var(--hs-ring); outline: none; }
.hs-form input[type="file"]::file-selector-button {
  margin-right: 1em;
  height: 2.5em;
  padding: 0 1.25em;
  border: 1px solid var(--hs-navy);
  border-radius: 999em;
  background-color: #fff;
  color: var(--hs-navy);
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease;
}
.hs-form input[type="file"]::file-selector-button:hover { background-color: var(--hs-tint); }

/* Errors: Form Error under the field; HubSpot's rollup above the button. */
/* HubSpot gives the error list the radio list's class (inputs-list) too. */
.hs-form .hs-error-msgs { display: block; margin: 0; padding: 0; list-style: none; }
.hs-form .hs-error-msgs label,
.hs-form .hs_error_rollup label { margin: 0; color: var(--hs-error); font-size: 0.8125em; font-weight: 400; }
.hs-form .hs_error_rollup .hs-error-msgs label { font-size: 0.875em; }

/* Submit: Button (primary, yellow) Is Full. */
.hs-form .hs_submit .actions { margin: 0; padding: 0; }
.hs-form .hs-button {
  display: block;
  width: 100%;
  height: 2.75em;
  margin: 0;
  padding: 0 1.5em;
  border: 0;
  border-radius: 999em;
  background-color: var(--hs-yellow);
  color: var(--hs-navy);
  font: inherit;
  font-size: 1em;
  font-weight: 500;
  line-height: 1.28;
  appearance: none;
  cursor: pointer;
  transition: background-color 200ms ease;
}
/* HubSpot's theme restyles the button on hover with a per-load instance
   selector (.hs-form-<id>_<instance> .hs-button:hover:not(.inactive):
   orange, white, 12px), which beats .hs-form .hs-button:hover; the 2026
   button keeps its colours and type in every state with !important. */
.hs-form .hs-button,
.hs-form .hs-button:hover,
.hs-form .hs-button:focus,
.hs-form .hs-button:active {
  border: 0 !important;
  background-color: var(--hs-yellow) !important;
  color: var(--hs-navy) !important;
  font-size: 1em !important;
  line-height: 1.28 !important;
}
.hs-form .hs-button:hover { background-color: var(--hs-yellow-hover) !important; }
.hs-form .hs-button:active { box-shadow: inset 0 0 0 100em rgba(0, 0, 0, 0.16); }
.hs-form .hs-button:focus-visible { outline: 0.1875em solid var(--hs-focus); outline-offset: 0; }

@media (max-width: 767px) {
  .hs-form > .hs_firstname,
  .hs-form > .hs_company,
  .hs-form > .hs_email,
  .hs-form > .hs_phone { grid-column: 1 / -1; }
}
@media (max-width: 479px) {
  .hs-form .inputs-list { grid-template-columns: minmax(0, 1fr); }
}

/* HubSpot's thank-you message, which replaces the form after a submit (when
   the form shows a message rather than redirecting to /thank-you). */
.submitted-message {
  padding: 2em;
  border: 1px solid #e2e6ed;
  border-radius: 0.75em;
  background-color: #f1f6f9;
  color: #00183d;
  font-family: "Geist", system-ui, sans-serif;
  text-align: center;
}
`;
