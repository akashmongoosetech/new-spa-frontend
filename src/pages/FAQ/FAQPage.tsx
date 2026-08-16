import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { FAQPage as OriginalFAQPage } from '../FAQPage';
import { mockFaqs, mockSettings } from '../../data/mockData';

export const FAQPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalFAQPage
      faqs={mockFaqs}
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
