import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import { BlogPage as OriginalBlogPage } from '../BlogPage';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SEO } from '../../components/ui/SEO';

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

  if (error || blogs.length === 0) {
    return (
      <div className="py-16 bg-[#FAFAFA] font-sans min-h-screen">
        <SEO
          title="Men's Wellness Journal | Tripod Wellness"
          description="Read the Tripod Wellness journal for men's massage, recovery and wellness guides. Articles are published only when verified content is available."
          robots="noindex, nofollow"
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-[var(--brand-ink)]">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Men's Wellness Journal
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            {error
              ? 'The journal could not be loaded right now. Please try again later or contact the concierge.'
              : 'Verified articles are being prepared. In the meantime, explore our therapies or contact the concierge with a question.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-brand-950 hover:bg-brand-400 transition-colors"
            >
              View therapies <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 hover:border-[#BFA476] transition-colors"
            >
              Contact concierge
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
