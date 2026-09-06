import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { BlogPost } from '../../types';
import { BlogPage as OriginalBlogPage } from '../BlogPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const BlogPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getPublicBlogs();
        if (Array.isArray(data)) setBlogs(data);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Failed to load articles');
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner fullScreen label="Loading wellness articles..." />;
  if (error) return <div className="py-12 text-center text-gray-500">{error}</div>;
  if (blogs.length === 0) return <div className="py-12 text-center text-gray-500">No articles available at the moment.</div>;

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
