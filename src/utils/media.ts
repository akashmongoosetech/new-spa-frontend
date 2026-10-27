/**
 * Images that are known to be third-party stock or generated avatars are not
 * presented as photographs of the actual Tripod Wellness team or facility.
 */
const UNVERIFIED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'img.magnific.com',
  'magnific.ai',
  'source.unsplash.com',
];

export function isUnverifiedStockImage(url?: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url, window.location.origin).hostname.toLowerCase();
    return UNVERIFIED_IMAGE_HOSTS.some((known) => host === known || host.endsWith(`.${known}`));
  } catch {
    return false;
  }
}

export function safeImageUrl(url?: string | null): string {
  return url && !isUnverifiedStockImage(url) ? url : '';
}
