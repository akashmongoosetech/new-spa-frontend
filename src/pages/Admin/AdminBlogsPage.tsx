import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  FileText,
  Filter,
  Globe,
  Loader2,
  Plus,
  Search,
  Settings2,
  Star,
  Trash2,
} from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';
import { BlogCategory, BlogPost, BlogStatus, PaginationMeta } from '../../types';
import { DeleteModal } from '../../components/ui/DeleteModal';
import { BlogCategoryManager } from '../../components/admin/BlogCategoryManager';

const DEFAULT_PAGINATION: PaginationMeta = { page: 1, limit: 10, total: 0, totalPages: 1 };

export const AdminBlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BlogStatus>('all');
  const [featureFilter, setFeatureFilter] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sort, setSort] = useState('-updatedAt');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      setCategories(await api.getBlogCategories());
    } catch {
      // The category filter remains optional if this request fails.
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getAdminBlogs({
        page,
        limit,
        q: debouncedQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        category: categoryFilter || undefined,
        isFeatured: featureFilter === 'all' ? undefined : featureFilter === 'featured',
        sort,
      });
      setBlogs(result.items);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err?.message || 'Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, limit, debouncedQuery, statusFilter, featureFilter, categoryFilter, sort]);

  const refresh = async (nextPage = page) => {
    if (nextPage !== page) {
      setPage(nextPage);
      return;
    }
    await fetchBlogs();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteBlog(deleteTarget.id);
      setDeleteTarget(null);
      showToast({ type: 'success', title: 'Deleted', message: 'Article deleted successfully.' });
      const nextPage = blogs.length === 1 && page > 1 ? page - 1 : page;
      await refresh(nextPage);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete failed', message: err?.message || 'Failed to delete article.' });
      throw err;
    }
  };

  const handleStatus = async (blog: BlogPost) => {
    const nextStatus: BlogStatus = blog.status === 'published' ? 'unpublished' : 'published';
    if (nextStatus === 'unpublished' && !window.confirm('Unpublish this article? It will be removed from the public site, sitemap and related posts.')) {
      return;
    }
    setBusyId(blog.id);
    try {
      const updated = await api.setBlogStatus(blog.id, nextStatus);
      setBlogs((current) => current.map((item) => (item.id === blog.id ? updated : item)));
      showToast({
        type: 'success',
        title: nextStatus === 'published' ? 'Published' : 'Unpublished',
        message: nextStatus === 'published' ? 'The article is now live.' : 'The article is hidden from the public site.',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Status update failed', message: err?.message || 'Could not update the article status.' });
    } finally {
      setBusyId(null);
    }
  };

  const handleFeature = async (blog: BlogPost) => {
    setBusyId(blog.id);
    try {
      const updated = await api.setBlogFeatured(blog.id, !blog.isFeatured);
      setBlogs((current) => current.map((item) => (item.id === blog.id ? updated : item)));
      showToast({
        type: 'success',
        title: updated.isFeatured ? 'Featured' : 'Unfeatured',
        message: updated.isFeatured ? 'Article marked as featured.' : 'Article removed from featured content.',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Update failed', message: err?.message || 'Could not update featured status.' });
    } finally {
      setBusyId(null);
    }
  };

  const statusBadge = (blog: BlogPost) => {
    if (blog.status === 'published') return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Published</span>;
    if (blog.status === 'unpublished') return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">Unpublished</span>;
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Draft</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Blog Management</h1>
          <p className="mt-1 text-xs text-gray-500">Create, review and publish the Tripod Wellness journal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCategoryManagerOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:border-[#BFA476]">
            <Settings2 className="h-4 w-4" /> Categories
          </button>
          <Link to="/admin/blogs/add" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-brand-950 shadow-sm hover:bg-brand-400">
            <Plus className="h-4 w-4" /> New article
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1 xl:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title, slug, author, category or tag..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs focus:border-[#BFA476] focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as any); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="unpublished">Unpublished</option>
            </select>
            <select value={featureFilter} onChange={(event) => { setFeatureFilter(event.target.value as any); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none">
              <option value="all">All articles</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not featured</option>
            </select>
            <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} className="max-w-44 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none">
              <option value="">All categories</option>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs focus:border-[#BFA476] focus:outline-none">
              <option value="-updatedAt">Recently updated</option>
              <option value="-publishedAt">Recently published</option>
              <option value="-createdAt">Newest created</option>
              <option value="title">Title A–Z</option>
              <option value="-title">Title Z–A</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-[var(--brand-ink)]" />
          <p className="text-sm text-gray-500">Loading articles...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <h2 className="text-sm font-bold text-gray-800">No articles match these filters</h2>
          <p className="mt-1 text-xs text-gray-500">Clear the filters or compose a new article.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-gray-50 font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="p-4">Article</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Reading</th>
                  <th className="p-4">Published / updated</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/80">
                    <td className="p-4">
                      <div className="flex min-w-56 items-center gap-3">
                        {blog.imageUrl ? (
                          <img src={blog.imageUrl} alt={blog.featuredImageAlt || ''} className="h-11 w-16 rounded-lg object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-11 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-300"><FileText className="h-4 w-4" /></div>
                        )}
                        <div className="min-w-0">
                          <p className="max-w-sm truncate font-bold text-gray-900" title={blog.title}>{blog.title}</p>
                          <p className="max-w-sm truncate font-mono text-[10px] text-gray-400">/blog/{blog.slug}/</p>
                          {(blog.author || blog.therapistName) && <p className="mt-0.5 text-[10px] text-gray-500">{blog.author || blog.therapistName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{blog.category || <span className="text-gray-400">Uncategorised</span>}</td>
                    <td className="p-4">{statusBadge(blog)}</td>
                    <td className="p-4">
                      <button type="button" onClick={() => handleFeature(blog)} disabled={busyId === blog.id} title={blog.isFeatured ? 'Remove from featured' : 'Feature article'} className={`rounded-lg p-1.5 ${blog.isFeatured ? 'text-[var(--brand-ink)]' : 'text-gray-300 hover:text-[var(--brand-ink)]'}`}>
                        {busyId === blog.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${blog.isFeatured ? 'fill-current' : ''}`} />}
                      </button>
                    </td>
                    <td className="p-4 text-gray-600">{blog.readTime}</td>
                    <td className="p-4 text-[10px] text-gray-500">
                      <div>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN') : 'Not published'}</div>
                      {blog.updatedAt && <div className="text-gray-400">Updated {new Date(blog.updatedAt).toLocaleDateString('en-IN')}</div>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        {blog.status === 'published' && (
                          <a href={`/blog/${blog.slug}/`} target="_blank" rel="noreferrer" title="View live article" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-ink)]">
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <Link to={`/admin/blogs/edit/${blog.id}`} title="Edit article" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-ink)]">
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button type="button" onClick={() => handleStatus(blog)} disabled={busyId === blog.id} title={blog.status === 'published' ? 'Unpublish' : 'Publish'} className={`rounded-lg p-1.5 hover:bg-gray-100 ${blog.status === 'published' ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}>
                          {busyId === blog.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(blog)} title="Delete article" className="rounded-lg p-1.5 text-gray-500 hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 p-4 sm:flex-row">
            <p className="text-xs text-gray-500">
              {pagination.total === 0 ? 'No articles' : `Showing ${(pagination.page - 1) * pagination.limit + 1}–${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}`}
            </p>
            <div className="flex items-center gap-2">
              <select value={limit} onChange={(event) => { setLimit(Number(event.target.value)); setPage(1); }} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs">
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={pagination.page <= 1} className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
              <button type="button" onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))} disabled={pagination.page >= pagination.totalPages} className="rounded-lg border border-gray-200 p-1.5 disabled:opacity-40" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[11px] text-gray-500">
        <Filter className="h-3.5 w-3.5" /> Drafts and unpublished articles are excluded from public search, categories, related posts and the sitemap.
      </div>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete article"
        itemName={deleteTarget?.title}
      />

      <BlogCategoryManager
        isOpen={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        onChanged={() => { loadCategories(); fetchBlogs(); }}
      />
    </div>
  );
};

export default AdminBlogsPage;
