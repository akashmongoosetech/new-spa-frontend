import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { BlogCategory, BlogPost, PaginationMeta } from '../../types';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const EMPTY_PAGINATION: PaginationMeta = { page: 1, limit: 9, total: 0, totalPages: 1 };

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ArticleCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => (
  <article className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg ${featured ? 'md:grid md:grid-cols-2' : ''}`}>
    <Link to={`/blog/${post.slug}/`} className="block overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.featuredImageAlt || post.title}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${featured ? 'h-full min-h-60 md:min-h-full' : 'h-52'}`}
        />
      ) : (
        <div className={`flex items-center justify-center text-brand-400 ${featured ? 'min-h-60' : 'h-52'}`}>
          <BookOpen className="h-10 w-10" />
        </div>
      )}
    </Link>
    <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:justify-center md:p-8' : ''}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
        {post.category && (
          <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="rounded-full bg-brand-50 px-2.5 py-1 text-[var(--brand-ink)] hover:bg-brand-100">
            {post.category}
          </Link>
        )}
        {post.isFeatured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700">
            <Sparkles className="h-3 w-3" /> Featured
          </span>
        )}
      </div>
      <h2 className={`font-serif font-bold leading-snug text-gray-900 group-hover:text-[var(--brand-ink)] ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
        <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
        {post.safeExcerpt || post.excerptText || ''}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-gray-50 pt-5 text-[11px] text-gray-500">
        <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-500" /> {post.readTime}</span>
        {post.date && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-brand-500" /> {formatDate(post.date)}</span>}
        {post.author && <span className="truncate">By {post.author}</span>}
        <Link to={`/blog/${post.slug}/`} className="ml-auto inline-flex items-center gap-1 font-bold text-[var(--brand-ink)] hover:underline">
          Read <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  </article>
);

export const BlogPageWrapper: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';
  const page = Math.max(1, Math.floor(Number(searchParams.get('page')) || 1));
  const [searchInput, setSearchInput] = useState(q);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(EMPTY_PAGINATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryToken, setRetryToken] = useState(0);

  const hasFilters = Boolean(q || category || tag);
  const isConfirmedEmpty = !loading && !error && pagination.total === 0;

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === q) return;
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set('q', trimmed);
      else next.delete('q');
      next.delete('page');
      setSearchParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, q, searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, tagList] = await Promise.all([api.getPublicBlogCategories(), api.getPublicBlogTags()]);
        if (!cancelled) {
          setCategories(cats);
          setTags(tagList.slice(0, 16));
        }
      } catch {
        // The journal remains usable without filter metadata.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (hasFilters) {
      setFeatured([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await api.getFeaturedBlogs(4);
        if (!cancelled) setFeatured(list);
      } catch {
        if (!cancelled) setFeatured([]);
      }
    })();
    return () => { cancelled = true; };
  }, [hasFilters, retryToken]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const result = await api.getPublicBlogs({ page, limit: 9, q: q || undefined, category: category || undefined, tag: tag || undefined });
        if (cancelled) return;
        setPosts(result.items);
        setPagination(result.pagination);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'The journal could not be loaded right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, q, category, tag, retryToken]);

  const setFilter = (key: 'category' | 'tag', value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const featuredPosts = useMemo(
    () => featured.filter((post) => !posts.some((item) => item.id === post.id)).slice(0, 3),
    [featured, posts]
  );

  if (loading && posts.length === 0 && !error) {
    return <LoadingSpinner fullScreen label="Opening the wellness journal..." />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-12 font-sans">
      <SEO
        title="Men's Massage & Wellness Journal | Tripod Wellness"
        description="Evidence-informed articles on men's massage, sports recovery, stress, sleep and everyday wellness from Tripod Wellness in Indore."
        path="/blog"
        keywords="men's massage Indore, sports recovery, wellness journal, stress relief"
        robots={hasFilters || page > 1 || isConfirmedEmpty ? 'noindex, follow' : 'index, follow'}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)]">
            <BookOpen className="h-3.5 w-3.5" /> The Tripod Wellness Journal
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-gray-900 sm:text-5xl">Practical wellness, without the noise</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600">
            Clear, verified guidance on massage, recovery and everyday wellbeing. Only published articles appear here.
          </p>
        </header>

        {featuredPosts.length > 0 && (
          <section className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-gray-900"><Sparkles className="h-5 w-5 text-brand-500" /> Featured reading</h2>
              <span className="text-[11px] text-gray-500">Selected by the editorial team</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ArticleCard post={featuredPosts[0]} featured />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {featuredPosts.slice(1, 3).map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search the journal..."
                aria-label="Search the journal"
                className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-10 text-sm focus:border-[#BFA476] focus:outline-none focus:ring-1 focus:ring-[#BFA476]"
              />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setFilter('category', '')} className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${!category ? 'bg-brand-500 text-brand-950' : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-300'}`}>
                All topics
              </button>
              {categories.map((item) => (
                <button key={item.slug || item.name} type="button" onClick={() => setFilter('category', item.name)} className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${category.toLowerCase() === item.name.toLowerCase() ? 'bg-brand-500 text-brand-950' : 'border border-gray-200 bg-white text-gray-600 hover:border-brand-300'}`}>
                  {item.name} <span className="opacity-60">{item.count}</span>
                </button>
              ))}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-400"><Tag className="h-3 w-3" /> Tags</span>
              {tags.map((item) => (
                <button key={item.name} type="button" onClick={() => setFilter('tag', tag.toLowerCase() === item.name.toLowerCase() ? '' : item.name)} className={`rounded-full px-2.5 py-1 text-[11px] ${tag.toLowerCase() === item.name.toLowerCase() ? 'bg-brand-500 font-bold text-brand-950' : 'bg-gray-100 text-gray-600 hover:bg-brand-50'}`}>
                  #{item.name}
                </button>
              ))}
            </div>
          )}

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
              <span>Active filters:</span>
              {q && <span className="rounded-full bg-gray-100 px-2.5 py-1">“{q}”</span>}
              {category && <span className="rounded-full bg-gray-100 px-2.5 py-1">{category}</span>}
              {tag && <span className="rounded-full bg-gray-100 px-2.5 py-1">#{tag}</span>}
              <button type="button" onClick={clearFilters} className="font-bold text-[var(--brand-ink)] hover:underline">Clear all</button>
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">{hasFilters ? 'Search results' : 'Latest articles'}</h2>
              <p className="mt-1 text-xs text-gray-500">{pagination.total} published article{pagination.total === 1 ? '' : 's'}</p>
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl border border-rose-100 bg-white p-12 text-center">
              <BookOpen className="mx-auto mb-3 h-9 w-9 text-rose-200" />
              <h2 className="text-lg font-serif font-bold text-gray-900">The journal could not be loaded</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">Please try again. If the problem continues, contact the concierge.</p>
              <button type="button" onClick={() => setRetryToken((value) => value + 1)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950 hover:bg-brand-400">
                Try again <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
                  <div className="h-52 animate-pulse bg-gray-100" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                    <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 && pagination.total > 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto mb-3 h-9 w-9 text-brand-300" />
              <h2 className="text-lg font-serif font-bold text-gray-900">This page is outside the journal</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">The requested page does not exist. Return to the latest published articles.</p>
              <button type="button" onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete('page');
                setSearchParams(next);
              }} className="mt-5 rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-700 hover:border-brand-300">Go to page 1</button>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto mb-3 h-9 w-9 text-brand-300" />
              <h2 className="text-lg font-serif font-bold text-gray-900">
                {hasFilters ? 'No published articles match those filters' : 'No articles have been published yet'}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                {hasFilters ? 'Try a different topic or clear the search.' : 'Check back soon for verified wellness guidance from the journal.'}
              </p>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="mt-5 rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-700 hover:border-brand-300">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => <ArticleCard key={post.id} post={post} />)}
            </div>
          )}

          {pagination.totalPages > 1 && !loading && (
            <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Blog pagination">
              <button type="button" disabled={page <= 1} onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('page', String(page - 1));
                setSearchParams(next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:opacity-40">Previous</button>
              <span className="text-xs text-gray-500">Page {pagination.page} of {pagination.totalPages}</span>
              <button type="button" disabled={page >= pagination.totalPages} onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.set('page', String(page + 1));
                setSearchParams(next);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 disabled:opacity-40">Next</button>
            </nav>
          )}
        </section>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-950 px-6 py-8 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-100">Have a wellness question?</h2>
            <p className="mt-1 text-xs text-gray-300">Our concierge can help you choose a therapy or answer a booking question.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950 hover:bg-brand-400">
            Contact the concierge <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPageWrapper;
