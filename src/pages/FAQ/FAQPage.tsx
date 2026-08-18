import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FAQPage as OriginalFAQPage } from '../FAQPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

export const FAQPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const f = await api.getFaqs();
        if (Array.isArray(f)) setFaqs(f);
      } catch (err) {
        // keep empty state
      }
    })();
  }, []);

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