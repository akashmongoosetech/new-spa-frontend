import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, Phone, Mail } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { mockSettings } from '../../data/mockData';

export const RefundPolicyPage: React.FC = () => {
  const context = useOutletContext<{ settings?: BusinessSettings }>() || {};
  const settings = context.settings || mockSettings;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 font-sans">
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <div className="space-y-2 text-center">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
            Legal Information
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Refund & Cancellation Policy</h1>
          <p className="text-xs text-gray-500">Draft — October 2026</p>
        </div>

        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="space-y-1.5 text-xs leading-relaxed">
              <p className="text-sm font-extrabold uppercase tracking-wide">
                TEMPLATE — REVIEW BEFORE PUBLICATION
              </p>
              <p>
                Cancellation windows, fees and refund methods have not been confirmed by the owner.
                Contact the concierge for the current terms before booking. This page is not indexed
                until the policy is reviewed.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-8 text-xs leading-relaxed text-gray-700 shadow-sm">
          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-gray-900">Cancellations and rescheduling</h2>
            <p>
              The cancellation and rescheduling window is [OWNER TO CONFIRM]. Contact the concierge as
              early as possible if your plans change so the appointment can be reviewed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-gray-900">Payments and refunds</h2>
            <p>
              The current website does not process online card, UPI or wallet payments. Unless the
              concierge confirms another payment method in writing, payment is made at the venue.
              Any refund method and processing time must be confirmed by the owner: [OWNER TO CONFIRM
              REFUND METHOD AND TIMELINE].
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-gray-900">Packages and vouchers</h2>
            <p>
              Terms for packages, vouchers or prepaid sessions are [OWNER TO CONFIRM]. Do not assume
              transferability, expiry or refund rights until the owner confirms them.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-base font-bold text-gray-900">Contact</h2>
            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-6">
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 font-semibold text-[var(--brand-ink)]">
                  <Phone className="h-4 w-4" /> {settings.phone}
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 font-semibold text-[var(--brand-ink)]">
                  <Mail className="h-4 w-4" /> {settings.email}
                </a>
              )}
            </div>
          </section>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-[11px] text-gray-600">
            <strong>Review notes:</strong> confirm the notice period, late-cancellation fee, no-show
            policy, refund method, processing time, package/voucher terms and the legal entity.
            Remove this box and the template banner before publication.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
