import React, { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calendar, MessageCircle } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { trackConversion, consumeConversionPending } from '../utils/analytics';

type SubmissionType = 'contact' | 'booking' | 'newsletter' | 'application';

const COPY: Record<SubmissionType, { title: string; body: string }> = {
  contact: {
    title: 'Your message has been received',
    body: 'The concierge will review your message and reply using the contact details you provided.',
  },
  booking: {
    title: 'Your booking request has been received',
    body: 'The concierge will confirm availability before the appointment. Keep your booking reference for any follow-up.',
  },
  newsletter: {
    title: 'Your subscription request has been received',
    body: 'You will receive Tripod Wellness updates at the email address you provided. You can unsubscribe at any time.',
  },
  application: {
    title: 'Your staff application has been received',
    body: 'A director will review your application. Portal access is granted only after approval.',
  },
};

function isSubmissionType(value: string | null): value is SubmissionType {
  return value === 'contact' || value === 'booking' || value === 'newsletter' || value === 'application';
}

export const ThankYouPage: React.FC = () => {
  const [params] = useSearchParams();
  const rawType = params.get('type');
  const type: SubmissionType = isSubmissionType(rawType) ? rawType : 'contact';
  const copy = COPY[type];
  const bookingRef =
    type === 'booking' && typeof window !== 'undefined'
      ? window.sessionStorage.getItem('tripod_booking_reference') || ''
      : '';
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    if (!consumeConversionPending(type)) return;
    trackConversion(type);
  }, [type]);

  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] px-4 py-16 font-sans sm:px-6">
      <SEO
        title="Thank You for Contacting Tripod Wellness"
        description="Your Tripod Wellness request has been received. Review the next steps or contact the concierge if you need to update your details."
        path="/thank-you"
        robots="noindex, nofollow"
      />
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-ink)]">
          Tripod Wellness
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900">{copy.title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{copy.body}</p>

        {type === 'booking' && bookingRef && (
          <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Booking reference
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-[var(--brand-ink)]">{bookingRef}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {type === 'booking' ? (
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950 transition-colors hover:bg-brand-400"
            >
              <MessageCircle className="h-4 w-4" /> Contact concierge
            </Link>
          ) : (
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950 transition-colors hover:bg-brand-400"
            >
              <Calendar className="h-4 w-4" /> Book an appointment
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-[#BFA476]"
          >
            Return home <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
