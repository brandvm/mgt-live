# Rollback point

Everything needed to put the site back as it was before the migration.
Read through the Webflow MCP on **2026-10-29** (nothing written). Refresh it
right before the first Webflow write; a rollback restores *that* state.

- Site: Michaels Global Trading `658c5919dffd45bc022c9153`, last published
  2026-10-29T17:10:55Z (custom domains 2026-10-13T19:29:30Z).
- Published HTML, CSS, JS, Embeds and interaction data: the capture
  `../capture/live-2026-10-29/` (outside git; `pnpm capture:live` makes a
  new one). Embeds verbatim: `code/embeds.json`; IX2/IX3: `interactions/`.
- Git tag on the commit matching live: none yet (no release installed).
- Webflow backup (Site settings › Backups): **[Person] make one, named with
  the date, before the first write.**

## Site head code

```html
<script src="https://platform.illow.io/banner.js?siteId=9e5c41df-d88b-4665-8d6d-dc221c978baa"></script>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                                                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-NKPQBTX');</script>
<!-- End Google Tag Manager -->

<!-- AHREFS for Asheem Shrestha --->
<meta name="ahrefs-site-verification" content="b811c9bc3997d8d4a4b7db2098b13327f586dab17857b1f0dff01cd406e1732b">

<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />

<script>

  function getParam(p) {
    var match = RegExp('[?&]' + p + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  function getExpiryRecord(value) {
    var expiryPeriod = 90 * 24 * 60 * 60 * 1000; // 90 day expiry in milliseconds

    var expiryDate = new Date().getTime() + expiryPeriod;
    return {
      value: value,
      expiryDate: expiryDate
    };
  }

  function addGclid() {
    var gclidParam = getParam('gclid');
    var gclidFormFields = ['gclid_field', 'foobar']; // all possible gclid form field ids here
    var gclidRecord = null;
    var currGclidFormField;

    var gclsrcParam = getParam('gclsrc');
    var isGclsrcValid = !gclsrcParam || gclsrcParam.indexOf('aw') !== -1;

    gclidFormFields.forEach(function (field) {
      if (document.getElementById(field)) {
        currGclidFormField = document.getElementById(field);
      }
    });

    if (gclidParam && isGclsrcValid) {
      gclidRecord = getExpiryRecord(gclidParam);
      localStorage.setItem('gclid', JSON.stringify(gclidRecord));
    }

    var gclid = gclidRecord || JSON.parse(localStorage.getItem('gclid'));
    var isGclidValid = gclid && new Date().getTime() < gclid.expiryDate;

    if (currGclidFormField && isGclidValid) {
      currGclidFormField.value = gclid.value;
    }
  }

  window.addEventListener('load', addGclid);

</script>

<style>
  .animated-item {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.5s, transform 0.5s;
  }

  .animated-item.animated {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes fadeInAndMoveDown {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

```

## Site footer code

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NKPQBTX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
<script src="https://weblocks.io/library.js"></script>
<script src="https://weblocks.io/script-66-529.js"></script>

<script>
  // Add the 'animated' class when the element is in view
  document.addEventListener("DOMContentLoaded", function() {
    var animatedItems = document.querySelectorAll('.animated-item');

    var observer = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, { threshold: 0.5 }); // Adjust the threshold as needed

    animatedItems.forEach(function(item) {
      observer.observe(item);
    });
  });
</script>
```

## Page code

Pages not listed have empty head and footer code (all static pages and
templates were read; the drafts Services, Style Guide and Infographics were
not).

### Home `65b96bae53fc6d4a10dbe215` — head

```html
<link href="https://unpkg.com/beerslider/dist/BeerSlider.css" rel="stylesheet" type="text/css" />
```

### Home — footer

```html
<script src="https://unpkg.com/beerslider/dist/BeerSlider.js" defer></script>

<script>
  // Add the 'animated' class when the element is in view
  document.addEventListener('DOMContentLoaded', function () {
    var animatedItems = document.querySelectorAll('.animated-item');
    var observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    animatedItems.forEach(function (item) { observer.observe(item); });
  });
</script>

<script>
  // Home hero background slideshow
  (function () {
    var c = document.querySelector('.s-home-heroo .s-bg-w');
    if (!c) return;
    var s = document.createElement('style');
    s.textContent = '.s-home-heroo .s-bg-w img.hero-slide{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0;animation:hs 12s infinite ease-in-out}.s-home-heroo .s-bg-w img.hero-slide:nth-of-type(1){animation-delay:-1s}.s-home-heroo .s-bg-w img.hero-slide:nth-of-type(2){animation-delay:3s}.s-home-heroo .s-bg-w img.hero-slide:nth-of-type(3){animation-delay:7s}@keyframes hs{0%{opacity:0}8.33%{opacity:1}33.33%{opacity:1}41.67%{opacity:0}100%{opacity:0}}';
    document.head.appendChild(s);
    var o = c.querySelector('img');
    if (o) {
      o.classList.add('hero-slide');
      o.removeAttribute('loading');
    }
    var b = 'https://cdn.prod.website-files.com/658c5919dffd45bc022c9153/';
    var u = [
      ['6aa428dbc6e72160fd27bbe1_MGT%20Image%202.webp', 'Commercial liquidation hero 2'],
      ['6aa428dbf2db72e27959a79c_MGT%20Image%201.webp', 'Commercial liquidation hero 3'],
    ];
    var f = c.querySelector('.s-bg-fader');
    u.forEach(function (p) {
      var m = document.createElement('img');
      m.className = 'hero-slide';
      m.src = b + p[0];
      m.alt = p[1];
      c.insertBefore(m, f);
    });
  })();
</script>
```

### Blogs `65b96bae53fc6d4a10dbe275` — head

```html
<!-- Finsweet Attributes -->
<script async type="module"
src="https://cdn.jsdelivr.net/npm/@finsweet/attributes@2/attributes.js"
fs-list
></script>

<!-- [Attributes by Finsweet] CMS Filter -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js"></script>

<!-- [Attributes by Finsweet] CMS Sort -->
<script async src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmssort@1/cmssort.js"></script>
```

### Blogs Template `65b96bae53fc6d4a10dbe27e` — head

```html
<link rel="canonical" href="https://www.michaelsglobaltrading.com/blog/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">
```

### Auctions Template `65b96bae53fc6d4a10dbe27d` — head

```html
<link rel="canonical" href="https://www.michaelsglobaltrading.com/auctions/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">
```

### Service Areas Template `65b96bae53fc6d4a10dbe284` — head

```html
<link rel="canonical" href="https://www.michaelsglobaltrading.com/service-areas/{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">

<script>
  // Get the #Services-Area-Header element
  var servicesAreaHeader = document.getElementById("Services-Area-Header");

  // Create a new h1 element
  var combinedH1 = document.createElement("h1");

  // Iterate through existing h1 elements and append their text content to the new h1
  var h1Elements = servicesAreaHeader.getElementsByTagName("h1");
  for (var i = 0; i < h1Elements.length; i++) {
    combinedH1.appendChild(document.createTextNode(h1Elements[i].textContent));
  }

  // Replace #Services-Area-Header content with the new combined h1
  servicesAreaHeader.innerHTML = '';
  servicesAreaHeader.appendChild(combinedH1);
</script>
```

## Registered scripts applied to pages

All in the head (`header`), no attributes. The hosted files are in the
capture under `assets/cdn.prod.website-files.com/`.

| Page | Page ID | Script ID | Version |
| --- | --- | --- | --- |
| Home | `65b96bae53fc6d4a10dbe215` | `homefaqpageschema` | 1.0.0 |
| Thank You | `6661e84a8ed7311a8de018c4` | `noindexmetatag` | 1.0.0 |
| Office Furniture Liquidation | `6866f9023a92a2a6a427a744` | `oflfaqpageschema` | 1.0.0 |
| Office Furniture Decommissioning | `6867ebeed7853f03d621daba` | `decommfaqpageschema` | 1.0.0 |
| Office Furniture Removal | `6867ec100998861bc64b6db8` | `furnremovalfaqpageschema` | 1.0.0 |
| Warehouse Liquidation | `6867ec71bfd499a4c506422e` | `warehouseliqfaqpageschema` | 1.0.0 |
| Commercial Asset Liquidation | `6867ec990de795e3150c41fe` | `commassetfaqpageschema` | 1.0.0 |
| IT Equipment Liquidation | `6867eda602eacc1668a2fd05` | `itequipfaqpageschema` | 1.0.0 |
| IT Asset Disposition | `6867ee1137594543ad7e65cf` | `itadfaqpageschema` | 1.0.0 |
| Data Center Decommissioning | `6867ee1eb1f5dad728f4652a` | `datacenterfaqpageschema` | 1.0.0 |
| Office Furniture Donation | `6867eeaf3b589653d7a03574` | `donationfaqpageschema` | 1.0.0 |

Site-level registered scripts applied: none. Registered but not applied to
any page read: `orglocalbusinessschema` (1.0.0, 1.0.1, 1.0.2),
`mgtheroslideshow` (1.0.0, 1.0.1), `calfaqpageschema`, `itelfaqpageschema`,
`ofremfaqpageschema`.

## Embeds

40 distinct Embeds, verbatim with the pages each is on, in the capture's
`code/embeds.json`. Code Embeds (the rest are SVG icons): `.global-embed`
(Phosphor CSS, Brand Vision global styles), `.hubspot-embed` on
`/contact-us` and `/offers`, `.home-video-embed`, and the two
`.seciton-code` Embeds (service map styles and script).
