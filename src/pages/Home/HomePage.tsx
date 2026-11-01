import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { HomePage as OriginalHomePage } from '../HomePage';
import { mockSettings } from '../../data/mockData';

export const HomePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    services?: any[];
    therapists?: any[];
    settings?: typeof mockSettings;
    servicesLoading?: boolean;
    therapistsLoading?: boolean;
    servicesError?: boolean;
    therapistsError?: boolean;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalHomePage
      settings={context.settings || mockSettings}
      services={context.services ?? []}
      therapists={context.therapists ?? []}
      servicesLoading={context.servicesLoading}
      therapistsLoading={context.therapistsLoading}
      servicesError={context.servicesError}
      therapistsError={context.therapistsError}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default HomePageWrapper;
