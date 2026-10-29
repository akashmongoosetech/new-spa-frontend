import React, { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Facebook,
  Linkedin,
  Loader2,
  MessageCircle,
  RefreshCw,
  Share2,
  Tag,
  Twitter,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { BlogPost, BlogPublicDetail } from '../../types';
import { SEO } from '../../components/ui/SEO';
import { SITE_NAME, SITE_URL } from '../../config/site';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function isoDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function plainText(html: string) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  doc.querySelectorAll('script,style,noscript').forEach((node) => node.remove());
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

const RelatedCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}/`}
    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
  >
    {post.imageUrl ? (
      <img src={post.imageUrl} alt={post.featuredImageAlt || post.title} loading="lazy" className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
    ) : (
      <div className="flex h-40 items-center justify-center bg-brand-50 text-brand-300"><BookOpen className="h-8 w-8" /></div>
    )}
    <div className="flex flex-1 flex-col p-5">
      {post.category && <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)]">{post.category}</span>}
      <h3 className="font-serif text-lg font-bold leading-snug text-gray-900 group-hover:text-[var(--brand-ink)]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">{post.safeExcerpt || post.excerptText || ''}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--brand-ink)]">Read article <ArrowRight className="h-3.5 w-3.5" /></span>
    </div>
  </Link>
);

export const BlogDetailPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BlogPublicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    setNotFound(false);
    (async () => {
      try {
        const result = await api.getPublicBlogDetail(slug);
        if (cancelled) return;
        if (!result) {
          setNotFound(true);
          return;
        }
        if (result.redirectTo && result.redirectTo !== `/blog/${slug}/`) {
          navigate(result.redirectTo, { replace: true });
          return;
        }
        setDetail(result);
      } catch (err: any) {
        if (!cancelled) {
          if (err?.response?.status === 404) setNotFound(true);
          else setError(err?.message || 'This article could not be loaded.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, retryToken, navigate]);

  const post = detail?.post;
  const resolved = post?.resolvedSeo;
  const contentHtml = useMemo(() => DOMPurify.sanitize(post?.content || ''), [post?.content]);
  const featuredImage = post?.featuredImageUrl || post?.imageUrl || '';
  const publishedDate = post?.publishedAt || post?.date;
  const canonicalUrl = resolved?.canonicalUrl || resolved?.canonical_url || (post?.slug ? `${SITE_URL}/blog/${post.slug}/` : '');
  const shareUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = post?.title || 'Tripod Wellness Journal';

  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    if (detail?.jsonLd) return detail.jsonLd;
    const fallback: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.safeExcerpt || post.excerptText || plainText(post.content).slice(0, 160),
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      url: canonicalUrl,
      image: featuredImage ? [featuredImage.startsWith('http') ? featuredImage : `${SITE_URL}${featuredImage}`] : undefined,
      publisher: { '@type': 'Organization', name: SITE_NAME },
    };
    if (isoDate(publishedDate)) fallback.datePublished = isoDate(publishedDate);
    if (isoDate(post.updatedAt)) fallback.dateModified = isoDate(post.updatedAt);
    if (post.author) fallback.author = { '@type': 'Person', name: post.author };
    if (post.category) fallback.articleSection = post.category;
    if (post.tags?.length) fallback.keywords = post.tags.join(', ');
    return fallback;
  }, [detail?.jsonLd, post, canonicalUrl, featuredImage, publishedDate]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt('Copy this article link', shareUrl);
    }
  };

  if (loading && !detail) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF8]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--brand-ink)]" />
          <p className="mt-3 text-sm text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[65vh] bg-[#FAFAF8] px-4 py-20 text-center">
        <SEO title="Article not found | Tripod Wellness" description="This article is not available." robots="noindex, nofollow" />
        <BookOpen className="mx-auto h-10 w-10 text-brand-300" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-gray-900">Article not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
          This article may have been unpublished, renamed or removed. Browse the journal for published wellness guidance.
        </p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950 hover:bg-brand-400">
          <ArrowLeft className="h-4 w-4" /> Back to the journal
        </Link>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[65vh] bg-[#FAFAF8] px-4 py-20 text-center">
        <SEO title="Journal unavailable | Tripod Wellness" description="The article could not be loaded." robots="noindex, nofollow" />
        <RefreshCw className="mx-auto h-10 w-10 text-brand-300" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-gray-900">The article could not be loaded</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">{error || 'Please try again in a moment.'}</p>
        <button type="button" onClick={() => setRetryToken((value) => value + 1)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950 hover:bg-brand-400">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  const tags = post.tags || [];
  const sections = post.sections || [];
  const related = detail?.related || [];
  const previous = detail?.previous;
  const next = detail?.next;
  const updatedDate = post.updatedAt && publishedDate && new Date(post.updatedAt).getTime() - new Date(publishedDate).getTime() > 86_400_000
    ? post.updatedAt
    : '';

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20 font-sans">
      <SEO
        title={resolved?.title || post.title}
        description={resolved?.description || post.safeExcerpt || post.excerptText || plainText(post.content).slice(0, 160)}
        canonicalUrl={canonicalUrl}
        keywords={(resolved?.keywords || post.seo?.keywords || post.tags || []).join(', ')}
        ogTitle={resolved?.ogTitle || post.seo?.ogTitle || undefined}
        ogDescription={resolved?.ogDescription || post.seo?.ogDescription || undefined}
        ogImage={resolved?.ogImageUrl || post.seo?.ogImageUrl || featuredImage || undefined}
        ogImageAlt={resolved?.ogImageAlt || post.featuredImageAlt || post.title}
        twitterTitle={resolved?.twitterTitle || post.seo?.twitterTitle || undefined}
        twitterDescription={resolved?.twitterDescription || post.seo?.twitterDescription || undefined}
        twitterImage={resolved?.twitterImageUrl || post.seo?.twitterImageUrl || undefined}
        twitterCard={resolved?.twitterCard}
        type="article"
        robots={resolved?.robots || 'index, follow'}
        articlePublishedTime={isoDate(publishedDate)}
        articleModifiedTime={isoDate(post.updatedAt || publishedDate)}
        articleSection={post.category}
        articleTags={post.tags}
        jsonLd={jsonLd}
      />

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
            <Link to="/" className="hover:text-[var(--brand-ink)]">Home</Link>
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <Link to="/blog" className="hover:text-[var(--brand-ink)]">Journal</Link>
            {post.category && (
              <>
                <ChevronRight className="h-3 w-3 text-gray-300" />
                <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-[var(--brand-ink)]">{post.category}</Link>
              </>
            )}
            <ChevronRight className="h-3 w-3 text-gray-300" />
            <span className="max-w-[55vw] truncate text-gray-400">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <header className="text-center">
          {post.category && (
            <Link to={`/blog?category=${encodeURIComponent(post.category)}`} className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--brand-ink)] hover:bg-brand-100">
              {post.category}
            </Link>
          )}
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.safeExcerpt && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600">{post.safeExcerpt}</p>
          )}
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-gray-500">
            {post.author && <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-brand-500" /> By {post.author}</span>}
            {publishedDate && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-brand-500" /> {formatDate(publishedDate)}</span>}
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-500" /> {post.readTime}</span>
            {updatedDate && <span className="text-gray-400">Updated {formatDate(updatedDate)}</span>}
          </div>
        </header>

        {featuredImage && (
          <figure className="mt-8 overflow-hidden rounded-3xl bg-brand-50 shadow-sm">
            <img src={featuredImage} alt={post.featuredImageAlt || post.title} className="max-h-[520px] w-full object-cover" />
            {post.featuredImageAlt && (
              <figcaption className="px-4 py-2 text-center text-[10px] text-gray-500">{post.featuredImageAlt}</figcaption>
            )}
          </figure>
        )}

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="prose prose-sm max-w-none text-[15px] leading-8 sm:text-base" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          {sections.map((section, index) => (
            <section key={section.id || index} className="mt-10 border-t border-gray-100 pt-8">
              {section.heading && <h2 className="font-serif text-2xl font-bold text-gray-900">{section.heading}</h2>}
              <div className="prose prose-sm mt-4 max-w-none text-[15px] leading-8 sm:text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content || '') }} />
            </section>
          ))}

          {tags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
              <Tag className="h-4 w-4 text-brand-500" />
              {tags.map((tag) => (
                <Link key={tag} to={`/blog?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-white px-3 py-1.5 text-[11px] text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-brand-50 hover:text-[var(--brand-ink)]">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-700"><Share2 className="h-4 w-4 text-brand-500" /> Share this article</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')} title="Share on X" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-brand-300 hover:text-[var(--brand-ink)]"><Twitter className="h-4 w-4" /></button>
              <button type="button" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')} title="Share on Facebook" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-brand-300 hover:text-[var(--brand-ink)]"><Facebook className="h-4 w-4" /></button>
              <button type="button" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer')} title="Share on LinkedIn" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-brand-300 hover:text-[var(--brand-ink)]"><Linkedin className="h-4 w-4" /></button>
              <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank', 'noopener,noreferrer')} title="Share on WhatsApp" className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:border-brand-300 hover:text-[var(--brand-ink)]"><MessageCircle className="h-4 w-4" /></button>
              <button type="button" onClick={copyLink} title="Copy article link" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-semibold text-gray-600 hover:border-brand-300 hover:text-[var(--brand-ink)]">
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {(previous || next) && (
          <nav className="mx-auto mt-10 grid max-w-3xl gap-4 border-t border-gray-100 pt-8 sm:grid-cols-2" aria-label="Article navigation">
            {previous ? (
              <Link to={`/blog/${previous.slug}/`} className="group rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm hover:border-brand-200">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400"><ArrowLeft className="h-3.5 w-3.5" /> Previous</span>
                <p className="mt-2 line-clamp-2 font-serif text-sm font-bold text-gray-900 group-hover:text-[var(--brand-ink)]">{previous.title}</p>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/blog/${next.slug}/`} className="group rounded-2xl border border-gray-100 bg-white p-4 text-right shadow-sm hover:border-brand-200 sm:col-start-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Next <ArrowRight className="h-3.5 w-3.5" /></span>
                <p className="mt-2 line-clamp-2 font-serif text-sm font-bold text-gray-900 group-hover:text-[var(--brand-ink)]">{next.title}</p>
              </Link>
            ) : null}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Related reading</h2>
            <Link to="/blog" className="text-[11px] font-bold text-[var(--brand-ink)] hover:underline">All articles</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => <RelatedCard key={item.id} post={item} />)}
          </div>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-brand-950 px-6 py-8 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-100">Ready to feel better in person?</h2>
            <p className="mt-1 text-xs text-gray-300">Explore therapies or speak with the Tripod Wellness concierge.</p>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-xs font-bold text-brand-950 hover:bg-brand-400">
            Explore therapies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPageWrapper;
