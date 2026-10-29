// Google Ads click id capture (CODE-MIGRATION C4), ported as-is from the
// live site's head code. On window load: a `?gclid=` in the URL (unless
// `?gclsrc=` names a non-Ads source) is stored in localStorage under
// `gclid` as {value, expiryDate} with a 90-day expiry, and the stored value
// is written into the form field #gclid_field (or #foobar) when one exists.
// Key, record format and field ids are unchanged so values stored by the
// old snippet keep working.
const GCLID_FORM_FIELDS = ['gclid_field', 'foobar']; // all possible gclid form field ids
const EXPIRY_PERIOD = 90 * 24 * 60 * 60 * 1000; // 90 days in ms

interface GclidRecord {
  value: string;
  expiryDate: number;
}

function getParam(p: string) {
  const match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getExpiryRecord(value: string): GclidRecord {
  return { value, expiryDate: new Date().getTime() + EXPIRY_PERIOD };
}

function addGclid() {
  const gclidParam = getParam('gclid');
  const gclsrcParam = getParam('gclsrc');
  const isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf('aw') !== -1;
  let gclidRecord: GclidRecord | null = null;
  let currGclidFormField: HTMLInputElement | undefined;

  // Last id that exists wins, as in the original.
  GCLID_FORM_FIELDS.forEach((field) => {
    const el = document.getElementById(field);
    if (el) currGclidFormField = el as HTMLInputElement;
  });

  if (gclidParam && isGclsrcValid) {
    gclidRecord = getExpiryRecord(gclidParam);
    localStorage.setItem('gclid', JSON.stringify(gclidRecord));
  }

  const gclid: GclidRecord | null = gclidRecord || JSON.parse(localStorage.getItem('gclid') as string);
  const isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;

  if (currGclidFormField && isGclidValid) {
    currGclidFormField.value = gclid!.value;
  }
}

// The original threw when storage is blocked or the stored value isn't
// JSON; here that is logged like any module failure instead of escaping
// from the load listener (nothing else changes).
function addGclidSafely() {
  try {
    addGclid();
  } catch (error) {
    console.error('[wfc] gclid failed', error);
  }
}

export function initGclid() {
  // The original listened for `load`; the bundle may arrive after it fired.
  if (document.readyState === 'complete') addGclidSafely();
  else window.addEventListener('load', addGclidSafely, { once: true });
}
