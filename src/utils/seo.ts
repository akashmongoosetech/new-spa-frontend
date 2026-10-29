/**
 * SEO & Meta Tag Management Utility for Tripod Wellness
 * Handles dynamic HTML meta tags, Open Graph card images, Twitter meta tags,
 * canonical link injection, and optional Schema.org JSON-LD.
 */

import { BRAND_ICON } from '../branding/logo';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  getStaticRouteMeta,
  normalizePath,
} from '../config/site';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: string;
  favicon?: string;
  canonicalUrl?: string;
  path?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  robots?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_SEO = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: '',
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: `${SITE_NAME} — men's massage therapy in Indore`,
  type: 'website' as const,
  robots: 'index, follow',
};

function metaContent(value: string): string {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

/**
 * Sets or updates a meta tag. Empty values are ignored so a page-level SEO
 * component cannot accidentally erase the site defaults.
 */
function setMeta(attrName: 'name' | 'property', attrVal: string, contentVal: string): void {
  const value = metaContent(contentVal);
  if (!value) return;
  let elem = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!elem) {
    elem = document.createElement('meta');
    elem.setAttribute(attrName, attrVal);
    document.head.appendChild(elem);
  }
  elem.setAttribute('content', value);
}

function removeMeta(attrName: 'name' | 'property', attrVal: string): void {
  document.querySelectorAll(`meta[${attrName}="${attrVal}"]`).forEach((elem) => elem.remove());
}

function upsertLink(rel: string, href: string, extra: Record<string, string> = {}): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
  Object.entries(extra).forEach(([key, value]) => link!.setAttribute(key, value));
}

/**
 * Dynamically sets or updates meta tags, Open Graph images, canonical links,
 * and optional JSON-LD. The default business schema is deliberately not
 * injected: structured data is only emitted when a page supplies verified data.
 */
export const updatePageSEO = (config: SEOConfig = {}): void => {
  if (typeof window === 'undefined') return;

  const title = metaContent(config.title || DEFAULT_SEO.title);
  const description = metaContent(config.description || DEFAULT_SEO.description);
  const ogTitle = metaContent(config.ogTitle || title);
  const ogDescription = metaContent(config.ogDescription || description);
  const twitterTitle = metaContent(config.twitterTitle || ogTitle);
  const twitterDescription = metaContent(config.twitterDescription || ogDescription);
  const ogImage = config.ogImage || config.twitterImage || DEFAULT_SEO.ogImage;
  const twitterImage = config.twitterImage || ogImage;
  const ogImageAlt = metaContent(config.ogImageAlt || DEFAULT_SEO.ogImageAlt);
  const type = config.type || DEFAULT_SEO.type;
  const robots = config.robots || DEFAULT_SEO.robots;

  const currentPath = normalizePath(config.path || window.location.pathname);
  // Netlify serves directory-index pages at a trailing-slash URL, so keep the
  // canonical and og:url aligned with the URL that actually returns 200.
  const canonicalPath = currentPath === '/' ? '/' : `${currentPath}/`;
  let canonicalUrl = (
    config.canonicalUrl || `${SITE_URL}${canonicalPath}`
  ).replace(/([^:]\/)\/+/g, '$1');
  try {
    const parsed = new URL(canonicalUrl);
    if (!/\.[a-z0-9]{2,8}$/i.test(parsed.pathname) && !parsed.pathname.endsWith('/')) {
      parsed.pathname = `${parsed.pathname}/`;
      canonicalUrl = parsed.toString();
    }
  } catch {
    // A relative canonical is resolved below by setMeta/upsertLink callers.
  }

  document.title = title;

  // Standard meta tags
  setMeta('name', 'description', description);
  setMeta('name', 'robots', robots);
  if (config.keywords) setMeta('name', 'keywords', config.keywords);
  else removeMeta('name', 'keywords');
  setMeta('name', 'theme-color', '#17130F');

  // Open Graph
  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:title', ogTitle);
  setMeta('property', 'og:description', ogDescription);
  setMeta('property', 'og:type', type === 'business' ? 'website' : type);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:image', ogImage);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', ogImageAlt);
  setMeta('property', 'og:locale', 'en_IN');

  // Twitter cards
  setMeta('name', 'twitter:card', config.twitterCard || 'summary_large_image');
  setMeta('name', 'twitter:title', twitterTitle);
  setMeta('name', 'twitter:description', twitterDescription);
  setMeta('name', 'twitter:image', twitterImage);
  setMeta('name', 'twitter:image:alt', ogImageAlt);
  if (TWITTER_HANDLE) setMeta('name', 'twitter:site', TWITTER_HANDLE);
  else removeMeta('name', 'twitter:site');

  // Article metadata is static in the initial document. Replace it on every
  // SPA navigation so a previous article's dates/tags never leak to a new page.
  document.querySelectorAll('meta[property^="article:"]').forEach((elem) => elem.remove());
  if (type === 'article') {
    if (config.articlePublishedTime) setMeta('property', 'article:published_time', config.articlePublishedTime);
    if (config.articleModifiedTime) setMeta('property', 'article:modified_time', config.articleModifiedTime);
    if (config.articleSection) setMeta('property', 'article:section', config.articleSection);
    for (const tag of config.articleTags || []) {
      const elem = document.createElement('meta');
      elem.setAttribute('property', 'article:tag');
      elem.setAttribute('content', metaContent(tag));
      document.head.appendChild(elem);
    }
  }

  // Canonical and icons
  upsertLink('canonical', canonicalUrl);
  upsertLink('icon', config.favicon || BRAND_ICON, { type: 'image/png' });
  upsertLink('apple-touch-icon', config.favicon || BRAND_ICON);

  // Optional JSON-LD. No default schema is emitted because the previous
  // default contained unverified ratings, prices, hours and amenities.
  let scriptTag = document.getElementById('json-ld-spa-schema') as HTMLScriptElement | null;
  if (config.jsonLd) {
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-spa-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(config.jsonLd);
  } else if (scriptTag) {
    scriptTag.remove();
  }
};

export function clampSeoTitle(value: string): string {
  let title = metaContent(value);
  if (title.length < 30) title = metaContent(`${title} | ${SITE_NAME}`);
  if (title.length <= 60) return title;
  const cut = title.slice(0, 60);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 35 ? lastSpace : 60).replace(/[|,;:\-–—\s]+$/, '').trim();
}

export function clampSeoDescription(value: string, fallback: string): string {
  let description = metaContent(value);
  if (description.length < 120) description = metaContent(`${description} ${fallback}`);
  if (description.length <= 160) return description;
  const cut = description.slice(0, 160);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 120 ? lastSpace : 160).replace(/[|,;:\-–—\s]+$/, '').trim();
}

const PRESET_PATHS: Record<string, string> = {
  home: '/',
  services: '/services',
  booking: '/booking',
  gallery: '/gallery',
  therapists: '/therapists',
  blog: '/blog',
  faq: '/faq',
  about: '/about',
  contact: '/contact',
};

/**
 * Returns SEO metadata for a named route. Kept for compatibility with the
 * existing hook API; all copy now comes from the central route manifest.
 */
export const getSEOPresets = (pageName: string): SEOConfig => {
  const path = PRESET_PATHS[pageName];
  if (!path) return {};
  const meta = getStaticRouteMeta(path);
  return meta ? { ...meta, path: meta.path } : {};
};
