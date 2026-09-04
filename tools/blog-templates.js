'use strict';
/**
 * HTML templates for the Encounters in Joy blog.
 *
 * Used by tools/build-blog.js. Everything here mirrors the look of the
 * hand-written pages (grief.html, why-no-insurance.html): same fonts,
 * Tailwind palette, nav, footer, crisis banner and sticky mobile bar.
 * All links are root-absolute (/donate.html, not donate.html) because
 * posts live one folder deep at /blog/<slug>/.
 */

const SITE = 'https://encountersinjoy.org';
const BLOG_TITLE = 'Encounters in Joy Blog';
const BLOG_DESCRIPTION =
  'Honest, faith-grounded reflections on grief, anxiety, marriage, and the ordinary hard days — written by the counselors at Encounters in Joy in Statham, GA.';
const DEFAULT_IMAGE = SITE + '/eij%20with%20words.png';
const DEFAULT_IMAGE_ALT = 'Encounters in Joy — Christian counseling in Statham, GA';

// Counselors who write for the blog. The author name in a post is matched
// loosely (case-insensitive, "Rev."/"Reverend" ignored) so a byline of
// "Reverend Jeff Langley" or "Jeff Langley" both get the photo and role.
// To add a new author, add an entry here AND to the options list in
// admin/config.yml.
const AUTHORS = [
  {
    match: ['jeff langley'],
    photo: '/Jeff.jpg',
    photoAlt: 'Reverend Jeff Langley',
    role: 'Founder · 35 years in ministry',
  },
  {
    match: ['stephanie langley'],
    photo: '/Stephanie.jpg',
    photoAlt: 'Stephanie Langley',
    role: 'Certified Christian Counselor',
  },
];

function authorInfo(name) {
  const key = String(name || '')
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\b(rev|reverend|bro|brother|dr|pastor)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return AUTHORS.find((a) => a.match.includes(key)) || null;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonLd(obj) {
  // "<" is escaped so a stray "</script>" inside content can't break out of the tag.
  return (
    '<script type="application/ld+json">\n' +
    JSON.stringify(obj, null, 2).replace(/</g, '\\u003c') +
    '\n</script>'
  );
}

const PHONE_ICON =
  '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>';

const ARROW_ICON =
  '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>';

const CHAT_ICON =
  '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>';

// ---------------------------------------------------------------------------
// Shared page chrome
// ---------------------------------------------------------------------------

function head({ title, description, url, image, imageAlt, ogType, structuredData }) {
  const ld = (structuredData || []).map(jsonLd).join('\n  ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Analytics (same IDs as index.html) -->
  <meta name="google-site-verification" content="3CxsK7BGQAyO_3JLDRCPuTdoiNPT_H8ZAXYUtT8I68g">
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GD5KC6RT8L"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GD5KC6RT8L', { anonymize_ip: true });
  </script>
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wwsuxhxz9l");
  </script>

  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(url)}">
  <link rel="alternate" type="application/rss+xml" title="${esc(BLOG_TITLE)}" href="${SITE}/blog/feed.xml">

  <meta property="og:type" content="${esc(ogType || 'website')}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(image || DEFAULT_IMAGE)}">
  <meta property="og:image:alt" content="${esc(imageAlt || DEFAULT_IMAGE_ALT)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:site_name" content="Encounters in Joy">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(image || DEFAULT_IMAGE)}">

  ${ld}

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            crimson: { 50: '#fdf3f1', 100: '#fadcd5', 200: '#f1ad9f', 300: '#e57f6c', 400: '#d65543', 500: '#d63725', 600: '#c42a20', 700: '#a72017', 800: '#8f2e24', 900: '#65100b' },
            gold:    { 50: '#fff8e1', 100: '#ffeeba', 200: '#ffe085', 300: '#ffd052', 400: '#ffcc33', 500: '#f2cc5a', 600: '#d8a013', 700: '#b58015', 800: '#8a5a16', 900: '#623a14' },
            cream:   { 50: '#f9f7f6', 100: '#f4efe9', 200: '#efe5da', 300: '#e2ddd5', 400: '#d3c5b0', 500: '#b39c7d', 600: '#8e7558', 700: '#6e5841', 800: '#4f3f2e', 900: '#332820' },
            brown:   { 50: '#f6f1ec', 100: '#e6d8c8', 200: '#cdb293', 300: '#b08c66', 400: '#8c6c4a', 500: '#74503e', 600: '#5e4030', 700: '#4a3225', 800: '#3a2820', 900: '#2a1d18' },
          },
          fontFamily: {
            display: ['"Cormorant Garamond"', 'serif'],
            body: ['"Source Sans 3"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Source Sans 3', sans-serif; }

    /* Article typography. Tailwind's reset strips list bullets, heading sizes,
       etc., so the post body gets its own small stylesheet that matches the
       rest of the site. */
    .post-body { font-size: 1.125rem; line-height: 1.8; color: #44403c; }
    .post-body > * + * { margin-top: 1.25em; }
    .post-body h1, .post-body h2, .post-body h3, .post-body h4 {
      font-family: 'Cormorant Garamond', serif; font-weight: 600; line-height: 1.2; color: #65100b;
    }
    .post-body h1 { font-size: 2.25rem; margin-top: 2em; }
    .post-body h2 { font-size: 2rem; margin-top: 2em; }
    .post-body h3 { font-size: 1.5rem; margin-top: 1.75em; color: #8f2e24; }
    .post-body h4 { font-size: 1.25rem; margin-top: 1.5em; color: #8f2e24; }
    .post-body a { color: #a72017; text-decoration: underline; text-underline-offset: 3px; }
    .post-body a:hover { color: #65100b; }
    .post-body strong { color: #292524; font-weight: 600; }
    .post-body ul, .post-body ol { padding-left: 1.5rem; }
    .post-body ul { list-style: disc; }
    .post-body ol { list-style: decimal; }
    .post-body li + li { margin-top: 0.5em; }
    .post-body li > ul, .post-body li > ol { margin-top: 0.5em; }
    .post-body blockquote {
      border-left: 3px solid #f2cc5a; padding: 0.25rem 0 0.25rem 1.5rem; margin-left: 0;
      font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.5rem; line-height: 1.4; color: #8f2e24;
    }
    .post-body blockquote > * + * { margin-top: 0.75em; }
    .post-body img { display: block; max-width: 100%; height: auto; border-radius: 1rem; margin: 2rem auto; }
    .post-body hr { border: 0; height: 2px; width: 48px; margin: 3rem auto; background: linear-gradient(90deg, #b62f26, #f5b425); }
    .post-body code { font-size: 0.9em; background: #f4efe9; padding: 0.1em 0.35em; border-radius: 0.25rem; }
    .post-body pre { background: #f4efe9; padding: 1rem 1.25rem; border-radius: 0.75rem; overflow-x: auto; font-size: 0.95rem; line-height: 1.5; }
    .post-body pre code { background: none; padding: 0; }
    .post-body table { width: 100%; border-collapse: collapse; font-size: 1rem; }
    .post-body th, .post-body td { border: 1px solid #efe5da; padding: 0.6rem 0.8rem; text-align: left; vertical-align: top; }
    .post-body th { background: #f4efe9; font-weight: 600; }
  </style>
</head>`;
}

function nav({ mobileBackHref, mobileBackLabel }) {
  return `
  <!-- Nav -->
  <nav class="bg-cream-50 border-b border-cream-200">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-3 font-display text-xl font-semibold text-crimson-800 tracking-tight">
        <img src="/EIJ%20logo.png" alt="" class="h-8 w-auto">
        Encounters in Joy
      </a>
      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
        <a href="/#about" class="hover:text-crimson-700">About</a>
        <a href="/#services" class="hover:text-crimson-700">Services</a>
        <a href="/#team" class="hover:text-crimson-700">Our Team</a>
        <a href="/#faq" class="hover:text-crimson-700">FAQ</a>
        <a href="/blog/" class="text-crimson-700 font-semibold" aria-current="page">Blog</a>
        <a href="/intake.html" class="hover:text-crimson-700">Forms</a>
        <a href="/donate.html" class="hover:text-crimson-700">Donate</a>
        <a href="tel:7708071227" class="inline-flex items-center gap-1.5 text-crimson-700 hover:text-crimson-900 font-semibold">
          ${PHONE_ICON}
          770-807-1227
        </a>
        <a href="/#contact" class="bg-gold-400 text-brown-900 font-semibold px-5 py-2 rounded-full hover:bg-gold-300">Take the first step</a>
      </div>
      <a href="/donate.html" class="md:hidden text-sm text-crimson-700 font-medium">Donate</a>
      <a href="${esc(mobileBackHref)}" class="md:hidden text-sm text-crimson-700 font-medium">&larr; ${esc(mobileBackLabel)}</a>
    </div>
  </nav>`;
}

function ctaSection() {
  return `
  <!-- Gentle call to action -->
  <section class="py-16 md:py-20 bg-cream-100 border-t border-cream-200">
    <div class="max-w-3xl mx-auto px-6 text-center">
      <p class="font-body text-crimson-700 font-semibold tracking-widest uppercase text-xs mb-3">When you're ready</p>
      <h2 class="font-display text-3xl md:text-4xl font-semibold text-crimson-900 mb-4">If something here spoke to you, we'd be glad to talk.</h2>
      <p class="text-stone-700 max-w-xl mx-auto mb-8">Reading is a good start. A conversation is a better one. Send a short message or leave a voicemail &mdash; a real person responds within 24 hours.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="/#contact" class="inline-block bg-gold-400 text-brown-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-300 transition-colors shadow-md shadow-gold-400/30">Take the first step</a>
        <a href="tel:7708071227" class="inline-flex items-center gap-2 text-crimson-700 font-semibold hover:text-crimson-900">
          ${PHONE_ICON}
          770-807-1227
        </a>
      </div>
    </div>
  </section>`;
}

function crisisBanner() {
  return `
  <!-- Crisis banner -->
  <div class="bg-crimson-50 border-y border-crimson-100 py-4 text-center">
    <p class="text-stone-700 text-sm px-6">
      <span class="font-semibold text-crimson-800">In a crisis right now?</span> Call <a href="tel:911" class="font-semibold text-crimson-700 hover:underline">911</a> or the Suicide &amp; Crisis Lifeline at <a href="tel:988" class="font-semibold text-crimson-700 hover:underline">988</a>
    </p>
  </div>`;
}

function footer() {
  return `
  <!-- Footer -->
  <footer class="bg-brown-800 text-cream-200 py-14">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/WatercolorApple(4).png" alt="" loading="lazy" decoding="async" width="320" height="320" class="h-10 w-auto">
            <p class="font-display text-xl font-semibold text-gold-300">Encounters in Joy, Inc.</p>
          </div>
          <p class="text-cream-300 text-sm leading-relaxed mb-5">A 501(c)(3) ministry providing professional, faith-grounded counseling for individuals, couples, and families across Barrow County and beyond. Sliding scale &amp; scholarships available.</p>
        </div>
        <div>
          <p class="font-display text-lg font-semibold text-gold-300 mb-4">Quick contact</p>
          <ul class="space-y-2 text-sm text-cream-300">
            <li><a href="tel:7708071227" class="hover:text-white">770-807-1227</a></li>
            <li><a href="mailto:brojefflangley@encountersinjoy.org" class="hover:text-white break-all">brojefflangley@encountersinjoy.org</a></li>
            <li>2064 Highway 82<br>Statham, GA 30666</li>
            <li><a href="/blog/" class="hover:text-white">Blog</a></li>
            <li><a href="/donate.html" class="hover:text-white">Donate</a></li>
            <li class="text-cream-400 text-xs italic mt-2">Crisis: 911 · Lifeline: 988</li>
          </ul>
        </div>
        <div>
          <p class="font-display text-lg font-semibold text-gold-300 mb-4">Cities we serve</p>
          <ul class="space-y-1.5 text-sm text-cream-300">
            <li><a href="/counseling-winder-ga.html" class="hover:text-white">Winder, GA</a></li>
            <li><a href="/counseling-bethlehem-ga.html" class="hover:text-white">Bethlehem, GA</a></li>
            <li><a href="/counseling-bogart-ga.html" class="hover:text-white">Bogart, GA</a></li>
            <li><a href="/counseling-athens-ga.html" class="hover:text-white">Athens, GA</a></li>
            <li><a href="/counseling-watkinsville-ga.html" class="hover:text-white">Watkinsville, GA</a></li>
            <li><a href="/counseling-monroe-ga.html" class="hover:text-white">Monroe, GA</a></li>
            <li class="text-cream-400 text-xs mt-2">Plus Jefferson, Auburn, Loganville, and surrounding areas.</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-brown-700 pt-6 space-y-3 text-xs text-cream-400">
        <p class="text-cream-300 leading-relaxed max-w-4xl">
          Encounters in Joy provides faith-grounded pastoral counseling. Our counselors are not licensed by the State of Georgia as LPC, LMFT, or LCSW. For severe psychiatric conditions or court-ordered care, please consult a licensed clinician. Posts on this blog are general reflections and are not a substitute for counseling or medical advice.
        </p>
        <div class="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
          <p>&copy; ${new Date().getFullYear()} Encounters in Joy, Inc. All rights reserved.</p>
          <p><em>"What began in the Garden ends at the Cross."</em></p>
        </div>
      </div>
    </div>
  </footer>`;
}

function mobileBar() {
  return `
  <!-- Sticky mobile call/text bar -->
  <div class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-cream-300 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] flex" style="padding-bottom: env(safe-area-inset-bottom);">
    <a href="tel:7708071227" class="flex-1 flex items-center justify-center gap-2 py-3.5 text-crimson-800 font-semibold text-sm border-r border-cream-200 active:bg-cream-50">
      ${PHONE_ICON}
      Call
    </a>
    <a href="sms:7708071227" class="flex-1 flex items-center justify-center gap-2 py-3.5 text-brown-900 font-semibold text-sm bg-gold-400 active:bg-gold-500">
      ${CHAT_ICON}
      Text us
    </a>
  </div>
  <div class="md:hidden h-14"></div>`;
}

function trackingScript() {
  return `
  <script>
    // Conversion tracking (same events as the rest of the site)
    (function() {
      function track(name, params) {
        if (typeof gtag === 'function') gtag('event', name, params || {});
        if (typeof clarity === 'function') clarity('event', name);
      }
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
        a.addEventListener('click', function () { track('phone_click', { event_category: 'engagement', event_label: a.getAttribute('href') }); });
      });
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.addEventListener('click', function () { track('email_click', { event_category: 'engagement', event_label: a.getAttribute('href') }); });
      });
      document.querySelectorAll('a[href^="sms:"]').forEach(function (a) {
        a.addEventListener('click', function () { track('text_click', { event_category: 'engagement', event_label: a.getAttribute('href') }); });
      });
    })();
  </script>`;
}

// ---------------------------------------------------------------------------
// Post card (used on the index and in "More from the blog")
// ---------------------------------------------------------------------------

function postCard(p, img) {
  const image = p.image
    ? `<img src="${esc(img(p.image, { w: 800, h: 450, fit: 'cover' }))}" alt="" class="w-full aspect-[16/9] object-cover bg-cream-100" loading="lazy" decoding="async" width="800" height="450">`
    : '';
  return `
        <a href="${esc(p.url)}" class="group flex flex-col bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden hover:border-crimson-200 hover:shadow-lg hover:shadow-crimson-900/5 transition-all">
          ${image}
          <div class="p-6 md:p-7 flex flex-col flex-1">
            <p class="text-xs font-semibold uppercase tracking-widest text-crimson-600 mb-3">${esc(p.dateLong)} &middot; ${esc(p.author)}</p>
            <h3 class="font-display text-2xl font-semibold text-crimson-900 leading-snug mb-3 group-hover:text-crimson-700 transition-colors">${esc(p.title)}</h3>
            <p class="text-stone-600 leading-relaxed mb-5">${esc(p.excerpt)}</p>
            <span class="mt-auto inline-flex items-center gap-2 text-crimson-700 font-semibold text-sm">Read more ${ARROW_ICON}</span>
          </div>
        </a>`;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

/**
 * @param {object} p        A post object from build-blog.js
 * @param {object[]} others Other published posts (most recent first)
 * @param {Function} img    (src, {w,h,fit}) => URL, wraps Netlify's image CDN when deployed
 */
function postPage(p, others, img) {
  const author = authorInfo(p.author);
  const absoluteImage = p.image ? SITE + encodeURI(p.image) : DEFAULT_IMAGE;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      image: [absoluteImage],
      datePublished: p.dateIso,
      dateModified: p.dateIso,
      wordCount: p.wordCount,
      author: { '@type': 'Person', name: p.author, url: SITE + '/#team' },
      publisher: {
        '@type': 'Organization',
        name: 'Encounters in Joy, Inc.',
        url: SITE + '/',
        logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': p.absoluteUrl },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
        { '@type': 'ListItem', position: 3, name: p.title, item: p.absoluteUrl },
      ],
    },
  ];

  const avatar = author
    ? `<img src="${esc(author.photo)}" alt="" class="w-10 h-10 rounded-full object-cover ring-2 ring-white/40" width="40" height="40">`
    : '';

  const featured = p.image
    ? `
    <div class="max-w-4xl mx-auto px-6 -mt-12 md:-mt-16 relative z-10">
      <img src="${esc(img(p.image, { w: 1600, h: 900, fit: 'cover' }))}" alt="${esc(p.title)}" class="w-full aspect-[16/9] object-cover rounded-2xl shadow-xl shadow-brown-900/20 border border-cream-200 bg-cream-100" width="1600" height="900" decoding="async">
    </div>`
    : '';

  const authorCard = `
      <div class="mt-14 pt-10 border-t border-cream-200 flex items-start gap-5">
        ${author ? `<img src="${esc(author.photo)}" alt="${esc(author.photoAlt)}" class="w-16 h-16 rounded-full object-cover shrink-0" loading="lazy" decoding="async" width="64" height="64">` : ''}
        <div>
          <p class="text-xs uppercase tracking-widest text-crimson-600 font-semibold mb-1">About the author</p>
          <p class="font-display text-xl font-semibold text-crimson-900">${esc(p.author)}</p>
          ${author ? `<p class="text-stone-600 text-sm">${esc(author.role)}</p>` : ''}
          <a href="/#team" class="inline-flex items-center gap-1.5 text-crimson-700 text-sm font-semibold hover:text-crimson-900 mt-2">Meet our counselors ${ARROW_ICON}</a>
        </div>
      </div>`;

  const more = others.length
    ? `
  <!-- More from the blog -->
  <section class="py-16 bg-white border-t border-cream-200">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex items-end justify-between gap-4 mb-8">
        <div>
          <p class="font-body text-crimson-700 font-semibold tracking-widest uppercase text-xs mb-2">Keep reading</p>
          <h2 class="font-display text-3xl font-semibold text-crimson-900">More from the blog</h2>
        </div>
        <a href="/blog/" class="hidden sm:inline-flex items-center gap-2 text-crimson-700 font-semibold text-sm hover:text-crimson-900">All posts ${ARROW_ICON}</a>
      </div>
      <div class="grid md:grid-cols-3 gap-6">
        ${others.slice(0, 3).map((o) => postCard(o, img)).join('\n')}
      </div>
    </div>
  </section>`
    : '';

  return `${head({
    title: `${p.title} | ${BLOG_TITLE}`,
    description: p.excerpt,
    url: p.absoluteUrl,
    image: absoluteImage,
    imageAlt: p.image ? p.title : DEFAULT_IMAGE_ALT,
    ogType: 'article',
    structuredData,
  })}
<body class="bg-cream-50 text-stone-800">
${nav({ mobileBackHref: '/blog/', mobileBackLabel: 'Blog' })}

  <article>
    <!-- Title -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-brown-500 via-crimson-800 to-brown-600"></div>
      <div class="absolute inset-0 bg-black/15"></div>
      <div class="relative max-w-3xl mx-auto px-6 pt-16 md:pt-24 ${p.image ? 'pb-24 md:pb-32' : 'pb-16 md:pb-24'} text-center">
        <p class="font-body text-gold-300 font-semibold tracking-widest uppercase text-xs mb-5"><a href="/blog/" class="hover:text-gold-200">Blog</a> &middot; <time datetime="${esc(p.dateIso)}">${esc(p.dateLong)}</time></p>
        <h1 class="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-6 drop-shadow-sm">${esc(p.title)}</h1>
        ${p.summary ? `<p class="font-body text-lg md:text-xl text-cream-100 leading-relaxed max-w-2xl mx-auto mb-8">${esc(p.summary)}</p>` : ''}
        <p class="inline-flex items-center gap-3 text-cream-100 text-sm">
          ${avatar}
          <span>By <span class="font-semibold text-white">${esc(p.author)}</span> &middot; ${p.readingMinutes} min read</span>
        </p>
      </div>
    </header>
    ${featured}

    <!-- Body -->
    <div class="max-w-3xl mx-auto px-6 py-12 md:py-16">
      <div class="post-body">
${p.html}
      </div>
      ${authorCard}
    </div>
  </article>
${more}
${ctaSection()}
${crisisBanner()}
${footer()}
${mobileBar()}
${trackingScript()}
</body>
</html>
`;
}

function indexPage(posts, img) {
  const url = SITE + '/blog/';
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: BLOG_TITLE,
      url,
      description: BLOG_DESCRIPTION,
      publisher: { '@type': 'Organization', name: 'Encounters in Joy, Inc.', url: SITE + '/' },
      blogPost: posts.slice(0, 20).map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: p.absoluteUrl,
        datePublished: p.dateIso,
        author: { '@type': 'Person', name: p.author },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: url },
      ],
    },
  ];

  const list = posts.length
    ? `
      <div class="grid md:grid-cols-2 gap-6 md:gap-8">
        ${posts.map((p) => postCard(p, img)).join('\n')}
      </div>`
    : `
      <div class="max-w-xl mx-auto text-center bg-cream-50 rounded-2xl border border-cream-200 px-8 py-14">
        <p class="font-display text-2xl font-semibold text-crimson-900 mb-3">Our first posts are on the way.</p>
        <p class="text-stone-600 leading-relaxed">We're writing a few things we think will be worth your time. In the meantime, you're always welcome to <a href="/#contact" class="text-crimson-700 font-semibold hover:underline">reach out directly</a>.</p>
      </div>`;

  return `${head({
    title: `Blog | Encounters in Joy · Counseling in Statham, GA`,
    description: BLOG_DESCRIPTION,
    url,
    ogType: 'website',
    structuredData,
  })}
<body class="bg-cream-50 text-stone-800">
${nav({ mobileBackHref: '/', mobileBackLabel: 'Home' })}

  <!-- Hero -->
  <section class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-brown-500 via-crimson-800 to-brown-600"></div>
    <div class="absolute inset-0 bg-black/15"></div>
    <div class="relative max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
      <p class="font-body text-gold-300 font-semibold tracking-widest uppercase text-xs mb-5">The blog</p>
      <h1 class="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-6 drop-shadow-sm">Notes from our counselors.</h1>
      <p class="font-body text-lg md:text-xl text-cream-100 leading-relaxed max-w-2xl mx-auto">
        Honest, faith-grounded reflections on grief, anxiety, marriage, and the ordinary hard days &mdash; from the people who sit with you in the room.
      </p>
    </div>
  </section>

  <!-- Posts -->
  <section class="py-16 md:py-20 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      ${list}
      <p class="text-center text-xs text-stone-400 mt-12">
        <a href="/blog/feed.xml" class="hover:text-crimson-700">Subscribe via RSS</a>
      </p>
    </div>
  </section>
${ctaSection()}
${crisisBanner()}
${footer()}
${mobileBar()}
${trackingScript()}
</body>
</html>
`;
}

function feed(posts) {
  const items = posts
    .slice(0, 30)
    .map(
      (p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(p.absoluteUrl)}</link>
      <guid isPermaLink="true">${esc(p.absoluteUrl)}</guid>
      <pubDate>${esc(p.dateRfc)}</pubDate>
      <dc:creator>${esc(p.author)}</dc:creator>
      <description>${esc(p.excerpt)}</description>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(BLOG_TITLE)}</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${esc(BLOG_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;
}

module.exports = { SITE, postPage, indexPage, feed, esc };
