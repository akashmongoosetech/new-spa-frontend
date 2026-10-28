import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const raw = JSON.parse(await readFile(join(root, 'src', 'config', 'routeMeta.json'), 'utf8'));

const SITE_URL = (process.env.VITE_SITE_URL || raw.siteUrl).replace(/\/+$/, '');
const API_BASE = (process.env.VITE_API_URL || 'https://new-spa-backend.onrender.com/api').replace(/\/+$/, '');
const OG_IMAGE = `${SITE_URL}${raw.defaultOgImage}`;
const TWITTER_HANDLE = process.env.VITE_TWITTER_HANDLE || '';
const FALLBACK_IMAGE_ALT = `${raw.siteName} — men's massage therapy in Indore`;

function clean(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeXml(value = '') {
  return escapeHtml(value);
}

function clampTitle(value) {
  let title = clean(value);
  if (title.length < 30) title = clean(`${title} | ${raw.siteName}`);
  if (title.length <= 60) return title;
  const cut = title.slice(0, 60);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 35 ? lastSpace : 60).replace(/[|,;:\-–—\s]+$/, '')}`.trim();
}

function clampDescription(value, fallback) {
  let description = clean(value);
  if (description.length < 120) description = clean(`${description} ${fallback}`);
  if (description.length <= 160) return description;
  const cut = description.slice(0, 160);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 120 ? lastSpace : 160).replace(/[|,;:\-–—\s]+$/, '').trim();
}

function routeMeta(path) {
  return raw.routes.find((route) => route.path === path);
}

function canonicalFor(path) {
  if (path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/+$/, '')}/`;
}

function buildHead({ title, description, robots = 'index, follow', path, type = 'website', image = OG_IMAGE, imageAlt = FALLBACK_IMAGE_ALT, canonical = true }) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
  ];

  if (canonical) {
    const url = canonicalFor(path);
    tags.push(
      `<link rel="canonical" href="${escapeHtml(url)}" />`,
      `<meta property="og:url" content="${escapeHtml(url)}" />`
    );
  }

  tags.push(
    `<meta property="og:site_name" content="${escapeHtml(raw.siteName)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:type" content="${escapeHtml(type === 'business' ? 'website' : type)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`
  );

  if (TWITTER_HANDLE) {
    tags.push(`<meta name="twitter:site" content="${escapeHtml(TWITTER_HANDLE)}" />`);
  }

  return tags.join('\n    ');
}

function stripManagedHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)=["'](?:description|robots|keywords|og:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
}

function injectHead(baseHtml, head) {
  return stripManagedHead(baseHtml).replace('</head>', `    ${head}\n  </head>`);
}

async function writePage(relativePath, html) {
  const target = join(dist, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
}

async function fetchJson(path) {
  let lastError;
  // Render cold starts can take longer than a normal request. Retry once after
  // waking the service so production builds do not silently omit detail pages.
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(45000),
      });
      if (!response.ok) throw new Error(`${path} returned ${response.status}`);
      return response.json();
    } catch (error) {
      lastError = error;
      if (attempt === 1) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
}

function isActive(item) {
  return item?.is_active !== 0 && item?.is_active !== false && item?.isActive !== false;
}

function nameSlug(name = '') {
  return clean(name).toLowerCase().replace(/\s+/g, '-');
}

const warnings = [];

const UNVERIFIED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'img.magnific.com',
  'magnific.ai',
  'source.unsplash.com',
];

function isUnverifiedStockImage(url = '') {
  try {
    const host = new URL(url, SITE_URL).hostname.toLowerCase();
    return UNVERIFIED_IMAGE_HOSTS.some((known) => host === known || host.endsWith(`.${known}`));
  } catch {
    return false;
  }
}

const [servicesResult, therapistsResult, blogsResult, faqsResult, galleryResult] =
  await Promise.allSettled([
    fetchJson('/services'),
    fetchJson('/therapists'),
    fetchJson('/blogs/public'),
    fetchJson('/faqs?all=true'),
    fetchJson('/gallery'),
  ]);

function settle(name, result, mapper) {
  if (result.status === 'fulfilled') {
    return (Array.isArray(result.value) ? result.value : []).filter(mapper);
  }
  warnings.push(`Could not load ${name} for static pages: ${result.reason?.message || 'unknown error'}`);
  return [];
}

const services = settle('services', servicesResult, isActive);
const therapists = settle('therapists', therapistsResult, isActive);
const blogs = settle(
  'blog posts',
  blogsResult,
  (post) => post?.is_published !== 0 && post?.isPublished !== false && post?.slug
);
const faqs = settle(
  'FAQs',
  faqsResult,
  (faq) => faq?.is_published !== 0 && faq?.isPublished !== false
);
const gallery = settle(
  'gallery',
  galleryResult,
  (item) =>
    item?.url &&
    item?.is_active !== 0 &&
    item?.isActive !== false &&
    !isUnverifiedStockImage(item.url)
);

const baseHtml = await readFile(join(dist, 'index.html'), 'utf8');
const blogPublished = blogs.length > 0;
const faqPublished = faqs.length > 0;
const galleryPublished = gallery.length > 0;

for (const route of raw.routes) {
  const isBlogIndex = route.path === '/blog';
  const isFaqIndex = route.path === '/faq';
  const isGalleryIndex = route.path === '/gallery';
  const robots =
    (isBlogIndex && !blogPublished) ||
    (isFaqIndex && !faqPublished) ||
    (isGalleryIndex && !galleryPublished)
      ? 'noindex, follow'
      : route.robots;

  const html = injectHead(
    baseHtml,
    buildHead({
      title: route.title,
      description: route.description,
      robots,
      path: route.path,
      type: 'website',
    })
  );

  await writePage(route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}/index.html`, html);
}

// Private routes that are served through the SPA fallback still need a
// crawler-visible noindex document for direct visits.
const privatePages = [
  {
    path: '/admin',
    title: 'Staff Portal | Tripod Wellness',
    description:
      'Secure staff access for Tripod Wellness. This page is restricted to authorised staff and is not indexed by search engines.',
  },
  {
    path: '/reset-password',
    title: 'Reset Staff Password | Tripod Wellness',
    description:
      'Request a password reset for your Tripod Wellness staff account. Enter your staff email to receive reset instructions.',
  },
];

for (const page of privatePages) {
  await writePage(
    `${page.path.replace(/^\//, '')}/index.html`,
    injectHead(
      baseHtml,
      buildHead({
        title: page.title,
        description: page.description,
        robots: 'noindex, nofollow',
        path: page.path,
      })
    )
  );
}

// A single 404 document. Netlify serves it with a real HTTP 404 status.
await writePage(
  '404.html',
  injectHead(
    baseHtml,
    buildHead({
      title: 'Page Not Found | Tripod Wellness',
      description:
        'The page you requested could not be found. Return to Tripod Wellness or browse therapies, therapists, booking and contact pages.',
      robots: 'noindex, nofollow',
      path: '/404',
      canonical: false,
    })
  )
);

const detailPages = [];

for (const service of services) {
  const slug = clean(service.slug || service.id);
  if (!slug) continue;
  const title = clampTitle(`${clean(service.title || service.name)} | ${raw.siteName}`);
  const description = clampDescription(
    service.short_description || service.shortDescription || service.full_description || service.fullDescription,
    'View session details, duration and pricing, then book a private men-to-men appointment with Tripod Wellness in Indore.'
  );
  const path = `/services/${slug}`;
  detailPages.push({ path, title, description, type: 'website' });
}

for (const therapist of therapists) {
  const slug = clean(therapist.slug || nameSlug(therapist.name));
  if (!slug) continue;
  const title = clampTitle(`${clean(therapist.name)} | ${raw.siteName}`);
  const description = clampDescription(
    therapist.bio || therapist.description,
    `View this ${raw.siteName} therapist profile, including specialties and experience, then book a private men-to-men massage appointment in Indore.`
  );
  const path = `/therapists/${slug}`;
  detailPages.push({ path, title, description, type: 'profile' });
}

for (const post of blogs) {
  const slug = clean(post.slug);
  if (!slug) continue;
  const title = clampTitle(`${clean(post.title)} | ${raw.siteName}`);
  const description = clampDescription(
    post.excerpt || post.summary,
    `Read this article from the ${raw.siteName} journal. View verified men's massage and wellness guidance, then book a private appointment in Indore.`
  );
  const path = `/blog/${slug}`;
  detailPages.push({ path, title, description, type: 'article' });
}

for (const page of detailPages) {
  const html = injectHead(
    baseHtml,
    buildHead({
      title: page.title,
      description: page.description,
      robots: 'index, follow',
      path: page.path,
      type: page.type,
    })
  );
  await writePage(`${page.path.replace(/^\//, '')}/index.html`, html);
}

const sitemapEntries = [];
for (const route of raw.routes) {
  if (route.robots.includes('noindex')) continue;
  if (route.path === '/blog' && !blogPublished) continue;
  if (route.path === '/faq' && !faqPublished) continue;
  if (route.path === '/gallery' && !galleryPublished) continue;
  sitemapEntries.push({
    path: route.path,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  });
}
for (const page of detailPages) {
  sitemapEntries.push({ path: page.path, changeFrequency: 'monthly', priority: '0.7' });
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries.map(
    (entry) =>
      `  <url>\n    <loc>${escapeXml(canonicalFor(entry.path))}</loc>` +
      (entry.changeFrequency ? `\n    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>` : '') +
      (entry.priority ? `\n    <priority>${escapeXml(entry.priority)}</priority>` : '') +
      '\n  </url>'
  ),
  '</urlset>',
].join('\n');

await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8');

const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /admin',
  'Disallow: /admin/',
  'Disallow: /admin-login',
  'Disallow: /admin-signup',
  'Disallow: /forgot-password',
  'Disallow: /reset-password/',
  'Disallow: /profile',
  'Disallow: /unauthorized',
  'Disallow: /thank-you',
  'Disallow: /unsubscribe',
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n');

await writeFile(join(dist, 'robots.txt'), robots, 'utf8');

console.log(
  `Static metadata generated: ${raw.routes.length} static routes, ${detailPages.length} detail routes, ${sitemapEntries.length} sitemap URLs.`
);
for (const warning of warnings) console.warn(`Warning: ${warning}`);
