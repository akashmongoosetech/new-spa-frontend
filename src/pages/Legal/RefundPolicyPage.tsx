import React from 'react';
import { SEO } from '../../components/ui/SEO';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans min-h-screen">
      <SEO title="Refund & Cancellation Policy | Tripod Wellness" description="Read our client-first cancellation and refund policies." />
      <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Refund & Cancellation Policy</h1>
        <p className="text-sm text-gray-500">Last Updated: January 2026</p>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-light">
          <h2 className="text-lg font-bold text-gray-900">1. Appointment Cancellations</h2>
          <p>We respect your busy schedule. Cancellations made at least 4 hours prior to your scheduled session will incur zero fees.</p>
          <h2 className="text-lg font-bold text-gray-900">2. Refund Processing</h2>
          <p>Pre-paid bookings canceled within the allowable window will be refunded to the original payment method within 3–5 business days.</p>
          <h2 className="text-lg font-bold text-gray-900">3. Gift Cards & Packages</h2>
          <p>Gift vouchers and multi-session packages are non-refundable but remain valid indefinitely and are transferable.</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
