import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Eye, Trash2, Search, Filter, ChevronLeft, ChevronRight, Globe, Star, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { BlogPost } from '../../types';

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featureFilter, setFeatureFilter] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogs();
      if (Array.isArray(data)) {
        setBlogs(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Load Failed', message: 'Failed to load articles.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.therapistName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesFeature = featureFilter === 'all' || 
      (featureFilter === 'featured' && b.featureOnHomePage) || 
      (featureFilter === 'not-featured' && !b.featureOnHomePage);
    
    return matchesSearch && matchesStatus && matchesFeature;
  });

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await api.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      showToast({ type: 'success', title: 'Deleted', message: 'Article deleted successfully.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err?.message || 'Failed to delete article.' });
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      const updated = await api.toggleBlogPublish(blog.id);
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      showToast({ type: 'success', title: 'Updated', message: `Article ${updated.published ? 'published' : 'unpublished'}.` });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err?.message || 'Failed to update article.' });
    }
  };

  const handleToggleFeature = async (blog: BlogPost) => {
    try {
      const updated = await api.toggleBlogFeature(blog.id);
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      showToast({ type: 'success', title: 'Updated', message: `Article ${updated.featureOnHomePage ? 'featured' : 'unfeatured'} on homepage.` });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err?.message || 'Failed to update article.' });
    }
  };

  const handleToggleStatus = async (blog: BlogPost) => {
    try {
      const updated = await api.toggleBlogStatus(blog.id);
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? updated : b)));
      showToast({ type: 'success', title: 'Updated', message: `Article ${updated.status === 'active' ? 'activated' : 'deactivated'}.` });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update Failed', message: err?.message || 'Failed to update article.' });
    }
  };

  const getStatusBadge = (blog: BlogPost) => {
    if (blog.status === 'inactive') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">Inactive</span>;
    }
    if (!blog.published) {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700">Draft</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Published</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Blog Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage articles, wellness guides, and featured content</p>
        </div>
        <Link
          to="/admin/blogs/add"
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Compose New Article
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by title, slug, author, therapist, tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#2CB5A0] focus:ring-1 focus:ring-[#2CB5A0]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#2CB5A0]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={featureFilter}
              onChange={(e) => { setFeatureFilter(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#2CB5A0]"
            >
              <option value="all">All</option>
              <option value="featured">Featured on Home</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Loader2 className="w-8 h-8 text-[#2CB5A0] animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-sm text-gray-400">
          No articles found. Add your first article using the button above.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">Featured Image</th>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Therapist / Author</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Read Time</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4">
                      {b.imageUrl && (
                        <img src={b.imageUrl} alt={b.title} className="w-16 h-10 object-cover rounded-lg" />
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900 max-w-xs truncate" title={b.title}>{b.title}</td>
                    <td className="p-4 text-gray-600">
                      <div>{b.therapistName || b.author}</div>
                      {b.therapistName && <div className="text-[10px] text-gray-400">by {b.author}</div>}
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-[10px] max-w-xs truncate">{b.slug}</td>
                    <td className="p-4">{getStatusBadge(b)}</td>
                    <td className="p-4">
                      {b.featureOnHomePage ? (
                        <span title="Featured on Homepage"><Star className="w-4 h-4 text-[#C7A36A] mx-auto" /></span>
                      ) : (
                        <span className="text-gray-300 text-center block">—</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{b.readTime}</td>
                    <td className="p-4 text-gray-500 text-[10px]">{new Date(b.date || b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/blog/${b.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-500 hover:text-[#2CB5A0] inline-block"
                        title="View on site"
                      >
                        <Globe className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${b.id}`}
                        className="p-1.5 text-gray-500 hover:text-[#2CB5A0] inline-block"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(b)}
                        className={`p-1.5 inline-block ${b.published ? 'text-emerald-600' : 'text-gray-500'} hover:text-emerald-600`}
                        title={b.published ? 'Unpublish' : 'Publish'}
                      >
                        {b.published ? <Globe className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeature(b)}
                        className={`p-1.5 inline-block ${b.featureOnHomePage ? 'text-[#C7A36A]' : 'text-gray-500'} hover:text-[#C7A36A]`}
                        title={b.featureOnHomePage ? 'Remove from Home' : 'Feature on Home'}
                      >
                        <Star className={b.featureOnHomePage ? 'w-4 h-4 fill-current' : 'w-4 h-4'} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(b)}
                        className={`p-1.5 inline-block ${b.status === 'active' ? 'text-emerald-600' : 'text-gray-500'} hover:text-emerald-600`}
                        title={b.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {b.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 inline-block cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page {currentPage} of {totalPages} • {filteredBlogs.length} articles
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBlogsPage;
