// Capture the live site exactly as visitors get it, with GET requests only,
// so the local copy and the code migration start from what is published.
//   pnpm capture:live [--base URL] [--out DIR] [--extra /a,/b] [--concurrency N]
// Writes DIR (default ../capture/live-<date>, next to the repo, not in git).
// Never edit it: it is the reference every local change is compared with.
//   pages/<path>/index.html   every sitemap URL plus --extra, byte for byte
//   assets/<host>/<path>      every stylesheet and script the pages load
//                             (images and fonts stay on the CDN)
//   code/embeds.json          every Embed (.w-embed) by hash, with its pages
//   code/inline.json          every inline <script> and <style>, with its pages
//   interactions/ix2.json     the Webflow.require("ix2").init({...}) data
//   interactions/ix3.json     the ix3 register(interactions, timelines) data
//   interactions/targets.json data-w-id elements (IX2 targets) per page
//   manifest.json             date, pages (status, title, sha256), assets
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const today = new Date().toISOString().slice(0, 10);
const base = opt('base', 'https://www.michaelsglobaltrading.com').replace(/\/$/, '');
const out = path.resolve(opt('out', path.join(root, '..', 'capture', `live-${today}`)));
const extra = opt('extra', '/thank-you').split(',').filter(Boolean);
const concurrency = Number(opt('concurrency', 6));

if (fs.existsSync(out) && fs.readdirSync(out).length) {
  console.error(`${out} already exists. A capture is never overwritten: pass --out for a new one.`);
  process.exit(1);
}

const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const write = (rel, data) => {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
};
const pool = async (items, fn) => {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }));
  return results;
};
const get = async (url) => {
  const res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'wf-mgt capture-live (read-only)' } });
  return { status: res.status, finalUrl: res.url, body: Buffer.from(await res.arrayBuffer()) };
};

// From an index, the end of the bracketed literal that starts there, skipping
// strings and template literals. Good enough for Webflow's minified output.
function matchBracket(s, start) {
  const open = s[start], close = { '{': '}', '[': ']', '(': ')' }[open];
  let depth = 0;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < s.length && s[i] !== c; i++) if (s[i] === '\\') i++;
      continue;
    }
    if (c === open) depth++;
    else if (c === close && --depth === 0) return i;
  }
  return -1;
}
// The literal is data in the site's own published file; evaluated in an empty
// context with a timeout, never with access to this process.
const literal = (src) => vm.runInNewContext(`(${src})`, {}, { timeout: 2000 });

// Each <div ... w-embed ...> with its balanced closing tag.
function embeds(html) {
  const found = [];
  const re = /<div\b[^>]*class="[^"]*\bw-embed\b[^"]*"[^>]*>/g;
  for (let m; (m = re.exec(html)); ) {
    let depth = 0, i = m.index;
    const tag = /<\/?div\b/g;
    tag.lastIndex = i;
    for (let t; (t = tag.exec(html)); ) {
      depth += t[0] === '<div' ? 1 : -1;
      if (depth === 0) { i = html.indexOf('>', t.index) + 1; break; }
    }
    found.push(html.slice(m.index, i));
  }
  return found;
}

// 1. Pages: the sitemap plus extra paths.
const sitemap = (await get(`${base}/sitemap.xml`)).body.toString();
const urls = [...new Set([
  ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()),
  ...extra.map((p) => base + p),
])];
console.log(`${urls.length} pages from ${base}`);

const pageOf = (url) => new URL(url).pathname.replace(/\/$/, '') || '/';
const assetUrls = new Map(); // url -> Set(page)
const embedMap = new Map();
const inlineMap = new Map();
const targets = {};
const pages = await pool(urls, async (url) => {
  const p = pageOf(url);
  const { status, finalUrl, body } = await get(url);
  const html = body.toString();
  write(path.join('pages', p === '/' ? '' : p, 'index.html'), body);
  const add = (map, code, kind) => {
    const h = sha(code).slice(0, 12);
    if (!map.has(h)) map.set(h, { hash: h, kind, code, pages: [] });
    map.get(h).pages.push(p);
  };
  for (const m of html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)) {
    const href = m[0].match(/href="([^"]+)"/)?.[1];
    if (href) (assetUrls.get(href) ?? assetUrls.set(href, new Set()).get(href)).add(p);
  }
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) {
    (assetUrls.get(m[1]) ?? assetUrls.set(m[1], new Set()).get(m[1])).add(p);
  }
  for (const e of embeds(html)) add(embedMap, e, 'embed');
  for (const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) if (m[1].trim()) add(inlineMap, m[0], 'script');
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) if (m[1].trim()) add(inlineMap, m[0], 'style');
  const ids = [...html.matchAll(/data-w-id="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length) targets[p] = ids;
  return {
    path: p, url, status, ...(finalUrl !== url && { finalUrl }),
    title: html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null,
    wfPage: html.match(/data-wf-page="([^"]+)"/)?.[1] ?? null,
    bytes: body.length, sha256: sha(body),
  };
});
const failed = pages.filter((p) => p.status !== 200);

// 2. Assets: every stylesheet and script, saved under its host and path,
// and the chunks a script imports by relative path at runtime (Finsweet
// Attributes v2 loads its features that way), followed until none are new.
const fetchAsset = async (raw, pagesOf) => {
  const url = new URL(raw, base);
  const file = path.join('assets', url.host, decodeURIComponent(url.pathname));
  try {
    const { status, body } = await get(url.href);
    if (status === 200) write(file, body);
    return { url: url.href, file: status === 200 ? file : null, status, bytes: body.length, sha256: sha(body), pages: pagesOf, body };
  } catch (e) {
    return { url: url.href, file: null, status: 0, error: String(e.message), pages: pagesOf };
  }
};
const relativeImports = (js) => [...js.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+\.m?js)["']/g)].map((m) => m[1]);
let batch = await pool([...assetUrls.keys()], (raw) => fetchAsset(raw, [...assetUrls.get(raw)].sort()));
const assets = [];
const seenAssets = new Set(batch.map((a) => a.url));
while (batch.length) {
  assets.push(...batch);
  const next = [];
  for (const a of batch.filter((a) => a.body && a.url.endsWith('.js'))) {
    for (const rel of relativeImports(a.body.toString())) {
      const url = new URL(rel, a.url).href;
      if (!seenAssets.has(url)) { seenAssets.add(url); next.push({ url, pages: a.pages }); }
    }
  }
  batch = await pool(next, (n) => fetchAsset(n.url, n.pages));
}
for (const a of assets) delete a.body;

// 3. Interactions: IX2 and IX3 data, from whichever Webflow chunk holds them.
const ix = { ix2: null, ix3: null };
for (const a of assets.filter((a) => a.file && a.file.endsWith('.js'))) {
  const js = fs.readFileSync(path.join(out, a.file), 'utf8');
  const i2 = js.indexOf('Webflow.require("ix2").init(');
  if (i2 >= 0 && !ix.ix2) {
    const s = js.indexOf('{', i2);
    ix.ix2 = { source: a.url, data: literal(js.slice(s, matchBracket(js, s) + 1)) };
  }
  const i3 = js.indexOf('require("ix3")');
  const r3 = i3 >= 0 ? js.indexOf('.register(', i3) : -1;
  if (r3 >= 0 && !ix.ix3) {
    const s = js.indexOf('(', r3);
    const [interactions, timelines] = literal(`[${js.slice(s + 1, matchBracket(js, s))}]`);
    ix.ix3 = { source: a.url, interactions, timelines };
  }
}
write('interactions/ix2.json', JSON.stringify(ix.ix2, null, 2));
write('interactions/ix3.json', JSON.stringify(ix.ix3, null, 2));
write('interactions/targets.json', JSON.stringify(targets, null, 2));
write('code/embeds.json', JSON.stringify([...embedMap.values()], null, 2));
write('code/inline.json', JSON.stringify([...inlineMap.values()], null, 2));
write('manifest.json', JSON.stringify({ base, captured: new Date().toISOString(), pages, assets }, null, 2));

const ix2Events = ix.ix2 ? Object.keys(ix.ix2.data.events ?? {}).length : 0;
const ix2Lists = ix.ix2 ? Object.keys(ix.ix2.data.actionLists ?? {}).length : 0;
console.log(`pages: ${pages.length - failed.length} saved, ${failed.length} not 200${failed.length ? ': ' + failed.map((p) => `${p.path} (${p.status})`).join(', ') : ''}`);
console.log(`assets: ${assets.filter((a) => a.file).length} of ${assets.length} saved`);
console.log(`embeds: ${embedMap.size} distinct · inline scripts/styles: ${inlineMap.size} distinct`);
console.log(`IX2: ${ix2Events} events, ${ix2Lists} action lists · IX3: ${ix.ix3?.interactions.length ?? 0} interactions, ${ix.ix3?.timelines.length ?? 0} timelines`);
console.log(`→ ${out}`);
