import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Calendar, MessageCircle } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#FAFAFA] p-6 text-[#1A1A1A]">
      <SEO
        title="Page Not Found | Tripod Wellness"
        description="The page you requested could not be found. Return to Tripod Wellness or browse therapies, therapists, booking and contact pages."
        robots="noindex, nofollow"
      />
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-[var(--brand-ink)]">
          <Compass className="h-8 w-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-ink)]">
          Error 404
        </span>
        <h1 className="mb-3 mt-2 font-serif text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">
          The requested page could not be found. It may have been moved, renamed, or removed.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-500 hover:text-brand-950"
          >
            <Home className="h-4 w-4" />
            Return home
          </Link>
          <Link
            to="/booking"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4" />
            Book appointment
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-500">
          <Link to="/services" className="hover:text-[var(--brand-ink)]">
            Therapies
          </Link>
          <Link to="/therapists" className="hover:text-[var(--brand-ink)]">
            Therapists
          </Link>
          <Link to="/contact" className="inline-flex items-center gap-1 hover:text-[var(--brand-ink)]">
            <MessageCircle className="h-3.5 w-3.5" /> Contact
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 hover:text-[var(--brand-ink)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
