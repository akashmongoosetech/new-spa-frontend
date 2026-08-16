import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GalleryPage as OriginalGalleryPage } from '../GalleryPage';
import { mockSettings } from '../../data/mockData';

export const GalleryPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  return (
    <OriginalGalleryPage
      settings={context.settings || mockSettings}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default GalleryPageWrapper;
