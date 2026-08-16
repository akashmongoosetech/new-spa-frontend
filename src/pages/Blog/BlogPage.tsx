import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { BlogPage as OriginalBlogPage } from '../BlogPage';
import { mockBlogs, mockSettings } from '../../data/mockData';
import { api } from '../../services/api';

export const BlogPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [blogs, setBlogs] = useState(mockBlogs);

  useEffect(() => {
    (async () => {
      try {
        const b = await api.getBlogs();
        if (Array.isArray(b) && b.length > 0) setBlogs(b as any);
      } catch (err) {
        // keep mock fallback
      }
    })();
  }, []);

  return (
    <OriginalBlogPage
      blogs={blogs}
      settings={context.settings || mockSettings}
      onOpenBooking={context.onOpenBooking || (() => {})}
      setActiveTab={(tab) => {
        if (tab === 'home') navigate('/');
        else navigate(`/${tab}`);
      }}
    />
  );
};

export default BlogPageWrapper;
