import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AboutPage as OriginalAboutPage } from '../AboutPage';
import { mockTherapists, mockSettings } from '../../data/mockData';

export const AboutPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    therapists?: typeof mockTherapists;
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalAboutPage
      settings={context.settings || mockSettings}
      therapists={context.therapists || mockTherapists}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default AboutPageWrapper;
