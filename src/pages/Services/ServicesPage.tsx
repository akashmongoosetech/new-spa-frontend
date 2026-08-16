import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ServicesPage as OriginalServicesPage } from '../ServicesPage';
import { mockServices, mockSettings } from '../../data/mockData';

export const ServicesPageWrapper: React.FC = () => {
  const context = useOutletContext<{
    services?: typeof mockServices;
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalServicesPage
      services={context.services || mockServices}
      settings={context.settings || mockSettings}
      onOpenBooking={context.onOpenBooking || (() => {})}
    />
  );
};

export default ServicesPageWrapper;
