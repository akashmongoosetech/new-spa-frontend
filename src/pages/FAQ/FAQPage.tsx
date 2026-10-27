import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { FAQ as FaqType } from '../../types';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { FAQPage as OriginalFAQPage } from '../FAQPage';
import { SEO } from '../../components/ui/SEO';

export const FAQPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [faqs, setFaqs] = useState<FaqType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getFaqs('true');
        const publishedFaqs = data.filter((f: FaqType) => f.isPublished !== 0);
        setFaqs(publishedFaqs);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load FAQs');
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-12 text-sm text-gray-500">
        Loading FAQs...
      </div>
    );
  }

  if (error || faqs.length === 0) {
    return (
      <div className="py-16 bg-[#FAFAFA] font-sans min-h-screen">
        <SEO
          title="Frequently Asked Questions | Tripod Wellness"
          description="Find answers about Tripod Wellness appointments, massage therapies, booking and privacy. Contact the concierge if your question is not listed."
          robots="noindex, nofollow"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-[var(--brand-ink)]">
            <HelpCircle className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {error
              ? 'The FAQ page could not be loaded right now. Please try again later or contact the concierge.'
              : 'Verified answers are being prepared. If you have a question about appointments, therapies or privacy, the concierge can help.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950 hover:bg-brand-400 transition-colors"
            >
              Contact concierge <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 hover:border-[#BFA476] transition-colors"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OriginalFAQPage
      faqs={faqs}
      settings={context.settings || mockSettings}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default FAQPageWrapper;
