import React from 'react';
import { ShieldCheck, FileText, Lock } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

interface LegalPagesProps {
  type: 'privacy' | 'terms' | 'cookies';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy & Data Security',
    terms: 'Terms of Service & Spa Etiquette',
    cookies: 'Cookie & Tracking Policy'
  };

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO title={`${titles[type]} | Aura Luxe Spa`} description="Read our executive privacy policy, terms of service, and cookie disclosures." />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Legal Compliance
          </span>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            {titles[type]}
          </h1>
          <p className="text-xs text-gray-500">Last updated: January 2026</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 text-xs text-gray-700 leading-relaxed">
          {type === 'privacy' && (
            <>
              <h2 className="text-base font-serif font-bold text-gray-900">1. Client Confidentiality & Anonymity</h2>
              <p>Aura Luxe strictly safeguards all client data, contact details, and appointment histories. We do not sell, rent, or distribute client information to third parties.</p>

              <h2 className="text-base font-serif font-bold text-gray-900">2. Information We Collect</h2>
              <p>When reserving a massage session, we collect your name, phone number, email address, and optional muscle focus notes for therapist preparation.</p>

              <h2 className="text-base font-serif font-bold text-gray-900">3. Payment & Data Security</h2>
              <p>All financial transactions processed online use 256-bit SSL encryption. Payment data is never stored locally on our web servers.</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h2 className="text-base font-serif font-bold text-gray-900">1. Code of Professional Conduct</h2>
              <p>Aura Luxe operates as a licensed, strictly therapeutic massage therapy spa. Professional behavior is expected from all guests at all times.</p>

              <h2 className="text-base font-serif font-bold text-gray-900">2. Cancellation & Rescheduling</h2>
              <p>Appointments may be rescheduled or cancelled up to 4 hours prior to slot time. Late cancellations may incur a fee.</p>

              <h2 className="text-base font-serif font-bold text-gray-900">3. Health & Medical Conditions</h2>
              <p>Guests must notify their therapist of any cardiovascular conditions, recent surgeries, or skin allergies prior to session start.</p>
            </>
          )}

          {type === 'cookies' && (
            <>
              <h2 className="text-base font-serif font-bold text-gray-900">1. Cookie Usage</h2>
              <p>We use essential functional cookies to remember your session preferences, active booking state, and dark mode toggles.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
