// HubSpot form (CODE-MIGRATION C14), replacing the `.hubspot-embed` Embeds
// on /contact-us and /offers. Loads HubSpot's v2 embed script once and
// creates each form inside its own target element, with the same region,
// portal and form id the live Embeds pass to hbspt.forms.create.
// Markup: <div data-hubspot-portal="44243593"
//              data-hubspot-form="<form id>"
//              data-hubspot-region="na1"></div>   (region optional, na1)
//   data-hubspot-style="2026" (optional)   the 2026 design (/design pages)
import { HUBSPOT_2026_CSS } from './hubspot-form-2026';

const SCRIPT_SRC = 'https://js.hsforms.net/forms/embed/v2.js';

interface HubSpotForms {
  forms: { create(options: Record<string, unknown>): void };
}

let scriptPromise: Promise<HubSpotForms> | null = null;

function loadHubSpot(): Promise<HubSpotForms> {
  const existing = (window as unknown as { hbspt?: HubSpotForms }).hbspt;
  if (existing?.forms) return Promise.resolve(existing);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.charset = 'utf-8';
      script.async = true;
      script.onload = () => {
        const hbspt = (window as unknown as { hbspt?: HubSpotForms }).hbspt;
        if (hbspt?.forms) resolve(hbspt);
        else reject(new Error('hbspt.forms missing after load'));
      };
      script.onerror = () => reject(new Error(`failed to load ${SCRIPT_SRC}`));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// HubSpot renders the form in a same-origin iframe (iframe.hs-form-iframe)
// or, for a raw HTML form, in the page; the sheet goes where the form is.
function injectStyles(el: HTMLElement) {
  const frame = el.querySelector<HTMLIFrameElement>('iframe.hs-form-iframe');
  const doc = frame?.contentDocument ?? document;
  if (doc.querySelector('style[data-hubspot-2026]')) return;
  const style = doc.createElement('style');
  style.setAttribute('data-hubspot-2026', '');
  style.textContent = HUBSPOT_2026_CSS;
  doc.head.appendChild(style);
}

let uid = 0;

export function initHubspotForm() {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hubspot-form][data-hubspot-portal]'),
  ).filter((el) => !el.dataset.hubspotReady);
  if (!targets.length) return;

  loadHubSpot()
    .then((hbspt) => {
      targets.forEach((el) => {
        el.dataset.hubspotReady = 'true';
        if (!el.id) el.id = `hubspot-form-${++uid}`;
        // data-hubspot-style="2026" (the 2026 /design pages): no HubSpot
        // theme CSS, and the 2026 sheet injected into the form's iframe
        // once it is ready. Without it the form renders as on live.
        const is2026 = el.dataset.hubspotStyle === '2026';
        hbspt.forms.create({
          region: el.dataset.hubspotRegion || 'na1',
          portalId: el.dataset.hubspotPortal,
          formId: el.dataset.hubspotForm,
          target: `#${el.id}`,
          ...(is2026 ? { css: '', onFormReady: () => injectStyles(el) } : {}),
        });
      });
    })
    .catch((error) => console.error('[wfc] hubspot-form', error));
}
