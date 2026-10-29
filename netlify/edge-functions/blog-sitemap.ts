type EdgeContext = { next: () => Promise<Response> };

const FALLBACK_API = 'https://new-spa-backend.onrender.com/api';
const FALLBACK_SITE = 'https://tripod-wellness.netlify.app';

function env(name: string, fallback = '') {
  try {
    return (globalThis as any).Netlify?.env?.get?.(name) || fallback;
  } catch {
    return fallback;
  }
}

const API_BASE = (env('BLOG_API_URL') || env('VITE_API_URL') || FALLBACK_API).replace(/\/+$/, '');
const SITE_URL = (env('VITE_SITE_URL') || FALLBACK_SITE).replace(/\/+$/, '');

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function isoDate(value: any) {
  if (!value) return '';
  try {
    return new Date(value).toISOString();
  } catch {
    return '';
  }
}

function isBlogUrl(loc: string) {
  try {
    const path = new URL(loc).pathname.replace(/\/+$/, '') || '/';
    return path === '/blog' || path.startsWith('/blog/');
  } catch {
    return false;
  }
}

function buildEntry({ loc, lastmod, changefreq, priority }: { loc: string; lastmod?: string; changefreq?: string; priority?: string }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : '',
    priority ? `    <priority>${escapeXml(priority)}</priority>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

export default async (request: Request, context: EdgeContext) => {
  const staticResponse = await context.next();
  if (!staticResponse.ok) return staticResponse;

  let posts: any[];
  try {
    const response = await fetch(`${API_BASE}/blog/sitemap`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return staticResponse;
    const data = await response.json();
    if (!Array.isArray(data)) return staticResponse;
    posts = data;
  } catch {
    // Keep the build-time sitemap if the API is cold or unavailable.
    return staticResponse;
  }

  const staticXml = await staticResponse.text();
  const firstUrl = staticXml.indexOf('<url>');
  const prefix = firstUrl >= 0 ? staticXml.slice(0, firstUrl) : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const blockPattern = /<url>[\s\S]*?<\/url>/g;
  const existingBlocks = staticXml.match(blockPattern) || [];
  const nonBlogBlocks = existingBlocks.filter((block) => {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] || '';
    return !isBlogUrl(loc.replaceAll('&amp;', '&'));
  });

  const liveBlocks = posts
    .filter((post) => post?.slug)
    .map((post) => buildEntry({
      loc: post.url || `${SITE_URL}/blog/${encodeURIComponent(post.slug)}/`,
      lastmod: isoDate(post.updatedAt || post.publishedAt),
      changefreq: 'monthly',
      priority: '0.7',
    }));

  if (posts.length > 0) {
    const newest = posts
      .map((post) => isoDate(post.updatedAt || post.publishedAt))
      .filter(Boolean)
      .sort()
      .at(-1);
    liveBlocks.unshift(buildEntry({
      loc: `${SITE_URL}/blog/`,
      lastmod: newest,
      changefreq: 'weekly',
      priority: '0.6',
    }));
  }

  const xml = `${prefix}${[...nonBlogBlocks, ...liveBlocks].join('\n')}\n</urlset>\n`;
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    },
  });
};

export const config = {
  path: '/sitemap.xml',
};
