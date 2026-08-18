import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { HomePage as OriginalHomePage } from '../HomePage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

export const HomePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    services?: any[];
    therapists?: any[];
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [t, b] = await Promise.all([
          api.getTestimonials().catch(() => []),
          api.getBlogs().catch(() => []),
        ]);
        if (Array.isArray(t)) setTestimonials(t);
        if (Array.isArray(b)) setBlogs(b);
      } catch (err) {
        // keep empty state
      }
    })();
  }, []);

  return (
    <OriginalHomePage
      settings={context.settings || mockSettings}
      services={context.services ?? []}
      therapists={context.therapists ?? []}
      testimonials={testimonials}
      blogs={blogs}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default HomePageWrapper;
