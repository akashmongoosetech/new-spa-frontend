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

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stripManagedHead(html: string) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)=["'](?:description|robots|keywords|og:[^"']+|article:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function normalizeCanonical(value: string, slug: string) {
  const fallback = `${SITE_URL}/blog/${encodeURIComponent(slug)}/`;
  if (!value) return fallback;
  try {
    const url = new URL(value, SITE_URL);
    if (!/\.[a-z0-9]{2,8}$/i.test(url.pathname) && !url.pathname.endsWith('/')) {
      url.pathname = `${url.pathname}/`;
    }
    return url.toString();
  } catch {
    return fallback;
  }
}

function absoluteAsset(value: string) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (/^\/(?!\/)/.test(value)) return `${SITE_URL}${value}`;
  return '';
}

function safeIso(value: any) {
  if (!value) return '';
  try {
    return new Date(value).toISOString();
  } catch {
    return '';
  }
}

function buildHead(post: any, detail: any) {
  const resolved = post?.resolvedSeo || {};
  const seo = post?.seo || {};
  const slug = post?.slug || '';
  const canonical = normalizeCanonical(resolved.canonicalUrl || resolved.canonical_url || `${SITE_URL}/blog/${slug}/`, slug);
  const title = resolved.title || post?.title || 'Tripod Wellness Journal';
  const description =
    resolved.description ||
    post?.safeExcerpt ||
    post?.excerptText ||
    post?.excerpt ||
    'Read the Tripod Wellness journal for men\'s massage, recovery and wellness guidance.';
  const image = absoluteAsset(resolved.ogImageUrl || resolved.og_image_url || seo.ogImageUrl || post?.featuredImageUrl || '') || `${SITE_URL}/brand/og-default.jpg`;
  const imageAlt = resolved.ogImageAlt || post?.featuredImageAlt || title;
  const publishedAt = safeIso(post?.publishedAt || post?.date);
  const updatedAt = safeIso(post?.updatedAt) || publishedAt;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="Tripod Wellness" />`,
    '<meta property="og:locale" content="en_IN" />',
    '<meta property="og:type" content="article" />',
    `<meta property="og:title" content="${escapeHtml(resolved.ogTitle || seo.ogTitle || title)}" />`,
    `<meta property="og:description" content="${escapeHtml(resolved.ogDescription || seo.ogDescription || description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta name="twitter:card" content="${escapeHtml(resolved.twitterCard || 'summary_large_image')}" />`,
    `<meta name="twitter:title" content="${escapeHtml(resolved.twitterTitle || seo.twitterTitle || title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(resolved.twitterDescription || seo.twitterDescription || description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(absoluteAsset(resolved.twitterImageUrl || seo.twitterImageUrl || '') || image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
  ];
  if (resolved.keywords?.length || seo.keywords?.length) {
    tags.push(`<meta name="keywords" content="${escapeHtml((resolved.keywords || seo.keywords).join(', '))}" />`);
  }
  if (publishedAt) tags.push(`<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />`);
  if (updatedAt) tags.push(`<meta property="article:modified_time" content="${escapeHtml(updatedAt)}" />`);
  if (post?.category) tags.push(`<meta property="article:section" content="${escapeHtml(post.category)}" />`);
  for (const tag of Array.isArray(post?.tags) ? post.tags.slice(0, 20) : []) {
    tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
  }
  const jsonLd = detail?.jsonLd;
  if (jsonLd) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

async function blogIndexResponse(request: Request, context: EdgeContext) {
  // The index is generated at build time. Keep its indexability in sync with
  // live data so publishing the first article does not require a rebuild.
  const requestUrl = new URL(request.url);
  const page = Number(requestUrl.searchParams.get('page') || 1) || 1;
  const filtered =
    requestUrl.searchParams.has('q') ||
    requestUrl.searchParams.has('category') ||
    requestUrl.searchParams.has('tag') ||
    page > 1;
  let total = 0;
  try {
    const response = await fetch(`${API_BASE}/blog/posts?limit=1`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return context.next();
    const data: any = await response.json();
    if (!Array.isArray(data?.items) || !data?.pagination) return context.next();
    total = Number(data.pagination.total) || 0;
  } catch {
    return context.next();
  }

  const originResponse = await context.next();
  const contentType = originResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return originResponse;

  const robots = total > 0 && !filtered ? 'index, follow' : 'noindex, follow';
  let html = await originResponse.text();
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="robots" content="${robots}" />\n</head>`);
  }

  const headers = new Headers(originResponse.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  headers.set('x-robots-tag', robots);
  return new Response(html, { status: 200, headers });
}

async function notFoundResponse(request: Request) {
  try {
    const response = await fetch(new URL('/404.html', request.url), {
      headers: { Accept: 'text/html' },
    });
    if (response.status === 200 || response.status === 404) {
      return new Response(await response.text(), {
        status: 404,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'public, max-age=60, s-maxage=300',
          'x-robots-tag': 'noindex, nofollow',
        },
      });
    }
  } catch {
    // Fall through to a minimal document if the static 404 is unavailable.
  }
  return new Response(
    '<!doctype html><html lang="en-IN"><head><meta charset="utf-8" /><meta name="robots" content="noindex, nofollow" /><title>Article not found | Tripod Wellness</title></head><body><h1>Article not found</h1><p>This article is not available.</p><p><a href="/blog/">Back to the journal</a></p></body></html>',
    {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60, s-maxage=300',
        'x-robots-tag': 'noindex, nofollow',
      },
    }
  );
}

export default async (request: Request, context: EdgeContext) => {
  const url = new URL(request.url);
  if (url.pathname === '/blog' || url.pathname === '/blog/') {
    return blogIndexResponse(request, context);
  }
  const match = url.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return context.next();

  let slug = '';
  try {
    slug = decodeURIComponent(match[1]);
  } catch {
    return notFoundResponse(request);
  }
  if (!slug || slug === 'index.html') return context.next();

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/blog/posts/${encodeURIComponent(slug)}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000),
    });
  } catch {
    // A cold/unreachable API must not take the whole journal offline.
    return context.next();
  }

  if (response.status === 404) return notFoundResponse(request);
  if (!response.ok) return context.next();

  let data: any;
  try {
    data = await response.json();
  } catch {
    return context.next();
  }

  if (data?.redirectTo) {
    return Response.redirect(new URL(data.redirectTo, request.url).toString(), 301);
  }

  const post = data?.post;
  if (!post) return notFoundResponse(request);

  const originResponse = await context.next();
  const contentType = originResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return originResponse;

  const html = await originResponse.text();
  const withHead = stripManagedHead(html).replace('</head>', `    ${buildHead(post, data)}\n  </head>`);
  const headers = new Headers(originResponse.headers);
  headers.delete('content-length');
  headers.delete('content-encoding');
  headers.delete('etag');
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  headers.set('x-robots-tag', 'index, follow');
  return new Response(withHead, { status: 200, headers });
};

export const config = {
  path: ['/blog', '/blog/*'],
};
