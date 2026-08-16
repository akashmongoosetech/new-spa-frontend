import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ContactPage as OriginalContactPage } from '../ContactPage';
import { mockSettings } from '../../data/mockData';

export const ContactPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalContactPage
      settings={context.settings || mockSettings}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default ContactPageWrapper;
