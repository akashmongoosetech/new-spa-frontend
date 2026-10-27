import React, { useEffect, useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import {
  analyticsConfigured,
  getConsentChoice,
  setConsentChoice,
} from '../../utils/analytics';

/**
 * Optional analytics is only requested when a GA4 measurement ID is configured.
 * Accept and Reject are equally prominent; rejecting keeps all booking and
 * contact forms functional.
 */
export const CookieConsent: React.FC = () => {
  const configured = analyticsConfigured();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!configured) return;
    setVisible(getConsentChoice() === null);
    const openSettings = () => setVisible(true);
    window.addEventListener('tripod-open-consent', openSettings);
    return () => window.removeEventListener('tripod-open-consent', openSettings);
  }, [configured]);

  if (!configured || !visible) return null;

  const choose = (choice: 'granted' | 'denied') => {
    setConsentChoice(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie and analytics consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-[#BFA476]/40 bg-[#17130F] p-5 text-gray-200 shadow-2xl sm:bottom-5 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-[var(--brand-ink)]">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">Your privacy choices</h2>
          <p className="text-xs leading-relaxed text-gray-400">
            Essential storage keeps booking and contact forms working. With your permission, we
            also use Google Analytics 4 to measure page views and successful form submissions. We
            do not configure advertising or remarketing. Read the{' '}
            <a
              href="/cookie-policy"
              className="font-semibold text-[var(--brand-ink)] underline underline-offset-2"
            >
              Cookie & Consent Policy
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand-ink)]" />
            <span>Rejecting analytics does not block the site.</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="flex-1 rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10 sm:flex-none"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="flex-1 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-brand-950 transition-colors hover:bg-brand-400 sm:flex-none"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
