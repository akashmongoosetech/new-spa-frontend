import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const PUBLIC_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Therapies & Prices', path: '/services' },
  { label: 'About Tripod Wellness', path: '/about' },
  { label: 'Male Massage Therapists', path: '/therapists' },
  { label: 'Facility Gallery', path: '/gallery' },
  { label: 'Wellness Journal', path: '/blog' },
  { label: 'Request Appointment', path: '/booking' },
  { label: 'Contact Concierge', path: '/contact' },
  { label: 'Frequently Asked Questions', path: '/faq' },
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  { label: 'Refund & Cancellation Policy', path: '/refund-policy' },
  { label: 'Cookie & Consent Policy', path: '/cookie-policy' },
];

export const SitemapPage: React.FC = () => {
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Compass className="h-8 w-8 text-[var(--brand-ink)]" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Site Map</h1>
            <p className="mt-1 text-xs font-light text-gray-500">
              Public pages for Tripod Wellness
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-2">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-4 text-sm font-medium text-gray-800 transition-all hover:border-[#BFA476] hover:bg-brand-500/5 hover:text-[var(--brand-ink)]"
            >
              <span>{link.label}</span>
              <span className="font-mono text-xs text-gray-400">{link.path}</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          Legal pages marked as drafts are not indexed until the business owner and a qualified
          adviser review them.
        </p>
      </div>
    </div>
  );
};

export default SitemapPage;
