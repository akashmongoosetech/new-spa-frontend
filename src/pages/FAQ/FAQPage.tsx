import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FAQ as FaqType } from '../../types';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { FAQPage as OriginalFAQPage } from '../FAQPage';

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
        // Add cache-busting param
        const data = await api.getFaqs('true');
        // Filter for published FAQs only (defense in depth)
        const publishedFaqs = data.filter((f: FaqType) => f.isPublished !== 0);
        setFaqs(publishedFaqs);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load FAQs');
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12">Loading FAQs...</div>;
  if (error) return <div className="py-12 text-center">Error loading FAQs. Please try again later.</div>;
  if (faqs.length === 0) return <div className="py-12 text-center">No FAQs currently available.</div>;

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