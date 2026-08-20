import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { updatePageSEO, getSEOPresets } from '../../utils/seo';

export const RouteMetadataManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/admin')) {
      updatePageSEO({
        title: 'Tripod Wellness | Executive CRM & Sanctuary Management',
        description: 'Secure administrative management portal for client bookings, therapist schedules, and sanctuary operations.',
        path,
        robots: 'noindex, nofollow',
      });
      return;
    }

    let presetName = 'home';
    if (path.startsWith('/services')) presetName = 'services';
    else if (path.startsWith('/booking')) presetName = 'booking';
    else if (path.startsWith('/gallery')) presetName = 'gallery';
    else if (path.startsWith('/therapists')) presetName = 'therapists';
    else if (path.startsWith('/blog')) presetName = 'blog';

    const preset = getSEOPresets(presetName);
    updatePageSEO({
      ...preset,
      path,
    });
  }, [location.pathname]);

  return null;
};

export default RouteMetadataManager;
