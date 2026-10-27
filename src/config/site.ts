import raw from './routeMeta.json';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  robots: string;
  changeFrequency?: string;
  priority?: string;
}

const configuredSiteUrl = (import.meta.env.VITE_SITE_URL as string | undefined) || raw.siteUrl;

export const SITE_NAME = raw.siteName;
export const SITE_URL = configuredSiteUrl.replace(/\/+$/, '');
export const DEFAULT_TITLE = raw.defaultTitle;
export const DEFAULT_DESCRIPTION = raw.defaultDescription;
export const DEFAULT_OG_IMAGE = `${SITE_URL}${raw.defaultOgImage}`;
export const DEFAULT_OG_IMAGE_PATH = raw.defaultOgImage;
export const TWITTER_HANDLE = (import.meta.env.VITE_TWITTER_HANDLE as string | undefined) || '';
export const PUBLIC_ROUTES = raw.routes as RouteMeta[];
export const PRIVATE_PREFIXES = raw.privatePrefixes;

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const clean = pathname.split('?')[0].split('#')[0];
  return clean.startsWith('/') ? clean.replace(/\/+$/, '') || '/' : `/${clean.replace(/\/+$/, '')}`;
}

export function isPrivatePath(pathname: string): boolean {
  const path = normalizePath(pathname);
  return PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function getStaticRouteMeta(pathname: string): RouteMeta | undefined {
  const path = normalizePath(pathname);
  return PUBLIC_ROUTES.find((route) => route.path === path);
}

export function getRouteMeta(pathname: string): RouteMeta | undefined {
  const path = normalizePath(pathname);
  const exact = getStaticRouteMeta(path);
  if (exact) return exact;

  // Detail routes inherit their parent page's metadata until the page supplies
  // its own service/therapist/article-specific values. Only one child segment
  // is valid; deeper unknown paths must remain 404s.
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 2 && ['services', 'therapists', 'blog'].includes(parts[0])) {
    return getStaticRouteMeta(`/${parts[0]}`);
  }
  return undefined;
}

export function isPublished(meta: RouteMeta | undefined): boolean {
  return !!meta && !meta.robots.includes('noindex');
}
