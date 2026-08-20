import React, { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { Clock, User, Tag, ArrowLeft, Calendar } from 'lucide-react';
import { mockSettings } from '../../data/mockData';
import { api } from '../../services/api';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import NotFound from '../NotFound';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const context = useOutletContext<{
    settings?: typeof mockSettings;
    onOpenBooking?: (serviceId?: string) => void;
  }>() || {};

  const settings = context.settings || mockSettings;
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const b = await api.getBlogs();
        if (Array.isArray(b)) setBlogs(b);
      } catch (err) {
        // keep empty state
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const blog = blogs.find(
    (b) => b.slug === slug || b.id === slug
  );

  if (!loaded) {
    return <LoadingSpinner fullScreen label="Loading article..." />;
  }

  if (!blog) {
    return <NotFound />;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans min-h-screen">
      <SEO
        title={`${blog.title} | ${settings.businessName} Blog`}
        description={blog.summary}
      />

      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#2CB5A0] mb-8 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Wellness Journal
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2CB5A0] uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{blog.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gray-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-b pb-6">
            <div className="flex items-center gap-1.5 font-medium text-gray-800">
              <User className="w-4 h-4 text-[#2CB5A0]" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 font-light leading-relaxed space-y-6">
          <p className="text-xl text-gray-800 font-normal leading-relaxed border-l-4 border-[#2CB5A0] pl-4 italic">
            {blog.summary}
          </p>
          <div className="whitespace-pre-line text-base text-gray-700 leading-relaxed">
            {blog.content}
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex items-center gap-2 pt-6 border-t">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-linear-to-r from-[#1A1A1A] to-[#2A2A2A] text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-serif font-bold text-[#C7A36A]">Experience Restorative Healing</h3>
            <p className="text-xs text-gray-300 font-light">Book your personalized therapeutic session with our licensed specialists.</p>
          </div>
          <button
            onClick={() => context.onOpenBooking?.()}
            className="px-6 py-3 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
          >
            Reserve Session
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
