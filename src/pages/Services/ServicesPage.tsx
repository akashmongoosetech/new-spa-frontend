import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServicesPage as OriginalServicesPage } from '../ServicesPage';
import { mockSettings } from '../../data/mockData';

export const ServicesPageWrapper: React.FC = () => {
  const context = useOutletContext<{
    services?: any[];
    settings?: typeof mockSettings;
    servicesLoading?: boolean;
    servicesError?: boolean;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalServicesPage
      services={context.services ?? []}
      settings={context.settings || mockSettings}
      servicesLoading={context.servicesLoading}
      servicesError={context.servicesError}
      onOpenBooking={context.onOpenBooking || (() => {})}
    />
  );
};

export default ServicesPageWrapper;
