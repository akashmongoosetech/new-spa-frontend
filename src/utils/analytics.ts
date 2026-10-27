/**
 * Consent-gated Google Analytics 4 loader.
 *
 * The measurement ID is supplied at build time through VITE_GA_MEASUREMENT_ID.
 * Nothing is loaded or sent until the visitor grants optional analytics
 * consent, and no advertising/remarketing features are configured.
 */
const MEASUREMENT_ID = String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
const CONSENT_KEY = 'tripod_consent_v1';
const PENDING_CONVERSION_KEY = 'tripod_conversion_pending_v1';

export type ConsentChoice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let scriptLoaded = false;

export function analyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}

export function getConsentChoice(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function setConsentChoice(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage can be unavailable in private modes; the choice still applies
    // for the current page load through the event below.
  }
  window.dispatchEvent(new CustomEvent('tripod-consent-change', { detail: choice }));
}

function ensureGtag(): void {
  if (!MEASUREMENT_ID || scriptLoaded) return;
  scriptLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  script.dataset.tripodAnalytics = 'true';
  document.head.appendChild(script);
}

export function trackPageView(path: string): void {
  if (getConsentChoice() !== 'granted' || !MEASUREMENT_ID) return;
  ensureGtag();
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
    send_to: MEASUREMENT_ID,
  });
}

export type ConversionType = 'booking' | 'contact' | 'newsletter' | 'application';

/**
 * Mark a genuine submission immediately before redirecting to /thank-you. The
 * thank-you page consumes this flag once, so a direct visit to the URL does not
 * count as a conversion.
 */
export function markConversionPending(type: ConversionType): void {
  try {
    sessionStorage.setItem(PENDING_CONVERSION_KEY, type);
  } catch {
    // Ignore storage limitations; the conversion simply will not be counted.
  }
}

export function consumeConversionPending(type: ConversionType): boolean {
  try {
    if (sessionStorage.getItem(PENDING_CONVERSION_KEY) !== type) return false;
    sessionStorage.removeItem(PENDING_CONVERSION_KEY);
    return true;
  } catch {
    return false;
  }
}

export function trackConversion(type: ConversionType): void {
  if (getConsentChoice() !== 'granted' || !MEASUREMENT_ID) return;
  ensureGtag();
  window.gtag?.('event', 'generate_lead', {
    form_type: type,
    send_to: MEASUREMENT_ID,
  });
}
