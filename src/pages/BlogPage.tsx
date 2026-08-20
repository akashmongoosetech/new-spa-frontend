import React, { useState } from 'react';
import { Search, Clock, User, Tag, BookOpen, ArrowRight } from 'lucide-react';
import { BlogPost, BusinessSettings } from '../types';
import { Modal } from '../components/ui/Modal';
import { SEO } from '../components/ui/SEO';

interface BlogPageProps {
  blogs: BlogPost[];
  settings?: BusinessSettings;
  onOpenBooking?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);

  const categories = ['all', 'Wellness & Health', 'Therapy Guide', 'Lifestyle'];

  const safeBlogs = blogs || [];
  const filteredBlogs = safeBlogs.filter(b => {
    if (!b) return false;
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch = (b.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 bg-[#FAFAFA] font-sans min-h-screen">
      <SEO title="Men's Health & Wellness Articles | Tripod Wellness Blog" description="Read articles on deep tissue recovery, Swedish comparison guides, and executive health maintenance." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2CB5A0] bg-teal-50 px-3 py-1 rounded-full">
            Executive Health Insights
          </span>
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            Men's Wellness & Bodywork Journal
          </h1>
          <p className="text-xs text-gray-600">
            Articles written by our certified therapists on athletic recovery, stress management, and posture maintenance.
          </p>
        </div>

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wellness articles..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0]"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === c ? 'bg-[#2CB5A0] text-white' : 'bg-white border text-gray-700 hover:bg-gray-50'
                }`}
              >
                {c === 'all' ? 'All Topics' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map(blog => (
            <article key={blog.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <span className="text-[#2CB5A0] font-bold">{blog.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  </div>
                  <h2 className="text-lg font-serif font-bold text-gray-900 leading-snug hover:text-[#2CB5A0] transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between text-xs pt-4">
                <span className="text-gray-500 font-medium">By {blog.author}</span>
                <button
                  onClick={() => setReadingBlog(blog)}
                  className="font-bold text-[#2CB5A0] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Read Article →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Modal isOpen={!!readingBlog} onClose={() => setReadingBlog(null)} maxWidth="2xl">
        {readingBlog && (
          <div className="space-y-4 font-sans">
            <span className="text-xs font-bold text-[#2CB5A0] uppercase">{readingBlog.category} • {readingBlog.date}</span>
            <h2 className="text-2xl font-serif font-bold text-gray-900 leading-snug">{readingBlog.title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3.5 h-3.5 text-[#2CB5A0]" />
              <span>Written by {readingBlog.author}</span>
              <span>•</span>
              <span>{readingBlog.readTime}</span>
            </div>
            <img src={readingBlog.imageUrl} alt={readingBlog.title} className="w-full h-60 object-cover rounded-2xl" />
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{readingBlog.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
