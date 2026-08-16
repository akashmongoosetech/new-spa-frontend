import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { HomePage as OriginalHomePage } from '../HomePage';
import { mockServices, mockTherapists, mockTestimonials, mockBlogs, mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

export const HomePageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    services?: typeof mockServices;
    therapists?: typeof mockTherapists;
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [blogs, setBlogs] = useState(mockBlogs);

  useEffect(() => {
    (async () => {
      try {
        const [t, b] = await Promise.all([
          api.getTestimonials().catch(() => []),
          api.getBlogs().catch(() => []),
        ]);
        if (Array.isArray(t) && t.length > 0) setTestimonials(t as any);
        if (Array.isArray(b) && b.length > 0) setBlogs(b as any);
      } catch (err) {
        // keep mock fallbacks
      }
    })();
  }, []);

  return (
    <OriginalHomePage
      settings={context.settings || mockSettings}
      services={context.services || mockServices}
      therapists={context.therapists || mockTherapists}
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
